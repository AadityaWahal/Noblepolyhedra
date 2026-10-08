import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NobleModelSummary, NoblePolyhedron } from '../types';
import { MiniPolyhedron3D } from './MiniPolyhedron3D';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  Landmark,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface PolyhedronSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  discoveryFilter: 'all' | 'newly-discovered' | 'previously-discovered';
  onChangeDiscoveryFilter: (filter: 'all' | 'newly-discovered' | 'previously-discovered') => void;
  orbitFilter: string;
  onChangeOrbitFilter: (orbit: string) => void;
  faceSidesFilter: string;
  onChangeFaceSidesFilter: (sides: string) => void;
  allModelsIndex: NobleModelSummary[];
  allModelsMap: Record<string, NoblePolyhedron>;
  onSelectModel: (summary: NobleModelSummary) => void;
  onSwitchToMultiView: () => void;
  isLightMode?: boolean;
}

export const PolyhedronSearchBar: React.FC<PolyhedronSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  discoveryFilter,
  onChangeDiscoveryFilter,
  orbitFilter,
  onChangeOrbitFilter,
  faceSidesFilter,
  onChangeFaceSidesFilter,
  allModelsIndex,
  allModelsMap,
  onSelectModel,
  onSwitchToMultiView,
  isLightMode = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter recommendations based on search & filters
  const recommendations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allModelsIndex
      .filter(m => {
        if (discoveryFilter === 'newly-discovered' && m.dof !== 2) return false;
        if (discoveryFilter === 'previously-discovered' && m.dof === 2) return false;
        if (orbitFilter !== 'all' && m.orbit !== orbitFilter) return false;
        if (faceSidesFilter !== 'all' && m.faceSides !== Number(faceSidesFilter)) return false;

        if (q) {
          const matchId = m.id.toLowerCase().includes(q);
          const matchOrbit = m.orbit.toLowerCase().includes(q);
          const matchSides = `${m.faceSides}-gon`.includes(q) || `${m.faceSides}` === q;
          const matchVerts = `v${m.numVertices}`.includes(q);
          const matchFaces = `f${m.numFaces}`.includes(q);
          return matchId || matchOrbit || matchSides || matchVerts || matchFaces;
        }
        return true;
      })
      .slice(0, 8); // Top 8 recommendations for instant popover
  }, [allModelsIndex, searchQuery, discoveryFilter, orbitFilter, faceSidesFilter]);

  const activeFilterCount =
    (discoveryFilter !== 'all' ? 1 : 0) +
    (orbitFilter !== 'all' ? 1 : 0) +
    (faceSidesFilter !== 'all' ? 1 : 0);

  const handleSelect = (model: NobleModelSummary) => {
    onSelectModel(model);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative z-40 w-full min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
      {/* Closed Search Bar input / Pill */}
      <div
        className={`flex items-center rounded-lg border transition-all duration-200 px-2 sm:px-2.5 py-1 ${
          isOpen
            ? isLightMode
              ? 'bg-white border-amber-600 ring-2 ring-amber-500/20 shadow-md'
              : 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
            : isLightMode
              ? 'bg-stone-50 hover:bg-white border-stone-200 text-stone-700 hover:border-stone-300 shadow-2xs'
              : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
        }`}
      >
        <Search className={`w-3.5 h-3.5 shrink-0 ${isLightMode ? 'text-stone-400' : 'text-slate-500'} mr-1.5 sm:mr-2`} />
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            onSearchChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Search 146 shapes..."
          className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-stone-400 dark:placeholder:text-slate-500"
        />

        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('');
              inputRef.current?.focus();
            }}
            className="p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 shrink-0"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Filter Toggle Button inside search bar */}
        <button
          onClick={() => {
            setIsOpen(true);
            setShowFilters(prev => !prev);
          }}
          className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border transition-colors shrink-0 ${
            showFilters || activeFilterCount > 0
              ? 'bg-amber-600 text-white border-amber-600 font-semibold'
              : isLightMode
                ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-600'
                : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
          }`}
          title="Filters"
        >
          <SlidersHorizontal className="w-2.5 h-2.5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && <span>({activeFilterCount})</span>}
        </button>
      </div>

      {/* Expanded Search & Indexing Recommendations Popover */}
      {isOpen && (
        <div
          className={`fixed sm:absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-14 sm:top-full mt-1.5 rounded-xl border shadow-2xl p-2.5 sm:p-3 z-50 transition-all ${
            isLightMode
              ? 'bg-white/98 backdrop-blur-lg border-stone-200 text-stone-900'
              : 'bg-slate-900/98 backdrop-blur-lg border-slate-700/80 text-slate-100'
          }`}
          style={{ maxWidth: '480px', width: 'min(480px, calc(100vw - 1rem))' }}
        >
          {/* Header with Close option for mobile */}
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider font-classic-heading">
                Search &amp; Index ({recommendations.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSwitchToMultiView();
                  setIsOpen(false);
                }}
                className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5 font-medium"
              >
                <span>Multi Grid</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                title="Close Search Popover"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* Filter options bar (collapsible or toggleable) */}
          {(showFilters || activeFilterCount > 0) && (
            <div className={`p-2 rounded-lg mb-2.5 border text-xs space-y-2 ${
              isLightMode ? 'bg-stone-50 border-stone-200/80' : 'bg-slate-950/80 border-slate-800'
            }`}>
              {/* Discovery status filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className={`text-[10.5px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>Discovery:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => onChangeDiscoveryFilter('all')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      discoveryFilter === 'all'
                        ? 'bg-amber-600 text-white font-semibold'
                        : isLightMode ? 'text-stone-600 hover:bg-stone-200/60' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    All (146)
                  </button>
                  <button
                    onClick={() => onChangeDiscoveryFilter('newly-discovered')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      discoveryFilter === 'newly-discovered'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : isLightMode ? 'text-stone-600 hover:bg-stone-200/60' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    ✨ New (40)
                  </button>
                  <button
                    onClick={() => onChangeDiscoveryFilter('previously-discovered')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      discoveryFilter === 'previously-discovered'
                        ? 'bg-blue-600 text-white font-semibold'
                        : isLightMode ? 'text-stone-600 hover:bg-stone-200/60' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    🏛 Classic (106)
                  </button>
                </div>
              </div>

              {/* Orbit / Symmetry filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className={`text-[10.5px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>Symmetry:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {['all', 'C', 'D', 'O', 'T', 'I'].map(orb => (
                    <button
                      key={orb}
                      onClick={() => onChangeOrbitFilter(orb)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        orbitFilter === orb
                          ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-slate-950 font-semibold'
                          : isLightMode ? 'text-stone-600 hover:bg-stone-200/60' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {orb === 'all' ? 'All' : orb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters button */}
              {activeFilterCount > 0 && (
                <div className="flex justify-end pt-1 border-t border-stone-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      onChangeDiscoveryFilter('all');
                      onChangeOrbitFilter('all');
                      onChangeFaceSidesFilter('all');
                    }}
                    className="text-[10px] text-amber-600 hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Indexing Recommendations header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider font-classic-heading">
              Indexing Recommendations ({recommendations.length})
            </span>
            <button
              onClick={() => {
                onSwitchToMultiView();
                setIsOpen(false);
              }}
              className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View all in Multi Grid</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Indexing Shapes: Straight-line list for phones only, 4-col grid for computers */}
          {recommendations.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-500">
              No matching shapes found for current search.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-4 sm:gap-2 max-h-72 overflow-y-auto scrollbar-thin p-0.5">
              {recommendations.map(model => {
                const fullModel = allModelsMap[model.id] || {
                  ...model,
                  vertices: [],
                  faces: [],
                  rawOff: '',
                };
                const disc = getDiscoveryInfo(model);

                return (
                  <div
                    key={model.id}
                    onClick={() => handleSelect(model)}
                    className={`group rounded-lg border overflow-hidden transition-all cursor-pointer ${
                      isLightMode
                        ? 'bg-white hover:bg-stone-50 border-stone-200 hover:border-amber-500 hover:shadow-xs'
                        : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 hover:border-amber-500'
                    }`}
                  >
                    {/* MOBILE VIEW: Straight-line row item (Phones only) */}
                    <div className="flex sm:hidden items-center p-2 gap-2.5 w-full">
                      {/* Mini 3D Preview (48x48) */}
                      <div className="w-12 h-12 shrink-0 rounded-md bg-stone-100/70 dark:bg-slate-900/80 relative overflow-hidden flex items-center justify-center border border-stone-200/60 dark:border-slate-800">
                        <MiniPolyhedron3D
                          model={fullModel}
                          isLightMode={isLightMode}
                          autoSpin={true}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Straight Line Info Layout */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                            {model.id}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 dark:text-slate-400">
                            {model.faceSides}-gon
                          </span>
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-medium ml-auto shrink-0 ${
                            disc.isNew
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {disc.isNew ? '✨ 2-DoF' : 'Classic'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500 dark:text-slate-400 mt-1">
                          <span>{model.numFaces} Faces</span>
                          <span>•</span>
                          <span>{model.numVertices} Vertices</span>
                          <span>•</span>
                          <span>Orbit {model.orbit}</span>
                        </div>
                      </div>

                      {/* Action Arrow */}
                      <div className="shrink-0 text-stone-300 dark:text-slate-600 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* COMPUTER / DESKTOP VIEW: The original 4-column card format */}
                    <div className="hidden sm:flex flex-col w-full">
                      {/* Small 3D View Canvas */}
                      <div className="w-full h-18 bg-stone-100/50 dark:bg-slate-900/60 relative overflow-hidden flex items-center justify-center">
                        <MiniPolyhedron3D
                          model={fullModel}
                          isLightMode={isLightMode}
                          autoSpin={true}
                          className="w-full h-full"
                        />
                        <span className={`absolute top-1 left-1 text-[8px] px-1 py-0.2 rounded font-medium ${
                          disc.isNew ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {disc.isNew ? 'New' : 'Classic'}
                        </span>
                      </div>

                      {/* Small Box with Name */}
                      <div className="p-1.5 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200 group-hover:text-amber-600">
                            {model.id}
                          </span>
                          <span className="text-[9px] font-mono text-stone-400">
                            {model.faceSides}g
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-stone-500 dark:text-slate-400 flex justify-between mt-0.5">
                          <span>F:{model.numFaces}</span>
                          <span>V:{model.numVertices}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom quick switch to Multi View action */}
          <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className={`text-[10px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
              Click any shape to open in Single 3D View
            </span>
            <button
              onClick={() => {
                onSwitchToMultiView();
                setIsOpen(false);
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-medium shadow-xs flex items-center gap-1 transition-colors"
            >
              <span>Explore Multi Grid</span>
              <Layers className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
