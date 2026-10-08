import React, { useState, useEffect } from 'react';
import { NobleModelSummary, NoblePolyhedron, ViewerSettings } from '../types';
import { MiniPolyhedron3D } from './MiniPolyhedron3D';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Sliders,
  Box,
  Layers,
  Grid,
  X,
} from 'lucide-react';

interface PolyhedronTrioNavProps {
  activeList: NobleModelSummary[];
  currentModelId: string;
  allModelsMap: Record<string, NoblePolyhedron>;
  onSelectModel: (summary: NobleModelSummary) => void;
  onPrev: () => void;
  onNext: () => void;
  isLightMode?: boolean;
  // Auto-tour
  isAutoTour?: boolean;
  onToggleAutoTour?: () => void;
  tourSpeedMs?: number;
  onChangeTourSpeed?: (speedMs: number) => void;
  // 3D Viewer Settings & Other controls
  settings: ViewerSettings;
  onUpdateSettings: (settings: Partial<ViewerSettings>) => void;
}

export const PolyhedronTrioNav: React.FC<PolyhedronTrioNavProps> = ({
  activeList,
  currentModelId,
  allModelsMap,
  onSelectModel,
  onPrev,
  onNext,
  isLightMode = true,
  isAutoTour = false,
  onToggleAutoTour,
  tourSpeedMs = 4000,
  onChangeTourSpeed,
  settings,
  onUpdateSettings,
}) => {
  const currentIndex = activeList.findIndex(m => m.id === currentModelId);
  const total = activeList.length;

  // Track slide transition direction for smooth animation
  const [slideDirection, setSlideDirection] = useState<'prev' | 'next' | null>(null);

  // Mobile tools drawer state (collapsed by default on mobile, always visible on desktop)
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 320);
      return () => clearTimeout(timer);
    }
  }, [slideDirection, currentModelId]);

  if (total === 0) return null;

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  const prevSummary = activeList[prevIndex];
  const currentSummary = activeList[currentIndex] || activeList[0];
  const nextSummary = activeList[nextIndex];

  const prevModel = allModelsMap[prevSummary.id];
  const currentModel = allModelsMap[currentSummary.id];
  const nextModel = allModelsMap[nextSummary.id];

  const currentDiscovery = currentModel ? getDiscoveryInfo(currentModel) : null;

  const handlePrevClick = () => {
    setSlideDirection('prev');
    onPrev();
  };

  const handleNextClick = () => {
    setSlideDirection('next');
    onNext();
  };

  // Reusable toolbar content
  const renderToolbarItems = () => (
    <>
      {/* AUTO TOUR SECTION */}
      <div className="flex flex-col items-center gap-1 w-full">
        {onToggleAutoTour && (
          <button
            id="left-auto-tour-btn"
            onClick={onToggleAutoTour}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all w-full ${
              isAutoTour
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : isLightMode
                  ? 'hover:bg-stone-100 text-stone-700'
                  : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={isAutoTour ? 'Pause Auto-Tour (Shortcut: Space)' : 'Start Auto-Tour (Shortcut: Space)'}
          >
            {isAutoTour ? (
              <Pause className="w-4 h-4 fill-current animate-pulse" />
            ) : (
              <Play className="w-4 h-4 fill-current text-amber-600 dark:text-amber-400" />
            )}
            <span className="text-[9.5px] font-semibold mt-0.5 tracking-tight">
              {isAutoTour ? 'Touring' : 'Tour'}
            </span>
          </button>
        )}

        {/* Speed Selector (2s, 4s, 6s) */}
        {onChangeTourSpeed && (
          <div className="flex items-center justify-center gap-0.5 w-full pt-0.5">
            {[2000, 4000, 6000].map(speed => (
              <button
                key={speed}
                onClick={() => onChangeTourSpeed(speed)}
                className={`px-1 py-0.5 rounded text-[8.5px] font-mono transition-colors ${
                  tourSpeedMs === speed
                    ? isLightMode
                      ? 'bg-stone-200 text-stone-900 font-bold'
                      : 'bg-slate-700 text-amber-300 font-bold'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-slate-200'
                }`}
                title={`Tour interval: ${speed / 1000}s`}
              >
                {speed / 1000}s
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={`w-full h-px ${isLightMode ? 'bg-stone-200' : 'bg-slate-800'}`} />

      {/* RENDER MODES (Solid, Transparent, Wireframe) */}
      <div className="flex flex-col items-center gap-1 w-full">
        <span className="text-[8.5px] uppercase tracking-wider font-semibold opacity-60">Mode</span>
        <div className="flex flex-col gap-0.5 w-full">
          {(['solid', 'transparent', 'wireframe'] as const).map(mode => (
            <button
              key={mode}
              id={`left-render-mode-${mode}`}
              onClick={() => onUpdateSettings({ renderMode: mode })}
              className={`w-full py-1 px-1 rounded-lg text-[10px] capitalize font-medium transition-all text-center ${
                settings.renderMode === mode
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : isLightMode
                    ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={`Render Mode: ${mode}`}
            >
              {mode === 'transparent' ? 'Trans' : mode === 'wireframe' ? 'Wire' : 'Solid'}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`w-full h-px ${isLightMode ? 'bg-stone-200' : 'bg-slate-800'}`} />

      {/* EXPLODE SLIDER */}
      <div className="flex flex-col items-center gap-1 w-full px-0.5">
        <div className="flex items-center justify-between w-full text-[9px] font-mono text-stone-500 dark:text-slate-400">
          <span>Exp</span>
          <span className="text-amber-600 font-semibold">{(settings.explodeAmount * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1.2"
          step="0.02"
          value={settings.explodeAmount}
          onChange={e => onUpdateSettings({ explodeAmount: parseFloat(e.target.value) })}
          className="w-14 accent-amber-600 cursor-pointer h-1 rounded-lg"
          title="Explode facets"
        />
      </div>

      {/* Divider */}
      <div className={`w-full h-px ${isLightMode ? 'bg-stone-200' : 'bg-slate-800'}`} />

      {/* GEOMETRY TOGGLES (Edges, Vertices, Spin) */}
      <div className="flex flex-col gap-1 w-full">
        <button
          onClick={() => onUpdateSettings({ showWireframeEdges: !settings.showWireframeEdges })}
          className={`w-full py-0.5 px-1 rounded-md text-[9.5px] transition-colors text-center ${
            settings.showWireframeEdges
              ? isLightMode ? 'bg-stone-200 text-stone-900 font-bold' : 'bg-slate-700 text-amber-300 font-bold'
              : isLightMode ? 'text-stone-500 hover:bg-stone-100' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Toggle Wireframe Edges"
        >
          Edges
        </button>
        <button
          onClick={() => onUpdateSettings({ showVertexSpheres: !settings.showVertexSpheres })}
          className={`w-full py-0.5 px-1 rounded-md text-[9.5px] transition-colors text-center ${
            settings.showVertexSpheres
              ? isLightMode ? 'bg-stone-200 text-stone-900 font-bold' : 'bg-slate-700 text-amber-300 font-bold'
              : isLightMode ? 'text-stone-500 hover:bg-stone-100' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Toggle Vertex Spheres"
        >
          Verts
        </button>
        <button
          onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
          className={`w-full py-0.5 px-1 rounded-md text-[9.5px] flex items-center justify-center gap-0.5 transition-colors ${
            settings.autoRotate
              ? isLightMode ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-amber-500/20 text-amber-300 font-bold'
              : isLightMode ? 'text-stone-500 hover:bg-stone-100' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title={settings.autoRotate ? 'Pause Auto-Spin' : 'Auto-Spin'}
        >
          <RotateCw className="w-2.5 h-2.5" />
          <span>Spin</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP PERMANENT LEFT-SIDE CONTROL BAR (Laptop & PC view: 100% untouched) */}
      <aside
        id="desktop-left-side-control-bar"
        className={`hidden md:flex absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-auto z-20 flex-col items-center gap-2 p-2 rounded-2xl border backdrop-blur-md shadow-xl select-none transition-all duration-200 text-xs ${
          isLightMode
            ? 'bg-white/90 border-stone-200/90 text-stone-700'
            : 'bg-slate-900/90 border-slate-700/70 text-slate-200'
        }`}
        style={{ maxWidth: '78px' }}
      >
        {renderToolbarItems()}
      </aside>

      {/* MOBILE COMPACT FLOATING TOOLS TRIGGER (Visible only on mobile devices) */}
      <button
        id="mobile-tools-trigger-btn"
        onClick={() => setIsMobileToolsOpen(prev => !prev)}
        className={`md:hidden absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto z-20 flex flex-col items-center justify-center p-2 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-200 ${
          isMobileToolsOpen
            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 scale-105'
            : isLightMode
              ? 'bg-white/90 hover:bg-white text-stone-700 border-stone-200/90'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/70'
        }`}
        title="Open 3D Tools"
      >
        <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-[9px] font-bold tracking-tight mt-0.5">Tools</span>
      </button>

      {/* MOBILE EXPANDED TOOLS DRAWER (Slides in when tapped, can be closed anytime) */}
      {isMobileToolsOpen && (
        <aside
          id="mobile-expanded-control-bar"
          className={`md:hidden absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto z-30 flex flex-col items-center gap-2 p-2 rounded-2xl border backdrop-blur-md shadow-2xl select-none transition-all duration-200 text-xs animate-in fade-in slide-in-from-left duration-150 ${
            isLightMode
              ? 'bg-white/95 border-stone-200/90 text-stone-700'
              : 'bg-slate-900/95 border-slate-700/70 text-slate-200'
          }`}
          style={{ maxWidth: '82px' }}
        >
          <div className="flex items-center justify-between w-full pb-1 border-b border-stone-200 dark:border-slate-800">
            <span className="text-[9px] font-bold text-amber-600">TOOLS</span>
            <button
              onClick={() => setIsMobileToolsOpen(false)}
              className="p-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              title="Close Tools"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {renderToolbarItems()}
        </aside>
      )}

      {/* 3-SHAPE ANIMATED CAROUSEL (BEFORE, CURRENT, NEXT) AT BOTTOM CENTER */}
      {/* Kept exact same shape, proportions, and sliding animation - but smaller and lower so it never collides! */}
      <div
        id="trio-bottom-carousel-container"
        className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 pointer-events-auto z-20 flex items-end justify-center gap-1.5 sm:gap-2.5 select-none transition-all duration-300"
      >
        {/* BEFORE SHAPE (Small square card with slide animation) */}
        <button
          id="trio-nav-before-btn"
          onClick={handlePrevClick}
          className={`group flex flex-col items-center justify-between p-1 rounded-xl border backdrop-blur-md shadow-md transition-all duration-300 transform cursor-pointer ${
            isLightMode
              ? 'bg-white/85 hover:bg-white border-stone-200/90 text-stone-700 hover:border-amber-400'
              : 'bg-slate-900/80 hover:bg-slate-900 border-slate-700/60 text-slate-300 hover:border-amber-400'
          } ${
            slideDirection === 'prev' ? '-translate-x-2 scale-90' : 'scale-90 hover:scale-95'
          } opacity-85 hover:opacity-100 w-14 sm:w-16 h-18 sm:h-20`}
          title={`Previous Shape: ${prevSummary.id} (Shortcut: Left Arrow ←)`}
        >
          {/* Header pill */}
          <div className="w-full flex items-center justify-between text-[9px] font-mono px-0.5">
            <span className="flex items-center text-stone-500 dark:text-slate-400 group-hover:text-amber-600 transition-colors">
              <ChevronLeft className="w-2.5 h-2.5 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span className="font-semibold text-stone-700 dark:text-slate-300 truncate">{prevSummary.id}</span>
          </div>

          {/* Mini 3D Preview (Small size 36px) */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center overflow-hidden my-auto pointer-events-none">
            {prevModel ? (
              <MiniPolyhedron3D
                model={prevModel}
                isLightMode={isLightMode}
                interactive={false}
                className="w-full h-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-slate-800 animate-pulse" />
            )}
          </div>

          {/* Bottom tag */}
          <span className="text-[8px] font-mono text-stone-500 dark:text-slate-400 truncate max-w-full">
            {prevSummary.faceSides}-gon
          </span>
        </button>

        {/* CURRENT SHAPE (Centered square card, highlighted with amber ring & animation) */}
        <div
          id="trio-nav-current-card"
          className={`relative flex flex-col items-center justify-between p-1.5 rounded-2xl border-2 backdrop-blur-xl shadow-xl transition-all duration-300 transform ${
            isLightMode
              ? 'bg-white/95 border-amber-500 ring-2 ring-amber-500/20 text-stone-900'
              : 'bg-slate-900/95 border-amber-400 ring-2 ring-amber-500/30 text-slate-100'
          } ${
            slideDirection === 'next'
              ? 'translate-x-1 scale-100'
              : slideDirection === 'prev'
                ? '-translate-x-1 scale-100'
                : 'scale-100 sm:scale-105'
          } w-22 sm:w-26 h-26 sm:h-30 z-10`}
        >
          {/* Active Top Tag */}
          <div className="w-full flex items-center justify-between px-0.5 text-[9.5px] font-mono">
            <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Current</span>
            </span>
            <span className="text-[8.5px] text-stone-400 dark:text-slate-400 font-mono">
              #{currentIndex + 1}
            </span>
          </div>

          {/* Mini 3D Preview (52px) with auto spin & drag */}
          <div className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center overflow-hidden my-auto">
            {currentModel ? (
              <MiniPolyhedron3D
                model={currentModel}
                isLightMode={isLightMode}
                interactive={true}
                className="w-full h-full cursor-grab"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-slate-800 animate-pulse" />
            )}
          </div>

          {/* Model Name & Stats */}
          <div className="w-full text-center">
            <div className="font-bold text-[11px] tracking-tight font-mono text-stone-900 dark:text-white leading-tight">
              {currentSummary.id}
            </div>
            <div className="flex items-center justify-center gap-1 text-[8.5px] font-mono mt-0.5 text-stone-500 dark:text-slate-400 truncate">
              <span>{currentSummary.faceSides}-gon</span>
              <span>•</span>
              <span>{currentSummary.orbit}</span>
              {currentDiscovery && (
                <>
                  <span>•</span>
                  <span className={currentDiscovery.isNew ? 'text-emerald-600 font-semibold' : 'text-blue-600'}>
                    {currentDiscovery.isNew ? '2-DoF' : '1-DoF'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NEXT SHAPE (Small square card with slide animation) */}
        <button
          id="trio-nav-next-btn"
          onClick={handleNextClick}
          className={`group flex flex-col items-center justify-between p-1 rounded-xl border backdrop-blur-md shadow-md transition-all duration-300 transform cursor-pointer ${
            isLightMode
              ? 'bg-white/85 hover:bg-white border-stone-200/90 text-stone-700 hover:border-amber-400'
              : 'bg-slate-900/80 hover:bg-slate-900 border-slate-700/60 text-slate-300 hover:border-amber-400'
          } ${
            slideDirection === 'next' ? 'translate-x-2 scale-90' : 'scale-90 hover:scale-95'
          } opacity-85 hover:opacity-100 w-14 sm:w-16 h-18 sm:h-20`}
          title={`Next Shape: ${nextSummary.id} (Shortcut: Right Arrow →)`}
        >
          {/* Header pill */}
          <div className="w-full flex items-center justify-between text-[9px] font-mono px-0.5">
            <span className="font-semibold text-stone-700 dark:text-slate-300 truncate">{nextSummary.id}</span>
            <span className="flex items-center text-stone-500 dark:text-slate-400 group-hover:text-amber-600 transition-colors">
              <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Mini 3D Preview (Small size 36px) */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center overflow-hidden my-auto pointer-events-none">
            {nextModel ? (
              <MiniPolyhedron3D
                model={nextModel}
                isLightMode={isLightMode}
                interactive={false}
                className="w-full h-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-slate-800 animate-pulse" />
            )}
          </div>

          {/* Bottom tag */}
          <span className="text-[8px] font-mono text-stone-500 dark:text-slate-400 truncate max-w-full">
            {nextSummary.faceSides}-gon
          </span>
        </button>
      </div>
    </>
  );
};
