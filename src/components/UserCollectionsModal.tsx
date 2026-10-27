import React, { useState, useEffect } from 'react';
import { useCollections } from '../context/CollectionsContext';
import { useAppAuth } from '../context/AuthContext';
import { NoblePolyhedron } from '../types';
import { MiniPolyhedron3D } from './MiniPolyhedron3D';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  Heart,
  Bookmark,
  X,
  Boxes,
  Trash2,
  RefreshCw,
  Database,
  Key,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut,
  User,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface UserCollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allModelsMap: Record<string, NoblePolyhedron>;
  onSelectModel: (modelId: string) => void;
  isLightMode: boolean;
  initialTab?: 'favorites' | 'bookmarks' | 'keys';
}

export const UserCollectionsModal: React.FC<UserCollectionsModalProps> = ({
  isOpen,
  onClose,
  allModelsMap,
  onSelectModel,
  isLightMode,
  initialTab = 'favorites',
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'bookmarks' | 'keys'>(initialTab);
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const {
    favorites,
    bookmarks,
    toggleFavorite,
    toggleBookmark,
    clearFavorites,
    clearBookmarks,
    isSyncing,
    isMongoConnected,
    lastSyncedAt,
    refreshFromCloud,
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

  if (!isOpen) return null;

  const favoriteModels = favorites
    .map(id => allModelsMap[id])
    .filter(Boolean) as NoblePolyhedron[];

  const bookmarkModels = bookmarks
    .map(id => allModelsMap[id])
    .filter(Boolean) as NoblePolyhedron[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isLightMode
            ? 'bg-white border-stone-200 text-stone-900 shadow-stone-900/10'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/40'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Boxes className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg font-classic-heading tracking-wide truncate">
                Saved Polyhedra &amp; Collections
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                {isSignedIn
                  ? `Logged in as ${userName} (${userEmail || 'Clerk user'})`
                  : 'Bookmarks & Favorites • Synced via Clerk & MongoDB'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => refreshFromCloud()}
              disabled={isSyncing}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isLightMode
                  ? 'border-stone-200 hover:bg-stone-100 text-stone-600'
                  : 'border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
              title="Refresh / Sync from Cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-transparent hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-stone-200 dark:border-slate-800 px-5 bg-stone-50/70 dark:bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold ${
              activeTab === 'favorites'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>Favorites</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'favorites'
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
              }`}
            >
              {favorites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold ${
              activeTab === 'bookmarks'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span>Bookmarks</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
              }`}
            >
              {bookmarks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold ml-auto ${
              activeTab === 'keys'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Clerk &amp; MongoDB Keys</span>
            {(isMongoConnected || isClerkConfigured) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin space-y-4">
          {/* TAB 1: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
                <span>{favoriteModels.length} shape(s) marked as favorites</span>
                {favoriteModels.length > 0 && (
                  <button
                    onClick={clearFavorites}
                    className="flex items-center gap-1 text-rose-500 hover:underline text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all favorites</span>
                  </button>
                )}
              </div>

              {favoriteModels.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-sm">No favorites saved yet</h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400 max-w-sm mx-auto">
                    Click the heart icon (❤️) on any 3D figure while exploring or in the Multi Grid to add it to your favorite collection.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteModels.map(model => {
                    const disc = getDiscoveryInfo(model);
                    return (
                      <div
                        key={model.id}
                        className={`flex items-center p-2.5 rounded-xl border transition-all ${
                          isLightMode
                            ? 'bg-stone-50/70 hover:bg-white border-stone-200 hover:border-amber-400 hover:shadow-xs'
                            : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 hover:border-amber-500'
                        }`}
                      >
                        {/* 3D Mini View (48x48) */}
                        <div
                          onClick={() => {
                            onSelectModel(model.id);
                            onClose();
                          }}
                          className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 overflow-hidden shrink-0 cursor-pointer"
                        >
                          <MiniPolyhedron3D
                            model={model}
                            isLightMode={isLightMode}
                            autoSpin={true}
                            className="w-full h-full"
                          />
                        </div>

                        {/* Info & Launch */}
                        <div
                          onClick={() => {
                            onSelectModel(model.id);
                            onClose();
                          }}
                          className="flex-1 min-w-0 mx-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
                              {model.id}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              Orbit {model.orbit}
                            </span>
                            {disc.isNew && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-stone-500 dark:text-slate-400 mt-0.5">
                            {model.numFaces} Faces • {model.numVertices} Vertices • {model.faceSides}-gon
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleFavorite(model.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Remove from favorites"
                          >
                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                          </button>
                          <button
                            onClick={() => {
                              onSelectModel(model.id);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-stone-200/50 dark:hover:bg-slate-700 transition-colors"
                            title="Inspect in 3D Studio"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
                <span>{bookmarkModels.length} shape(s) bookmarked for research</span>
                {bookmarkModels.length > 0 && (
                  <button
                    onClick={clearBookmarks}
                    className="flex items-center gap-1 text-amber-600 hover:underline text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all bookmarks</span>
                  </button>
                )}
              </div>

              {bookmarkModels.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-sm">No bookmarks saved yet</h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400 max-w-sm mx-auto">
                    Click the bookmark icon (🔖) on any shape to save it to your research study list.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bookmarkModels.map(model => {
                    const disc = getDiscoveryInfo(model);
                    return (
                      <div
                        key={model.id}
                        className={`flex items-center p-2.5 rounded-xl border transition-all ${
                          isLightMode
                            ? 'bg-stone-50/70 hover:bg-white border-stone-200 hover:border-amber-400 hover:shadow-xs'
                            : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 hover:border-amber-500'
                        }`}
                      >
                        {/* 3D Mini View (48x48) */}
                        <div
                          onClick={() => {
                            onSelectModel(model.id);
                            onClose();
                          }}
                          className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 overflow-hidden shrink-0 cursor-pointer"
                        >
                          <MiniPolyhedron3D
                            model={model}
                            isLightMode={isLightMode}
                            autoSpin={true}
                            className="w-full h-full"
                          />
                        </div>

                        {/* Info & Launch */}
                        <div
                          onClick={() => {
                            onSelectModel(model.id);
                            onClose();
                          }}
                          className="flex-1 min-w-0 mx-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
                              {model.id}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              Orbit {model.orbit}
                            </span>
                            {disc.isNew && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-stone-500 dark:text-slate-400 mt-0.5">
                            {model.numFaces} Faces • {model.numVertices} Vertices • {model.faceSides}-gon
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleBookmark(model.id)}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                            title="Remove from bookmarks"
                          >
                            <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
                          </button>
                          <button
                            onClick={() => {
                              onSelectModel(model.id);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-stone-200/50 dark:hover:bg-slate-700 transition-colors"
                            title="Inspect in 3D Studio"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CLERK & MONGODB KEYS & SYNC STATUS */}
          {activeTab === 'keys' && (
            <div className="space-y-4 text-xs">
              {/* Account / Login Status Card */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-sm">Clerk User Authentication</span>
                  </div>
                  {isClerkConfigured ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Clerk Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <AlertCircle className="w-3 h-3" />
                      Key Required in .env
                    </span>
                  )}
                </div>

                <p className="text-stone-600 dark:text-slate-400 leading-relaxed text-[11.5px]">
                  {isClerkConfigured
                    ? isSignedIn
                      ? `You are authenticated as ${userName} (${userEmail}). Your bookmarks and favorites are tied to your Clerk user account.`
                      : 'Clerk is configured and ready. Click Sign In below to log in or create an account.'
                    : 'To enable live user login with Clerk, add your Publishable Key to your environment variables.'}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {isClerkConfigured ? (
                    isSignedIn ? (
                      <button
                        onClick={signOut}
                        className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900/50 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out ({userName.split(' ')[0]})</span>
                      </button>
                    ) : (
                      <button
                        onClick={openSignIn}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In with Clerk</span>
                      </button>
                    )
                  ) : (
                    <div className="text-[11px] font-mono p-2 rounded-lg bg-stone-200 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 w-full overflow-x-auto">
                      VITE_CLERK_PUBLISHABLE_KEY=&quot;pk_test_...&quot;
                    </div>
                  )}
                </div>
              </div>

              {/* MongoDB Cloud Storage Card */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-sm">MongoDB Database Persistence</span>
                  </div>
                  {isMongoConnected ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      MongoDB Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-stone-600 dark:text-slate-400 bg-stone-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Local Storage Fallback
                    </span>
                  )}
                </div>

                <p className="text-stone-600 dark:text-slate-400 leading-relaxed text-[11.5px]">
                  All your bookmarks and favorites are always safely stored in your browser's persistent local storage. When you provide a MongoDB connection string, they automatically sync to the cloud via Vercel serverless functions (<code>/api/user-data</code>).
                </p>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono p-2 rounded-lg bg-stone-200 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 flex-1 overflow-x-auto">
                    MONGODB_URI=&quot;mongodb+srv://user:pass@cluster0.mongodb.net/...&quot;
                  </div>

                  <button
                    onClick={() => refreshFromCloud()}
                    disabled={isSyncing}
                    className="px-3 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
                    <span>{isSyncing ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {lastSyncedAt && (
                  <p className="text-[10px] text-stone-400 font-mono">
                    Last synced with cloud: {lastSyncedAt.toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* Vercel Serverless Hosting Instructions */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isLightMode ? 'bg-amber-50/50 border-amber-200/70 text-amber-950' : 'bg-amber-950/15 border-amber-500/20 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider font-classic-heading">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>How to configure on Vercel Hosting</span>
                  </div>

                  <button
                    onClick={() => {
                      const envText = `VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_PUBLISHABLE_KEY\nCLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY\nMONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/noble_polyhedra?retryWrites=true&w=majority`;
                      navigator.clipboard.writeText(envText);
                      setCopiedEnv(true);
                      setTimeout(() => setCopiedEnv(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-2xs transition-colors"
                  >
                    {copiedEnv ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEnv ? 'Copied Template!' : 'Copy Env Template'}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-1.5 text-[11.5px] leading-relaxed text-stone-700 dark:text-slate-300">
                  <li>Open your project dashboard at <strong>Vercel.com</strong></li>
                  <li>Navigate to <strong>Settings</strong> &rarr; <strong>Environment Variables</strong></li>
                  <li>
                    Add <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> with your Clerk publishable key (e.g. <code>pk_test_...</code>)
                  </li>
                  <li>
                    Add <strong>CLERK_SECRET_KEY</strong> with your Clerk secret key (e.g. <code>sk_test_...</code>)
                  </li>
                  <li>
                    Add <strong>MONGODB_URI</strong> with your MongoDB connection string (e.g. <code>mongodb+srv://dbuser:mypassword@cluster0.mongodb.net/noble_polyhedra?retryWrites=true&w=majority</code>)
                    <p className="text-[10.5px] text-amber-700 dark:text-amber-300 mt-0.5">
                      <strong>Tip:</strong> Be sure to remove the <code>&lt;</code> and <code>&gt;</code> placeholder brackets around your username and password. Our backend now automatically sanitizes special characters!
                    </p>
                  </li>
                  <li>Redeploy your project. The Vercel serverless functions in <code>/api/user-data.ts</code> will instantly connect to MongoDB!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-slate-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Automatic Instant Auto-Save Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
