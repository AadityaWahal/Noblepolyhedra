import React, { useState, useEffect, useRef } from 'react';
import { NobleModelSummary, NoblePolyhedron } from '../types';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Landmark,
  Compass,
  Search,
  Check,
  FastForward,
  Clock,
  Layers,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface PolyhedronStepperProps {
  currentModel: NoblePolyhedron;
  activeList: NobleModelSummary[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelectModel: (summary: NobleModelSummary) => void;
  discoveryFilter: 'all' | 'newly-discovered' | 'previously-discovered';
  onChangeDiscoveryFilter: (filter: 'all' | 'newly-discovered' | 'previously-discovered') => void;
  isAutoTour: boolean;
  onToggleAutoTour: () => void;
  tourSpeedMs: number;
  onChangeTourSpeed: (ms: number) => void;
  onMaximize3D?: () => void;
  is3DMaximized?: boolean;
  onMaximize2DPlane?: () => void;
  isLightMode?: boolean;
}

export const PolyhedronStepper: React.FC<PolyhedronStepperProps> = ({
  currentModel,
  activeList,
  currentIndex,
  onNext,
  onPrev,
  onSelectModel,
  discoveryFilter,
  onChangeDiscoveryFilter,
  isAutoTour,
  onToggleAutoTour,
  tourSpeedMs,
  onChangeTourSpeed,
  onMaximize3D,
  is3DMaximized = false,
  onMaximize2DPlane,
  isLightMode = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [progress, setProgress] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const discoveryInfo = getDiscoveryInfo(currentModel);

  // Auto-tour progress bar animation
  useEffect(() => {
    if (!isAutoTour) {
      setProgress(0);
      return;
    }
    const interval = 50;
    const step = (interval / tourSpeedMs) * 100;
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + step));
    }, interval);
    return () => clearInterval(timer);
  }, [isAutoTour, tourSpeedMs, currentModel.id]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredForDropdown = activeList.filter(m =>
    m.id.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
    m.orbit.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
    `${m.faceSides}-gon`.includes(dropdownSearch.toLowerCase())
  );

  return (
    <div
      id="polyhedron-stepper-bar"
      className={`px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 select-none relative z-20 border-b transition-colors ${
        isLightMode
          ? 'bg-[#fbfbfa] border-stone-200 text-stone-800'
          : 'bg-slate-900/90 border-slate-800/80 text-slate-200'
      }`}
    >
      {/* Auto Tour Progress Indicator Line */}
      {isAutoTour && (
        <div className={`absolute top-0 left-0 right-0 h-0.5 overflow-hidden ${isLightMode ? 'bg-stone-200' : 'bg-slate-800'}`}>
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Left: Discovery Era Switcher Tabs (Compact) */}
      <div
        className={`flex items-center gap-0.5 p-0.5 rounded-md border text-xs ${
          isLightMode ? 'bg-stone-100 border-stone-200' : 'bg-slate-950 border-slate-800/80'
        }`}
      >
        <button
          id="stepper-filter-all"
          onClick={() => onChangeDiscoveryFilter('all')}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
            discoveryFilter === 'all'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : isLightMode
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Browse all 146 noble polyhedra"
        >
          <Layers className="w-3 h-3" />
          <span>All ({146})</span>
        </button>

        <button
          id="stepper-filter-new"
          onClick={() => onChangeDiscoveryFilter('newly-discovered')}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
            discoveryFilter === 'newly-discovered'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : isLightMode
                ? 'text-stone-600 hover:text-emerald-700'
                : 'text-slate-400 hover:text-emerald-400'
          }`}
          title="Browse 81 newly discovered noble polyhedra (2 DoF: gC, gD, sC, sD)"
        >
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>New (81)</span>
        </button>

        <button
          id="stepper-filter-classical"
          onClick={() => onChangeDiscoveryFilter('previously-discovered')}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
            discoveryFilter === 'previously-discovered'
              ? isLightMode
                ? 'bg-stone-800 text-white font-semibold shadow-xs'
                : 'bg-blue-600 text-white font-semibold shadow-xs'
              : isLightMode
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-slate-400 hover:text-blue-400'
          }`}
          title="Browse 65 classical polyhedra (Platonic, Keplerian, 1-DoF)"
        >
          <Landmark className="w-3 h-3" />
          <span>Classical (65)</span>
        </button>
      </div>

      {/* Center: Stepper (Prev / Current Picker / Next) */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button (Small) */}
        <button
          id="stepper-prev-btn"
          onClick={onPrev}
          disabled={activeList.length <= 1}
          className={`px-2 py-1 rounded text-xs border transition-colors flex items-center gap-0.5 disabled:opacity-30 ${
            isLightMode
              ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 shadow-xs'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
          }`}
          title="Previous Polyhedron (Shortcut: Left Arrow ←)"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Current Shape Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="stepper-current-picker"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-2.5 py-1 rounded text-xs border flex items-center gap-2 transition-colors min-w-[190px] justify-between shadow-xs ${
              isLightMode
                ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                : 'bg-slate-950 hover:bg-slate-800/80 border-slate-700/80 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-left">
              <span className={`font-mono font-bold ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`}>
                {currentModel.id}
              </span>
              <span className={`text-[10px] ${isLightMode ? 'text-stone-400' : 'text-slate-400'}`}>
                #{currentIndex + 1}/{activeList.length}
              </span>
            </div>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded border font-medium ${discoveryInfo.badgeClass}`}
            >
              {discoveryInfo.isNew ? '✨ New' : '🏛️ Classic'}
            </span>
          </button>

          {/* Direct Jump Dropdown */}
          {isDropdownOpen && (
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 max-h-80 rounded-xl shadow-2xl p-2 z-50 flex flex-col border ${
                isLightMode
                  ? 'bg-white border-stone-200 text-stone-800'
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <div className="relative mb-2">
                <Search className={`absolute left-2.5 top-2 w-3.5 h-3.5 ${isLightMode ? 'text-stone-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={dropdownSearch}
                  onChange={e => setDropdownSearch(e.target.value)}
                  placeholder="Jump to shape..."
                  autoFocus
                  className={`w-full pl-8 pr-2 py-1.5 rounded-lg text-xs font-mono border focus:outline-hidden ${
                    isLightMode
                      ? 'bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400 focus:border-amber-600'
                      : 'bg-slate-950 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-amber-500'
                  }`}
                />
              </div>

              <div
                className={`overflow-y-auto divide-y max-h-60 rounded-lg border ${
                  isLightMode
                    ? 'divide-stone-100 border-stone-200'
                    : 'divide-slate-800/60 border-slate-800'
                }`}
              >
                {filteredForDropdown.map((m, idx) => {
                  const isSelected = m.id === currentModel.id;
                  const isNew = m.dof === 2;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModel(m);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 flex items-center justify-between text-left text-xs transition-colors ${
                        isSelected
                          ? isLightMode
                            ? 'bg-amber-100/80 text-amber-950 font-semibold'
                            : 'bg-amber-500/20 text-white font-semibold'
                          : isLightMode
                            ? 'hover:bg-stone-50 text-stone-700'
                            : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono w-6 ${isLightMode ? 'text-stone-400' : 'text-slate-500'}`}>
                          #{idx + 1}
                        </span>
                        <span className={`font-mono font-bold ${isLightMode ? 'text-stone-900' : 'text-amber-300'}`}>
                          {m.id}
                        </span>
                        <span className={`text-[10px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                          ({m.faceSides}-gon)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded border ${
                            isNew
                              ? isLightMode
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : isLightMode
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {isNew ? 'New' : `${m.dof} DoF`}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Next Button (Small) */}
        <button
          id="stepper-next-btn"
          onClick={onNext}
          disabled={activeList.length <= 1}
          className={`px-2 py-1 rounded text-xs border transition-colors flex items-center gap-0.5 disabled:opacity-30 ${
            isLightMode
              ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 shadow-xs'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
          }`}
          title="Next Polyhedron (Shortcut: Right Arrow →)"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Auto-Tour, Speed & Maximize controls (Small Buttons) */}
      <div className="flex items-center gap-1.5">
        <button
          id="auto-tour-toggle-btn"
          onClick={onToggleAutoTour}
          className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all border shadow-xs ${
            isAutoTour
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : isLightMode
                ? 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Auto-step through noble polyhedra one after another (Shortcut: Spacebar)"
        >
          {isAutoTour ? (
            <>
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current text-amber-600" />
              <span>Tour</span>
            </>
          )}
        </button>

        {/* Speed Selector */}
        <div
          className={`flex items-center rounded border p-0.5 text-[10px] ${
            isLightMode ? 'bg-stone-100 border-stone-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          {[3000, 5000, 8000].map(speed => (
            <button
              key={speed}
              onClick={() => onChangeTourSpeed(speed)}
              className={`px-1 py-0.5 rounded transition-colors ${
                tourSpeedMs === speed
                  ? isLightMode
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'bg-slate-800 text-amber-300 font-bold'
                  : isLightMode
                    ? 'text-stone-500 hover:text-stone-800'
                    : 'text-slate-500 hover:text-slate-300'
              }`}
              title={`Switch shape every ${speed / 1000} seconds`}
            >
              {speed / 1000}s
            </button>
          ))}
        </div>

        {/* Maximize 3D Screen Button (Small) */}
        {onMaximize3D && (
          <button
            id="stepper-maximize-3d-btn"
            onClick={onMaximize3D}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all border shadow-xs ${
              is3DMaximized
                ? 'bg-amber-600 text-white border-amber-600'
                : isLightMode
                  ? 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={is3DMaximized ? 'Exit Fullscreen 3D (Esc or F)' : 'Maximize 3D Screen (Press F)'}
          >
            {is3DMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3 text-amber-600" />}
            <span className="hidden md:inline">{is3DMaximized ? 'Exit 3D' : 'Max 3D'}</span>
          </button>
        )}

        {/* Maximize 2D Plane Button (Small) */}
        {onMaximize2DPlane && (
          <button
            id="stepper-maximize-2d-btn"
            onClick={onMaximize2DPlane}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors border shadow-xs ${
              isLightMode
                ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200'
                : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30'
            }`}
            title="Maximize 2D Face Plane Screen"
          >
            <Layers className="w-3 h-3 text-sky-600" />
            <span className="hidden md:inline">2D Plane</span>
          </button>
        )}
      </div>
    </div>
  );
};
