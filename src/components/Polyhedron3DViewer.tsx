import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import earcut from 'earcut';
import { NoblePolyhedron, ViewerSettings, ColorTheme } from '../types';
import { computeFaceNormal } from '../utils/polyGeometry';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  RotateCw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface Polyhedron3DViewerProps {
  polyhedron: NoblePolyhedron;
  selectedFaceIndex: number;
  onSelectFace: (faceIndex: number) => void;
  settings: ViewerSettings;
  onUpdateSettings: (newSettings: Partial<ViewerSettings>) => void;
  onPrevPolyhedron?: () => void;
  onNextPolyhedron?: () => void;
  isAutoTour?: boolean;
  onToggleAutoTour?: () => void;
  tourSpeedMs?: number;
  isLightMode?: boolean;
}

const THEME_COLORS: Record<ColorTheme, { face: number; edge: number; vertex: number; highlight: number; bg: string }> = {
  classicLight: {
    face: 0x64748b,
    edge: 0x0f172a,
    vertex: 0x1e293b,
    highlight: 0xd97706,
    bg: '#f8fafc',
  },
  academic: {
    face: 0x475569,
    edge: 0x0f172a,
    vertex: 0x334155,
    highlight: 0xb45309,
    bg: '#f8fafc',
  },
  slateAmber: {
    face: 0xd97706,
    edge: 0x92400e,
    vertex: 0xb45309,
    highlight: 0x2563eb,
    bg: '#0f172a',
  },
  royalPrism: {
    face: 0x6366f1,
    edge: 0x4338ca,
    vertex: 0x818cf8,
    highlight: 0xec4899,
    bg: '#090d16',
  },
  emeraldGold: {
    face: 0x059669,
    edge: 0x047857,
    vertex: 0x10b981,
    highlight: 0xeab308,
    bg: '#022c22',
  },
  cyberpunk: {
    face: 0xec4899,
    edge: 0x06b6d4,
    vertex: 0x38bdf8,
    highlight: 0xfacc15,
    bg: '#180e29',
  },
};

