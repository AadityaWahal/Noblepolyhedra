import React, { useState } from 'react';
import { PolyShapeAnalysis, NoblePolyhedron } from '../types';
import { EasyInspectorPanel } from './EasyInspectorPanel';
import { AdvancedInspectorPanel } from './AdvancedInspectorPanel';
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  Smile,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface PolyShapeInspectorProps {
  analysis: PolyShapeAnalysis;
  polyhedron: NoblePolyhedron;
  selectedFaceIndex: number;
  onSelectFace: (index: number) => void;
  onPrevPolyhedron?: () => void;
  onNextPolyhedron?: () => void;
  panelMode?: 'easy' | 'advanced';
  onChangePanelMode?: (mode: 'easy' | 'advanced') => void;
  onMaximize2DPlane?: () => void;
  isLightMode?: boolean;
}

export const PolyShapeInspector: React.FC<PolyShapeInspectorProps> = ({
  analysis,
  polyhedron,
  selectedFaceIndex,
  onSelectFace,
  onPrevPolyhedron,
  onNextPolyhedron,
  panelMode: externalPanelMode,
  onChangePanelMode: externalOnChangePanelMode,
  onMaximize2DPlane,
  isLightMode = true,
}) => {
  const [internalPanelMode, setInternalPanelMode] = useState<'easy' | 'advanced'>('easy');

  // Support controlled or uncontrolled mode
  const activeMode = externalPanelMode !== undefined ? externalPanelMode : internalPanelMode;
  const setMode = (mode: 'easy' | 'advanced') => {
    if (externalOnChangePanelMode) {
      externalOnChangePanelMode(mode);
    } else {
      setInternalPanelMode(mode);
    }
  };

  const totalFaces = polyhedron.faces?.length || 1;

  return (
    <div
      className={`flex flex-col h-full rounded-xl overflow-hidden border transition-colors shadow-xs ${
        isLightMode
          ? 'bg-white border-stone-200 text-stone-900'
          : 'bg-slate-900/95 border-slate-700/60 text-slate-100 shadow-2xl'
      }`}
    >
      {/* Top Banner: Shape ID + Steppers */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between gap-2 transition-colors ${
          isLightMode
            ? 'bg-stone-50 border-stone-200 text-stone-900'
            : 'bg-slate-800/90 border-slate-700/70 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              isLightMode
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold font-classic-heading flex items-center gap-1.5">
                <span>{polyhedron.id}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border font-normal ${
                    isLightMode
                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {analysis.shapeClassification}
                </span>
              </h2>
            </div>
            <p className={`text-[10px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
              {totalFaces} congruent faces • {polyhedron.dof === 2 ? 'Modern 2-DoF' : `${polyhedron.dof}-DoF`}
            </p>
          </div>
        </div>

        {/* Quick Steppers: Polyhedron & Face (Small buttons) */}
        <div className="flex items-center gap-1">
          {onPrevPolyhedron && onNextPolyhedron && (
            <div
              className={`flex items-center p-0.5 rounded-md border text-xs ${
                isLightMode
                  ? 'bg-white border-stone-200 text-stone-700 shadow-xs'
                  : 'bg-slate-950/80 border-slate-700/60 text-slate-300'
              }`}
            >
              <button
                id="panel-prev-poly-btn"
                onClick={onPrevPolyhedron}
                className={`p-0.5 rounded transition-colors ${
                  isLightMode ? 'hover:bg-stone-100 text-stone-700' : 'hover:bg-slate-800 text-slate-300 hover:text-amber-300'
                }`}
                title="Previous Polyhedron (Shortcut: ←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className={`text-[10px] font-mono px-1 font-semibold ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                Shape
              </span>
              <button
                id="panel-next-poly-btn"
                onClick={onNextPolyhedron}
                className={`p-0.5 rounded transition-colors ${
                  isLightMode ? 'hover:bg-stone-100 text-stone-700' : 'hover:bg-slate-800 text-slate-300 hover:text-amber-300'
                }`}
                title="Next Polyhedron (Shortcut: →)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div
            className={`flex items-center gap-0.5 px-1 py-0.5 rounded-md border text-xs ${
              isLightMode
                ? 'bg-white border-stone-200 text-stone-700 shadow-xs'
                : 'bg-slate-950/80 border-slate-700/60 text-slate-300'
            }`}
          >
            <button
              id="prev-face-btn"
              onClick={() => onSelectFace((selectedFaceIndex - 1 + totalFaces) % totalFaces)}
              className={`p-0.5 rounded transition-colors ${
                isLightMode ? 'hover:bg-stone-100 text-stone-700' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Previous Face (Shortcut: ↑)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className={`font-mono px-1 text-[10px] ${isLightMode ? 'text-stone-700' : 'text-slate-300'}`}>
              F:{selectedFaceIndex + 1}/{totalFaces}
            </span>
            <button
              id="next-face-btn"
              onClick={() => onSelectFace((selectedFaceIndex + 1) % totalFaces)}
              className={`p-0.5 rounded transition-colors ${
                isLightMode ? 'hover:bg-stone-100 text-stone-700' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Next Face (Shortcut: ↓)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Easy Panel vs Advanced Panel Switcher */}
      <div
        className={`px-3 py-1.5 border-b flex items-center justify-between gap-2 transition-colors ${
          isLightMode
            ? 'bg-stone-50/70 border-stone-200'
            : 'bg-slate-950/70 border-slate-800'
        }`}
      >
        <div
          className={`flex items-center p-0.5 rounded-lg border w-full ${
            isLightMode ? 'bg-stone-200/70 border-stone-300/80' : 'bg-slate-900 border-slate-700/80'
          }`}
        >
          <button
            id="tab-easy-panel-btn"
            onClick={() => setMode('easy')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-semibold transition-all duration-150 ${
              activeMode === 'easy'
                ? isLightMode
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'bg-emerald-600 text-white shadow-md'
                : isLightMode
                  ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            id="tab-advanced-panel-btn"
            onClick={() => setMode('advanced')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-semibold transition-all duration-150 ${
              activeMode === 'advanced'
                ? isLightMode
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'bg-amber-600 text-white shadow-md'
                : isLightMode
                  ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical</span>
          </button>
        </div>
      </div>

      {/* Mode Sub-indicator Bar */}
      <div
        className={`px-3 py-1 border-b text-[10px] flex items-center justify-between ${
          isLightMode
            ? 'bg-stone-50 border-stone-200 text-stone-500'
            : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
        }`}
      >
        {activeMode === 'easy' ? (
          <span className={`font-medium ${isLightMode ? 'text-stone-700' : 'text-emerald-400/90'}`}>
            Overview: Name, Vertices, Edges, Faces, DoF & Symmetry
          </span>
        ) : (
          <span className={`font-medium ${isLightMode ? 'text-stone-700' : 'text-amber-400/90'}`}>
            Technical: Angles, coordinates, 3D equations & code export
          </span>
        )}
        <span className={`font-mono text-[9px] uppercase ${isLightMode ? 'text-stone-400' : 'text-slate-500'}`}>
          {activeMode}
        </span>
      </div>

      {/* Panel Body Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeMode === 'easy' ? (
          <EasyInspectorPanel
            analysis={analysis}
            polyhedron={polyhedron}
            selectedFaceIndex={selectedFaceIndex}
            onSelectFace={onSelectFace}
            onMaximize2DPlane={onMaximize2DPlane}
            isLightMode={isLightMode}
          />
        ) : (
          <AdvancedInspectorPanel
            analysis={analysis}
            polyhedron={polyhedron}
            selectedFaceIndex={selectedFaceIndex}
            onMaximize2DPlane={onMaximize2DPlane}
            isLightMode={isLightMode}
          />
        )}
      </div>

      {/* Footer Copyright & Attribution */}
      <div
        className={`px-3 py-2 border-t text-[10px] leading-tight shrink-0 select-none ${
          isLightMode
            ? 'bg-stone-50 border-stone-200 text-stone-500'
            : 'bg-slate-900/80 border-slate-800 text-slate-400'
        }`}
      >
        <div className="flex items-center justify-between font-medium">
          <span>© 2026 Webtigo. All rights reserved.</span>
          <span className="font-semibold text-amber-500">Webtigo Group</span>
        </div>
        <div className="mt-0.5 text-[9px] text-stone-400 dark:text-slate-500">
          Created by Member of Multiverse (Aaditya Wahal) • Powered by Webtigo Group
        </div>
      </div>
    </div>
  );
};
