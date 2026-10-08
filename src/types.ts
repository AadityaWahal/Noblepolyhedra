export interface NobleModelSummary {
  id: string;
  dof: number; // 0, 1, 2
  orbit: string;
  numVertices: number;
  numFaces: number;
  numEdges: number;
  faceSides: number;
  eulerChar: number;
  genus: number;
  coordinatesDesc?: string;
  polynomialDesc?: string;
}

export interface NoblePolyhedron extends NobleModelSummary {
  path?: string;
  vertices: [number, number, number][];
  faces: number[][];
  rawOff: string;
}

export interface PolyShape2DPoint {
  x: number;
  y: number;
  originalIndex: number;
  vertexIndex3D: number;
}

export interface PolyShapeAnalysis {
  faceIndex: number;
  vertexIndices: number[];
  points3D: [number, number, number][];
  points2D: PolyShape2DPoint[];
  sideCount: number;
  edgeLengths: number[];
  interiorAnglesDeg: number[];
  perimeter: number;
  area: number;
  planeNormal: [number, number, number];
  planeDistance: number;
  centroid3D: [number, number, number];
  isEquilateral: boolean;
  isEquiangular: boolean;
  isRegular: boolean;
  isSelfIntersecting: boolean;
  shapeClassification: string;
}

export type RenderMode = 'solid' | 'transparent' | 'wireframe' | 'points' | 'exploded';

export type ColorTheme = 'classicLight' | 'academic' | 'slateAmber' | 'royalPrism' | 'emeraldGold' | 'cyberpunk';

export interface ViewerSettings {
  renderMode: RenderMode;
  colorTheme: ColorTheme;
  explodeAmount: number; // 0 to 1.5
  autoRotate: boolean;
  rotationSpeed: number;
  showVertexSpheres: boolean;
  showWireframeEdges: boolean;
  showNormals: boolean;
  opacity: number;
}
