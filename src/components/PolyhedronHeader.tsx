import React, { useState } from 'react';
import { NoblePolyhedron, ViewerSettings, ColorTheme, NobleModelSummary } from '../types';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import { PolyhedronSearchBar } from './PolyhedronSearchBar';
import {
  Sparkles,
  Palette,
  BookOpen,
  Boxes,
  Landmark,
  Calculator,
  Sun,
  Moon,
  Info,
  Layers,
  Box,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  X,
} from 'lucide-react';

interface PolyhedronHeaderProps {
  currentModel: NoblePolyhedron;
  settings: ViewerSettings;
  onUpdateSettings: (newSettings: Partial<ViewerSettings>) => void;
  onOpenMathInfo: () => void;
  onOpenDiscoveryGuide: () => void;
  panelMode?: 'easy' | 'advanced';
  onChangePanelMode?: (mode: 'easy' | 'advanced') => void;
  onOpenExhibitionCalculator?: () => void;
  isLightMode?: boolean;
  onToggleLightMode?: () => void;
  isCleanView?: boolean;
  onToggleCleanView?: () => void;
  viewMode: 'single' | 'multi';
  onChangeViewMode: (mode: 'single' | 'multi') => void;
  isInfoOpen: boolean;
  onToggleInfo: () => void;
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
  onSelectModel: (model: NobleModelSummary) => void;
}

const THEME_OPTIONS: { id: ColorTheme; label: string; dotColor: string }[] = [
  { id: 'classicLight', label: 'Classic Light', dotColor: 'bg-stone-500' },
  { id: 'academic', label: 'Architectural Slate', dotColor: 'bg-slate-600' },
  { id: 'slateAmber', label: 'Slate & Amber (Dark)', dotColor: 'bg-amber-500' },
  { id: 'royalPrism', label: 'Royal Prism (Dark)', dotColor: 'bg-indigo-500' },
  { id: 'emeraldGold', label: 'Emerald & Gold (Dark)', dotColor: 'bg-emerald-500' },
  { id: 'cyberpunk', label: 'Cyberpunk (Dark)', dotColor: 'bg-pink-500' },
];