export const Polyhedron3DViewer: React.FC<Polyhedron3DViewerProps> = ({
  polyhedron,
  selectedFaceIndex,
  onSelectFace,
  settings,
  onUpdateSettings,
  onPrevPolyhedron,
  onNextPolyhedron,
  isAutoTour = false,
  onToggleAutoTour,
  tourSpeedMs = 4000,
  isLightMode = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const faceMeshesRef = useRef<THREE.Mesh[]>([]);
  const edgeLinesRef = useRef<THREE.LineSegments | null>(null);
  const vertexPointsRef = useRef<THREE.Points | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 4.5, theta: Math.PI / 4, phi: Math.PI / 3 });
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  // Multi-touch & Pinch gesture tracking for mobile devices
  const touchTrackingRef = useRef<{
    isPinching: boolean;
    lastX: number;
    lastY: number;
    startX: number;
    startY: number;
    startTime: number;
    lastPinchDist: number;
  }>({
    isPinching: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    startTime: 0,
    lastPinchDist: 0,
  });

  // Pick face raycasting callback (shared by desktop click & mobile single-finger tap)
  const pickFaceAtCoords = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || !cameraRef.current || faceMeshesRef.current.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const intersects = raycaster.intersectObjects(faceMeshesRef.current, false);

    if (intersects.length > 0) {
      const hitFace = intersects[0].object.userData.faceIndex;
      onSelectFace(hitFace);
    }
  }, [onSelectFace]);

  const onSelectFaceRef = useRef(pickFaceAtCoords);
  useEffect(() => {
    onSelectFaceRef.current = pickFaceAtCoords;
  }, [pickFaceAtCoords]);

  // Keyboard shortcut listener for ArrowLeft, ArrowRight, Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === ' ' && onToggleAutoTour) {
        e.preventDefault();
        onToggleAutoTour();
      } else if (e.key === 'ArrowLeft' && onPrevPolyhedron) {
        e.preventDefault();
        onPrevPolyhedron();
      } else if (e.key === 'ArrowRight' && onNextPolyhedron) {
        e.preventDefault();
        onNextPolyhedron();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrevPolyhedron, onNextPolyhedron, onToggleAutoTour]);

  // Reset camera view angle
  const resetCamera = useCallback((view: 'iso' | 'front' | 'top' = 'iso') => {
    if (view === 'iso') {
      sphericalRef.current = { radius: 4.5, theta: Math.PI / 4, phi: Math.PI / 3 };
    } else if (view === 'front') {
      sphericalRef.current = { radius: 4.5, theta: 0, phi: Math.PI / 2 };
    } else if (view === 'top') {
      sphericalRef.current = { radius: 4.5, theta: 0, phi: 0.001 };
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const theme = THEME_COLORS[settings.colorTheme];
    scene.background = new THREE.Color(theme.bg);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    container.innerHTML = '';
    // Enforce touch-action none on canvas to block browser default touch interventions
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.userSelect = 'none';
    renderer.domElement.style.webkitUserSelect = 'none';
    (renderer.domElement.style as any).webkitTouchCallout = 'none';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 0.45);
    dirLight2.position.set(-5, -6, -4);
    scene.add(dirLight2);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Animation Loop
    let animationFrameId: number;
    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      if (settings.autoRotate && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.006 * settings.rotationSpeed;
      }

      // Update camera position from spherical coords with vertical offset so the actual shape sits higher up
      const { radius, theta, phi } = sphericalRef.current;
      const TARGET_Y = -0.42;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = TARGET_Y + radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, TARGET_Y, 0);

      renderer.render(scene, camera);
    };
    renderLoop();

    // Native Non-Passive Touch Event Handlers
    // Explicitly call e.preventDefault() so mobile browsers NEVER zoom the whole webpage or trigger elastic bounce
    const handleTouchStart = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      isDraggingRef.current = true;

      if (e.touches.length === 1) {
        const t = e.touches[0];
        touchTrackingRef.current = {
          isPinching: false,
          lastX: t.clientX,
          lastY: t.clientY,
          startX: t.clientX,
          startY: t.clientY,
          startTime: Date.now(),
          lastPinchDist: 0,
        };
      } else if (e.touches.length >= 2) {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        touchTrackingRef.current.isPinching = true;
        touchTrackingRef.current.lastPinchDist = dist;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();

      if (e.touches.length === 1 && !touchTrackingRef.current.isPinching) {
        const t = e.touches[0];
        const deltaX = t.clientX - touchTrackingRef.current.lastX;
        const deltaY = t.clientY - touchTrackingRef.current.lastY;

        // Smooth revolving: update spherical azimuth & elevation
        sphericalRef.current.theta -= deltaX * 0.009;
        sphericalRef.current.phi = Math.max(
          0.05,
          Math.min(Math.PI - 0.05, sphericalRef.current.phi - deltaY * 0.009)
        );

        touchTrackingRef.current.lastX = t.clientX;
        touchTrackingRef.current.lastY = t.clientY;
      } else if (e.touches.length >= 2) {
        // Multi-touch two-finger pinch to zoom in/out of the 3D polyhedron
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);

        if (touchTrackingRef.current.lastPinchDist > 5 && dist > 5) {
          const ratio = dist / touchTrackingRef.current.lastPinchDist;
          // When distance between fingers expands (spreading fingers), ratio > 1 -> camera radius decreases (zooms in)
          // When fingers pinch together, ratio < 1 -> camera radius increases (zooms out)
          const newRadius = sphericalRef.current.radius / ratio;
          sphericalRef.current.radius = Math.max(1.2, Math.min(12, newRadius));
          touchTrackingRef.current.lastPinchDist = dist;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();

      if (e.touches.length === 0) {
        isDraggingRef.current = false;
        const duration = Date.now() - touchTrackingRef.current.startTime;
        const movedDist = Math.hypot(
          touchTrackingRef.current.lastX - touchTrackingRef.current.startX,
          touchTrackingRef.current.lastY - touchTrackingRef.current.startY
        );

        // Clean single tap detection (< 350ms and < 8px moved)
        if (!touchTrackingRef.current.isPinching && duration < 350 && movedDist < 8) {
          onSelectFaceRef.current(touchTrackingRef.current.lastX, touchTrackingRef.current.lastY);
        }
        touchTrackingRef.current.isPinching = false;
      } else if (e.touches.length === 1) {
        // Lifted one finger from pinch: seamlessly switch back to single-finger revolve without camera jumping
        const t = e.touches[0];
        touchTrackingRef.current.lastX = t.clientX;
        touchTrackingRef.current.lastY = t.clientY;
        touchTrackingRef.current.isPinching = false;
      }
    };

    const handleTouchCancel = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      isDraggingRef.current = false;
      touchTrackingRef.current.isPinching = false;
    };

    const handleGesturePrevent = (e: Event) => {
      if (e.cancelable) e.preventDefault();
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    container.addEventListener('gesturestart', handleGesturePrevent, { passive: false });
    container.addEventListener('gesturechange', handleGesturePrevent, { passive: false });
    container.addEventListener('gestureend', handleGesturePrevent, { passive: false });

    // Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchCancel);
      container.removeEventListener('gesturestart', handleGesturePrevent);
      container.removeEventListener('gesturechange', handleGesturePrevent);
      container.removeEventListener('gestureend', handleGesturePrevent);
      renderer.dispose();
    };
  }, []);

  // Update Scene Background on Theme change
  useEffect(() => {
    if (sceneRef.current) {
      const theme = THEME_COLORS[settings.colorTheme];
      sceneRef.current.background = new THREE.Color(theme.bg);
    }
  }, [settings.colorTheme]);

  // Rebuild 3D Model Geometry
  useEffect(() => {
    const group = modelGroupRef.current;
    if (!group || !polyhedron || !polyhedron.vertices || !polyhedron.faces) return;

    // Clear previous objects
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) {
        (obj as THREE.Mesh).geometry.dispose();
      }
    }
    faceMeshesRef.current = [];

    const theme = THEME_COLORS[settings.colorTheme];
    const isAcademic = settings.colorTheme === 'academic';

    // Normalize scale so the polyhedron fits nicely inside sphere of radius 1.5
    let maxDist = 0.001;
    for (const v of polyhedron.vertices) {
      const d = Math.hypot(v[0], v[1], v[2]);
      if (d > maxDist) maxDist = d;
    }
    const scaleFactor = 1.4 / maxDist;
    const scaledVertices = polyhedron.vertices.map(v => [
      v[0] * scaleFactor,
      v[1] * scaleFactor,
      v[2] * scaleFactor,
    ] as [number, number, number]);

    // Create individual meshes for each face to support Explode, Highlighting, and Picking
    const edgeSegmentsPositions: number[] = [];

    polyhedron.faces.forEach((faceIndices, fIdx) => {
      const facePoints3D = faceIndices.map(idx => scaledVertices[idx]);
      const n = facePoints3D.length;
      if (n < 3) return;

      // Face normal & centroid
      const normal = computeFaceNormal(facePoints3D);
      let cx = 0, cy = 0, cz = 0;
      for (const p of facePoints3D) {
        cx += p[0];
        cy += p[1];
        cz += p[2];
      }
      const centroid: [number, number, number] = [cx / n, cy / n, cz / n];

      // Edge segments for line rendering
      for (let i = 0; i < n; i++) {
        const p1 = facePoints3D[i];
        const p2 = facePoints3D[(i + 1) % n];
        edgeSegmentsPositions.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
      }

      // Orthonormal basis for 2D triangulation via earcut
      const edge0 = [facePoints3D[1][0] - facePoints3D[0][0], facePoints3D[1][1] - facePoints3D[0][1], facePoints3D[1][2] - facePoints3D[0][2]];
      let uBasis = new THREE.Vector3(...edge0).normalize();
      const normVec = new THREE.Vector3(...normal).normalize();
      // Gram-Schmidt
      uBasis.sub(normVec.clone().multiplyScalar(uBasis.dot(normVec))).normalize();
      if (uBasis.lengthSq() < 0.1) {
        uBasis = new THREE.Vector3(1, 0, 0).cross(normVec).normalize();
      }
      const wBasis = new THREE.Vector3().crossVectors(normVec, uBasis).normalize();

      // Project into 2D flat array [x0, y0, x1, y1, ...]
      const coords2D: number[] = [];
      facePoints3D.forEach(pt => {
        const diff = new THREE.Vector3(pt[0] - centroid[0], pt[1] - centroid[1], pt[2] - centroid[2]);
        coords2D.push(diff.dot(uBasis), diff.dot(wBasis));
      });

      // Triangulate face using earcut
      const triangles = earcut(coords2D);

      const positions: number[] = [];
      const normals: number[] = [];

      for (let i = 0; i < triangles.length; i += 3) {
        const i0 = triangles[i];
        const i1 = triangles[i + 1];
        const i2 = triangles[i + 2];

        const pt0 = facePoints3D[i0];
        const pt1 = facePoints3D[i1];
        const pt2 = facePoints3D[i2];

        // Ensure both sides or proper winding
        positions.push(...pt0, ...pt1, ...pt2);
        normals.push(...normal, ...normal, ...normal);
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

      const isSelected = fIdx === selectedFaceIndex;
      const isHovered = fIdx === hoveredFace;

      let faceColor = theme.face;
      let opacity = settings.opacity;
      let transparent = settings.renderMode === 'transparent' || isHovered || isSelected;

      if (isSelected) {
        faceColor = theme.highlight;
        opacity = 0.95;
      } else if (isHovered) {
        faceColor = theme.highlight;
        opacity = 0.8;
      }

      const material = new THREE.MeshStandardMaterial({
        color: faceColor,
        roughness: 0.35,
        metalness: 0.2,
        side: THREE.DoubleSide,
        transparent: transparent || settings.renderMode === 'transparent',
        opacity: settings.renderMode === 'transparent' ? (isSelected ? 0.9 : 0.45) : opacity,
        wireframe: settings.renderMode === 'wireframe',
      });

      const mesh = new THREE.Mesh(geom, material);
      mesh.userData = { faceIndex: fIdx, normal, centroid };

      // Explode displacement along normal
      if (settings.explodeAmount > 0) {
        const disp = settings.explodeAmount * 0.8;
        mesh.position.set(normal[0] * disp, normal[1] * disp, normal[2] * disp);
      }

      group.add(mesh);
      faceMeshesRef.current.push(mesh);
    });

    // Add wireframe edge lines
    if (settings.showWireframeEdges && edgeSegmentsPositions.length > 0) {
      const edgeGeom = new THREE.BufferGeometry();
      edgeGeom.setAttribute('position', new THREE.Float32BufferAttribute(edgeSegmentsPositions, 3));
      const edgeMat = new THREE.LineBasicMaterial({
        color: isAcademic ? 0x0f172a : 0xf8fafc,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.65,
      });
      const lines = new THREE.LineSegments(edgeGeom, edgeMat);
      lines.renderOrder = 2;
      group.add(lines);
      edgeLinesRef.current = lines;
    }

    // Add vertex spheres / points
    if (settings.showVertexSpheres && scaledVertices.length > 0) {
      const vertexPositions = scaledVertices.flatMap(v => [v[0], v[1], v[2]]);
      const vGeom = new THREE.BufferGeometry();
      vGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertexPositions, 3));
      const vMat = new THREE.PointsMaterial({
        color: theme.vertex,
        size: 0.08,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(vGeom, vMat);
      points.renderOrder = 3;
      group.add(points);
      vertexPointsRef.current = points;
    }
  }, [
    polyhedron,
    selectedFaceIndex,
    hoveredFace,
    settings.renderMode,
    settings.colorTheme,
    settings.explodeAmount,
    settings.showWireframeEdges,
    settings.showVertexSpheres,
    settings.opacity,
  ]);

  // Desktop Mouse & Hover Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      sphericalRef.current.theta -= deltaX * 0.009;
      sphericalRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, sphericalRef.current.phi - deltaY * 0.009)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hover raycasting for mouse cursor
    if (!containerRef.current || !cameraRef.current || faceMeshesRef.current.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const intersects = raycaster.intersectObjects(faceMeshesRef.current, false);

    if (intersects.length > 0) {
      const hitFace = intersects[0].object.userData.faceIndex;
      if (hoveredFace !== hitFace) {
        setHoveredFace(hitFace);
      }
    } else if (hoveredFace !== null) {
      setHoveredFace(null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const wasDraggingDist = Math.hypot(
      e.clientX - previousMousePositionRef.current.x,
      e.clientY - previousMousePositionRef.current.y
    );
    isDraggingRef.current = false;

    // Clean mouse click selects face
    if (wasDraggingDist < 5) {
      pickFaceAtCoords(e.clientX, e.clientY);
    }
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setHoveredFace(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(
      1.2,
      Math.min(12, sphericalRef.current.radius + e.deltaY * 0.005)
    );
  };

  return (
    <div
      id="polyhedron-3d-viewer-container"
      className={`select-none transition-all duration-200 flex flex-col overflow-hidden relative w-full h-full touch-none ${
        isLightMode ? 'bg-[#fcfbf9]' : 'bg-slate-950'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex-1 touch-none select-none overscroll-none"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      />

      {/* Floating View Controls Header (Top Floating Controls) */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between pointer-events-none gap-1 sm:gap-2 z-20">
        <div className={`pointer-events-auto flex items-center gap-1.5 sm:gap-2 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border shadow-sm text-xs font-mono ${
          isLightMode
            ? 'bg-white/95 border-stone-200/90 text-stone-800'
            : 'bg-slate-900/85 border-slate-700/60 text-slate-200'
        }`}>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span className="font-semibold text-amber-600">{polyhedron.id}</span>
          <span className={isLightMode ? 'text-stone-300' : 'text-slate-500'}>|</span>
          <span className={isLightMode ? 'text-stone-600' : 'text-slate-400'}>{polyhedron.faceSides}-gon</span>
          <span className={`${isLightMode ? 'text-stone-300' : 'text-slate-500'} hidden xs:inline`}>|</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded border hidden xs:inline-block ${getDiscoveryInfo(polyhedron).badgeClass}`}>
            {polyhedron.dof === 2 ? '✨ 2-DoF' : `${polyhedron.dof} DoF`}
          </span>
        </div>

        {/* Auto-Tour Floating Banner if Tour is running */}
        {isAutoTour && (
          <div className={`pointer-events-auto flex items-center gap-1.5 backdrop-blur-md px-2 sm:px-3 py-1 rounded-xl border text-xs shadow-md animate-in fade-in ${
            isLightMode
              ? 'bg-amber-50/90 border-amber-300 text-amber-900'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="font-bold text-[11px] sm:text-xs">Touring</span>
            {onToggleAutoTour && (
              <button
                onClick={onToggleAutoTour}
                className="p-1 hover:bg-amber-500/20 rounded transition-colors"
                title="Pause Tour (Space)"
              >
                <Pause className="w-3 h-3 fill-current" />
              </button>
            )}
          </div>
        )}

        {/* Camera Quick Angles, Quick Zoom & Auto-Rotate */}
        <div className={`pointer-events-auto flex items-center gap-0.5 sm:gap-1 backdrop-blur-md p-0.5 sm:p-1 rounded-xl border shadow-sm text-xs ${
          isLightMode
            ? 'bg-white/95 border-stone-200/90 text-stone-700'
            : 'bg-slate-900/85 border-slate-700/60 text-slate-300'
        }`}>
          <button
            id="view-iso-btn"
            onClick={() => resetCamera('iso')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition-colors text-[11px] ${
              isLightMode ? 'hover:bg-stone-100 text-stone-700 hover:text-stone-950' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Isometric View"
          >
            ISO
          </button>
          <button
            id="view-front-btn"
            onClick={() => resetCamera('front')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition-colors text-[11px] ${
              isLightMode ? 'hover:bg-stone-100 text-stone-700 hover:text-stone-950' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Front View"
          >
            Front
          </button>
          <button
            id="view-top-btn"
            onClick={() => resetCamera('top')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition-colors text-[11px] ${
              isLightMode ? 'hover:bg-stone-100 text-stone-700 hover:text-stone-950' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Top View"
          >
            Top
          </button>
          <div className={`w-[1px] h-4 mx-0.5 ${isLightMode ? 'bg-stone-200' : 'bg-slate-700'}`} />
          {/* Touch-friendly and click-friendly Zoom In and Out buttons */}
          <button
            id="view-zoom-in-btn"
            onClick={() => {
              sphericalRef.current.radius = Math.max(1.2, sphericalRef.current.radius * 0.82);
            }}
            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
              isLightMode ? 'hover:bg-stone-100 text-stone-600 hover:text-stone-900' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="view-zoom-out-btn"
            onClick={() => {
              sphericalRef.current.radius = Math.min(12, sphericalRef.current.radius * 1.22);
            }}
            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
              isLightMode ? 'hover:bg-stone-100 text-stone-600 hover:text-stone-900' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className={`w-[1px] h-4 mx-0.5 ${isLightMode ? 'bg-stone-200' : 'bg-slate-700'}`} />
          <button
            id="autorotate-toggle-btn"
            onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
              settings.autoRotate
                ? isLightMode ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-300'
                : isLightMode ? 'hover:bg-stone-100 text-stone-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title={settings.autoRotate ? 'Pause Auto-Rotation' : 'Start Auto-Rotation'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
