import React, { useState, useMemo } from 'react';
import { NobleModelSummary } from '../types';
import { NOBLE_MODELS_INDEX } from '../data/modelsIndex';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import { Search, Filter, Shuffle, Layers, Sparkles, Landmark, Check, ChevronRight, Calculator } from 'lucide-react';

interface PolyhedronCatalogProps {
  selectedId: string;
  onSelectModel: (summary: NobleModelSummary) => void;
  onOpenCustomModal: () => void;
  discoveryFilter?: 'all' | 'newly-discovered' | 'previously-discovered';
  onChangeDiscoveryFilter?: (filter: 'all' | 'newly-discovered' | 'previously-discovered') => void;
  onOpenExhibitionCalculator?: () => void;
  isLightMode?: boolean;
}

export const PolyhedronCatalog: React.FC<PolyhedronCatalogProps> = ({
  selectedId,
  onSelectModel,
  onOpenCustomModal,
  discoveryFilter = 'all',
  onChangeDiscoveryFilter,
  onOpenExhibitionCalculator,
  isLightMode = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDof, setSelectedDof] = useState<number | 'all'>('all');
  const [selectedOrbit, setSelectedOrbit] = useState<string>('all');
  const [selectedSides, setSelectedSides] = useState<number | 'all'>('all');

  // Compute unique orbits and face sides
  const orbits = useMemo(() => {
    const set = new Set(NOBLE_MODELS_INDEX.map(m => m.orbit));
    return Array.from(set);
  }, []);

  const faceSideOptions = useMemo(() => {
    const set = new Set(NOBLE_MODELS_INDEX.map(m => m.faceSides));
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  // Filtered models
  const filteredModels = useMemo(() => {
    return NOBLE_MODELS_INDEX.filter(m => {
      // Discovery filter
      if (discoveryFilter === 'newly-discovered' && m.dof !== 2) return false;
      if (discoveryFilter === 'previously-discovered' && m.dof === 2) return false;

      // Degree of freedom filter
      if (selectedDof !== 'all' && m.dof !== selectedDof) return false;
      if (selectedOrbit !== 'all' && m.orbit !== selectedOrbit) return false;
      if (selectedSides !== 'all' && m.faceSides !== selectedSides) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesId = m.id.toLowerCase().includes(term);
        const matchesOrbit = m.orbit.toLowerCase().includes(term);
        const matchesSides = `${m.faceSides}-gon`.includes(term);
        const matchesPoly = m.polynomialDesc?.toLowerCase().includes(term);
        if (!matchesId && !matchesOrbit && !matchesSides && !matchesPoly) return false;
      }

      return true;
    });
  }, [searchTerm, selectedDof, selectedOrbit, selectedSides, discoveryFilter]);

  // Pick random model
  const handleRandom = () => {
    if (filteredModels.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredModels.length);
    onSelectModel(filteredModels[randomIndex]);
  };

  const handleJumpToFirstNew = () => {
    const firstNew = NOBLE_MODELS_INDEX.find(m => m.dof === 2);
    if (firstNew) onSelectModel(firstNew);
  };

  const handleJumpToClassical = () => {
    const classic = NOBLE_MODELS_INDEX.find(m => m.id === 'O-1' || m.id === 'C-1');
    if (classic) onSelectModel(classic);
  };

  return (
    <div
      className={`flex flex-col h-full select-none border-r transition-colors ${
        isLightMode
          ? 'bg-[#fcfcfa] border-stone-200 text-stone-800'
          : 'bg-slate-900/95 border-slate-700/60 text-slate-200'
      }`}
    >
      {/* Search and Top Controls */}
      <div className={`p-2.5 border-b space-y-2 ${isLightMode ? 'border-stone-200' : 'border-slate-700/60'}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider font-classic-heading">
            <Layers className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
            Catalog ({filteredModels.length})
          </span>
          <div className="flex items-center gap-1">
            <button
              id="random-poly-btn"
              onClick={handleRandom}
              className={`p-1 rounded text-xs flex items-center gap-1 px-2 border transition-colors shadow-xs ${
                isLightMode
                  ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Pick Random Polyhedron"
            >
              <Shuffle className="w-3 h-3" />
              <span className="text-[10px]">Random</span>
            </button>
            <button
              id="open-custom-btn"
              onClick={onOpenCustomModal}
              className={`p-1 rounded text-[10px] font-medium px-2 flex items-center gap-1 border transition-colors shadow-xs ${
                isLightMode
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
              }`}
              title="Import or paste custom OFF"
            >
              <Sparkles className="w-3 h-3" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Discovery Category Switcher */}
        <div
          className={`grid grid-cols-3 gap-0.5 p-0.5 rounded-md border text-[10px] ${
            isLightMode ? 'bg-stone-100 border-stone-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <button
            onClick={() => onChangeDiscoveryFilter && onChangeDiscoveryFilter('all')}
            className={`py-1 rounded font-medium transition-all ${
              discoveryFilter === 'all'
                ? isLightMode
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : isLightMode
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All (146)
          </button>
          <button
            onClick={() => onChangeDiscoveryFilter && onChangeDiscoveryFilter('newly-discovered')}
            className={`py-1 rounded font-medium transition-all flex items-center justify-center gap-0.5 ${
              discoveryFilter === 'newly-discovered'
                ? isLightMode
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : isLightMode
                  ? 'text-stone-600 hover:text-emerald-700'
                  : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>New (81)</span>
          </button>
          <button
            onClick={() => onChangeDiscoveryFilter && onChangeDiscoveryFilter('previously-discovered')}
            className={`py-1 rounded font-medium transition-all flex items-center justify-center gap-0.5 ${
              discoveryFilter === 'previously-discovered'
                ? isLightMode
                  ? 'bg-stone-800 text-white font-bold shadow-xs'
                  : 'bg-blue-500 text-slate-950 font-bold shadow-xs'
                : isLightMode
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-slate-400 hover:text-blue-400'
            }`}
          >
            <Landmark className="w-2.5 h-2.5" />
            <span>Classic (65)</span>
          </button>
        </div>

        {/* Search Input and Calculate & Find Action */}
        <div className="space-y-1.5">
          <div className="relative">
            <Search className={`absolute left-2.5 top-2 w-3.5 h-3.5 ${isLightMode ? 'text-stone-400' : 'text-slate-400'}`} />
            <input
              id="poly-search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search (e.g. sD-25, 5-gon, O-1)..."
              className={`w-full pl-8 pr-3 py-1 rounded-md text-xs font-mono border focus:outline-hidden transition-colors ${
                isLightMode
                  ? 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-600 shadow-xs'
                  : 'bg-slate-950 border-slate-700/80 text-slate-200 placeholder-slate-500 focus:border-amber-500'
              }`}
            />
          </div>

          {onOpenExhibitionCalculator && (
            <button
              id="catalog-open-calc-btn"
              onClick={onOpenExhibitionCalculator}
              className={`w-full py-1 px-2 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border shadow-xs ${
                isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
              }`}
              title="Open Exhibition Calculator: Input V, F, n, Euler Chi to compute and find polyhedra"
            >
              <Calculator className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
              <span>Euler Calculator & Finder</span>
            </button>
          )}
        </div>

        {/* Quick jump anchors */}
        <div className="flex items-center gap-1 text-[10px]">
          <button
            onClick={handleJumpToFirstNew}
            className={`flex-1 py-0.5 px-1 rounded truncate border transition-colors ${
              isLightMode
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                : 'bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border-slate-700'
            }`}
            title="Jump directly to first newly discovered noble shape (gC-1.1)"
          >
            ✨ 1st New Shape
          </button>
          <button
            onClick={handleJumpToClassical}
            className={`flex-1 py-0.5 px-1 rounded truncate border transition-colors ${
              isLightMode
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                : 'bg-slate-800/80 hover:bg-slate-700 text-blue-300 border-slate-700'
            }`}
            title="Jump directly to classical Platonic solid (O-1 / C-1)"
          >
            🏛️ Platonic Solid
          </button>
        </div>

        {/* Filter Selects for Orbit and Face Sides */}
        <div className="flex items-center gap-1 text-[10px]">
          <select
            value={selectedOrbit}
            onChange={e => setSelectedOrbit(e.target.value)}
            className={`flex-1 rounded px-1.5 py-0.5 focus:outline-hidden border text-[10px] ${
              isLightMode
                ? 'bg-white border-stone-200 text-stone-700 focus:border-amber-600'
                : 'bg-slate-800 border-slate-700 text-slate-300 focus:border-amber-500'
            }`}
          >
            <option value="all">All Orbits ({orbits.length})</option>
            {orbits.map(orb => (
              <option key={orb} value={orb}>
                Orbit {orb}
              </option>
            ))}
          </select>

          <select
            value={selectedSides}
            onChange={e => setSelectedSides(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className={`flex-1 rounded px-1.5 py-0.5 focus:outline-hidden border text-[10px] ${
              isLightMode
                ? 'bg-white border-stone-200 text-stone-700 focus:border-amber-600'
                : 'bg-slate-800 border-slate-700 text-slate-300 focus:border-amber-500'
            }`}
          >
            <option value="all">All Sides</option>
            {faceSideOptions.map(side => (
              <option key={side} value={side}>
                {side}-gon
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Model List View */}
      <div className={`flex-1 overflow-y-auto divide-y ${isLightMode ? 'divide-stone-100' : 'divide-slate-800/60'}`}>
        {filteredModels.length === 0 ? (
          <div className="p-6 text-center text-xs text-stone-400">
            No matching noble polyhedra found.
          </div>
        ) : (
          filteredModels.map((m, idx) => {
            const isSelected = m.id === selectedId;
            const info = getDiscoveryInfo(m);

            return (
              <button
                key={m.id}
                id={`model-item-${m.id}`}
                onClick={() => onSelectModel(m)}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors ${
                  isSelected
                    ? isLightMode
                      ? 'bg-amber-100/70 text-stone-900 border-l-3 border-amber-600 font-medium'
                      : 'bg-amber-500/15 text-white border-l-2 border-amber-500 font-medium'
                    : isLightMode
                      ? 'hover:bg-stone-100/80 text-stone-700'
                      : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono w-5 ${isLightMode ? 'text-stone-400' : 'text-slate-500'}`}>
                      #{idx + 1}
                    </span>
                    <span className={`font-mono font-bold text-xs ${isLightMode ? 'text-stone-900' : 'text-amber-300'}`}>
                      {m.id}
                    </span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded border ${
                        isLightMode
                          ? 'bg-stone-100 text-stone-600 border-stone-200'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {m.faceSides}-gon
                    </span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded border font-medium ${info.badgeClass}`}
                    >
                      {info.isNew ? 'New (2 DoF)' : `${m.dof} DoF`}
                    </span>
                  </div>
                  <div className={`text-[10px] flex items-center gap-1.5 font-mono pl-5 ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                    <span>V:{m.numVertices}</span>
                    <span>•</span>
                    <span>F:{m.numFaces}</span>
                    <span>•</span>
                    <span>E:{m.numEdges}</span>
                    <span>•</span>
                    <span>g:{m.genus}</span>
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  {isSelected ? (
                    <Check className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 opacity-30 ${isLightMode ? 'text-stone-400' : 'text-slate-500'}`} />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
