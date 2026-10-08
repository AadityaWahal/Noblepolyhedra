import { PolyShapeAnalysis, PolyShape2DPoint } from '../types';

export function parseOFF(offText: string): {
  vertices: [number, number, number][];
  faces: number[][];
  numEdges: number;
} {
  const lines = offText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));

  if (lines.length === 0) {
    throw new Error('Empty OFF file.');
  }

  let lineIdx = 0;
  if (lines[lineIdx] === 'OFF') {
    lineIdx++;
  } else if (lines[lineIdx].startsWith('OFF')) {
    lines[lineIdx] = lines[lineIdx].substring(3).trim();
  }

  if (lineIdx >= lines.length) {
    throw new Error('Invalid OFF header.');
  }

  const counts = lines[lineIdx].split(/\s+/).map(Number);
  const numVertices = counts[0];
  const numFaces = counts[1];
  lineIdx++;

  const vertices: [number, number, number][] = [];
  for (let i = 0; i < numVertices && lineIdx < lines.length; i++) {
    const coords = lines[lineIdx].split(/\s+/).map(Number);
    vertices.push([coords[0] || 0, coords[1] || 0, coords[2] || 0]);
    lineIdx++;
  }

  const faces: number[][] = [];
  const edgeSet = new Set<string>();

  for (let i = 0; i < numFaces && lineIdx < lines.length; i++) {
    const tokens = lines[lineIdx].split(/\s+/).map(Number);
    const count = tokens[0];
    const faceIndices = tokens.slice(1, count + 1);
    faces.push(faceIndices);

    for (let j = 0; j < faceIndices.length; j++) {
      const u = faceIndices[j];
      const v = faceIndices[(j + 1) % faceIndices.length];
      const edgeKey = u < v ? `${u}-${v}` : `${v}-${u}`;
      edgeSet.add(edgeKey);
    }
    lineIdx++;
  }

  return {
    vertices,
    faces,
    numEdges: edgeSet.size,
  };
}

