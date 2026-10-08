/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NoblePolyhedron, NobleModelSummary, ViewerSettings } from './types';
import { SAMPLE_MODELS } from './data/sampleModels';
import { NOBLE_MODELS_INDEX } from './data/modelsIndex';
import { analyzePolyShape } from './utils/polyGeometry';
import { Polyhedron3DViewer } from './components/Polyhedron3DViewer';
import { PolyShapeInspector } from './components/PolyShapeInspector';
import { PolyhedronHeader } from './components/PolyhedronHeader';
import { PolyhedronMultiView } from './components/PolyhedronMultiView';
import { PolyhedronTrioNav } from './components/PolyhedronTrioNav';
import { DiscoveryGuideModal } from './components/DiscoveryGuideModal';
import { CustomShapeModal } from './components/CustomShapeModal';
import { MathTheoryModal } from './components/MathTheoryModal';
import { Maximized2DPlaneModal } from './components/Maximized2DPlaneModal';
import { ExhibitionCalculatorModal } from './components/ExhibitionCalculatorModal';
import { updateDocumentHeadSEO } from './utils/seo';
import { X, ChevronLeft, ChevronRight, Loader2, Info } from 'lucide-react';

function resolveModelIdFromUrl(): string {
  if (typeof window === 'undefined') return 'O-1';
  try {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const candidate = parts[0].toLowerCase() === 'shape' && parts[1] ? parts[1] : parts[0];
      const match = NOBLE_MODELS_INDEX.find(m => m.id.toLowerCase() === candidate.toLowerCase());
      if (match) return match.id;
    }

    const params = new URLSearchParams(window.location.search);
    const paramShape = params.get('shape') || params.get('id');
    if (paramShape) {
      const match = NOBLE_MODELS_INDEX.find(m => m.id.toLowerCase() === paramShape.toLowerCase());
      if (match) return match.id;
    }

    const hash = window.location.hash.replace(/^#\/?(shape\/)?/, '');
    if (hash) {
      const match = NOBLE_MODELS_INDEX.find(m => m.id.toLowerCase() === hash.toLowerCase());
      if (match) return match.id;
    }
  } catch {
    // fallback
  }
  return 'O-1';
}

