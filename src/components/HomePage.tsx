import React, { useState, useMemo } from 'react';
import { NoblePolyhedron, NobleModelSummary } from '../types';
import { SAMPLE_MODELS } from '../data/sampleModels';
import { getAllPolyhedraGroups, PolyhedronOrbitGroup } from '../data/polyhedraGroups';
import { MiniPolyhedron3D } from './MiniPolyhedron3D';
import {
  Box,
  Boxes,
  Sparkles,
  Search,
  ArrowRight,
  Sun,
  Moon,
  Dices,
  ShieldCheck,
  Award,
  Layers,
  Compass,
  ChevronRight,
  Info,
  Maximize2,
  Filter,
  Menu,
  X,
} from 'lucide-react';

interface HomePageProps {
  allModelsMap: Record<string, NoblePolyhedron>;
  onStartViewer: (modelId?: string) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  allModelsMap,
  onStartViewer,
  isLightMode,
  onToggleLightMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | '0dof' | '1dof' | '2dof' | 'octahedral' | 'icosahedral' | 'tetrahedral'
  >('all');
  const [activePreviewModelId, setActivePreviewModelId] = useState<string>('D-1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const groups = useMemo(() => getAllPolyhedraGroups(), []);

  // Filter groups according to selected category and search
  const filteredGroups = useMemo(() => {
    return groups
      .map(group => {
        // First filter models within the group based on search query
        const query = searchQuery.trim().toLowerCase();
        const matchedModels = group.models.filter(m => {
          if (!query) return true;
          return (
            m.id.toLowerCase().includes(query) ||
            m.orbit.toLowerCase().includes(query) ||
            `${m.faceSides}-gon`.includes(query) ||
            `${m.numVertices} vertices`.includes(query) ||
            `${m.numFaces} faces`.includes(query)
          );
        });

        return {
          ...group,
          models: matchedModels,
          modelCount: matchedModels.length,
        };
      })
      .filter(group => {
        // If search query is active and group has no matching models, skip unless group name matches
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const groupMatches =
            group.name.toLowerCase().includes(query) ||
            group.id.toLowerCase().includes(query) ||
            group.description.toLowerCase().includes(query);
          return groupMatches || group.modelCount > 0;
        }

        // Apply category filter
        if (selectedFilter === '0dof') return group.dof === 0;
        if (selectedFilter === '1dof') return group.dof === 1;
        if (selectedFilter === '2dof') return group.dof === 2;
        if (selectedFilter === 'octahedral') return group.symmetryClass === 'Octahedral';
        if (selectedFilter === 'icosahedral') return group.symmetryClass === 'Icosahedral';
        if (selectedFilter === 'tetrahedral') return group.symmetryClass === 'Tetrahedral';
        return true;
      });
  }, [groups, searchQuery, selectedFilter]);

