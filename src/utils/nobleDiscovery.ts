import { NobleModelSummary } from '../types';

export type DiscoveryEra = 'newly-discovered' | 'previously-discovered';

export interface DiscoveryInfo {
  isNew: boolean;
  eraLabel: string;
  badgeText: string;
  badgeClass: string;
  historicalContext: string;
  familyGroup: 'Platonic & Keplerian' | 'Rigid Classical (0 DoF)' | 'Historical 1-DoF' | 'Newly Discovered (2 DoF)';
}

/**
 * Identifies whether a noble polyhedron was newly discovered in modern 2-DoF research
 * (the 2-degree-of-freedom orbits: gC, gD, sC, sD) or was previously discovered
 * (0 DoF rigid and 1 DoF parameter families).
 */
export function getDiscoveryInfo(model: NobleModelSummary): DiscoveryInfo {
  if (model.dof === 2) {
    return {
      isNew: true,
      eraLabel: 'Newly Discovered (Modern 2-DoF)',
      badgeText: '✨ Newly Discovered',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      historicalContext: 'Discovered and systematically enumerated via 2-parameter algebraic polynomial root systems.',
      familyGroup: 'Newly Discovered (2 DoF)',
    };
  }

  if (model.dof === 0) {
    const isRegular = ['C-1', 'D-1', 'I-1', 'O-1', 'T-1'].includes(model.id);
    return {
      isNew: false,
      eraLabel: isRegular ? 'Classical Regular (Platonic)' : 'Previously Discovered (0 DoF Rigid)',
      badgeText: isRegular ? '🏛️ Platonic Solid' : '🏛️ Classical Rigid',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      historicalContext: isRegular
        ? 'One of the classical Platonic / Keplerian regular polyhedra known since antiquity.'
        : 'Classical rigid 0-parameter noble polyhedron with fixed vertex coordinates.',
      familyGroup: isRegular ? 'Platonic & Keplerian' : 'Rigid Classical (0 DoF)',
    };
  }

  return {
    isNew: false,
    eraLabel: 'Previously Discovered (1-DoF Family)',
    badgeText: '🏛️ Classical (1 DoF)',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    historicalContext: 'Continuous 1-parameter noble polyhedron family studied in historical geometric literature (Grünbaum, Hess, Miklowitz).',
    familyGroup: 'Historical 1-DoF',
  };
}