export const PolyhedronHeader: React.FC<PolyhedronHeaderProps> = ({
  currentModel,
  settings,
  onUpdateSettings,
  onOpenMathInfo,
  onOpenDiscoveryGuide,
  onOpenExhibitionCalculator,
  isLightMode = true,
  onToggleLightMode,
  isCleanView = false,
  onToggleCleanView,
  viewMode,
  onChangeViewMode,
  isInfoOpen,
  onToggleInfo,
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
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const discoveryInfo = getDiscoveryInfo(currentModel);

  return (
    <header
      id="main-app-header"
      className={`h-14 px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-3 select-none shrink-0 z-30 transition-colors duration-200 border-b relative ${
        isLightMode
          ? 'bg-white/95 border-stone-200 text-stone-800 shadow-xs'
          : 'bg-slate-900/95 border-slate-700/60 text-slate-100 shadow-sm'
      }`}
    >
      {/* Left: Brand Logo & Title (Responsive) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ${
            isLightMode
              ? 'bg-stone-900 text-stone-100'
              : 'bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950'
          }`}
        >
          <Boxes className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <h1 className="text-xs sm:text-sm font-semibold tracking-tight font-classic-heading">
              <span className="hidden sm:inline">Noble Polyhedra</span>
              <span className="sm:hidden font-bold">Noble</span>
            </h1>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded border hidden sm:inline-block ${
                isLightMode
                  ? 'bg-stone-100 text-stone-600 border-stone-200'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              Atlas of 146
            </span>
          </div>
          <p
            className={`text-[10px] hidden md:block font-classic-serif italic ${
              isLightMode ? 'text-stone-500' : 'text-slate-400'
            }`}
          >
            3D Figures &amp; Solid Shapes • Webtigo Group
          </p>
        </div>
      </div>

      {/* Center: Top Search Bar with Filters & Indexing Recommendations */}
      <div className="flex-1 min-w-0 flex justify-center max-w-xs sm:max-w-sm md:max-w-lg mx-1 sm:mx-auto">
        <PolyhedronSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          discoveryFilter={discoveryFilter}
          onChangeDiscoveryFilter={onChangeDiscoveryFilter}
          orbitFilter={orbitFilter}
          onChangeOrbitFilter={onChangeOrbitFilter}
          faceSidesFilter={faceSidesFilter}
          onChangeFaceSidesFilter={onChangeFaceSidesFilter}
          allModelsIndex={allModelsIndex}
          allModelsMap={allModelsMap}
          onSelectModel={model => {
            onSelectModel(model);
            if (viewMode === 'multi') {
              onChangeViewMode('single');
            }
          }}
          onSwitchToMultiView={() => onChangeViewMode('multi')}
          isLightMode={isLightMode}
        />
      </div>

      {/* Right Controls: View Switcher, Shape Info Toggle, & Tools */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* VIEW MODE TOGGLE (MULTI vs SINGLE) */}
        <div
          className={`flex items-center p-0.5 rounded-lg border text-xs shadow-2xs ${
            isLightMode ? 'bg-stone-100 border-stone-200' : 'bg-slate-800 border-slate-700'
          }`}
        >
          <button
            id="view-mode-single-btn"
            onClick={() => onChangeViewMode('single')}
            className={`px-1.5 sm:px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
              viewMode === 'single'
                ? isLightMode
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'bg-slate-700 text-white font-semibold shadow-xs'
                : isLightMode
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Single 3D Viewer"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Single View</span>
          </button>

          <button
            id="view-mode-multi-btn"
            onClick={() => onChangeViewMode('multi')}
            className={`px-1.5 sm:px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
              viewMode === 'multi'
                ? isLightMode
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'bg-slate-700 text-white font-semibold shadow-xs'
                : isLightMode
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Multi 3D Grid Preview"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Multi View</span>
          </button>
        </div>

        {/* INFO SLIDE BAR TOGGLE BUTTON (Prominently visible on Mobile and Desktop) */}
        {viewMode === 'single' && (
          <button
            id="toggle-info-drawer-btn"
            onClick={onToggleInfo}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              isInfoOpen
                ? isLightMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold shadow-xs'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold shadow-xs'
                : isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 shadow-2xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Shape Information Slide Bar"
          >
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] font-semibold">
              <span className="hidden sm:inline">Shape </span>Info
            </span>
            <span className={`text-[9px] font-mono hidden md:inline ${isInfoOpen ? 'font-bold' : 'opacity-70'}`}>
              {isInfoOpen ? 'Hide' : 'Open'}
            </span>
          </button>
        )}

        {/* DESKTOP TOOLS MENU (Theory, Calc, Palette, Mode) - Exact Laptop View Preserved */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={onOpenMathInfo}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isLightMode
                ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Mathematical Theory & Formulae"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          {onOpenExhibitionCalculator && (
            <button
              onClick={onOpenExhibitionCalculator}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Geometry & Face Dimensions Calculator"
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Theme Palette Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="3D Shading Themes"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>

            {showThemeMenu && (
              <div
                className={`absolute right-0 mt-1.5 w-48 rounded-xl border p-1.5 shadow-xl z-50 text-xs ${
                  isLightMode
                    ? 'bg-white border-stone-200 text-stone-800'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <div className="px-2 py-1 font-semibold text-[10px] uppercase tracking-wider text-stone-400">
                  Render Themes
                </div>
                {THEME_OPTIONS.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onUpdateSettings({ colorTheme: theme.id });
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                      settings.colorTheme === theme.id
                        ? isLightMode
                          ? 'bg-stone-100 text-stone-900 font-semibold'
                          : 'bg-slate-800 text-white font-semibold'
                        : isLightMode
                          ? 'hover:bg-stone-50 text-stone-600'
                          : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${theme.dotColor}`} />
                    <span className="text-xs">{theme.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          {onToggleLightMode && (
            <button
              id="theme-light-dark-toggle"
              onClick={onToggleLightMode}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
              }`}
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* MOBILE SECONDARY TOOLS: Dark/Light Mode + Clean More Menu */}
        <div className="flex md:hidden items-center gap-1">
          {onToggleLightMode && (
            <button
              onClick={onToggleLightMode}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
              }`}
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                showMobileMenu
                  ? 'bg-amber-600 text-white border-amber-600'
                  : isLightMode
                    ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="More Options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Dropdown Popover */}
            {showMobileMenu && (
              <div
                className={`absolute right-0 top-full mt-1.5 w-52 rounded-xl border p-2 shadow-2xl z-50 text-xs animate-in fade-in duration-150 ${
                  isLightMode
                    ? 'bg-white border-stone-200 text-stone-800'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-200 dark:border-slate-800">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-stone-400">
                    Additional Tools
                  </span>
                  <button onClick={() => setShowMobileMenu(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onOpenMathInfo();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Theory & Formulae</span>
                  </button>

                  {onOpenExhibitionCalculator && (
                    <button
                      onClick={() => {
                        onOpenExhibitionCalculator();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-left"
                    >
                      <Calculator className="w-3.5 h-3.5 text-amber-600" />
                      <span>Face Dimensions Calc</span>
                    </button>
                  )}

                  <div className="pt-1 mt-1 border-t border-stone-200 dark:border-slate-800">
                    <div className="px-2 py-1 font-semibold text-[9px] uppercase tracking-wider text-stone-400">
                      Color Themes
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {THEME_OPTIONS.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            onUpdateSettings({ colorTheme: theme.id });
                            setShowMobileMenu(false);
                          }}
                          className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[10px] ${
                            settings.colorTheme === theme.id
                              ? 'bg-amber-500/20 text-amber-600 font-bold'
                              : 'hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${theme.dotColor}`} />
                          <span className="truncate">{theme.label.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
