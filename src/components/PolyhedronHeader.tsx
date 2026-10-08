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
  Home,
} from 'lucide-react';

interface PolyhedronHeaderProps {
  currentModel: NoblePolyhedron;
  onNavigateHome?: () => void;
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
  onNavigateHome,
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
      className={`h-14 px-2 sm:px-4 flex items-center justify-between gap-1 sm:gap-2.5 select-none shrink-0 z-30 transition-colors duration-200 border-b relative w-full max-w-full overflow-hidden ${
        isLightMode
          ? 'bg-white/95 border-stone-200 text-stone-800 shadow-xs'
          : 'bg-slate-900/95 border-slate-700/60 text-slate-100 shadow-sm'
      }`}
    >
      {/* Left: Home Navigation & Brand Identity */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-colors shrink-0 shadow-2xs ${
              isLightMode
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 hover:border-amber-300'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
            }`}
            title="Return to Home Page & Groups Catalog"
          >
            <Home className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-classic-heading">Home</span>
          </button>
        )}

        <div className="hidden xs:flex sm:flex items-center gap-1.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ${
              isLightMode
                ? 'bg-amber-600 text-white'
                : 'bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950'
            }`}
          >
            <Boxes className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <h1 className="text-xs sm:text-sm font-semibold tracking-tight font-classic-heading">
                Noble Polyhedra
              </h1>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border hidden lg:inline-block ${
                  isLightMode
                    ? 'bg-stone-100 text-stone-600 border-stone-200'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                Atlas of 146
              </span>
            </div>
            <p
              className={`text-[10px] hidden xl:block font-classic-serif italic ${
                isLightMode ? 'text-stone-500' : 'text-slate-400'
              }`}
            >
              3D Figures &amp; Solid Shapes • Webtigo Group
            </p>
          </div>
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

      {/* Right Controls: Desktop Preserved, Mobile Optimized to Never Cut Off */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* DESKTOP CONTROLS (Laptop & PC): 100% Intact & Unchanged */}
        <div className="hidden md:flex items-center gap-1.5">
          {/* VIEW MODE TOGGLE (MULTI vs SINGLE) */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs shadow-2xs ${
              isLightMode ? 'bg-stone-100 border-stone-200' : 'bg-slate-800 border-slate-700'
            }`}
          >
            <button
              id="view-mode-single-btn"
              onClick={() => onChangeViewMode('single')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
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
              <span>Single View</span>
            </button>

            <button
              id="view-mode-multi-btn"
              onClick={() => onChangeViewMode('multi')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
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
              <span>Multi View</span>
            </button>
          </div>

          {/* INFO SLIDE BAR TOGGLE BUTTON */}
          {viewMode === 'single' && (
            <button
              id="toggle-info-drawer-btn"
              onClick={onToggleInfo}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
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
              <span className="text-[11px] font-semibold">Shape Info</span>
              <span className={`text-[9px] font-mono ${isInfoOpen ? 'font-bold' : 'opacity-70'}`}>
                {isInfoOpen ? 'Hide' : 'Open'}
              </span>
            </button>
          )}

          {/* Mathematical Theory */}
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

          {/* Exhibition Calculator */}
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
              title={isLightMode ? 'Switch to Dark Mode (Auto-synced with device)' : 'Switch to Light Mode (Auto-synced with device)'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* MOBILE CONTROLS (Phones): Compact, zero cut-off, instant access to all tools */}
        <div className="flex md:hidden items-center gap-1">
          {/* Smart View Mode Toggle: Single button switches between Single 3D and Multi Grid */}
          <button
            onClick={() => onChangeViewMode(viewMode === 'single' ? 'multi' : 'single')}
            className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
              isLightMode
                ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title={viewMode === 'single' ? 'Switch to Multi Grid' : 'Switch to Single 3D Viewer'}
          >
            {viewMode === 'single' ? (
              <Layers className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Box className="w-3.5 h-3.5 text-amber-600" />
            )}
          </button>

          {/* Shape Info drawer button (when in single view) */}
          {viewMode === 'single' && (
            <button
              id="toggle-info-drawer-btn-mobile"
              onClick={onToggleInfo}
              className={`flex items-center gap-1 px-1.5 xs:px-2 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 ${
                isInfoOpen
                  ? isLightMode
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                  : isLightMode
                    ? 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle Shape Info Drawer"
            >
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] font-semibold hidden xs:inline">Info</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          {onToggleLightMode && (
            <button
              onClick={onToggleLightMode}
              className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
                isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
              }`}
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Mobile All Options & Tools Drawer Button */}
          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
                showMobileMenu
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : isLightMode
                    ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="All Options & Tools"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Options Popover Sheet */}
            {showMobileMenu && (
              <>
                {/* Backdrop to close when tapping outside */}
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 md:hidden"
                  onClick={() => setShowMobileMenu(false)}
                />

                <div
                  className={`fixed sm:absolute right-2 left-2 sm:left-auto top-16 sm:top-full mt-1 sm:w-64 rounded-xl border p-3 shadow-2xl z-50 text-xs animate-in fade-in duration-150 ${
                    isLightMode
                      ? 'bg-white border-stone-200 text-stone-800'
                      : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 dark:border-slate-800">
                    <span className="font-semibold text-[11px] uppercase tracking-wider font-classic-heading text-amber-700 dark:text-amber-400">
                      Studio Options &amp; Tools
                    </span>
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {/* Return Home Option */}
                    {onNavigateHome && (
                      <button
                        onClick={() => {
                          onNavigateHome();
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-medium text-left transition-colors"
                      >
                        <Home className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Return to Home &amp; Groups Index</span>
                      </button>
                    )}

                    {/* View Switcher in Menu */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          onChangeViewMode('single');
                          setShowMobileMenu(false);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          viewMode === 'single'
                            ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                            : isLightMode
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                        }`}
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>Single 3D</span>
                      </button>
                      <button
                        onClick={() => {
                          onChangeViewMode('multi');
                          setShowMobileMenu(false);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          viewMode === 'multi'
                            ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                            : isLightMode
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Multi Grid</span>
                      </button>
                    </div>

                    {/* Shape Info Drawer Button */}
                    {viewMode === 'single' && (
                      <button
                        onClick={() => {
                          onToggleInfo();
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-amber-600" />
                          <span>Shape Info Panel</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isInfoOpen
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold'
                            : 'bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-slate-300'
                        }`}>
                          {isInfoOpen ? 'Open' : 'Hidden'}
                        </span>
                      </button>
                    )}

                    {/* Mathematical Theory */}
                    <button
                      onClick={() => {
                        onOpenMathInfo();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>Mathematical Theory &amp; Formulae</span>
                    </button>

                    {/* Exhibition Calculator */}
                    {onOpenExhibitionCalculator && (
                      <button
                        onClick={() => {
                          onOpenExhibitionCalculator();
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <Calculator className="w-4 h-4 text-amber-600" />
                        <span>Face Dimensions Calculator</span>
                      </button>
                    )}

                    {/* Color Themes Section */}
                    <div className="pt-2 mt-2 border-t border-stone-200 dark:border-slate-800">
                      <div className="px-1 py-1 font-semibold text-[10px] uppercase tracking-wider text-stone-400">
                        3D Shading Themes
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        {THEME_OPTIONS.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              onUpdateSettings({ colorTheme: theme.id });
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                              settings.colorTheme === theme.id
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30'
                                : 'hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-400 border border-transparent'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${theme.dotColor}`} />
                            <span className="truncate">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
