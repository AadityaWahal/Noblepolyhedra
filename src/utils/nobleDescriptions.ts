import { NoblePolyhedron, NobleModelSummary } from '../types';

export interface EasyPolyhedronInfo {
  friendlyName: string;
  category: string;
  simpleDescription: string;
  verticesExplanation: string;
  edgesExplanation: string;
  facesExplanation: string;
  faceShapeName: string;
  dofTitle: string;
  dofSimpleExplanation: string;
  symmetryGroup: string;
  symmetrySimpleExplanation: string;
  eulerSimpleExplanation: string;
  funFact: string;
}

/**
 * Returns human-friendly name for standard polygon sides
 */
export function getPolygonName(sides: number): string {
  switch (sides) {
    case 3:
      return 'Triangle';
    case 4:
      return 'Quadrilateral / Square';
    case 5:
      return 'Pentagon';
    case 6:
      return 'Hexagon';
    case 7:
      return 'Heptagon';
    case 8:
      return 'Octagon';
    case 9:
      return 'Nonagon';
    case 10:
      return 'Decagon';
    case 12:
      return 'Dodecagon';
    default:
      return `${sides}-sided Polygon`;
  }
}

/**
 * Map orbit and model ID to human-friendly title, symmetry, and plain English descriptions
 */
export function getEasyPolyhedronInfo(model: NobleModelSummary | NoblePolyhedron): EasyPolyhedronInfo {
  const { id, orbit, dof, numVertices, numEdges, numFaces, faceSides, eulerChar } = model;
  const faceShape = getPolygonName(faceSides);

  // 1. Friendly Name & Category
  let friendlyName = `Noble Polyhedron ${id}`;
  let category = 'Classical Noble Shape';
  let funFact = 'All faces in this shape are 100% congruent, meaning every single face has the exact same size, shape, and corners.';

  if (id === 'C-1') {
    friendlyName = 'Regular Cube (Hexahedron)';
    category = 'Platonic Solid (Ancient Greek)';
    funFact = 'The cube is one of the 5 famous Platonic solids, recognized since ancient times for its perfect symmetry.';
  } else if (id === 'O-1') {
    friendlyName = 'Regular Octahedron';
    category = 'Platonic Solid (Ancient Greek)';
    funFact = 'The dual counterpart of the cube: placing a vertex at the center of each cube face creates an octahedron!';
  } else if (id === 'T-1') {
    friendlyName = 'Regular Tetrahedron';
    category = 'Platonic Solid (Ancient Greek)';
    funFact = 'The simplest of all regular 3D shapes, made of 4 equilateral triangles and self-dual to itself.';
  } else if (id === 'D-1') {
    friendlyName = 'Regular Dodecahedron';
    category = 'Platonic Solid (Ancient Greek)';
    funFact = 'Constructed of 12 regular pentagons. Plato associated this celestial shape with the entire cosmos.';
  } else if (id === 'I-1') {
    friendlyName = 'Regular Icosahedron';
    category = 'Platonic Solid (Ancient Greek)';
    funFact = 'Made of 20 triangular faces. Many biological viruses naturally form icosahedral capsids for maximum volume.';
  } else if (id === 'D-2') {
    friendlyName = 'Great Dodecahedron';
    category = 'Kepler-Poinsot Star Polyhedron';
    funFact = 'Discovered by Johannes Kepler in 1619, featuring self-intersecting pentagonal star planes.';
  } else if (id === 'D-3') {
    friendlyName = 'Small Stellated Dodecahedron';
    category = 'Kepler-Poinsot Star Polyhedron';
    funFact = 'Resembles a 12-pointed star created by extending the pentagonal planes of a dodecahedron outward.';
  } else if (id === 'D-4') {
    friendlyName = 'Great Stellated Dodecahedron';
    category = 'Kepler-Poinsot Star Polyhedron';
    funFact = 'Known for its dramatic 20 sharp star vertices and 12 intersecting star planes.';
  } else if (dof === 2) {
    category = '✨ Modern Mathematical Discovery (2-DoF)';
    if (orbit === 'gC') friendlyName = `General Octahedral 2-DoF (${id})`;
    else if (orbit === 'gD') friendlyName = `General Icosahedral 2-DoF (${id})`;
    else if (orbit === 'sC') friendlyName = `Snub Octahedral 2-DoF (${id})`;
    else if (orbit === 'sD') friendlyName = `Snub Icosahedral 2-DoF (${id})`;
    funFact = 'This shape was discovered computationally using 2-variable algebraic polynomial systems in modern geometry research!';
  } else if (dof === 1) {
    category = '1-Parameter Continuous Family (Classical)';
    if (orbit.startsWith('r')) friendlyName = `Rhombic Family (${id})`;
    else if (orbit.startsWith('t')) friendlyName = `Truncated Family (${id})`;
    funFact = 'Belongs to a continuous geometric family that can smoothly morph and flex while preserving noble symmetry.';
  } else if (dof === 0) {
    friendlyName = `Rigid Noble Faceting (${id})`;
    category = 'Rigid 0-DoF Polyhedron';
    funFact = 'A rigid faceting with exact coordinate solutions locked into symmetry axes.';
  }

  // 2. Vertices, Edges, Faces in plain language
  const verticesExplanation = `${numVertices} corner points in 3D space where edges intersect`;
  const edgesExplanation = `${numEdges} straight line segments connecting the corner points`;
  const facesExplanation = `${numFaces} flat surfaces, all sharing the identical ${faceShape} shape`;

  // 3. Degree of Freedom explained simply
  let dofTitle = '0 Degrees of Freedom (Rigid)';
  let dofSimpleExplanation =
    'This polyhedron has a fixed, rigid shape. Its vertices and angles are mathematically locked and cannot be changed without breaking its symmetry.';

  if (dof === 1) {
    dofTitle = '1 Degree of Freedom (Flexible Family)';
    dofSimpleExplanation =
      'This polyhedron belongs to a continuous 1-slider family. You could stretch or morph it along one geometric parameter while all faces remain completely identical!';
  } else if (dof === 2) {
    dofTitle = '2 Degrees of Freedom (Newly Discovered)';
    dofSimpleExplanation =
      'Newly discovered in modern geometry! It relies on two independent algebraic parameters, found by solving high-degree polynomial root equations.';
  }

  // 4. Symmetry Group & Plain Explanation
  let symmetryGroup = 'Octahedral Symmetry';
  let symmetrySimpleExplanation =
    'Octahedral symmetry (the symmetry of a Cube and Octahedron). It looks completely identical from 24 rotational perspectives (and 48 if you include mirror reflections).';

  if (orbit === 'T') {
    symmetryGroup = 'Tetrahedral Symmetry';
    symmetrySimpleExplanation =
      'Tetrahedral symmetry (the symmetry of a 4-sided pyramid). It looks completely identical across 12 rotational orientations.';
  } else if (
    orbit === 'D' ||
    orbit === 'I' ||
    orbit === 'rD' ||
    orbit === 'tD' ||
    orbit === 'tI' ||
    orbit === 'gD' ||
    orbit === 'sD'
  ) {
    symmetryGroup = 'Icosahedral Symmetry';
    symmetrySimpleExplanation =
      'Icosahedral symmetry (the symmetry of a Dodecahedron and Icosahedron). This is the highest rotational symmetry possible in 3-dimensional space, with 60 rotational orientations (120 with mirrors)!';
  }

  // 5. Euler characteristic in simple words
  let eulerSimpleExplanation = `Corners (${numVertices}) - Edges (${numEdges}) + Faces (${numFaces}) = ${eulerChar}. `;
  if (eulerChar === 2) {
    eulerSimpleExplanation += 'A value of 2 means this shape is topologically equivalent to a normal solid sphere (no holes).';
  } else if (eulerChar === 0) {
    eulerSimpleExplanation += 'A value of 0 means this shape is topologically a torus (like a donut with 1 hole through the center).';
  } else {
    eulerSimpleExplanation += `Because its faces intersect through the center, it has an exotic star topology with genus ${(1 - eulerChar / 2).toFixed(0)}.`;
  }

  return {
    friendlyName,
    category,
    simpleDescription: `A noble polyhedron where all ${numVertices} vertices are identical and all ${numFaces} faces are congruent ${faceSides}-gons.`,
    verticesExplanation,
    edgesExplanation,
    facesExplanation,
    faceShapeName: faceShape,
    dofTitle,
    dofSimpleExplanation,
    symmetryGroup,
    symmetrySimpleExplanation,
    eulerSimpleExplanation,
    funFact,
  };
}
