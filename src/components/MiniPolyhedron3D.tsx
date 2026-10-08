import React, { useRef, useEffect, useState, useMemo } from 'react';
import { NoblePolyhedron } from '../types';

interface MiniPolyhedron3DProps {
  model: NoblePolyhedron;
  isLightMode?: boolean;
  interactive?: boolean;
  className?: string;
  autoSpin?: boolean;
}

export const MiniPolyhedron3D: React.FC<MiniPolyhedron3DProps> = ({
  model,
  isLightMode = true,
  interactive = true,
  className = 'w-full h-28',
  autoSpin = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotX, setRotX] = useState<number>(0.4);
  const [rotY, setRotY] = useState<number>(0.6);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Normalize vertices to unit sphere [-1, 1]
  const normalizedVertices = useMemo(() => {
    if (!model.vertices || model.vertices.length === 0) return [];
    let maxR = 0;
    for (const v of model.vertices) {
      const r = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      if (r > maxR) maxR = r;
    }
    const scale = maxR > 0 ? 1 / maxR : 1;
    return model.vertices.map(v => [v[0] * scale, v[1] * scale, v[2] * scale] as [number, number, number]);
  }, [model.vertices]);

  // Handle pointer drag for 3D rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive || !isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotY(prev => prev + dx * 0.015);
    setRotX(prev => Math.max(-1.4, Math.min(1.4, prev + dy * 0.015)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Auto-spin animation
  useEffect(() => {
    if (!autoSpin) return;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isDraggingRef.current) {
        setRotY(prev => (prev + dt * 0.35) % (Math.PI * 2));
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoSpin]);

  // Render polyhedral projection to 2D canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (normalizedVertices.length === 0 || !model.faces || model.faces.length === 0) {
      // Draw placeholder geometric wireframe
      ctx.strokeStyle = isLightMode ? '#d6d3d1' : '#334155';
      ctx.strokeRect(width * 0.25, height * 0.25, width * 0.5, height * 0.5);
      return;
    }

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // Rotate vertices
    const rotated = normalizedVertices.map(([x, y, z]) => {
      // Y-axis rotation
      const x1 = x * cosY + z * sinY;
      const y1 = y;
      const z1 = -x * sinY + z * cosY;

      // X-axis rotation
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      return [x2, y2, z2] as [number, number, number];
    });

    const scale = Math.min(width, height) * 0.42;
    const cx = width / 2;
    const cy = height / 2;

    // Light source vector (normalized)
    const lx = 0.5;
    const ly = 0.8;
    const lz = 0.8;
    const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
    const nlx = lx / lLen;
    const nly = ly / lLen;
    const nlz = lz / lLen;

    // Prepare faces with depth sorting
    interface FaceDepth {
      indices: number[];
      avgZ: number;
      normalZ: number;
      lightIntensity: number;
    }

    const faceList: FaceDepth[] = [];
    const faces = model.faces;

    for (let f = 0; f < faces.length; f++) {
      const idxs = faces[f];
      if (idxs.length < 3) continue;

      let sumZ = 0;
      for (const idx of idxs) {
        if (rotated[idx]) sumZ += rotated[idx][2];
      }
      const avgZ = sumZ / idxs.length;

      // Calculate face normal
      const v0 = rotated[idxs[0]];
      const v1 = rotated[idxs[1]];
      const v2 = rotated[idxs[2]];
      if (!v0 || !v1 || !v2) continue;

      const ax = v1[0] - v0[0];
      const ay = v1[1] - v0[1];
      const az = v1[2] - v0[2];
      const bx = v2[0] - v0[0];
      const by = v2[1] - v0[1];
      const bz = v2[2] - v0[2];

      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;
      const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

      let lightIntensity = 0.6;
      if (nLen > 0.0001) {
        const dot = (nx * nlx + ny * nly + nz * nlz) / nLen;
        lightIntensity = Math.max(0.2, Math.min(1.0, 0.45 + 0.55 * Math.abs(dot)));
      }

      faceList.push({
        indices: idxs,
        avgZ,
        normalZ: nz,
        lightIntensity,
      });
    }

    // Sort back-to-front (painter's algorithm)
    faceList.sort((a, b) => a.avgZ - b.avgZ);

    // Draw shaded faces
    for (const item of faceList) {
      const pts = item.indices.map(i => rotated[i]).filter(Boolean);
      if (pts.length < 3) continue;

      ctx.beginPath();
      const p0x = cx + pts[0][0] * scale;
      const p0y = cy - pts[0][1] * scale;
      ctx.moveTo(p0x, p0y);

      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(cx + pts[i][0] * scale, cy - pts[i][1] * scale);
      }
      ctx.closePath();

      // Shading color calculation
      const val = item.lightIntensity;
      if (isLightMode) {
        // Classic stone & warm ivory tones
        const r = Math.round(180 * val + 50);
        const g = Math.round(185 * val + 50);
        const b = Math.round(195 * val + 50);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.72)`;
        ctx.strokeStyle = `rgba(30, 41, 59, 0.45)`;
      } else {
        // Deep obsidian with amber sheen
        const r = Math.round(190 * val + 20);
        const g = Math.round(120 * val + 20);
        const b = Math.round(40 * val + 15);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
        ctx.strokeStyle = `rgba(245, 158, 11, 0.4)`;
      }

      ctx.fill();
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Draw subtle vertex points
    if (rotated.length <= 60) {
      ctx.fillStyle = isLightMode ? '#0f172a' : '#fbbf24';
      for (const pt of rotated) {
        const px = cx + pt[0] * scale;
        const py = cy - pt[1] * scale;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [normalizedVertices, model.faces, rotX, rotY, isLightMode]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={180}
        height={130}
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full object-contain cursor-grab active:cursor-grabbing touch-none select-none`}
        title="Drag to rotate 3D preview"
      />
    </div>
  );
};
