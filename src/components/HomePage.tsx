import React, { useState, useMemo } from 'react';
import { NoblePolyhedron, NobleModelSummary } from '../types';
import { SAMPLE_MODELS } from '../data/sampleModels';
import { getAllPolyhedraGroups, PolyhedronOrbitGroup } from '../data/polyhedraGroups';
import { MiniPolyhedron3D } from './MiniPolyhedron3D';
import { useCollections } from '../context/CollectionsContext';
import { useAppAuth } from '../context/AuthContext';
import { LegalTab } from './LegalPolicyModal';
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
  Heart,
  Bookmark,
  LogIn,
  LogOut,
  User,
  Key,
  HelpCircle,
  BookOpen,
  FileText,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface HomePageProps {
  allModelsMap: Record<string, NoblePolyhedron>;
  onStartViewer: (modelId?: string) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
  onOpenCollections?: (tab?: 'favorites' | 'bookmarks' | 'keys') => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  allModelsMap,
  onStartViewer,
  isLightMode,
  onToggleLightMode,
  onOpenCollections,
  onOpenLegal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | '0dof' | '1dof' | '2dof' | 'octahedral' | 'icosahedral' | 'tetrahedral'
  >('all');
  const [activePreviewModelId, setActivePreviewModelId] = useState<string>('D-1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    favorites,
    bookmarks,
    isFavorite,
    isBookmarked,
    toggleFavorite,
    toggleBookmark,
  } = useCollections();

  const {
    isClerkConfigured,
    isSignedIn,
    userName,
    userEmail,
    userAvatar,
    openSignIn,
    signOut,
  } = useAppAuth();

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
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Overview
            </a>
            <a href="#groups" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Atlas &amp; Groups
            </a>
            <a href="#theory" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Theory
            </a>
            <a href="#guide" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Definitive Guide
            </a>
            <a href="#faq" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              FAQ
            </a>
            <a href="#acknowledgments" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Attribution
            </a>
            {onOpenLegal && (
              <button
                type="button"
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-amber-700 dark:text-amber-400 font-semibold cursor-pointer"
              >
                Privacy &amp; Policies
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Saved Bookmarks & Favorites Button */}
            {onOpenCollections && (
              <button
                onClick={() => onOpenCollections('favorites')}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 shrink-0 text-xs font-medium ${
                  isLightMode
                    ? 'border-stone-200 hover:bg-stone-100 text-stone-700'
                    : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
                title="View Saved Bookmarks & Favorites"
              >
                <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                <span className="hidden sm:inline font-semibold">Saved</span>
                {(favorites.length > 0 || bookmarks.length > 0) && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                    {favorites.length + bookmarks.length}
                  </span>
                )}
              </button>
            )}

            {/* Clerk User Login / Profile Button */}
            {isSignedIn ? (
              <button
                onClick={() => onOpenCollections?.('keys')}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
                  isLightMode
                    ? 'bg-amber-50/80 hover:bg-amber-100 border-amber-200 text-amber-900'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                }`}
                title={`Logged in as ${userName}. Click for Cloud Sync & Settings`}
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-4 h-4 rounded-full object-cover shrink-0" />
                ) : (
                  <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="hidden sm:inline text-xs font-semibold max-w-[70px] truncate">{userName.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => (isClerkConfigured ? openSignIn() : onOpenCollections?.('keys'))}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                title="Sign In with Clerk"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

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
            {/* User Account Bar in Mobile Drawer */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
              isLightMode ? 'bg-amber-50/70 border-amber-200/80' : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-xs truncate">
                    {isSignedIn ? userName : 'Guest Explorer'}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-slate-400 truncate">
                    {isSignedIn ? (userEmail || 'Clerk Member') : 'Sign in with Clerk'}
                  </p>
                </div>
              </div>

              {isSignedIn ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-md border border-rose-300 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 font-medium shrink-0"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (isClerkConfigured) openSignIn();
                    else onOpenCollections?.('keys');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 shadow-xs"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Saved Bookmarks & Favorites Quick Launch */}
            {onOpenCollections && (
              <button
                onClick={() => {
                  onOpenCollections('favorites');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Saved Bookmarks &amp; Favorites</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold">
                    ❤️ {favorites.length}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                    🔖 {bookmarks.length}
                  </span>
                </div>
              </button>
            )}

            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 font-classic-heading pt-1">
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
                href="#guide"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-slate-800/60 text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-amber-600"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Definitive Guide</span>
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-slate-800/60 text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-amber-600"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Polyhedra FAQ</span>
              </a>
              <a
                href="#acknowledgments"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-slate-800/60 text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-amber-600"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Attribution</span>
              </a>
            </div>

            {/* Legal & Compliance Links in Mobile Menu */}
            {onOpenLegal && (
              <div className="pt-2 border-t border-stone-200/80 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onOpenLegal('privacy');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Privacy Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenLegal('terms');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Terms of Service</span>
                </button>
              </div>
            )}

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
                    <div className="flex items-center gap-1.5">
                      {previewModel && (
                        <>
                          <button
                            onClick={() => toggleFavorite(previewModel.id)}
                            className={`p-1 rounded-md border text-xs transition-colors ${
                              isFavorite(previewModel.id)
                                ? 'bg-rose-500/15 border-rose-400 text-rose-500'
                                : isLightMode
                                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-500'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
                            }`}
                            title={isFavorite(previewModel.id) ? "Remove Favorite" : "Add to Favorites"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorite(previewModel.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => toggleBookmark(previewModel.id)}
                            className={`p-1 rounded-md border text-xs transition-colors ${
                              isBookmarked(previewModel.id)
                                ? 'bg-amber-500/15 border-amber-400 text-amber-500'
                                : isLightMode
                                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-500'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
                            }`}
                            title={isBookmarked(previewModel.id) ? "Remove Bookmark" : "Add to Bookmarks"}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(previewModel.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </>
                      )}
                      <div className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        Shape {previewModel?.id || 'D-1'}
                      </div>
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

        {/* SECTION: DEFINITIVE GUIDE TO NOBLE POLYHEDRA (Authoritative Academic Resource) */}
        <section
          id="guide"
          className={`py-16 md:py-24 border-b transition-colors ${
            isLightMode ? 'bg-white border-stone-200/80' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Comprehensive Treatise
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-classic-heading tracking-tight">
                  The Definitive Guide to Noble Polyhedra &amp; Geometric Symmetries
                </h2>
                <p className="text-stone-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  An authoritative reference for mathematicians, 3D geometers, educators, and students exploring higher-order symmetry groups, dual transitivity, and parametric continuous deformation families.
                </p>
              </div>

              {/* Subsection 1 */}
              <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
                isLightMode ? 'bg-stone-50/70 border-stone-200' : 'bg-slate-900/70 border-slate-800'
              }`}>
                <h3 className="text-xl font-bold font-classic-heading text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <span className="font-mono text-sm px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">01</span>
                  <span>Rigorous Definition &amp; Dual Transitivity</span>
                </h3>
                <div className="space-y-3 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    In discrete geometry, a polyhedron <span className="font-serif italic font-semibold">P</span> in Euclidean space &reals;<sup>3</sup> is formally designated as <strong>noble</strong> if and only if its combinatorial automorphism group <span className="font-serif italic">Aut(P)</span> satisfies two simultaneous transitivity conditions:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-600 dark:text-slate-400">
                    <li>
                      <strong className="text-stone-800 dark:text-slate-200">Isogonal (Vertex-Transitive):</strong> For any pair of vertices <span className="font-serif italic">v<sub>1</sub>, v<sub>2</sub> &isin; V(P)</span>, there exists a symmetry operation <span className="font-serif italic">&sigma; &isin; Aut(P)</span> such that <span className="font-serif italic">&sigma;(v<sub>1</sub>) = v<sub>2</sub></span>. Every vertex shares an identical local neighborhood and configuration of surrounding facets.
                    </li>
                    <li>
                      <strong className="text-stone-800 dark:text-slate-200">Isohedral (Face-Transitive):</strong> For any pair of faces <span className="font-serif italic">f<sub>1</sub>, f<sub>2</sub> &isin; F(P)</span>, there exists a symmetry operation <span className="font-serif italic">&tau; &isin; Aut(P)</span> such that <span className="font-serif italic">&tau;(f<sub>1</sub>) = f<sub>2</sub></span>. Every face is congruent and geometrically equivalent under the global symmetry group.
                    </li>
                  </ul>
                  <p>
                    Unlike the classical <em>regular polyhedra</em>, which also demand edge-transitivity (<em>isotoxality</em>), noble polyhedra can possess multiple distinct edge orbits. As a result, every regular polyhedron is inherently noble, but the universe of noble polyhedra extends far beyond the 9 classical regular solids.
                  </p>
                </div>
              </div>

              {/* Subsection 2 */}
              <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
                isLightMode ? 'bg-stone-50/70 border-stone-200' : 'bg-slate-900/70 border-slate-800'
              }`}>
                <h3 className="text-xl font-bold font-classic-heading text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <span className="font-mono text-sm px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">02</span>
                  <span>Euler Characteristic (&chi;) &amp; Non-Convex Topology</span>
                </h3>
                <div className="space-y-3 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    For classical convex solids homeomorphic to the 2-sphere <span className="font-serif italic">S<sup>2</sup></span>, Euler's polyhedral formula strictly dictates:
                  </p>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 font-mono text-center text-base font-bold text-amber-900 dark:text-amber-200">
                    &chi; = V &minus; E + F = 2
                  </div>
                  <p>
                    However, noble polyhedra encompass complex non-convex and self-intersecting star figures. When facet planes penetrate through the interior, the resulting topological 2-manifold often possesses higher genus <span className="font-serif italic">g &ge; 1</span>, leading to generalized Euler characteristics:
                  </p>
                  <div className="p-3 rounded-xl bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 font-mono text-center text-sm font-semibold">
                    &chi; = 2 &minus; 2g &le; 2 &emsp; (&chi; &isin; &#123;2, 0, &minus;2, &minus;4, &minus;6, &minus;8, &dots;&#125;)
                  </div>
                  <p>
                    For example, toroidal noble polyhedra with genus <span className="font-serif italic">g = 1</span> possess an Euler characteristic of exactly <span className="font-serif italic">&chi; = 0</span>. Our 3D solid engine dynamically computes the vertex count <span className="font-serif italic">V</span>, edge count <span className="font-serif italic">E</span>, face count <span className="font-serif italic">F</span>, and resulting topological Euler number for every solid figure in the atlas.
                  </p>
                </div>
              </div>

              {/* Subsection 3 */}
              <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
                isLightMode ? 'bg-stone-50/70 border-stone-200' : 'bg-slate-900/70 border-slate-800'
              }`}>
                <h3 className="text-xl font-bold font-classic-heading text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <span className="font-mono text-sm px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">03</span>
                  <span>Degrees of Freedom: Rigid Solids to Continuous 2-DoF Families</span>
                </h3>
                <div className="space-y-3 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    A critical parameter in modern polyhedral taxonomy is the <strong>Degree of Freedom (DoF)</strong>, which measures the dimension of the continuous coordinate deformation space under which a polyhedron remains noble:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="font-bold text-amber-700 dark:text-amber-400 font-mono text-xs block mb-1">0-DoF (Rigid)</span>
                      <p className="text-xs text-stone-600 dark:text-slate-400">
                        Geometrically rigid shapes. Their vertex coordinates are uniquely fixed up to global translation and uniform scaling (e.g. Platonic solids, Kepler-Poinsot star solids).
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="font-bold text-amber-700 dark:text-amber-400 font-mono text-xs block mb-1">1-DoF (Continuous 1D)</span>
                      <p className="text-xs text-stone-600 dark:text-slate-400">
                        Parametrized by a single continuous scalar <span className="font-serif italic">t</span>. As <span className="font-serif italic">t</span> shifts, vertices slide along symmetry axes while retaining identical facet congruence.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="font-bold text-amber-700 dark:text-amber-400 font-mono text-xs block mb-1">2-DoF (Continuous 2D)</span>
                      <p className="text-xs text-stone-600 dark:text-slate-400">
                        Parametrized by two independent real variables <span className="font-serif italic">(u, v)</span>. Discovered in 2020 by Mirko Stevanovi&cacute;, forming a continuous 2D surface of noble polyhedra.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subsection 4 */}
              <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
                isLightMode ? 'bg-stone-50/70 border-stone-200' : 'bg-slate-900/70 border-slate-800'
              }`}>
                <h3 className="text-xl font-bold font-classic-heading text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <span className="font-mono text-sm px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">04</span>
                  <span>Historical Progression &amp; Scientific Acknowledgments</span>
                </h3>
                <div className="space-y-3 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    The exploration of noble polyhedra spans centuries of mathematical inquiry. While the regular solids were cataloged by Plato (c. 360 BCE) and Johannes Kepler (1619), the modern definition was formalized in Branko Gr&uuml;nbaum's landmark 1999 treatise <em>&ldquo;Are Your Polyhedra the Same as My Polyhedra?&rdquo;</em>, which classified discrete noble polyhedra with tetrahedral and octahedral symmetries.
                  </p>
                  <p>
                    In 2020, research by Mirko Stevanovi&cacute; opened a new chapter by proving the existence of continuous 2-degree-of-freedom noble families with icosahedral and octahedral symmetries.
                  </p>
                  <p>
                    The initiative to bridge these cutting-edge discoveries from mathematical literature into this accessible, interactive 3D digital studio was spearheaded by <strong>Akshat Wahal</strong>, who conceived the vision and provided the crucial discovery intelligence. The architecture, mathematical rendering engine, coordinate compilation, and 3D application were subsequently designed and created by <strong>Member of Multiverse (Aaditya Wahal)</strong>, published under <strong>Webtigo Group</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section
          id="faq"
          className={`py-16 md:py-20 border-b transition-colors ${
            isLightMode ? 'bg-stone-50/80 border-stone-200' : 'bg-slate-900/50 border-slate-800'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Questions &amp; Inquiries
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-classic-heading">
                  Frequently Asked Questions (FAQ)
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400">
                  Everything you need to know about noble polyhedra geometry, 3D visualization, citations, and platform policies.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: 'What is a Noble Polyhedron in geometry?',
                    a: 'A noble polyhedron is a 3D geometric solid that possesses dual transitivity: it is simultaneously isogonal (all vertices are symmetrically equivalent under its symmetry group) and isohedral (all faces are congruent and symmetrically equivalent). Unlike regular polyhedra, its edges do not have to belong to a single symmetry orbit.',
                  },
                  {
                    q: 'How do noble polyhedra differ from Archimedean and Catalan solids?',
                    a: 'Archimedean solids are isogonal (vertex-transitive) but not isohedral. Catalan solids (their duals) are isohedral (face-transitive) but not isogonal. Noble polyhedra uniquely bridge this duality by fulfilling both criteria simultaneously, which means every noble polyhedron is either self-dual or dual to another noble polyhedron.',
                  },
                  {
                    q: 'What does "Degree of Freedom" (0-DoF, 1-DoF, 2-DoF) signify?',
                    a: 'Degree of Freedom indicates how many independent continuous variables can be altered without destroying the polyhedron\'s nobility. 0-DoF polyhedra are rigid with fixed coordinate ratios. 1-DoF polyhedra form continuous curves of shapes governed by a single parameter. 2-DoF polyhedra form continuous 2D families whose shape alters smoothly across two continuous parameters.',
                  },
                  {
                    q: 'Why do many noble polyhedra have self-intersecting or star-shaped faces?',
                    a: 'Because isohedral and isogonal transitivity across non-convex symmetry orbits naturally forces facial planes to pass through the interior of the solid. In modern discrete geometry, self-intersecting facets are treated as genuine mathematical 2-manifolds with well-defined orientation normals and dihedral angles.',
                  },
                  {
                    q: 'Who discovered the newly documented continuous 2-DoF polyhedra?',
                    a: 'The continuous 2-DoF polyhedra families were proven in academic literature by Mirko Stevanović in 2020. The initiative to turn this discovery into an interactive public 3D catalog was championed by Akshat Wahal, and the entire 3D solid engine, user experience, and interactive studio were designed and created by Member of Multiverse (Aaditya Wahal) under Webtigo Group.',
                  },
                  {
                    q: 'Can these 3D models and geometric coordinates be used for research and academic citations?',
                    a: 'Yes. The Noble Polyhedra Studio is open for educational, academic, and non-commercial research use. When citing in papers or educational presentations, please attribute to: Member of Multiverse (Aaditya Wahal) & Webtigo Group (2026). Noble Polyhedra 3D Studio.',
                  },
                  {
                    q: 'How does this platform handle user privacy, cookies, and advertising?',
                    a: 'We strictly adhere to Google AdSense program policies, the European Union User Consent Policy (GDPR), and the California Consumer Privacy Act (CCPA). Standard non-personalized cookies and advertising cookies (via Google DoubleClick/DART) are disclosed transparently, and users can review policy terms and adjust cookie preferences at any time via our Cookie Preferences banner.',
                  },
                  {
                    q: 'What is Webtigo Group and how can I get in touch for academic collaboration?',
                    a: 'Webtigo Group is an independent technology and mathematical digital publisher. All platform copyrights are held by Webtigo. For inquiries, corrections, or collaboration, contact us at somiwahal6287@gmail.com or through our Contact & Inquiries drawer.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
                      isLightMode
                        ? 'bg-white border-stone-200/90 hover:border-amber-400/50 shadow-2xs'
                        : 'bg-slate-900 border-slate-800 hover:border-amber-600/50'
                    }`}
                  >
                    <h3 className="font-bold text-sm sm:text-base font-classic-heading text-stone-900 dark:text-slate-100 mb-2 flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.q}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed pl-6.5">
                      {item.a}
                    </p>
                  </div>
                ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {/* 1. Creator & Lead Architect: Member of Multiverse (Aaditya Wahal) */}
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
                  <p className="text-[11px] font-mono text-stone-400 dark:text-slate-500 mb-2">
                    Creation &amp; 3D Engine
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                    Designed and authored the interactive 3D solid shape engine, facet analysis, and geometric coordinate rendering for the Noble Polyhedra catalog.
                  </p>
                </div>

                {/* 2. Publisher & Copyright Holder: Webtigo Group */}
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
                  <p className="text-[11px] font-mono text-stone-400 dark:text-slate-500 mb-2">
                    Webtigo Platform
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                    All copyrights held by Webtigo. Powered by Webtigo Group. All rights reserved &copy; 2026 Webtigo.
                  </p>
                </div>

                {/* 3. Initiative & Discovery Idea: Akshat Wahal */}
                <div
                  className={`p-6 rounded-2xl border transition-colors ${
                    isLightMode ? 'bg-white border-stone-200 ring-1 ring-amber-500/20' : 'bg-slate-900 border-slate-800 ring-1 ring-amber-500/30'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-wider font-classic-heading mb-1">
                    Initiative &amp; Discovery Idea
                  </h4>
                  <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                    Akshat Wahal
                  </p>
                  <p className="text-[11px] font-mono text-stone-400 dark:text-slate-500 mb-2">
                    Brother of Aaditya Wahal
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                    He was the one who gave the idea and the information that new polyhedrons are discovered. The initiative was his, and afterwards the creation was Member of Multiverse's (Aaditya Wahal).
                  </p>
                </div>

                {/* 4. Mathematical Foundations: Grünbaum & Stevanović */}
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
                  <p className="text-[11px] font-mono text-stone-400 dark:text-slate-500 mb-2">
                    Literature (1999 • 2020)
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                    Based on the classical classification of noble polyhedra by Branko Grünbaum (1999) and the 2-degree-of-freedom continuous discoveries by Stevanović et al. (2020).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER: 4-COLUMN ACADEMIC & LEGAL COMPLIANCE FOOTER */}
      <footer
        className={`pt-14 pb-10 border-t transition-colors ${
          isLightMode
            ? 'bg-stone-100/80 border-stone-200 text-stone-600'
            : 'bg-slate-950 border-slate-900 text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand & Academic Mission */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
                  <Box className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-classic-heading font-bold text-base text-stone-900 dark:text-slate-100">
                    Noble Polyhedra
                  </h3>
                  <span className="text-[10px] uppercase font-semibold text-amber-700 dark:text-amber-400 font-mono">
                    Webtigo Group
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                An open mathematical atlas and interactive 3D solid shape engine dedicated to the classification, facet analysis, and visualization of noble polyhedra.
              </p>
              <div className="text-[11px] space-y-1 text-stone-500 dark:text-slate-400 border-t border-stone-200/80 dark:border-slate-800/80 pt-2.5">
                <p>
                  <strong className="text-stone-700 dark:text-slate-300">Creator:</strong> Member of Multiverse (Aaditya Wahal)
                </p>
                <p>
                  <strong className="text-stone-700 dark:text-slate-300">Discovery Initiative:</strong> Akshat Wahal
                </p>
                <p>
                  <strong className="text-stone-700 dark:text-slate-300">Publisher:</strong> Webtigo Group
                </p>
              </div>
            </div>

            {/* Col 2: 3D Studio & Categories */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider font-classic-heading text-stone-900 dark:text-slate-200">
                Interactive 3D Studio
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => onStartViewer()}
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Boxes className="w-3.5 h-3.5 text-amber-600" />
                    <span>Launch 3D Explorer</span>
                  </button>
                </li>
                <li>
                  <a
                    href="#groups"
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                  >
                    Rigid 0-DoF Polyhedra
                  </a>
                </li>
                <li>
                  <a
                    href="#groups"
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                  >
                    1-DoF Continuous Orbits
                  </a>
                </li>
                <li>
                  <a
                    href="#groups"
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                  >
                    2-DoF Stevanović Families
                  </a>
                </li>
                {onOpenCollections && (
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenCollections('favorites')}
                      className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1"
                    >
                      <Bookmark className="w-3 h-3 text-amber-500" />
                      <span>Bookmarks &amp; Favorites</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Col 3: Research & Educational Resources */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider font-classic-heading text-stone-900 dark:text-slate-200">
                Research &amp; Foundations
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#theory"
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                  >
                    Mathematical Theory &amp; Axioms
                  </a>
                </li>
                <li>
                  <a
                    href="#guide"
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                  >
                    Definitive Guide to Noble Polyhedra
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                  >
                    Polyhedral Geometry FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#acknowledgments"
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                  >
                    Attribution &amp; Copyright Holding
                  </a>
                </li>
                <li>
                  <span className="text-[11px] text-stone-400 dark:text-slate-500 block">
                    Grünbaum (1999) &bull; Stevanović (2020)
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Policy Compliance */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider font-classic-heading text-stone-900 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Legal &amp; Transparency</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {onOpenLegal ? (
                  <>
                    <li>
                      <button
                        type="button"
                        onClick={() => onOpenLegal('privacy')}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-medium text-amber-800 dark:text-amber-300"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Privacy Policy (GDPR / DART)</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onOpenLegal('terms')}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
                      >
                        Terms of Service &amp; Fair Use
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onOpenLegal('cookies')}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
                      >
                        Cookie Policy &amp; Preferences
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onOpenLegal('about')}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
                      >
                        About Us &amp; Editorial Standards
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onOpenLegal('contact')}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3 text-amber-600" />
                        <span>Contact &amp; Support Inquiries</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><span className="text-stone-400">Privacy Policy</span></li>
                    <li><span className="text-stone-400">Terms of Service</span></li>
                  </>
                )}
                <li className="pt-1">
                  <a
                    href="/ads.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-stone-400 dark:text-slate-500 hover:text-amber-600 flex items-center gap-1 font-mono"
                  >
                    <span>ads.txt Authorized Sellers</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer Bar */}
          <div className="pt-8 border-t border-stone-200/90 dark:border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
              <span className="font-semibold text-stone-800 dark:text-slate-200 font-classic-heading">
                Noble Polyhedra Studio
              </span>
              <span>&bull;</span>
              <span>All copyrights to Webtigo &copy; 2026</span>
              <span>&bull;</span>
              <span>Powered by Webtigo Group</span>
              <span>&bull;</span>
              <span>Creator: Member of Multiverse (Aaditya Wahal)</span>
              <span>&bull;</span>
              <span>Discovery Idea: Akshat Wahal</span>
            </div>

            <div className="text-center md:text-right shrink-0">
              <span>All rights reserved. Academic &amp; educational fair use supported.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
