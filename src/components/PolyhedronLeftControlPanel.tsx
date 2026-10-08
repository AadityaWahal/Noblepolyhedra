import React, { useState } from 'react';
import { ViewerSettings, RenderMode, ColorTheme } from '../types';
import {
  Sliders,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Play,
  Pause,
  Box,
  Layers,
  Sparkles,
  Camera,
  Compass,
  Palette,
  CircleDot,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface PolyhedronLeftControlPanelProps {
  settings: ViewerSettings;
  onUpdateSettings: (settings: Partial<ViewerSettings>) => void;
  isLightMode?: boolean;
  isAutoTour?: boolean;
  onToggleAutoTour?: () => void;
  tourSpeedMs?: number;
  onChangeTourSpeed?: (speedMs: number) => void;
  onResetCamera?: (view: 'iso' | 'front' | 'top') => void;
}

const COLOR_THEMES: { id: ColorTheme; label: string; color: string }[] = [
  { id: 'classicLight', label: 'Classic', color: 'bg-amber-400' },
  { id: 'slateAmber', label: 'Amber', color: 'bg-amber-600' },
  { id: 'royalPrism', label: 'Prism', color: 'bg-indigo-500' },
  { id: 'emeraldGold', label: 'Emerald', color: 'bg-emerald-500' },
  { id: 'cyberpunk', label: 'Neon', color: 'bg-fuchsia-500' },
  { id: 'academic', label: 'Paper', color: 'bg-stone-400' },
];

export const PolyhedronLeftControlPanel: React.FC<PolyhedronLeftControlPanelProps> = ({
  settings,
  onUpdateSettings,
  isLightMode = true,
  isAutoTour = false,
  onToggleAutoTour,
  tourSpeedMs = 4000,
  onChangeTourSpeed,
  onResetCamera,
}) => {
  // Start expanded by default, but collapsible for full canvas view
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      id="polyhedron-left-control-panel"
      className="absolute top-16 left-3 sm:left-4 z-20 pointer-events-auto select-none transition-all duration-300"
    >
      {isCollapsed ? (
        /* COLLAPSED ICON STRIP: Ultra-compact, stylish floating icon bar */
        <div
          className={`flex flex-col items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all ${
            isLightMode
              ? 'bg-white/92 border-stone-200/90 text-stone-700 shadow-stone-300/40'
              : 'bg-slate-900/92 border-slate-700/80 text-slate-200 shadow-black/60'
          }`}
        >
          {/* Expand Button */}
          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-2 rounded-xl transition-colors ${
              isLightMode ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-amber-500/20 text-amber-400'
            }`}
            title="Expand Control Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className={`w-5 h-[1px] ${isLightMode ? 'bg-stone-200' : 'bg-slate-700'}`} />

          {/* Render Mode Toggle Quick Icon */}
          <button
            onClick={() => {
              const modes: RenderMode[] = ['solid', 'transparent', 'wireframe'];
              const nextMode = modes[(modes.indexOf(settings.renderMode) + 1) % modes.length];
              onUpdateSettings({ renderMode: nextMode });
            }}
            className={`p-2 rounded-xl transition-colors ${
              settings.renderMode !== 'solid'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : isLightMode
                  ? 'hover:bg-stone-100 text-stone-600'
                  : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={`Render Mode: ${settings.renderMode} (Click to cycle)`}
          >
            <Box className="w-4 h-4" />
          </button>

          {/* Auto-Rotate Quick Toggle */}
          <button
            onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
            className={`p-2 rounded-xl transition-colors ${
              settings.autoRotate
                ? 'bg-amber-500 text-slate-950 font-bold'
                : isLightMode
                  ? 'hover:bg-stone-100 text-stone-600'
                  : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={settings.autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          >
            <RotateCw className={`w-4 h-4 ${settings.autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Auto-Tour Quick Toggle */}
          {onToggleAutoTour && (
            <button
              onClick={onToggleAutoTour}
              className={`p-2 rounded-xl transition-colors ${
                isAutoTour
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : isLightMode
                    ? 'hover:bg-stone-100 text-stone-600'
                    : 'hover:bg-slate-800 text-slate-300'
              }`}
              title={isAutoTour ? 'Pause Tour' : 'Start Auto Tour'}
            >
              {isAutoTour ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          )}

          {/* Camera Reset Quick Icon */}
          {onResetCamera && (
            <button
              onClick={() => onResetCamera('iso')}
              className={`p-2 rounded-xl transition-colors ${
                isLightMode ? 'hover:bg-stone-100 text-stone-600' : 'hover:bg-slate-800 text-slate-300'
              }`}
              title="Reset to ISO View"
            >
              <Compass className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* EXPANDED RICH CONTROL PANEL: Beautiful, organized, intuitive */
        <div
          className={`w-64 sm:w-72 p-3 sm:p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-200 flex flex-col gap-3 max-h-[calc(100vh-170px)] overflow-y-auto ${
            isLightMode
              ? 'bg-white/94 border-stone-200/90 text-stone-800 shadow-stone-300/50'
              : 'bg-slate-900/94 border-slate-700/80 text-slate-100 shadow-black/70'
          }`}
        >
          {/* HEADER: Title & Collapse Button */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold tracking-tight uppercase font-mono">Control Panel</span>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className={`p-1 rounded-lg transition-colors text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 ${
                isLightMode ? 'hover:bg-stone-100' : 'hover:bg-slate-800'
              }`}
              title="Collapse Panel (Shift to compact)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 1. RENDER MODE */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Render Mode
            </span>
            <div
              className={`grid grid-cols-3 gap-1 p-1 rounded-xl ${
                isLightMode ? 'bg-stone-100/90' : 'bg-slate-800/80'
              }`}
            >
              {(['solid', 'transparent', 'wireframe'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => onUpdateSettings({ renderMode: mode })}
                  className={`capitalize py-1 px-1.5 rounded-lg text-xs font-medium transition-all ${
                    settings.renderMode === mode
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : isLightMode
                        ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                  }`}
                >
                  {mode === 'transparent' ? 'Glass' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* 2. GEOMETRY & EXPLODE SLIDER */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Explode Faces
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  {(settings.explodeAmount * 100).toFixed(0)}%
                </span>
                {settings.explodeAmount > 0 && (
                  <button
                    onClick={() => onUpdateSettings({ explodeAmount: 0 })}
                    className="text-[9.5px] px-1 py-0.2 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 font-mono transition-colors"
                    title="Reset Explode"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1.2"
              step="0.02"
              value={settings.explodeAmount}
              onChange={e => onUpdateSettings({ explodeAmount: parseFloat(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer h-1.5 rounded-lg bg-stone-200 dark:bg-slate-700"
            />
          </div>

          {/* 3. EDGES & VERTICES TOGGLES */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onUpdateSettings({ showWireframeEdges: !settings.showWireframeEdges })}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                settings.showWireframeEdges
                  ? isLightMode
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold shadow-xs'
                    : 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                  : isLightMode
                    ? 'border-stone-200/80 text-stone-600 hover:bg-stone-50'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Edges</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showVertexSpheres: !settings.showVertexSpheres })}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                settings.showVertexSpheres
                  ? isLightMode
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold shadow-xs'
                    : 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                  : isLightMode
                    ? 'border-stone-200/80 text-stone-600 hover:bg-stone-50'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>Vertices</span>
            </button>
          </div>

          {/* 4. COLOR THEME PALETTE */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Color Palette
            </span>
            <div className="grid grid-cols-3 gap-1">
              {COLOR_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onUpdateSettings({ colorTheme: theme.id })}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] border transition-all ${
                    settings.colorTheme === theme.id
                      ? 'border-amber-500 bg-amber-500/15 text-stone-900 dark:text-amber-300 font-semibold'
                      : isLightMode
                        ? 'border-stone-200 hover:bg-stone-50 text-stone-600'
                        : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${theme.color}`} />
                  <span className="truncate">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. CAMERA PRESETS & AUTO-ROTATE */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-stone-200/70 dark:border-slate-800">
            <span className="text-[10.5px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Camera & Motion
            </span>

            {/* Camera Views: ISO, Front, Top */}
            {onResetCamera && (
              <div
                className={`flex items-center justify-between p-1 rounded-xl ${
                  isLightMode ? 'bg-stone-100/90' : 'bg-slate-800/80'
                }`}
              >
                {(['iso', 'front', 'top'] as const).map(view => (
                  <button
                    key={view}
                    onClick={() => onResetCamera(view)}
                    className={`capitalize flex-1 py-1 px-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                      isLightMode
                        ? 'hover:bg-white text-stone-700 hover:text-stone-900'
                        : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {view.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Auto-Rotate Toggle & Speed */}
            <div className="flex items-center justify-between gap-2 mt-1">
              <button
                onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl text-xs font-medium border transition-all ${
                  settings.autoRotate
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                    : isLightMode
                      ? 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${settings.autoRotate ? 'animate-spin' : ''}`} />
                <span>Auto-Rotate</span>
              </button>

              {settings.autoRotate && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(spd => (
                    <button
                      key={spd}
                      onClick={() => onUpdateSettings({ rotationSpeed: spd })}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        settings.rotationSpeed === spd
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : isLightMode
                            ? 'text-stone-500 hover:bg-stone-200'
                            : 'text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. AUTO-TOUR CONTROLS */}
          {onToggleAutoTour && (
            <div className="flex flex-col gap-1.5 pt-1 border-t border-stone-200/70 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Auto-Tour
                </span>
                {onChangeTourSpeed && (
                  <div className="flex items-center gap-1">
                    {[2000, 4000, 6000].map(speed => (
                      <button
                        key={speed}
                        onClick={() => onChangeTourSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono transition-colors ${
                          tourSpeedMs === speed
                            ? isLightMode
                              ? 'bg-stone-200 text-stone-900 font-bold'
                              : 'bg-slate-700 text-amber-300 font-bold'
                            : 'text-stone-400 hover:text-stone-600 dark:hover:text-slate-200'
                        }`}
                      >
                        {speed / 1000}s
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={onToggleAutoTour}
                className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl font-semibold text-xs transition-all ${
                  isAutoTour
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : isLightMode
                      ? 'bg-stone-100 hover:bg-stone-200/80 text-stone-800'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isAutoTour ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isAutoTour ? 'Pause Auto-Tour (Space)' : 'Start Auto-Tour'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