export default function App() {
  const initialModelId = useMemo(() => resolveModelIdFromUrl(), []);
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);
  const [currentModel, setCurrentModel] = useState<NoblePolyhedron>(() => {
    return SAMPLE_MODELS[initialModelId] || SAMPLE_MODELS['O-1'] || Object.values(SAMPLE_MODELS)[0];
  });
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number>(0);
  const [allModelsMap, setAllModelsMap] = useState<Record<string, NoblePolyhedron>>({
    ...SAMPLE_MODELS,
  });
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(true);

  // View Mode: 'single' (focused 3D view) or 'multi' (grid of 3D preview cards)
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');

  // Search & Global Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [discoveryFilter, setDiscoveryFilter] = useState<'all' | 'newly-discovered' | 'previously-discovered'>('all');
  const [orbitFilter, setOrbitFilter] = useState<string>('all');
  const [faceSidesFilter, setFaceSidesFilter] = useState<string>('all');

  // Slide-bar Drawer for Information Panel (right side) - open on desktop, starts closed on mobile
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  // Auto-tour state & sequence stepping
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [tourSpeedMs, setTourSpeedMs] = useState<number>(4000);

  // Inspector panel mode: easy vs advanced
  const [panelMode, setPanelMode] = useState<'easy' | 'advanced'>('easy');

  // Light Mode & Classic Website Theme
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const [isCleanView, setIsCleanView] = useState<boolean>(false);

  // Maximized 2D Plane Modal
  const [is2DPlaneMaximized, setIs2DPlaneMaximized] = useState<boolean>(false);

  // Modals
  const [isExhibitionCalcOpen, setIsExhibitionCalcOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isMathTheoryOpen, setIsMathTheoryOpen] = useState<boolean>(false);
  const [isDiscoveryGuideOpen, setIsDiscoveryGuideOpen] = useState<boolean>(false);

  // Viewer Settings
  const [settings, setSettings] = useState<ViewerSettings>({
    renderMode: 'solid',
    colorTheme: 'classicLight',
    explodeAmount: 0,
    autoRotate: false,
    rotationSpeed: 1,
    showVertexSpheres: false,
    showWireframeEdges: true,
    showNormals: false,
    opacity: 1,
  });

  const handleUpdateSettings = (newSettings: Partial<ViewerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleToggleLightMode = () => {
    setIsLightMode(prev => {
      const next = !prev;
      handleUpdateSettings({ colorTheme: next ? 'classicLight' : 'slateAmber' });
      return next;
    });
  };

  // Preload complete 146 models from public JSON
  useEffect(() => {
    let isMounted = true;
    fetch('/nobleModels.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load nobleModels.json');
        return res.json();
      })
      .then((modelsList: NoblePolyhedron[]) => {
        if (!isMounted) return;
        const map: Record<string, NoblePolyhedron> = {};
        modelsList.forEach(m => {
          map[m.id] = m;
        });
        setAllModelsMap(prev => ({ ...prev, ...map }));
        setIsLoadingAll(false);
        if (map[selectedModelId]) {
          setCurrentModel(map[selectedModelId]);
        }
      })
      .catch(err => {
        console.warn('Using bundled sample models:', err);
        if (isMounted) setIsLoadingAll(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedModelId]);

  // Dynamic Document Head SEO & Canonical URL Synchronization
  useEffect(() => {
    updateDocumentHeadSEO(currentModel);

    // Synchronize browser address bar with canonical shape path without page reload
    if (typeof window !== 'undefined') {
      const canonicalPath = `/shape/${encodeURIComponent(currentModel.id)}`;
      if (
        window.location.pathname !== canonicalPath &&
        !window.location.pathname.startsWith('/api')
      ) {
        window.history.replaceState({ modelId: currentModel.id }, '', canonicalPath);
      }
    }
  }, [currentModel]);

  // Handle Model Selection
  const handleSelectModel = useCallback(
    (summary: NobleModelSummary) => {
      setSelectedModelId(summary.id);
      setSelectedFaceIndex(0);

      if (allModelsMap[summary.id]) {
        setCurrentModel(allModelsMap[summary.id]);
      } else {
        const fallback: NoblePolyhedron = {
          ...summary,
          vertices: SAMPLE_MODELS['O-1']?.vertices || [],
          faces: SAMPLE_MODELS['O-1']?.faces || [],
          rawOff: SAMPLE_MODELS['O-1']?.rawOff || '',
        };
        setCurrentModel(fallback);
      }
    },
    [allModelsMap]
  );

  // Listen for browser Back and Forward history buttons
  useEffect(() => {
    const handlePopState = () => {
      const modelId = resolveModelIdFromUrl();
      const found = NOBLE_MODELS_INDEX.find(m => m.id === modelId);
      if (found) {
        handleSelectModel(found);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleSelectModel]);

  const handleSelectModelById = useCallback(
    (id: string) => {
      const found = NOBLE_MODELS_INDEX.find(m => m.id === id);
      if (found) {
        handleSelectModel(found);
        setViewMode('single');
      }
    },
    [handleSelectModel]
  );

  // Filtered active list for stepping and carousel
  const activeModelsList = useMemo(() => {
    return NOBLE_MODELS_INDEX.filter(m => {
      if (discoveryFilter === 'newly-discovered') return m.dof === 2;
      if (discoveryFilter === 'previously-discovered') return m.dof < 2;
      return true;
    });
  }, [discoveryFilter]);

  const currentIndex = useMemo(() => {
    const idx = activeModelsList.findIndex(m => m.id === selectedModelId);
    return idx >= 0 ? idx : 0;
  }, [activeModelsList, selectedModelId]);

  // Stepping actions: Next & Previous
  const handleNextModel = useCallback(() => {
    if (activeModelsList.length === 0) return;
    const nextIdx = (currentIndex + 1) % activeModelsList.length;
    handleSelectModel(activeModelsList[nextIdx]);
  }, [activeModelsList, currentIndex, handleSelectModel]);

  const handlePrevModel = useCallback(() => {
    if (activeModelsList.length === 0) return;
    const prevIdx = (currentIndex - 1 + activeModelsList.length) % activeModelsList.length;
    handleSelectModel(activeModelsList[prevIdx]);
  }, [activeModelsList, currentIndex, handleSelectModel]);

  // Auto-tour timer effect
  useEffect(() => {
    if (!isAutoTour) return;
    const timer = setInterval(() => {
      handleNextModel();
    }, tourSpeedMs);
    return () => clearInterval(timer);
  }, [isAutoTour, tourSpeedMs, handleNextModel]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextModel();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevModel();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoTour(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setViewMode(prev => (prev === 'single' ? 'multi' : 'single'));
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setIsInfoOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (is2DPlaneMaximized) setIs2DPlaneMaximized(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentModel?.faces?.length) {
          setSelectedFaceIndex(prev => (prev + 1) % currentModel.faces.length);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentModel?.faces?.length) {
          setSelectedFaceIndex(
            prev => (prev - 1 + currentModel.faces.length) % currentModel.faces.length
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextModel, handlePrevModel, currentModel, is2DPlaneMaximized]);

  // Sync if allModelsMap updates with current selected ID
  useEffect(() => {
    if (allModelsMap[selectedModelId]) {
      setCurrentModel(allModelsMap[selectedModelId]);
    }
  }, [allModelsMap, selectedModelId]);

  // Handle Custom Model Import
  const handleLoadCustomModel = (customModel: NoblePolyhedron) => {
    setAllModelsMap(prev => ({ ...prev, [customModel.id]: customModel }));
    setSelectedModelId(customModel.id);
    setCurrentModel(customModel);
    setSelectedFaceIndex(0);
    setViewMode('single');
  };

  // Compute Poly Shape Analysis for the current selected face
  const polyShapeAnalysis = useMemo(() => {
    if (!currentModel || !currentModel.faces || currentModel.faces.length === 0) {
      return null;
    }
    const safeFaceIndex = Math.min(
      Math.max(0, selectedFaceIndex),
      currentModel.faces.length - 1
    );
    const faceIndices = currentModel.faces[safeFaceIndex];
    return analyzePolyShape(currentModel.vertices, faceIndices, safeFaceIndex);
  }, [currentModel, selectedFaceIndex]);

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden transition-colors duration-200 ${
        isLightMode ? 'bg-[#fcfbf9] text-stone-900' : 'bg-slate-950 text-slate-100'
      } font-sans`}
    >
      {/* Top Header with Closed Search Bar, Filters, Multi/Single Switch & Info Toggle */}
      <PolyhedronHeader
        currentModel={currentModel}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenMathInfo={() => setIsMathTheoryOpen(true)}
        onOpenDiscoveryGuide={() => setIsDiscoveryGuideOpen(true)}
        panelMode={panelMode}
        onChangePanelMode={setPanelMode}
        onOpenExhibitionCalculator={() => setIsExhibitionCalcOpen(true)}
        isLightMode={isLightMode}
        onToggleLightMode={handleToggleLightMode}
        isCleanView={isCleanView}
        onToggleCleanView={() => setIsCleanView(prev => !prev)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        isInfoOpen={isInfoOpen}
        onToggleInfo={() => setIsInfoOpen(prev => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        discoveryFilter={discoveryFilter}
        onChangeDiscoveryFilter={setDiscoveryFilter}
        orbitFilter={orbitFilter}
        onChangeOrbitFilter={setOrbitFilter}
        faceSidesFilter={faceSidesFilter}
        onChangeFaceSidesFilter={setFaceSidesFilter}
        allModelsIndex={NOBLE_MODELS_INDEX}
        allModelsMap={allModelsMap}
        onSelectModel={summary => {
          handleSelectModel(summary);
          setViewMode('single');
        }}
      />

      {/* Main Central Screen Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {viewMode === 'multi' ? (
          /* MULTI VIEW: Grid of small 3D views with small box of name & metadata */
          <PolyhedronMultiView
            models={NOBLE_MODELS_INDEX}
            allModelsMap={allModelsMap}
            selectedModelId={selectedModelId}
            onSelectModel={summary => {
              handleSelectModel(summary);
              setViewMode('single'); // When clicked, opens in single view!
            }}
            isLightMode={isLightMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            discoveryFilter={discoveryFilter}
            onChangeDiscoveryFilter={setDiscoveryFilter}
          />
        ) : (
          /* SINGLE VIEW: Full-Screen 3D Viewer with Controls Up & Down + Floating Trio Bottom Nav */
          <div className="flex-1 flex overflow-hidden relative">
            {/* Main Central Screen: Full-screen 3D interactive canvas with floating controls up and down */}
            <main className="flex-1 h-full w-full overflow-hidden min-w-0 relative">
              {/* Central 3D Viewer taking the WHOLE SCREEN */}
              <Polyhedron3DViewer
                polyhedron={currentModel}
                selectedFaceIndex={selectedFaceIndex}
                onSelectFace={faceIdx => setSelectedFaceIndex(faceIdx)}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onPrevPolyhedron={handlePrevModel}
                onNextPolyhedron={handleNextModel}
                isAutoTour={isAutoTour}
                onToggleAutoTour={() => setIsAutoTour(prev => !prev)}
                tourSpeedMs={tourSpeedMs}
                isLightMode={isLightMode}
              />

              {/* Floating Bottom Nav: Just 3 shapes (before small, current big, next small) with sliding animation + Auto Tour & other 3D controls */}
              <PolyhedronTrioNav
                activeList={activeModelsList}
                currentModelId={selectedModelId}
                allModelsMap={allModelsMap}
                onSelectModel={handleSelectModel}
                onPrev={handlePrevModel}
                onNext={handleNextModel}
                isLightMode={isLightMode}
                isAutoTour={isAutoTour}
                onToggleAutoTour={() => setIsAutoTour(prev => !prev)}
                tourSpeedMs={tourSpeedMs}
                onChangeTourSpeed={speed => setTourSpeedMs(speed)}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
              />
            </main>

            {/* Mobile Info Drawer Backdrop */}
            {isInfoOpen && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-25 md:hidden"
                onClick={() => setIsInfoOpen(false)}
              />
            )}

            {/* Information Slide Bar (Right Drawer: opened/closed from the upper header button) */}
            <aside
              className={`fixed md:static inset-y-14 right-0 z-30 w-full sm:w-[380px] md:w-[400px] lg:w-[440px] shrink-0 flex flex-col transition-transform duration-300 ease-in-out border-l shadow-2xl md:shadow-none ${
                isLightMode
                  ? 'bg-white border-stone-200 text-stone-900'
                  : 'bg-slate-900 border-slate-800 text-slate-100'
              } ${isInfoOpen ? 'translate-x-0' : 'translate-x-full hidden'}`}
            >
              {/* Slide Bar Header */}
              <div
                className={`px-3.5 py-2 flex items-center justify-between border-b shrink-0 text-xs ${
                  isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider text-[11px] font-classic-heading">
                    Shape Details & Inspector
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Close Slide Bar button */}
                  <button
                    onClick={() => setIsInfoOpen(false)}
                    className={`p-1 rounded-md text-xs transition-colors ${
                      isLightMode
                        ? 'hover:bg-stone-200/70 text-stone-600'
                        : 'hover:bg-slate-800 text-slate-400'
                    }`}
                    title="Close Slide Bar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inspector Content */}
              <div className="flex-1 overflow-hidden p-2">
                {polyShapeAnalysis ? (
                  <PolyShapeInspector
                    analysis={polyShapeAnalysis}
                    polyhedron={currentModel}
                    selectedFaceIndex={selectedFaceIndex}
                    onSelectFace={faceIdx => setSelectedFaceIndex(faceIdx)}
                    onPrevPolyhedron={handlePrevModel}
                    onNextPolyhedron={handleNextModel}
                    panelMode={panelMode}
                    onChangePanelMode={setPanelMode}
                    onMaximize2DPlane={() => setIs2DPlaneMaximized(true)}
                    isLightMode={isLightMode}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-xs text-stone-500">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing poly shape...
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Modals */}
      <CustomShapeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onLoadCustomModel={handleLoadCustomModel}
      />

      <MathTheoryModal
        isOpen={isMathTheoryOpen}
        onClose={() => setIsMathTheoryOpen(false)}
        polyhedron={currentModel}
        isLightMode={isLightMode}
      />

      <DiscoveryGuideModal
        isOpen={isDiscoveryGuideOpen}
        onClose={() => setIsDiscoveryGuideOpen(false)}
        onSelectModelId={handleSelectModelById}
        onStartAutoTour={() => {
          setIsAutoTour(true);
          setViewMode('single');
        }}
      />

      {/* Maximized 2D Plane Modal */}
      {polyShapeAnalysis && (
        <Maximized2DPlaneModal
          isOpen={is2DPlaneMaximized}
          onClose={() => setIs2DPlaneMaximized(false)}
          analysis={polyShapeAnalysis}
          polyhedron={currentModel}
          selectedFaceIndex={selectedFaceIndex}
          onSelectFace={faceIdx => setSelectedFaceIndex(faceIdx)}
          onPrevPolyhedron={handlePrevModel}
          onNextPolyhedron={handleNextModel}
          isAutoTour={isAutoTour}
          onToggleAutoTour={() => setIsAutoTour(prev => !prev)}
        />
      )}

      {/* Exhibition Calculator & Shape Finder Modal */}
      <ExhibitionCalculatorModal
        isOpen={isExhibitionCalcOpen}
        onClose={() => setIsExhibitionCalcOpen(false)}
        onSelectModel={summary => {
          handleSelectModel(summary);
          setViewMode('single');
        }}
      />
    </div>
  );
}
