import React from 'react';
import { PolyShapeAnalysis, NoblePolyhedron } from '../types';
import { getEasyPolyhedronInfo } from '../utils/nobleDescriptions';
import { generatePolyShapeSVG } from '../utils/polyGeometry';
import {
  Sparkles,
  Layers,
  CircleDot,
  Maximize2,
  Compass,
  Shapes,
  HelpCircle,
  Activity,
  Smile,
  Info,
} from 'lucide-react';

interface EasyInspectorPanelProps {
  analysis: PolyShapeAnalysis;
  polyhedron: NoblePolyhedron;
  selectedFaceIndex: number;
  onSelectFace: (index: number) => void;
  onMaximize2DPlane?: () => void;
  isLightMode?: boolean;
}

export const EasyInspectorPanel: React.FC<EasyInspectorPanelProps> = ({
  analysis,
  polyhedron,
  selectedFaceIndex,
  onSelectFace,
  onMaximize2DPlane,
  isLightMode = true,
}) => {
  const easyInfo = getEasyPolyhedronInfo(polyhedron);
  const totalFaces = polyhedron.faces?.length || 1;

  return (
    <div className={`space-y-3.5 transition-colors ${isLightMode ? 'text-stone-800' : 'text-slate-200'}`}>
      {/* Friendly Name and Overview Banner */}
      <div
        className={`p-3 rounded-xl border shadow-xs transition-colors ${
          isLightMode
            ? 'bg-stone-50/90 border-stone-200 text-stone-900'
            : 'bg-gradient-to-br from-slate-800/90 via-slate-850 to-slate-900 border-slate-700/80 shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className={`text-base font-bold tracking-tight font-classic-heading ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                {easyInfo.friendlyName}
              </h3>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-semibold ${
                  isLightMode
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {polyhedron.id}
              </span>
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isLightMode ? 'text-amber-800' : 'text-amber-400/90'}`}>
              {easyInfo.category}
            </p>
          </div>
          <div
            className={`p-1.5 rounded-lg border shrink-0 ${
              isLightMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <Smile className="w-4 h-4" />
          </div>
        </div>

        <p className={`text-xs mt-2 leading-relaxed ${isLightMode ? 'text-stone-700 font-classic-serif' : 'text-slate-300'}`}>
          {easyInfo.simpleDescription}
        </p>

        <div className={`mt-2 pt-2 border-t flex items-center gap-1.5 text-[11px] ${isLightMode ? 'border-stone-200 text-stone-600' : 'border-slate-700/60 text-slate-400'}`}>
          <Info className={`w-3.5 h-3.5 shrink-0 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
          <span>{easyInfo.funFact}</span>
        </div>
      </div>

      {/* 3 Core Building Blocks (Vertices, Edges, Faces) */}
      <div>
        <h4 className={`text-xs font-semibold mb-2 flex items-center gap-1.5 font-classic-heading ${isLightMode ? 'text-stone-800' : 'text-slate-300'}`}>
          <Shapes className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
          Core Geometric Elements
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {/* Vertices */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors shadow-xs ${
              isLightMode
                ? 'bg-white border-stone-200 hover:border-amber-400'
                : 'bg-slate-800/70 border-slate-700/60 hover:border-amber-500/40'
            }`}
          >
            <div className={`flex items-center justify-between mb-1 ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
              <span className={`text-[11px] font-semibold ${isLightMode ? 'text-stone-800' : 'text-slate-300'}`}>Vertices</span>
              <CircleDot className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
            </div>
            <div>
              <span className={`text-xl font-black font-mono ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                {polyhedron.numVertices}
              </span>
              <span className={`text-[10px] block mt-0.5 leading-tight ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                Points
              </span>
            </div>
          </div>

          {/* Edges */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors shadow-xs ${
              isLightMode
                ? 'bg-white border-stone-200 hover:border-sky-400'
                : 'bg-slate-800/70 border-slate-700/60 hover:border-amber-500/40'
            }`}
          >
            <div className={`flex items-center justify-between mb-1 ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
              <span className={`text-[11px] font-semibold ${isLightMode ? 'text-stone-800' : 'text-slate-300'}`}>Edges</span>
              <Activity className={`w-3.5 h-3.5 ${isLightMode ? 'text-sky-700' : 'text-cyan-400'}`} />
            </div>
            <div>
              <span className={`text-xl font-black font-mono ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                {polyhedron.numEdges}
              </span>
              <span className={`text-[10px] block mt-0.5 leading-tight ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                Lines
              </span>
            </div>
          </div>

          {/* Faces */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors shadow-xs ${
              isLightMode
                ? 'bg-white border-stone-200 hover:border-emerald-400'
                : 'bg-slate-800/70 border-slate-700/60 hover:border-amber-500/40'
            }`}
          >
            <div className={`flex items-center justify-between mb-1 ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
              <span className={`text-[11px] font-semibold ${isLightMode ? 'text-stone-800' : 'text-slate-300'}`}>Faces</span>
              <Layers className={`w-3.5 h-3.5 ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`} />
            </div>
            <div>
              <span className={`text-xl font-black font-mono ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                {polyhedron.numFaces}
              </span>
              <span className={`text-[10px] block mt-0.5 leading-tight ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                Surfaces
              </span>
            </div>
          </div>
        </div>

        <div
          className={`mt-2 p-2 rounded-lg border text-[11px] space-y-1 ${
            isLightMode
              ? 'bg-stone-50 border-stone-200 text-stone-700'
              : 'bg-slate-800/40 border-slate-700/40 text-slate-300'
          }`}
        >
          <div>• <strong>Corners:</strong> {easyInfo.verticesExplanation}.</div>
          <div>• <strong>Lines:</strong> {easyInfo.edgesExplanation}.</div>
          <div>• <strong>Surfaces:</strong> {easyInfo.facesExplanation}.</div>
        </div>
      </div>

      {/* Degree of Freedom (DoF) Explained Simply */}
      <div
        className={`p-3 rounded-xl border space-y-1.5 shadow-xs ${
          isLightMode ? 'bg-white border-stone-200' : 'bg-slate-800/70 border-slate-700/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
            <Sparkles className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
            Degrees of Freedom (DoF)
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              polyhedron.dof === 2
                ? isLightMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : polyhedron.dof === 1
                ? isLightMode
                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : isLightMode
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
            }`}
          >
            {easyInfo.dofTitle}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-slate-300'}`}>
          {easyInfo.dofSimpleExplanation}
        </p>
      </div>

      {/* Symmetry Group Explained Simply */}
      <div
        className={`p-3 rounded-xl border space-y-1.5 shadow-xs ${
          isLightMode ? 'bg-white border-stone-200' : 'bg-slate-800/70 border-slate-700/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
            <Compass className={`w-3.5 h-3.5 ${isLightMode ? 'text-sky-700' : 'text-cyan-400'}`} />
            3D Symmetry Group
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isLightMode
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            }`}
          >
            {easyInfo.symmetryGroup}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-slate-300'}`}>
          {easyInfo.symmetrySimpleExplanation}
        </p>
      </div>

      {/* Clean Visual Face Polygon (Friendly, Uncluttered) */}
      <div
        className={`p-3 rounded-xl border space-y-2 shadow-xs ${
          isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/70 border-slate-800/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Maximize2 className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
            <span className={`text-xs font-bold ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
              Face Shape ({analysis.sideCount}-sided {easyInfo.faceShapeName})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
              Face #{selectedFaceIndex + 1}/{totalFaces}
            </span>
            {onMaximize2DPlane && (
              <button
                id="easy-maximize-2d-btn"
                onClick={onMaximize2DPlane}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border transition-colors shadow-xs ${
                  isLightMode
                    ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border-slate-700/80'
                }`}
                title="Maximize 2D Face Plane Screen"
              >
                <Maximize2 className={`w-3 h-3 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>2D Plane</span>
              </button>
            )}
          </div>
        </div>

        <div
          className={`w-full flex items-center justify-center p-2 rounded-lg border ${
            isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
          } ${onMaximize2DPlane ? 'cursor-pointer group' : ''}`}
          onClick={onMaximize2DPlane}
          title={onMaximize2DPlane ? 'Click to open Maximized 2D Plane' : undefined}
        >
          <div
            className="w-full max-w-[220px] aspect-square flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
            dangerouslySetInnerHTML={{
              __html: generatePolyShapeSVG(analysis, {
                width: 220,
                height: 220,
                showVertices: true,
                showLengths: false,
                showAngles: false,
                showAxes: false,
                darkMode: !isLightMode,
              }),
            }}
          />
        </div>

        <p className={`text-[11px] text-center ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
          All {polyhedron.numFaces} faces on this shape are exact duplicates of this {easyInfo.faceShapeName}.
        </p>
      </div>

      {/* Euler's Formula Card */}
      <div
        className={`p-3 rounded-xl border flex items-start gap-2.5 shadow-xs ${
          isLightMode ? 'bg-white border-stone-200' : 'bg-slate-800/50 border-slate-700/50'
        }`}
      >
        <div
          className={`p-1 rounded shrink-0 mt-0.5 font-mono text-xs font-bold ${
            isLightMode ? 'bg-amber-100 text-amber-900' : 'bg-amber-500/20 text-amber-400'
          }`}
        >
          χ
        </div>
        <div>
          <div className={`text-xs font-bold ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
            Euler's Polyhedral Formula
          </div>
          <div className={`text-xs font-mono font-semibold mt-0.5 ${isLightMode ? 'text-amber-800' : 'text-amber-300'}`}>
            V({polyhedron.numVertices}) - E({polyhedron.numEdges}) + F({polyhedron.numFaces}) = {polyhedron.eulerChar}
          </div>
          <div className={`text-[11px] mt-1 leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-slate-400'}`}>
            {easyInfo.eulerSimpleExplanation}
          </div>
        </div>
      </div>
    </div>
  );
};