// Vector operations
function vecSub(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vecAdd(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vecScale(a: [number, number, number], s: number): [number, number, number] {
  return [a[0] * s, a[1] * s, a[2] * s];
}

function vecDot(a: [number, number, number], b: [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vecCross(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function vecLen(a: [number, number, number]): number {
  return Math.sqrt(vecDot(a, a));
}

function vecNorm(a: [number, number, number]): [number, number, number] {
  const l = vecLen(a);
  return l > 1e-12 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 1];
}

// Check if two line segments in 2D intersect (excluding shared endpoints)
function segmentsIntersect2D(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  p4: [number, number]
): boolean {
  const ccw = (a: [number, number], b: [number, number], c: [number, number]) =>
    (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]);

  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

/**
 * Computes face normal using Newell's method for arbitrary 3D polygon
 */
export function computeFaceNormal(points: [number, number, number][]): [number, number, number] {
  let nx = 0;
  let ny = 0;
  let nz = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const current = points[i];
    const next = points[(i + 1) % n];
    nx += (current[1] - next[1]) * (current[2] + next[2]);
    ny += (current[2] - next[2]) * (current[0] + next[0]);
    nz += (current[0] - next[0]) * (current[1] + next[1]);
  }

  return vecNorm([nx, ny, nz]);
}

/**
 * Analyzes the fundamental Poly Shape of a given face.
 */
export function analyzePolyShape(
  vertices: [number, number, number][],
  faceIndices: number[],
  faceIndex: number = 0
): PolyShapeAnalysis {
  const points3D: [number, number, number][] = faceIndices.map(idx => vertices[idx]);
  const sideCount = points3D.length;

  // 1. Centroid
  let cx = 0, cy = 0, cz = 0;
  for (const pt of points3D) {
    cx += pt[0];
    cy += pt[1];
    cz += pt[2];
  }
  const centroid3D: [number, number, number] = [
    cx / sideCount,
    cy / sideCount,
    cz / sideCount,
  ];

  // 2. Normal vector & plane distance
  const normal = computeFaceNormal(points3D);
  const planeDistance = vecDot(normal, centroid3D);

  // 3. Orthonormal basis on face plane
  let uBasis: [number, number, number] = [1, 0, 0];
  if (sideCount >= 2) {
    const edge0 = vecSub(points3D[1], points3D[0]);
    if (vecLen(edge0) > 1e-7) {
      uBasis = vecNorm(edge0);
    }
  }
  // Ensure uBasis is perpendicular to normal
  uBasis = vecNorm(vecSub(uBasis, vecScale(normal, vecDot(uBasis, normal))));
  if (vecLen(uBasis) < 1e-6) {
    // If degenerate, choose an arbitrary vector not collinear with normal
    const arbitrary: [number, number, number] = Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    uBasis = vecNorm(vecCross(normal, arbitrary));
  }
  const wBasis: [number, number, number] = vecCross(normal, uBasis);

  // 4. Project points into 2D plane relative to centroid
  const points2D: PolyShape2DPoint[] = points3D.map((pt, i) => {
    const diff = vecSub(pt, centroid3D);
    return {
      x: vecDot(diff, uBasis),
      y: vecDot(diff, wBasis),
      originalIndex: i,
      vertexIndex3D: faceIndices[i],
    };
  });

  // 5. Edge lengths
  const edgeLengths: number[] = [];
  let perimeter = 0;
  for (let i = 0; i < sideCount; i++) {
    const nextIdx = (i + 1) % sideCount;
    const dx = points2D[nextIdx].x - points2D[i].x;
    const dy = points2D[nextIdx].y - points2D[i].y;
    const len = Math.hypot(dx, dy);
    edgeLengths.push(len);
    perimeter += len;
  }

  // 6. Interior angles (in degrees)
  const interiorAnglesDeg: number[] = [];
  for (let i = 0; i < sideCount; i++) {
    const prevIdx = (i - 1 + sideCount) % sideCount;
    const nextIdx = (i + 1) % sideCount;

    const vPrev: [number, number] = [
      points2D[prevIdx].x - points2D[i].x,
      points2D[prevIdx].y - points2D[i].y,
    ];
    const vNext: [number, number] = [
      points2D[nextIdx].x - points2D[i].x,
      points2D[nextIdx].y - points2D[i].y,
    ];

    const lenPrev = Math.hypot(vPrev[0], vPrev[1]);
    const lenNext = Math.hypot(vNext[0], vNext[1]);

    if (lenPrev < 1e-8 || lenNext < 1e-8) {
      interiorAnglesDeg.push(0);
      continue;
    }

    const dot = (vPrev[0] * vNext[0] + vPrev[1] * vNext[1]) / (lenPrev * lenNext);
    const clampedDot = Math.max(-1, Math.min(1, dot));
    const angleRad = Math.acos(clampedDot);
    interiorAnglesDeg.push((angleRad * 180) / Math.PI);
  }

  // 7. Area (Shoelace formula)
  let shoelace = 0;
  for (let i = 0; i < sideCount; i++) {
    const nextIdx = (i + 1) % sideCount;
    shoelace += points2D[i].x * points2D[nextIdx].y - points2D[nextIdx].x * points2D[i].y;
  }
  const area = Math.abs(shoelace) / 2;

  // 8. Equilateral & Equiangular checks
  const avgLen = perimeter / sideCount;
  const isEquilateral = edgeLengths.every(l => Math.abs(l - avgLen) / (avgLen || 1) < 0.005);

  const avgAngle = interiorAnglesDeg.reduce((a, b) => a + b, 0) / sideCount;
  const isEquiangular = interiorAnglesDeg.every(a => Math.abs(a - avgAngle) < 0.5);

  // 9. Self-intersection test (e.g. pentagrams, crossed quadrilaterals, octagrams)
  let isSelfIntersecting = false;
  for (let i = 0; i < sideCount; i++) {
    const p1: [number, number] = [points2D[i].x, points2D[i].y];
    const p2: [number, number] = [points2D[(i + 1) % sideCount].x, points2D[(i + 1) % sideCount].y];

    for (let j = i + 2; j < sideCount; j++) {
      if (i === 0 && j === sideCount - 1) continue; // adjacent edges share endpoint
      const p3: [number, number] = [points2D[j].x, points2D[j].y];
      const p4: [number, number] = [points2D[(j + 1) % sideCount].x, points2D[(j + 1) % sideCount].y];

      if (segmentsIntersect2D(p1, p2, p3, p4)) {
        isSelfIntersecting = true;
        break;
      }
    }
    if (isSelfIntersecting) break;
  }

  const isRegular = isEquilateral && isEquiangular && !isSelfIntersecting;

  // 10. Classification string
  let shapeClassification = `${sideCount}-gon`;
  if (sideCount === 3) {
    if (isEquilateral) shapeClassification = 'Equilateral Triangle';
    else if (
      Math.abs(edgeLengths[0] - edgeLengths[1]) < 0.01 ||
      Math.abs(edgeLengths[1] - edgeLengths[2]) < 0.01 ||
      Math.abs(edgeLengths[0] - edgeLengths[2]) < 0.01
    ) {
      shapeClassification = 'Isosceles Triangle';
    } else {
      shapeClassification = 'Scalene Triangle';
    }
  } else if (sideCount === 4) {
    if (isRegular) shapeClassification = 'Square';
    else if (isEquilateral) shapeClassification = 'Rhombus';
    else if (isSelfIntersecting) shapeClassification = 'Crossed / Anti-parallelogram Quad';
    else if (isEquiangular) shapeClassification = 'Rectangle';
    else shapeClassification = 'Planar Quadrilateral';
  } else if (sideCount === 5) {
    if (isRegular) shapeClassification = 'Regular Convex Pentagon';
    else if (isSelfIntersecting && isEquilateral) shapeClassification = 'Star Pentagram {5/2}';
    else if (isSelfIntersecting) shapeClassification = 'Self-Intersecting Pentagram';
    else shapeClassification = 'Isohedral Pentagon';
  } else if (sideCount === 6) {
    if (isRegular) shapeClassification = 'Regular Hexagon';
    else if (isSelfIntersecting) shapeClassification = 'Self-Intersecting Star Hexagram';
    else shapeClassification = 'Equilateral / Symmetric Hexagon';
  } else if (sideCount === 8) {
    if (isRegular) shapeClassification = 'Regular Octagon';
    else if (isSelfIntersecting) shapeClassification = 'Star Octagram';
    else shapeClassification = 'Equilateral Octagon';
  } else if (sideCount === 9) {
    shapeClassification = isSelfIntersecting ? 'Star Nonagram {9/k}' : 'Enneagon (9-gon)';
  } else if (sideCount === 12) {
    shapeClassification = isSelfIntersecting ? 'Star Dodecagram {12/k}' : 'Dodecagon (12-gon)';
  } else {
    shapeClassification = `${isSelfIntersecting ? 'Star ' : ''}${sideCount}-sided Poly Shape`;
  }

  return {
    faceIndex,
    vertexIndices: faceIndices,
    points3D,
    points2D,
    sideCount,
    edgeLengths,
    interiorAnglesDeg,
    perimeter,
    area,
    planeNormal: normal,
    planeDistance,
    centroid3D,
    isEquilateral,
    isEquiangular,
    isRegular,
    isSelfIntersecting,
    shapeClassification,
  };
}

/**
 * Generate clean SVG string for the 2D Poly Shape
 */
export function generatePolyShapeSVG(
  analysis: PolyShapeAnalysis,
  options: {
    width?: number;
    height?: number;
    showVertices?: boolean;
    showLengths?: boolean;
    showAngles?: boolean;
    showAxes?: boolean;
    darkMode?: boolean;
  } = {}
): string {
  const {
    width = 400,
    height = 400,
    showVertices = true,
    showLengths = true,
    showAngles = true,
    showAxes = true,
    darkMode = true,
  } = options;

  const points = analysis.points2D;
  if (points.length === 0) return '<svg></svg>';

  // Find bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const pt of points) {
    minX = Math.min(minX, pt.x);
    maxX = Math.max(maxX, pt.x);
    minY = Math.min(minY, pt.y);
    maxY = Math.max(maxY, pt.y);
  }

  const padding = showLengths || showVertices ? 55 : 35;
  const spanX = Math.max(maxX - minX, 0.001);
  const spanY = Math.max(maxY - minY, 0.001);
  const maxSpan = Math.max(spanX, spanY);

  const scale = (Math.min(width, height) - padding * 2) / maxSpan;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const toSvgX = (x: number) => width / 2 + (x - cx) * scale;
  const toSvgY = (y: number) => height / 2 - (y - cy) * scale; // invert Y for SVG

  const svgPoints = points.map(pt => `${toSvgX(pt.x).toFixed(2)},${toSvgY(pt.y).toFixed(2)}`).join(' ');

  let elements = '';

  // Grid/Axes colors
  const axisColor = darkMode ? '#334155' : '#e2e8f0';
  const axisLabelColor = darkMode ? '#64748b' : '#94a3b8';
  const polyFill = darkMode ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.18)';
  const polyStroke = darkMode ? '#fbbf24' : '#d97706';
  const lengthTextColor = darkMode ? '#fef08a' : '#78350f';
  const lengthBgColor = darkMode ? '#1e293b' : '#fef3c7';
  const vertexTextColor = darkMode ? '#f8fafc' : '#1e293b';
  const angleTextColor = darkMode ? '#67e8f9' : '#0891b2';

  // Axes / Grid
  if (showAxes) {
    const originX = toSvgX(0);
    const originY = toSvgY(0);
    // Subtle cross axes through (0,0)
    elements += `<line x1="16" y1="${originY.toFixed(2)}" x2="${width - 16}" y2="${originY.toFixed(2)}" stroke="${axisColor}" stroke-dasharray="4,4" stroke-width="1.2" />`;
    elements += `<line x1="${originX.toFixed(2)}" y1="16" x2="${originX.toFixed(2)}" y2="${height - 16}" stroke="${axisColor}" stroke-dasharray="4,4" stroke-width="1.2" />`;
    elements += `<text x="${width - 24}" y="${(originY - 6).toFixed(2)}" font-size="10" font-family="monospace" fill="${axisLabelColor}">+X</text>`;
    elements += `<text x="${(originX + 6).toFixed(2)}" y="24" font-size="10" font-family="monospace" fill="${axisLabelColor}">+Y</text>`;
    // Center dot
    elements += `<circle cx="${originX.toFixed(2)}" cy="${originY.toFixed(2)}" r="2.5" fill="${axisLabelColor}" />`;
  }

  // Polygon fill & stroke
  elements += `<polygon points="${svgPoints}" fill="${polyFill}" stroke="${polyStroke}" stroke-width="2.5" stroke-linejoin="round" />`;

  // Interior angle labels
  if (showAngles && analysis.interiorAnglesDeg?.length === points.length) {
    for (let i = 0; i < points.length; i++) {
      const sx = toSvgX(points[i].x);
      const sy = toSvgY(points[i].y);
      const angle = analysis.interiorAnglesDeg[i];
      if (angle > 0) {
        // Offset toward centroid
        const dx = (width / 2) - sx;
        const dy = (height / 2) - sy;
        const dist = Math.hypot(dx, dy) || 1;
        const offsetDist = Math.min(22, dist * 0.35);
        const ax = sx + (dx / dist) * offsetDist;
        const ay = sy + (dy / dist) * offsetDist;

        elements += `<text x="${ax.toFixed(1)}" y="${ay.toFixed(1)}" font-size="9.5" font-family="monospace" font-weight="600" fill="${angleTextColor}" text-anchor="middle" dominant-baseline="middle">${angle.toFixed(1)}°</text>`;
      }
    }
  }

  // Edge lengths labels
  if (showLengths) {
    for (let i = 0; i < points.length; i++) {
      const nextIdx = (i + 1) % points.length;
      const x1 = toSvgX(points[i].x);
      const y1 = toSvgY(points[i].y);
      const x2 = toSvgX(points[nextIdx].x);
      const y2 = toSvgY(points[nextIdx].y);

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Normal offset for label (outwards from center)
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      let nx = -dy / (len || 1) * 14;
      let ny = dx / (len || 1) * 14;

      // Check dot product with vector from center to point to ensure outward
      const toMidX = midX - width / 2;
      const toMidY = midY - height / 2;
      if (nx * toMidX + ny * toMidY < 0) {
        nx = -nx;
        ny = -ny;
      }

      const lenStr = analysis.edgeLengths[i]?.toFixed(3) || '';
      // Pill badge behind text for legibility
      const labelX = midX + nx;
      const labelY = midY + ny;
      elements += `<rect x="${(labelX - 16).toFixed(1)}" y="${(labelY - 7).toFixed(1)}" width="32" height="14" rx="3" fill="${lengthBgColor}" opacity="0.85" />`;
      elements += `<text x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" font-size="9" font-family="monospace" fill="${lengthTextColor}" text-anchor="middle" dominant-baseline="middle" font-weight="700">${lenStr}</text>`;
    }
  }

  // Vertices and indices
  if (showVertices) {
    for (let i = 0; i < points.length; i++) {
      const sx = toSvgX(points[i].x);
      const sy = toSvgY(points[i].y);

      elements += `<circle cx="${sx.toFixed(2)}" cy="${sy.toFixed(2)}" r="4.5" fill="#f59e0b" stroke="${darkMode ? '#0f172a' : '#ffffff'}" stroke-width="2" />`;
      // Vertex index label offset outward
      const dx = sx - width / 2;
      const dy = sy - height / 2;
      const dist = Math.hypot(dx, dy) || 1;
      const lx = sx + (dx / dist) * 12;
      const ly = sy + (dy / dist) * 12;

      elements += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="10.5" font-weight="bold" font-family="monospace" fill="${vertexTextColor}" text-anchor="middle" dominant-baseline="middle">v${points[i].vertexIndex3D}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${elements}
</svg>`;
}

/**
 * Generate OBJ string for 3D export
 */
export function generateOBJ(polyhedron: {
  name?: string;
  vertices: [number, number, number][];
  faces: number[][];
}): string {
  let obj = `# Noble Polyhedron Export\n# Vertices: ${polyhedron.vertices.length}\n# Faces: ${polyhedron.faces.length}\no ${polyhedron.name || 'noble_poly'}\n\n`;

  for (const v of polyhedron.vertices) {
    obj += `v ${v[0]} ${v[1]} ${v[2]}\n`;
  }
  obj += '\n';

  for (const f of polyhedron.faces) {
    obj += `f ${f.map(idx => idx + 1).join(' ')}\n`;
  }

  return obj;
}

/**
 * Download helper for files
 */
export function triggerDownload(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
