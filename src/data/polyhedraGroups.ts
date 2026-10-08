import { NobleModelSummary } from '../types';
import { NOBLE_MODELS_INDEX } from './modelsIndex';

export interface PolyhedronOrbitGroup {
  id: string;
  name: string;
  shortLabel: string;
  symmetry: string;
  symmetryClass: 'Octahedral' | 'Icosahedral' | 'Tetrahedral';
  dof: 0 | 1 | 2;
  dofLabel: string;
  description: string;
  discoveryNote: string;
  vertexArrangement: string;
  modelCount: number;
  models: NobleModelSummary[];
}

export const ORBIT_GROUP_DEFINITIONS: Record<
  string,
  Omit<PolyhedronOrbitGroup, 'models' | 'modelCount'>
> = {
  C: {
    id: 'C',
    name: 'Cubic Orbit (Regular Hexahedron)',
    shortLabel: 'Group C',
    symmetry: 'Octahedral (Oh)',
    symmetryClass: 'Octahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      'Derived from the 8 vertices (±1, ±1, ±1) of a cube. Forms the classical Platonic regular hexahedron with square faces.',
    discoveryNote: 'Classical Platonic solid known since antiquity.',
    vertexArrangement: '8 vertices at (±1, ±1, ±1)',
  },
  D: {
    id: 'D',
    name: 'Dodecahedral Rigid Orbit',
    shortLabel: 'Group D',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      'Formed from the 20 vertices of a regular dodecahedron with coordinates involving the golden ratio φ = (1+√5)/2.',
    discoveryNote: 'Classical and Kepler-Poinsot star polyhedral families (Branko Grünbaum classification).',
    vertexArrangement: '20 vertices with golden ratio coordinates',
  },
  I: {
    id: 'I',
    name: 'Icosahedral Rigid Orbit',
    shortLabel: 'Group I',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      'Built upon the 12 vertices of a regular icosahedron. Displays triangular and star face configurations under icosahedral symmetry.',
    discoveryNote: 'Classical icosahedral figures including the regular icosahedron and great icosahedron.',
    vertexArrangement: '12 vertices at cyclic permutations of (0, ±1, ±φ)',
  },
  ID: {
    id: 'ID',
    name: 'Icosidodecahedral Orbit',
    shortLabel: 'Group ID',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      'Quasiregular 30-vertex configuration bridging icosahedral and dodecahedral symmetries with edge-transitive properties.',
    discoveryNote: 'Enumerated in Grünbaum’s landmark 1999 noble polyhedra classification.',
    vertexArrangement: '30 vertices at midpoints of dodecahedral edges',
  },
  O: {
    id: 'O',
    name: 'Octahedral Rigid Orbit',
    shortLabel: 'Group O',
    symmetry: 'Octahedral (Oh)',
    symmetryClass: 'Octahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      'The 6-vertex regular octahedron orbit at (±1, 0, 0) and cyclic coordinate permutations with triangular faces.',
    discoveryNote: 'Classical regular Platonic octahedron.',
    vertexArrangement: '6 vertices on Cartesian axes (±1, 0, 0)',
  },
  T: {
    id: 'T',
    name: 'Tetrahedral Rigid Orbit',
    shortLabel: 'Group T',
    symmetry: 'Tetrahedral (Td)',
    symmetryClass: 'Tetrahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      'The self-dual 4-vertex regular simplex in 3D Euclidean space. The simplest noble solid figure.',
    discoveryNote: 'Fundamental regular tetrahedron known across mathematical history.',
    vertexArrangement: '4 vertices at (1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)',
  },
  rC: {
    id: 'rC',
    name: 'Rectified Cubic Orbit',
    shortLabel: 'Group rC',
    symmetry: 'Octahedral (Oh)',
    symmetryClass: 'Octahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      '12-vertex cuboctahedral arrangement possessing octahedral symmetry. Exhibits triangular and square geometric harmonies.',
    discoveryNote: 'Archimedean cuboctahedral vertex arrangement.',
    vertexArrangement: '12 vertices at midpoints of cube edges',
  },
  rD: {
    id: 'rD',
    name: 'Rectified Dodecahedral Orbit',
    shortLabel: 'Group rD',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      '60-vertex rectified dodecahedral arrangement giving rise to 19 distinct noble polyhedra with intricate self-intersecting faces.',
    discoveryNote: '19 distinct noble polyhedra classified by Branko Grünbaum.',
    vertexArrangement: '60 vertices along rectified dodecahedral edges',
  },
  tC: {
    id: 'tC',
    name: 'Truncated Cubic Orbit',
    shortLabel: 'Group tC',
    symmetry: 'Octahedral (Oh)',
    symmetryClass: 'Octahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      '24-vertex truncated cubic orbit possessing octahedral symmetry with uniform edge lengths.',
    discoveryNote: 'Truncated cubic framework enumerated in Grünbaum (1999).',
    vertexArrangement: '24 vertices of a truncated cube',
  },
  tD: {
    id: 'tD',
    name: 'Truncated Dodecahedral Orbit',
    shortLabel: 'Group tD',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      '60-vertex truncated dodecahedral orbit containing 6 noble polyhedra with alternating decagonal and triangular geometries.',
    discoveryNote: '6 distinct isogonal and isohedral solid figures.',
    vertexArrangement: '60 vertices of truncated dodecahedron',
  },
  tI: {
    id: 'tI',
    name: 'Truncated Icosahedral Orbit',
    shortLabel: 'Group tI',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      '60-vertex truncated icosahedral orbit (the famous fullerene geometry) yielding 17 unique noble polyhedra.',
    discoveryNote: '17 noble polyhedra on the buckminsterfullerene vertex configuration.',
    vertexArrangement: '60 vertices of truncated icosahedron (C60 geometry)',
  },
  tO: {
    id: 'tO',
    name: 'Truncated Octahedral Orbit',
    shortLabel: 'Group tO',
    symmetry: 'Octahedral (Oh)',
    symmetryClass: 'Octahedral',
    dof: 0,
    dofLabel: '0-DOF Rigid Classical',
    description:
      '24-vertex truncated octahedral orbit known as the space-filling Kelvin solid geometry.',
    discoveryNote: 'Bitruncated cubic / truncated octahedral space-filling arrangement.',
    vertexArrangement: '24 vertices at permutations of (0, ±1, ±2)',
  },
  gC: {
    id: 'gC',
    name: 'General Cubic 1-DOF Orbit',
    shortLabel: 'Group gC',
    symmetry: 'Octahedral (Oh)',
    symmetryClass: 'Octahedral',
    dof: 1,
    dofLabel: '1-DOF Continuous Family',
    description:
      'Single continuous degree of freedom under octahedral symmetry allowing smooth morphing while retaining noble geometry.',
    discoveryNote: '3 continuous deformation families maintaining isohedral and isogonal symmetry.',
    vertexArrangement: 'Continuous 1D parametric curve of vertices under Oh symmetry',
  },
  gD: {
    id: 'gD',
    name: 'General Dodecahedral 1-DOF Orbit',
    shortLabel: 'Group gD',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 1,
    dofLabel: '1-DOF Continuous Family',
    description:
      'Expansive 1-parameter continuous deformation family with icosahedral symmetry containing 38 mathematically distinct noble shapes.',
    discoveryNote: '38 continuous deformation families cataloged by Grünbaum and Stevanović.',
    vertexArrangement: 'Continuous 1D parametric curve of vertices under Ih symmetry',
  },
  sC: {
    id: 'sC',
    name: 'Special Cubic 2-DOF Orbit',
    shortLabel: 'Group sC',
    symmetry: 'Octahedral (Oh)',
    symmetryClass: 'Octahedral',
    dof: 2,
    dofLabel: '2-DOF Stevanović Family',
    description:
      'Two continuous degrees of freedom under octahedral symmetry discovered in 2020 by Stevanović, expanding polyhedral frontiers.',
    discoveryNote: '7 newly discovered 2-DOF noble polyhedra families by Stevanović.',
    vertexArrangement: '2D continuous parametric manifold under Oh symmetry',
  },
  sD: {
    id: 'sD',
    name: 'Special Dodecahedral 2-DOF Orbit',
    shortLabel: 'Group sD',
    symmetry: 'Icosahedral (Ih)',
    symmetryClass: 'Icosahedral',
    dof: 2,
    dofLabel: '2-DOF Stevanović Family',
    description:
      'Breakthrough 33-member modern discovery family possessing 2 independent continuous deformation parameters under icosahedral symmetry.',
    discoveryNote: '33 newly discovered 2-DOF noble polyhedra families by Stevanović.',
    vertexArrangement: '2D continuous parametric manifold under Ih symmetry',
  },
};

/**
 * Returns all 16 orbit groups populated with their corresponding models from NOBLE_MODELS_INDEX.
 */
export function getAllPolyhedraGroups(): PolyhedronOrbitGroup[] {
  const groupOrder = [
    'C',
    'D',
    'I',
    'ID',
    'O',
    'T',
    'rC',
    'rD',
    'tC',
    'tD',
    'tI',
    'tO',
    'gC',
    'gD',
    'sC',
    'sD',
  ];

  return groupOrder.map(groupId => {
    const meta = ORBIT_GROUP_DEFINITIONS[groupId];
    const models = NOBLE_MODELS_INDEX.filter(m => m.orbit === groupId);
    return {
      ...meta,
      modelCount: models.length,
      models,
    };
  });
}