  const totalFilteredCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.models.length, 0);
  }, [filteredGroups]);

  const handleRandomShape = () => {
    const allModels = groups.flatMap(g => g.models);
    if (allModels.length > 0) {
      const random = allModels[Math.floor(Math.random() * allModels.length)];
      onStartViewer(random.id);
    } else {
      onStartViewer('D-1');
    }
  };

  const previewModel =
    allModelsMap[activePreviewModelId] ||
    SAMPLE_MODELS[activePreviewModelId] ||
    allModelsMap['D-1'] ||
    SAMPLE_MODELS['D-1'] ||
    SAMPLE_MODELS['O-1'] ||
    Object.values(allModelsMap)[0];

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-200 ${
        isLightMode ? 'bg-[#fcfbf9] text-stone-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Navbar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isLightMode
            ? 'bg-white/90 border-stone-200/80 shadow-xs'
            : 'bg-slate-900/90 border-slate-800/80 shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
              <Box className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-classic-heading font-bold text-sm sm:text-lg tracking-wide text-amber-700 dark:text-amber-400 truncate">
                  Noble Polyhedra
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shrink-0 hidden xs:inline-block">
                  Webtigo Group
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-slate-400 truncate hidden sm:block">
                3D Figure &amp; Solid Shape Studio
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-stone-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Overview
            </a>
            <a href="#groups" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Polyhedra by Group
            </a>
            <a href="#theory" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Mathematical Theory
            </a>
            <a href="#acknowledgments" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Acknowledgments
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Device-synced Theme Toggle */}
            <button
              onClick={onToggleLightMode}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors shrink-0 ${
                isLightMode
                  ? 'border-stone-200 hover:bg-stone-100 text-stone-700'
                  : 'border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
              title={isLightMode ? 'Switch to Dark Mode (Auto-synced with device)' : 'Switch to Light Mode (Auto-synced with device)'}
            >
              {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Launch 3D Studio Button */}
            <button
              onClick={() => onStartViewer()}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md shadow-amber-600/25 flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              title="Launch Interactive 3D Studio"
            >
              <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span><span className="hidden xs:inline">Launch </span>3D Studio</span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className={`md:hidden p-1.5 rounded-lg border transition-colors shrink-0 ${
                mobileMenuOpen
                  ? 'bg-amber-600 text-white border-amber-600'
                  : isLightMode
                    ? 'border-stone-200 hover:bg-stone-100 text-stone-700'
                    : 'border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
              title="Toggle Menu Options"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200/80 dark:border-slate-800/80 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg px-4 py-3 space-y-2.5 animate-in fade-in duration-150 shadow-xl">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 font-classic-heading">
              Page Navigation &amp; Options
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-slate-800/60 text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-amber-600"
              >
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Overview</span>
              </a>
              <a
                href="#groups"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-slate-800/60 text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-amber-600"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Groups Atlas</span>
              </a>
              <a
                href="#theory"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-slate-800/60 text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-amber-600"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Math Theory</span>
              </a>
              <a
                href="#acknowledgments"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-slate-800/60 text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-amber-600"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Acknowledgments</span>
              </a>
            </div>

            {/* Quick 3D Launch Action in Mobile Menu */}
            <div className="pt-1.5 border-t border-stone-200/80 dark:border-slate-800/80">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartViewer();
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Boxes className="w-4 h-4" />
                <span>Launch Interactive 3D Studio</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="hero" className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-stone-200/60 dark:border-slate-800/60">
          {/* Subtle geometric background pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headlines & Call to Action */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Powered by Webtigo Group &bull; Creator: Member of Multiverse (Aaditya Wahal)</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-classic-heading leading-[1.1]">
                    Noble Polyhedra <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500">
                      3D Figure &amp; Solid Shape Studio
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    The authoritative online atlas of all <strong>146 noble polyhedra</strong>. A noble polyhedron is a 3D geometric solid shape that is simultaneously <strong>isogonal</strong> (vertex-transitive) and <strong>isohedral</strong> (face-transitive). Explore every figure in interactive 3D WebGL, categorized by symmetry and orbit groups.
                  </p>
                </div>

                {/* Primary Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onStartViewer()}
                    className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/30 flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Boxes className="w-5 h-5" />
                    <span>Start Exploring in 3D Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#groups"
                    className={`px-5 py-3.5 rounded-xl text-sm sm:text-base font-medium border transition-colors flex items-center gap-2 ${
                      isLightMode
                        ? 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800 shadow-xs'
                        : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>Browse Polyhedra by Group</span>
                  </a>

                  <button
                    onClick={handleRandomShape}
                    className={`p-3.5 rounded-xl border transition-colors ${
                      isLightMode
                        ? 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                        : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200'
                    }`}
                    title="Open Random 3D Solid Shape"
                  >
                    <Dices className="w-5 h-5 text-amber-600" />
                  </button>
                </div>

                {/* Stat Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200/80 dark:border-slate-800/80">
                  <div className={`p-3 rounded-lg border ${isLightMode ? 'bg-stone-50/80 border-stone-200/80' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="text-2xl font-bold font-classic-heading text-amber-600 dark:text-amber-400">146</div>
                    <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 uppercase tracking-wide">Noble Polyhedra</div>
                  </div>
                  <div className={`p-3 rounded-lg border ${isLightMode ? 'bg-stone-50/80 border-stone-200/80' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="text-2xl font-bold font-classic-heading text-amber-600 dark:text-amber-400">16</div>
                    <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 uppercase tracking-wide">Orbit Groups</div>
                  </div>
                  <div className={`p-3 rounded-lg border ${isLightMode ? 'bg-stone-50/80 border-stone-200/80' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="text-2xl font-bold font-classic-heading text-amber-600 dark:text-amber-400">0, 1, 2</div>
                    <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 uppercase tracking-wide">Degrees of Freedom</div>
                  </div>
                  <div className={`p-3 rounded-lg border ${isLightMode ? 'bg-stone-50/80 border-stone-200/80' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="text-2xl font-bold font-classic-heading text-amber-600 dark:text-amber-400">100%</div>
                    <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 uppercase tracking-wide">Interactive WebGL</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live 3D Interactive Showcase */}
              <div className="lg:col-span-5">
                <div
                  className={`relative rounded-2xl border p-4 shadow-xl transition-all ${
                    isLightMode
                      ? 'bg-white border-stone-200/90 shadow-stone-200/50'
                      : 'bg-slate-900 border-slate-800 shadow-slate-950/80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold font-classic-heading uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Interactive 3D Solid Preview
                      </span>
                    </div>
                    <div className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">
                      Shape {previewModel?.id || 'D-1'}
                    </div>
                  </div>

                  {/* 3D Canvas Preview */}
                  <div className="w-full h-72 sm:h-80 flex items-center justify-center relative my-2 overflow-hidden rounded-xl bg-gradient-to-b from-stone-50/50 to-stone-100/30 dark:from-slate-950/40 dark:to-slate-900/40">
                    {previewModel ? (
                      <MiniPolyhedron3D
                        model={previewModel}
                        polyhedron={previewModel}
                        isLightMode={isLightMode}
                        autoSpin={true}
                        width={320}
                        height={300}
                      />
                    ) : (
                      <div className="text-xs text-stone-400">Loading 3D model...</div>
                    )}
                    <div className="absolute bottom-2 left-2 text-[10px] text-stone-400 dark:text-slate-500 bg-white/70 dark:bg-slate-900/70 px-2 py-1 rounded backdrop-blur-xs">
                      Drag to rotate &bull; Interactive 3D Figure
                    </div>
                  </div>

                  {/* Quick Shape Selector Strip */}
                  <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {['C-1', 'D-1', 'I-1', 'O-1', 'T-1', 'sD-1'].map(id => (
                        <button
                          key={id}
                          onClick={() => setActivePreviewModelId(id)}
                          className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors ${
                            activePreviewModelId === id
                              ? 'bg-amber-600 text-white font-bold'
                              : isLightMode
                              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {id}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onStartViewer(activePreviewModelId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <span>Open in Studio</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: NOBLE POLYHEDRA BY GROUP */}
        <section id="groups" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Boxes className="w-4 h-4" />
                  <span>The Complete Mathematical Catalog</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-classic-heading">
                  Noble Polyhedra by Group
                </h2>
                <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 max-w-2xl">
                  Every known noble polyhedron grouped by its orbit symmetry classification. Select any figure to launch full-screen 3D inspection, facet analysis, and geometric coordinate examination.
                </p>
              </div>

              {/* Search Bar for Shapes */}
              <div className="w-full md:w-80 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search 146 shapes (e.g. C-1, sD-12, quad)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                    isLightMode
                      ? 'bg-white border-stone-200 text-stone-900'
                      : 'bg-slate-900 border-slate-800 text-slate-100'
                  }`}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All 16 Groups (146 Shapes)' },
                { id: '0dof', label: '0-DOF Rigid (58 Shapes)' },
                { id: '1dof', label: '1-DOF Continuous (41 Shapes)' },
                { id: '2dof', label: '2-DOF Stevanović (47 Shapes)' },
                { id: 'octahedral', label: 'Octahedral / Cubic (Oh)' },
                { id: 'icosahedral', label: 'Icosahedral (Ih)' },
                { id: 'tetrahedral', label: 'Tetrahedral (Td)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === tab.id
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : isLightMode
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Groups Render List */}
            {filteredGroups.length === 0 ? (
              <div className="text-center py-16 border rounded-2xl border-dashed border-stone-300 dark:border-slate-800">
                <p className="text-base font-semibold text-stone-600 dark:text-slate-400">
                  No polyhedra found matching "{searchQuery}"
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                  className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-12 pt-4">
                {filteredGroups.map(group => (
                  <div
                    key={group.id}
                    id={`group-${group.id}`}
                    className={`rounded-2xl border p-5 sm:p-7 transition-colors ${
                      isLightMode
                        ? 'bg-white border-stone-200/90 shadow-sm'
                        : 'bg-slate-900 border-slate-800 shadow-md'
                    }`}
                  >
                    {/* Group Header Info */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-stone-100 dark:border-slate-800">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-md bg-amber-600 text-white shadow-xs">
                            {group.shortLabel}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                            {group.symmetry}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${
                              group.dof === 0
                                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                                : group.dof === 1
                                ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
                                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {group.dofLabel}
                          </span>
                          <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">
                            ({group.modelCount} {group.modelCount === 1 ? 'shape' : 'shapes'})
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold font-classic-heading">
                          {group.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                          {group.description}
                        </p>

                        <div className="text-[11px] text-stone-500 dark:text-slate-400 italic">
                          {group.discoveryNote} &bull; Arrangement: {group.vertexArrangement}
                        </div>
                      </div>

                      {/* Quick Start Button for First Shape in Group */}
                      {group.models.length > 0 && (
                        <button
                          onClick={() => onStartViewer(group.models[0].id)}
                          className="self-start md:self-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <span>Explore {group.id} in 3D</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Shapes Grid inside the Group */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-5">
                      {group.models.map(model => (
                        <div
                          key={model.id}
                          onClick={() => onStartViewer(model.id)}
                          className={`group cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all hover:scale-[1.03] hover:shadow-md ${
                            isLightMode
                              ? 'bg-stone-50/70 hover:bg-white border-stone-200 hover:border-amber-500'
                              : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-200/60 dark:border-slate-800/60">
                              <span className="font-mono font-bold text-sm text-amber-700 dark:text-amber-400 group-hover:text-amber-600">
                                {model.id}
                              </span>
                              <span className="text-[10px] uppercase font-semibold text-stone-400 group-hover:text-amber-600 transition-colors">
                                3D &rarr;
                              </span>
                            </div>

                            <div className="space-y-1 text-[11px] text-stone-600 dark:text-slate-300">
                              <div className="flex justify-between">
                                <span className="text-stone-400">Vertices:</span>
                                <span className="font-semibold">{model.numVertices}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Faces:</span>
                                <span className="font-semibold">{model.numFaces}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Edges:</span>
                                <span className="font-semibold">{model.numEdges}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Face Type:</span>
                                <span className="font-semibold">
                                  {model.faceSides === 3
                                    ? 'Triangle'
                                    : model.faceSides === 4
                                    ? 'Quad'
                                    : model.faceSides === 5
                                    ? 'Pentagon'
                                    : model.faceSides === 6
                                    ? 'Hexagon'
                                    : `${model.faceSides}-gon`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Euler &chi;:</span>
                                <span className="font-mono">{model.eulerChar}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-stone-200/50 dark:border-slate-800/50 text-center">
                            <span className="inline-block w-full py-1 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                              Inspect 3D
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION: MATHEMATICAL THEORY & DEGREES OF FREEDOM */}
        <section
          id="theory"
          className={`py-16 md:py-20 border-y transition-colors ${
            isLightMode ? 'bg-stone-50 border-stone-200/80' : 'bg-slate-900/50 border-slate-800'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Polyhedral Geometry Fundamentals
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-classic-heading">
                  What Makes a 3D Solid Shape "Noble"?
                </h2>
                <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">
                  In geometry, a polyhedron is designated as <strong>noble</strong> when its symmetry group acts transitively on both its vertices and its faces.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className={`p-6 rounded-2xl border transition-colors ${
                    isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-classic-heading mb-2">
                    Isohedral (Face-Transitive)
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                    All faces are congruent and symmetrically equivalent. For any two faces, there exists an isometric rotation or reflection of the solid figure mapping one directly onto the other.
                  </p>
                </div>

                <div
                  className={`p-6 rounded-2xl border transition-colors ${
                    isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-classic-heading mb-2">
                    Isogonal (Vertex-Transitive)
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                    All vertices are congruent under symmetry operations. Every vertex shares identical surrounding facet configurations, ensuring uniform vertex topology across the entire 3D figure.
                  </p>
                </div>

                <div
                  className={`p-6 rounded-2xl border transition-colors ${
                    isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-classic-heading mb-2">
                    Degrees of Freedom (DOF)
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                    0-DOF polyhedra are geometrically rigid. 1-DOF and 2-DOF families possess continuous deformation parameters that warp coordinates while continuously maintaining nobility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: DOWN THERE START OPTION */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className={`rounded-3xl border p-8 sm:p-12 text-center relative overflow-hidden transition-colors ${
              isLightMode
                ? 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/50 border-amber-200/80 shadow-xl'
                : 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-amber-900/40 shadow-2xl'
            }`}
          >
            {/* Background Accent */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <Box className="w-4 h-4" />
                <span>Ready to Explore in 3D?</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-classic-heading tracking-tight">
                Launch the Interactive <br />
                <span className="text-amber-600 dark:text-amber-400">
                  3D Polyhedron Studio
                </span>
              </h2>

              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">
                Step inside the full-screen 3D viewer. Rotate figures with multi-touch fingers on mobile or mouse on desktop, inspect faces with raycasting, explode facets, view 2D face unfolded planes, and experience guided auto-tours.
              </p>

              {/* High-visibility START OPTION */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onStartViewer()}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base sm:text-lg font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white shadow-xl shadow-amber-500/30 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
                >
                  <Boxes className="w-6 h-6 stroke-[2.2]" />
                  <span>Start Exploring Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleRandomShape}
                  className={`w-full sm:w-auto px-6 py-4 rounded-xl text-sm sm:text-base font-semibold border transition-colors flex items-center justify-center gap-2 ${
                    isLightMode
                      ? 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800'
                      : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100'
                  }`}
                >
                  <Dices className="w-5 h-5 text-amber-600" />
                  <span>Random 3D Figure</span>
                </button>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="pt-6 border-t border-stone-200/60 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500 dark:text-slate-400">
                <span>Featured Solid Shapes:</span>
                {[
                  { id: 'C-1', label: 'Cube (C-1)' },
                  { id: 'O-1', label: 'Octahedron (O-1)' },
                  { id: 'D-1', label: 'Dodecahedron (D-1)' },
                  { id: 'T-1', label: 'Tetrahedron (T-1)' },
                  { id: 'sD-1', label: 'Stevanović 2-DOF (sD-1)' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => onStartViewer(item.id)}
                    className="font-mono px-2.5 py-1 rounded-md bg-stone-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/50 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ACKNOWLEDGMENTS & COPYRIGHT (Explicitly Requested) */}
        <section
          id="acknowledgments"
          className={`py-16 border-t transition-colors ${
            isLightMode ? 'bg-stone-100/60 border-stone-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Attribution &amp; Copyright Notice
                </span>
                <h2 className="text-3xl font-bold font-classic-heading">
                  Acknowledgments &amp; Copyright Holding
                </h2>
              </div>

              {/* Highlighted Banner Statement */}
              <div className="p-6 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-center max-w-3xl mx-auto shadow-xs">
                <p className="text-base sm:text-lg font-bold text-amber-900 dark:text-amber-200">
                  All copyrights to Webtigo and the creator is Member of Multiverse (Aaditya Wahal) also powered by webtigo group
                </p>
              </div>

              {/* Detailed Attribution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div
                  className={`p-6 rounded-2xl border transition-colors ${
                    isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-wider font-classic-heading mb-1">
                    Creator &amp; Lead Architect
                  </h4>
                  <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                    Member of Multiverse (Aaditya Wahal)
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Designed and authored the interactive 3D solid shape engine, facet analysis, and geometric coordinate rendering for the Noble Polyhedra catalog.
                  </p>
                </div>

                <div
                  className={`p-6 rounded-2xl border transition-colors ${
                    isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-wider font-classic-heading mb-1">
                    Publisher &amp; Copyright Holder
                  </h4>
                  <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                    Webtigo Group
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-2 leading-relaxed">
                    All copyrights held by Webtigo. Powered by Webtigo Group. All rights reserved &copy; 2026 Webtigo.
                  </p>
                </div>

                <div
                  className={`p-6 rounded-2xl border transition-colors ${
                    isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                    <Info className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-wider font-classic-heading mb-1">
                    Mathematical Foundations
                  </h4>
                  <p className="text-base font-semibold text-stone-800 dark:text-slate-200">
                    Grünbaum &amp; Stevanović
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Based on the classical classification of noble polyhedra by Branko Grünbaum (1999) and the 2-degree-of-freedom continuous discoveries by Stevanović et al. (2020).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className={`py-8 border-t transition-colors ${
          isLightMode ? 'bg-white border-stone-200 text-stone-600' : 'bg-slate-950 border-slate-900 text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-classic-heading font-bold text-stone-900 dark:text-slate-100">
              Noble Polyhedra
            </span>
            <span>&bull;</span>
            <span>Powered by Webtigo Group</span>
            <span>&bull;</span>
            <span>Creator: Member of Multiverse (Aaditya Wahal)</span>
          </div>

          <div className="text-center md:text-right">
            <span>All copyrights to Webtigo &copy; 2026. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
