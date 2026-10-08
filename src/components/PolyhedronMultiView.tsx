import React, { useState, useMemo } from 'react';
import { NobleModelSummary, NoblePolyhedron } from '../types';
import { MiniPolyhedron3D } from './MiniPolyhedron3D';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  Search,
  Sparkles,
  Landmark,
  Layers,
  ArrowUpDown,
  Filter,
  Maximize2,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

interface PolyhedronMultiViewProps {
  models: NobleModelSummary[];
  allModelsMap: Record<string, NoblePolyhedron>;
  selectedModelId: string;
  onSelectModel: (summary: NobleModelSummary) => void;
  isLightMode?: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  discoveryFilter: 'all' | 'newly-discovered' | 'previously-discovered';
  onChangeDiscoveryFilter: (filter: 'all' | 'newly-discovered' | 'previously-discovered') => void;
}

export const PolyhedronMultiView: React.FC<PolyhedronMultiViewProps> = ({
  models,
  allModelsMap,
  selectedModelId,
  onSelectModel,
  isLightMode = true,
  searchQuery,
  onSearchChange,
  discoveryFilter,
  onChangeDiscoveryFilter,
}) => {
  const [orbitFilter, setOrbitFilter] = useState<string>('all');
  const [faceSidesFilter, setFaceSidesFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'faces' | 'vertices' | 'sides'>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Available orbits
  const availableOrbits = useMemo(() => {
    const set = new Set<string>();
    models.forEach(m => set.add(m.orbit));
    return Array.from(set).sort();
  }, [models]);

  // Available face sides
  const availableSides = useMemo(() => {
    const set = new Set<number>();
    models.forEach(m => set.add(m.faceSides));
    return Array.from(set).sort((a, b) => a - b);
  }, [models]);

  // Filtered & Sorted items
  const filteredModels = useMemo(() => {
    return models
      .filter(m => {
        // Discovery filter
        if (discoveryFilter === 'newly-discovered' && m.dof !== 2) return false;
        if (discoveryFilter === 'previously-discovered' && m.dof === 2) return false;

        // Orbit filter
        if (orbitFilter !== 'all' && m.orbit !== orbitFilter) return false;

        // Face sides filter
        if (faceSidesFilter !== 'all' && m.faceSides !== Number(faceSidesFilter)) return false;

        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = m.id.toLowerCase().includes(q);
          const matchOrbit = m.orbit.toLowerCase().includes(q);
          const matchSides = `${m.faceSides}-gon`.includes(q) || `${m.faceSides}` === q;
          const matchVerts = `v${m.numVertices}`.includes(q) || `v:${m.numVertices}`.includes(q);
          const matchFaces = `f${m.numFaces}`.includes(q) || `f:${m.numFaces}`.includes(q);
          return matchId || matchOrbit || matchSides || matchVerts || matchFaces;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'id') {
          diff = a.id.localeCompare(b.id, undefined, { numeric: true });
        } else if (sortBy === 'faces') {
          diff = a.numFaces - b.numFaces;
        } else if (sortBy === 'vertices') {
          diff = a.numVertices - b.numVertices;
        } else if (sortBy === 'sides') {
          diff = a.faceSides - b.faceSides;
        }
        return sortAsc ? diff : -diff;
      });
  }, [models, discoveryFilter, orbitFilter, faceSidesFilter, searchQuery, sortBy, sortAsc]);

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden ${
        isLightMode ? 'bg-[#fcfbf9] text-stone-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Subheader Filter & Indexing Info Bar */}
      <div
        className={`px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 border-b shrink-0 text-xs ${
          isLightMode ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        {/* Left: Summary & Orbit Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 font-mono text-[11px]">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            Showing {filteredModels.length} of {models.length}
          </span>

          <span className="text-stone-300 dark:text-slate-700">|</span>

          {/* Orbit / Symmetry Family Selector */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className={`text-[11px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>Symmetry:</span>
            <button
              onClick={() => setOrbitFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                orbitFilter === 'all'
                  ? isLightMode
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-amber-500 text-slate-950 font-semibold'
                  : isLightMode
                    ? 'text-stone-600 hover:bg-stone-100'
                    : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              All
            </button>
            {availableOrbits.map(orb => (
              <button
                key={orb}
                onClick={() => setOrbitFilter(orb)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  orbitFilter === orb
                    ? isLightMode
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-amber-500 text-slate-950 font-semibold'
                    : isLightMode
                      ? 'text-stone-600 hover:bg-stone-100'
                      : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {orb}
              </button>
            ))}
          </div>

          <span className="text-stone-300 dark:text-slate-700">|</span>

          {/* Face Sides (n-gon) Filter */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className={`text-[11px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>Face:</span>
            <button
              onClick={() => setFaceSidesFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                faceSidesFilter === 'all'
                  ? isLightMode
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-amber-500 text-slate-950 font-semibold'
                  : isLightMode
                    ? 'text-stone-600 hover:bg-stone-100'
                    : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              All
            </button>
            {availableSides.map(sides => (
              <button
                key={sides}
                onClick={() => setFaceSidesFilter(String(sides))}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  faceSidesFilter === String(sides)
                    ? isLightMode
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-amber-500 text-slate-950 font-semibold'
                    : isLightMode
                      ? 'text-stone-600 hover:bg-stone-100'
                      : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {sides}g
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sort controls */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              isLightMode
                ? 'bg-stone-50 border-stone-200 text-stone-800'
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <option value="id">ID</option>
            <option value="faces">Faces Count</option>
            <option value="vertices">Vertices Count</option>
            <option value="sides">Face Polygon Sides</option>
          </select>
          <button
            onClick={() => setSortAsc(prev => !prev)}
            className={`p-1 rounded border transition-colors ${
              isLightMode
                ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title={sortAsc ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Shapes (3D preview cards with small box of name) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
        {filteredModels.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Info className="w-8 h-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              No polyhedra matched your search or filter.
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
              Try resetting the search terms or symmetry filter.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                setOrbitFilter('all');
                setFaceSidesFilter('all');
                onChangeDiscoveryFilter('all');
              }}
              className="mt-3 px-3 py-1 bg-stone-900 text-white rounded text-xs hover:bg-stone-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {filteredModels.map(model => {
              const fullModel = allModelsMap[model.id] || {
                ...model,
                vertices: [],
                faces: [],
                rawOff: '',
              };
              const isSelected = model.id === selectedModelId;
              const disc = getDiscoveryInfo(model);

              return (
                <div
                  key={model.id}
                  onClick={() => onSelectModel(model)}
                  id={`multi-shape-card-${model.id}`}
                  className={`group relative rounded-xl border flex flex-col overflow-hidden transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isLightMode
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/25 shadow-md -translate-y-0.5'
                        : 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10 -translate-y-0.5'
                      : isLightMode
                        ? 'bg-white hover:bg-stone-50/90 border-stone-200 hover:border-amber-500/40 hover:shadow-md hover:-translate-y-0.5 shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-amber-500/40 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {/* Small 3D View Canvas */}
                  <div
                    className={`relative w-full h-28 sm:h-32 flex items-center justify-center border-b transition-colors ${
                      isLightMode ? 'bg-[#fbfbfa] border-stone-100' : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <MiniPolyhedron3D
                      model={fullModel}
                      isLightMode={isLightMode}
                      autoSpin={true}
                      className="w-full h-full"
                    />

                    {/* Top corner discovery badge */}
                    <div className="absolute top-1.5 left-2 z-10">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5 border ${
                          disc.isNew
                            ? isLightMode
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : isLightMode
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {disc.isNew ? (
                          <>
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>New</span>
                          </>
                        ) : (
                          <>
                            <Landmark className="w-2.5 h-2.5" />
                            <span>Classic</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Hover indicator: Click to open single 3D view */}
                    <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-[9px] bg-stone-900/80 text-white px-1.5 py-0.5 rounded shadow-xs">
                        Open ↗
                      </span>
                    </div>
                  </div>

                  {/* Small Box with Name & Metadata */}
                  <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isSelected
                              ? isLightMode
                                ? 'text-amber-800'
                                : 'text-amber-400'
                              : isLightMode
                                ? 'text-stone-900 group-hover:text-amber-700'
                                : 'text-white group-hover:text-amber-400'
                          }`}
                        >
                          {model.id}
                        </span>
                        <span className={`text-[10px] font-classic-serif ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                          Orbit {model.orbit}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono ${isLightMode ? 'text-stone-400' : 'text-slate-500'}`}>
                        {model.faceSides}g
                      </span>
                    </div>

                    {/* Bottom Geometry Line */}
                    <div className={`mt-1.5 pt-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
                      isLightMode ? 'border-stone-100 text-stone-500' : 'border-slate-800/80 text-slate-400'
                    }`}>
                      <span>F: {model.numFaces}</span>
                      <span>V: {model.numVertices}</span>
                      <span>E: {model.numEdges}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
