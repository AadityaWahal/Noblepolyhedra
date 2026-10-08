/**
 * ============================================================================
 * EXHIBITION CALCULATOR & NOBLE SHAPE FINDER
 * ============================================================================
 * This component provides an interactive mathematical calculation and search
 * engine designed specifically for exhibition demonstrations and audience engagement.
 *
 * MATHEMATICAL CAPABILITIES:
 * 1. Euler Characteristic Calculator: \chi = V - E + F
 * 2. Noble Polyhedron Incidence Solver: 2E = n * F = v * V
 *    where n = face sides (polygon gonality) and v = vertex valence
 * 3. Genus Solver: g = 1 - \chi / 2 (topological genus / number of holes)
 * 4. Reverse Shape Finder: Filters all 146 Noble Polyhedra in real time to match
 *    the computed or entered parameters, with one-click 3D loading.
 * 5. Exhibition Demonstration Presets: Instant buttons for classic vs newly discovered
 *    topological families.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { NobleModelSummary } from '../types';
import { NOBLE_MODELS_INDEX } from '../data/modelsIndex';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  Calculator,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Sliders,
  Layers,
  Flame,
} from 'lucide-react';

interface ExhibitionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (model: NobleModelSummary) => void;
}

export const ExhibitionCalculatorModal: React.FC<ExhibitionCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
}) => {
  // Input parameters state
  const [inputV, setInputV] = useState<string>(''); // Vertices
  const [inputF, setInputF] = useState<string>(''); // Faces
  const [inputSides, setInputSides] = useState<string>(''); // n-gon face sides
  const [inputEuler, setInputEuler] = useState<string>(''); // Target Euler characteristic
  const [selectedDof, setSelectedDof] = useState<'all' | 0 | 1 | 2>('all'); // Degree of Freedom
  const [selectedOrbit, setSelectedOrbit] = useState<string>('all'); // Symmetry Orbit

  // Parsed numerical inputs
  const numV = inputV.trim() === '' ? null : Number(inputV);
  const numF = inputF.trim() === '' ? null : Number(inputF);
  const numSides = inputSides.trim() === '' ? null : Number(inputSides);
  const numEuler = inputEuler.trim() === '' ? null : Number(inputEuler);

  /**
   * MATHEMATICAL TOPOLOGY CALCULATIONS:
   * We calculate theoretical edges and check consistency with Noble polyhedral topology:
   * - Isohedral condition: every face has n sides => 2E = n * F => E = (n * F) / 2
   * - Euler characteristic: \chi = V - E + F
   */
  const computedMetrics = useMemo(() => {
    // 1. Calculate Edge count if F and n (sides) are provided:
    let theoreticalEdgesFromF: number | null = null;
    if (numF !== null && numSides !== null && numSides > 0) {
      theoreticalEdgesFromF = (numSides * numF) / 2;
    }

    // 2. Calculate Edge count from Euler if V, F, and Chi are provided:
    let theoreticalEdgesFromEuler: number | null = null;
    if (numV !== null && numF !== null && numEuler !== null) {
      theoreticalEdgesFromEuler = numV + numF - numEuler;
    }

    // 3. Computed Euler Characteristic if V, F, and E (from sides) are known:
    let calculatedChi: number | null = null;
    if (numV !== null && numF !== null && theoreticalEdgesFromF !== null) {
      calculatedChi = numV - theoreticalEdgesFromF + numF;
    }

    // 4. Computed Genus: g = 1 - \chi / 2
    let calculatedGenus: number | null = null;
    const effectiveChi = numEuler !== null ? numEuler : calculatedChi;
    if (effectiveChi !== null) {
      calculatedGenus = 1 - effectiveChi / 2;
    }

    // 5. Computed Valence v = 2E / V:
    let calculatedValence: number | null = null;
    const effectiveE = theoreticalEdgesFromF !== null ? theoreticalEdgesFromF : theoreticalEdgesFromEuler;
    if (effectiveE !== null && numV !== null && numV > 0) {
      calculatedValence = (2 * effectiveE) / numV;
    }

    // 6. Consistency flag:
    const isEulerConsistent =
      theoreticalEdgesFromF !== null && theoreticalEdgesFromEuler !== null
        ? theoreticalEdgesFromF === theoreticalEdgesFromEuler
        : true;

    return {
      theoreticalEdgesFromF,
      theoreticalEdgesFromEuler,
      calculatedChi,
      calculatedGenus,
      calculatedValence,
      isEulerConsistent,
    };
  }, [numV, numF, numSides, numEuler]);

  /**
   * REVERSE MATCHING ENGINE:
   * Searches the entire 146-polyhedron dataset to find models matching the user's
   * specified parameters.
   */
  const matchedModels = useMemo(() => {
    return NOBLE_MODELS_INDEX.filter(m => {
      // Filter by Vertices (V)
      if (numV !== null && m.numVertices !== numV) return false;

      // Filter by Faces (F)
      if (numF !== null && m.numFaces !== numF) return false;

      // Filter by Face sides (n)
      if (numSides !== null && m.faceSides !== numSides) return false;

      // Filter by Euler characteristic (\chi)
      if (numEuler !== null && m.eulerChar !== numEuler) return false;

      // Filter by Degree of Freedom (DoF)
      if (selectedDof !== 'all' && m.dof !== selectedDof) return false;

      // Filter by Symmetry Orbit
      if (selectedOrbit !== 'all' && m.orbit !== selectedOrbit) return false;

      return true;
    });
  }, [numV, numF, numSides, numEuler, selectedDof, selectedOrbit]);

  // List of all unique orbits in the library
  const availableOrbits = useMemo(() => {
    return Array.from(new Set(NOBLE_MODELS_INDEX.map(m => m.orbit)));
  }, []);

  // Quick reset all inputs
  const handleReset = () => {
    setInputV('');
    setInputF('');
    setInputSides('');
    setInputEuler('');
    setSelectedDof('all');
    setSelectedOrbit('all');
  };

  /**
   * EXHIBITION QUICK PRESETS:
   * Demonstrates key mathematical families to visitors with 1 click.
   */
  const handleApplyPreset = (preset: {
    v?: number;
    f?: number;
    sides?: number;
    euler?: number;
    dof?: 'all' | 0 | 1 | 2;
    orbit?: string;
  }) => {
    setInputV(preset.v !== undefined ? String(preset.v) : '');
    setInputF(preset.f !== undefined ? String(preset.f) : '');
    setInputSides(preset.sides !== undefined ? String(preset.sides) : '');
    setInputEuler(preset.euler !== undefined ? String(preset.euler) : '');
    setSelectedDof(preset.dof !== undefined ? preset.dof : 'all');
    setSelectedOrbit(preset.orbit !== undefined ? preset.orbit : 'all');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Exhibition Calculator & Shape Finder
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Interactive Formula Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Input topological parameters to solve Euler equations and discover matching Noble polyhedra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
              title="Reset all inputs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Quick Exhibition Presets Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Exhibition Demo Presets (Click to Test):
              </span>
              <span className="text-[10px] font-mono text-slate-500">Fast attendee questions</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleApplyPreset({ v: 24, f: 24, dof: 2 })}
                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                    ✨ 2-DoF New Discovery
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  V=24, F=24 (81 Models)
                </span>
              </button>

              <button
                onClick={() => handleApplyPreset({ euler: 2, dof: 0 })}
                className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300 group-hover:text-blue-200">
                    🏛️ Classical Spheres
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  &chi;=2, Genus=0 (Platonic)
                </span>
              </button>

              <button
                onClick={() => handleApplyPreset({ sides: 5 })}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                    ⭐ Pentagonal Faces
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  n=5 (Pentagonal Stars)
                </span>
              </button>

              <button
                onClick={() => handleApplyPreset({ euler: 0 })}
                className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 group-hover:text-purple-200">
                    🍩 Toroidal Genus-1
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  &chi;=0 (Euler torus)
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Parameters Input Grid */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                1. Input Known Geometric Parameters:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Leave blank to match any value
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Vertices V */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Vertices (V)</span>
                  <span className="text-[9px] font-mono text-slate-500">Points</span>
                </label>
                <input
                  id="calc-input-v"
                  type="number"
                  min="4"
                  max="120"
                  value={inputV}
                  onChange={e => setInputV(e.target.value)}
                  placeholder="e.g. 24"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Faces F */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Faces (F)</span>
                  <span className="text-[9px] font-mono text-slate-500">Polygons</span>
                </label>
                <input
                  id="calc-input-f"
                  type="number"
                  min="4"
                  max="120"
                  value={inputF}
                  onChange={e => setInputF(e.target.value)}
                  placeholder="e.g. 24"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Face Sides n */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Face Sides (n)</span>
                  <span className="text-[9px] font-mono text-slate-500">gonality</span>
                </label>
                <input
                  id="calc-input-sides"
                  type="number"
                  min="3"
                  max="12"
                  value={inputSides}
                  onChange={e => setInputSides(e.target.value)}
                  placeholder="e.g. 4 (quad)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Euler Characteristic Chi */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Euler (&chi;)</span>
                  <span className="text-[9px] font-mono text-slate-500">V - E + F</span>
                </label>
                <input
                  id="calc-input-euler"
                  type="number"
                  value={inputEuler}
                  onChange={e => setInputEuler(e.target.value)}
                  placeholder="e.g. -2 or 2"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* DoF and Orbit Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Degree of Freedom (DoF):
                </label>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  {(['all', 0, 1, 2] as const).map(dof => (
                    <button
                      key={dof}
                      onClick={() => setSelectedDof(dof)}
                      className={`py-1 rounded-md border font-mono transition-all ${
                        selectedDof === dof
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {dof === 'all' ? 'All DoF' : `${dof} DoF`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Symmetry Orbit Family:
                </label>
                <select
                  value={selectedOrbit}
                  onChange={e => setSelectedOrbit(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="all">All Symmetry Orbits ({availableOrbits.length})</option>
                  {availableOrbits.map(orb => (
                    <option key={orb} value={orb}>
                      Orbit {orb}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mathematical Analysis & Real-time Solved Equations */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                2. Real-Time Solved Mathematical Equations:
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Auto-computed</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {/* Calculated Edges */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Edges (E)</span>
                <span className="text-base font-bold font-mono text-amber-300">
                  {computedMetrics.theoreticalEdgesFromF !== null
                    ? computedMetrics.theoreticalEdgesFromF
                    : computedMetrics.theoreticalEdgesFromEuler !== null
                    ? computedMetrics.theoreticalEdgesFromEuler
                    : '—'}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {computedMetrics.theoreticalEdgesFromF !== null
                    ? '2E = n·F'
                    : computedMetrics.theoreticalEdgesFromEuler !== null
                    ? 'E = V+F-&chi;'
                    : 'Awaiting V, F or n'}
                </span>
              </div>

              {/* Calculated Euler Characteristic */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Euler Characteristic (&chi;)</span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {numEuler !== null
                    ? numEuler
                    : computedMetrics.calculatedChi !== null
                    ? computedMetrics.calculatedChi
                    : '—'}
                </span>
                <span className="text-[9px] text-slate-500 block">&chi; = V - E + F</span>
              </div>

              {/* Calculated Genus */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Topological Genus (g)</span>
                <span className="text-base font-bold font-mono text-emerald-300">
                  {computedMetrics.calculatedGenus !== null
                    ? computedMetrics.calculatedGenus
                    : '—'}
                </span>
                <span className="text-[9px] text-slate-500 block">Holes = 1 - &chi;/2</span>
              </div>

              {/* Calculated Vertex Valence */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Vertex Valence (v)</span>
                <span className="text-base font-bold font-mono text-purple-300">
                  {computedMetrics.calculatedValence !== null
                    ? computedMetrics.calculatedValence.toFixed(1)
                    : '—'}
                </span>
                <span className="text-[9px] text-slate-500 block">Edges per vertex (2E/V)</span>
              </div>
            </div>

            {/* Consistency explanation note */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Noble Consistency Condition: </span>
                Every noble polyhedron is both <strong className="text-amber-300">isohedral</strong> (all faces congruent) and <strong className="text-cyan-300">isogonal</strong> (all vertices transitive). Therefore, the incidence relationship <code className="text-emerald-300 font-mono">2E = n·F = v·V</code> strictly holds for all 146 models in the database!
              </div>
            </div>
          </div>

          {/* Matched Shapes from Library */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                3. Matched Noble Polyhedra in Library ({matchedModels.length}):
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Click any shape to load in 3D
              </span>
            </div>

            {matchedModels.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto opacity-70" />
                <p className="text-xs font-semibold text-slate-300">
                  No exact Noble Polyhedron found matching these criteria
                </p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  Try clearing one parameter (e.g. leave Euler blank or set DoF to All) or select one of the demonstration presets above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {matchedModels.map(m => {
                  const info = getDiscoveryInfo(m);
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-2 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-amber-300">
                            {m.id}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${info.badgeClass}`}
                          >
                            {info.isNew ? 'New (2 DoF)' : `${m.dof} DoF`}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 font-mono flex items-center gap-2">
                          <span>V:{m.numVertices}</span>
                          <span>•</span>
                          <span>F:{m.numFaces}</span>
                          <span>•</span>
                          <span>E:{m.numEdges}</span>
                          <span>•</span>
                          <span>{m.faceSides}-gon</span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono">
                          Orbit: <strong className="text-slate-300">{m.orbit}</strong> | &chi;={m.eulerChar} | g={m.genus}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectModel(m);
                          onClose();
                        }}
                        className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Load in 3D Viewer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
