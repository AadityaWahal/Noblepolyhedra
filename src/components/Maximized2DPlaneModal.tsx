import React, { useState, useEffect } from 'react';
import { PolyShapeAnalysis, NoblePolyhedron, NobleModelSummary } from '../types';
import { generatePolyShapeSVG, triggerDownload } from '../utils/polyGeometry';
import { getEasyPolyhedronInfo } from '../utils/nobleDescriptions';
import { getDiscoveryInfo } from '../utils/nobleDiscovery';
import {
  Minimize2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Maximize2 as MaximizeIcon,
  Sparkles,
  Info,
} from 'lucide-react';

interface Maximized2DPlaneModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: PolyShapeAnalysis;
  polyhedron: NoblePolyhedron;
  selectedFaceIndex: number;
  onSelectFace: (index: number) => void;
  onPrevPolyhedron?: () => void;
  onNextPolyhedron?: () => void;
  isAutoTour?: boolean;
  onToggleAutoTour?: () => void;
}

export const Maximized2DPlaneModal: React.FC<Maximized2DPlaneModalProps> = ({
  isOpen,
  onClose,
  analysis,
  polyhedron,
  selectedFaceIndex,
  onSelectFace,
  onPrevPolyhedron,
  onNextPolyhedron,
  isAutoTour = false,
  onToggleAutoTour,
}) => {
  const [showOptions, setShowOptions] = useState(true);
  const [showVertices, setShowVertices] = useState(true);
  const [showLengths, setShowLengths] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [copied, setCopied] = useState(false);

  // Keyboard shortcut listener (Esc to close, H to toggle options, arrows to cycle)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'h' || e.key === 'H') {
        setShowOptions(prev => !prev);
      } else if (e.key === 'ArrowLeft' && onPrevPolyhedron) {
        onPrevPolyhedron();
      } else if (e.key === 'ArrowRight' && onNextPolyhedron) {
        onNextPolyhedron();
      } else if (e.key === 'ArrowUp') {
        const total = polyhedron.faces?.length || 1;
        onSelectFace((selectedFaceIndex - 1 + total) % total);
      } else if (e.key === 'ArrowDown') {
        const total = polyhedron.faces?.length || 1;
        onSelectFace((selectedFaceIndex + 1) % total);
      } else if (e.key === ' ' && onToggleAutoTour) {
        e.preventDefault();
        onToggleAutoTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevPolyhedron, onNextPolyhedron, selectedFaceIndex, polyhedron.faces, onSelectFace, onToggleAutoTour]);

  if (!isOpen) return null;

  const easyInfo = getEasyPolyhedronInfo(polyhedron);
  const discoveryInfo = getDiscoveryInfo(polyhedron);
  const totalFaces = polyhedron.faces?.length || 1;

  const handleDownloadSVG = () => {
    const svgStr = generatePolyShapeSVG(analysis, {
      width: 1000,
      height: 1000,
      showVertices,
      showLengths,
      showAngles,
      showAxes,
      darkMode: true,
    });
    triggerDownload(`${polyhedron.id}_face_${selectedFaceIndex}_2D_plane.svg`, svgStr, 'image/svg+xml');
  };

  const handleCopyPoints = () => {
    const jsonStr = JSON.stringify(
      analysis.points2D.map(p => ({
        vertexId: p.vertexIndex3D,
        x: Number(p.x.toFixed(6)),
        y: Number(p.y.toFixed(6)),
      })),
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="maximized-2d-plane-overlay"
      className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl flex flex-col text-slate-100 select-none animate-in fade-in duration-200"
    >
      {/* Top Header Controls (Hidden when clean view is enabled) */}
      {showOptions && (
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          {/* Left: Shape Title & Badges */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <MaximizeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {easyInfo.friendlyName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  {polyhedron.id}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${discoveryInfo.badgeClass}`}>
                  {polyhedron.dof === 2 ? '✨ 2-DoF Discovery' : `${polyhedron.dof} DoF`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Fundamental 2D Face Plane • {analysis.sideCount}-sided {easyInfo.faceShapeName} ({totalFaces} congruent duplicates)
              </p>
            </div>
          </div>

          {/* Center: Face & Polyhedron Steppers */}
          <div className="flex items-center gap-2">
            {/* Shape Navigation */}
            {onPrevPolyhedron && onNextPolyhedron && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  id="max-2d-prev-poly"
                  onClick={onPrevPolyhedron}
                  className="px-2 py-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                  title="Previous Polyhedron (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev Shape</span>
                </button>
                <div className="w-[1px] h-4 bg-slate-800 mx-1" />
                <button
                  id="max-2d-next-poly"
                  onClick={onNextPolyhedron}
                  className="px-2 py-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                  title="Next Polyhedron (→)"
                >
                  <span className="hidden sm:inline">Next Shape</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Face Navigation */}
            <div className="flex items-center bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              <button
                id="max-2d-prev-face"
                onClick={() => onSelectFace((selectedFaceIndex - 1 + totalFaces) % totalFaces)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                title="Previous Congruent Face (↑)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-amber-300 font-bold">
                Face {selectedFaceIndex + 1}/{totalFaces}
              </span>
              <button
                id="max-2d-next-face"
                onClick={() => onSelectFace((selectedFaceIndex + 1) % totalFaces)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                title="Next Congruent Face (↓)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto-Tour Button */}
            {onToggleAutoTour && (
              <button
                id="max-2d-toggle-tour"
                onClick={onToggleAutoTour}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isAutoTour
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Auto-Tour through shapes"
              >
                {isAutoTour ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current text-amber-400" />}
                <span className="hidden md:inline">{isAutoTour ? 'Touring...' : 'Auto-Tour'}</span>
              </button>
            )}
          </div>

          {/* Right: Toggle Options & Exit Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Hide Options (Zen Clean Mode) */}
            <button
              id="max-2d-hide-options-btn"
              onClick={() => setShowOptions(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Hide all options for a clean view (Press H)"
            >
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>Hide Options</span>
            </button>

            {/* Exit Maximize Button */}
            <button
              id="max-2d-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Exit Maximized 2D Screen (Esc)"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Zen Controls when options are HIDDEN */}
      {!showOptions && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 animate-in fade-in duration-150">
          <button
            id="max-2d-show-options-btn"
            onClick={() => setShowOptions(true)}
            className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-700/60 backdrop-blur-md shadow-2xl text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105"
            title="Restore options and toolbars (Press H)"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Show Options</span>
          </button>
          <button
            id="max-2d-zen-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md shadow-2xl transition-all hover:scale-105"
            title="Exit Maximized Screen (Esc)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Vector Canvas Display */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Floating Toggle Pills (Only shown when options are ON) */}
        {showOptions && (
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl text-xs">
            <span className="text-[11px] text-slate-400 font-mono px-2">Show:</span>
            <button
              onClick={() => setShowVertices(!showVertices)}
              className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                showVertices ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Vertices
            </button>
            <button
              onClick={() => setShowLengths(!showLengths)}
              className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                showLengths ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Edge Lengths
            </button>
            <button
              onClick={() => setShowAngles(!showAngles)}
              className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                showAngles ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Interior Angles
            </button>
            <button
              onClick={() => setShowAxes(!showAxes)}
              className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                showAxes ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Cartesian Axes
            </button>
          </div>
        )}

        {/* The Clean or Detailed Large SVG */}
        <div
          id="maximized-svg-canvas"
          className="w-full h-full max-w-[850px] max-h-[850px] aspect-square flex items-center justify-center filter drop-shadow-2xl transition-all duration-200"
          dangerouslySetInnerHTML={{
            __html: generatePolyShapeSVG(analysis, {
              width: 800,
              height: 800,
              showVertices: showOptions ? showVertices : false,
              showLengths: showOptions ? showLengths : false,
              showAngles: showOptions ? showAngles : false,
              showAxes: showOptions ? showAxes : false,
              darkMode: true,
            }),
          }}
        />

        {/* Uncluttered subtitle watermark in Clean Mode */}
        {!showOptions && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-center">
            <p className="text-sm font-bold font-mono text-slate-400/80 tracking-wider">
              {polyhedron.id} • {analysis.sideCount}-sided {easyInfo.faceShapeName}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Clean 2D Plane Mode • Press <kbd className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">H</kbd> for options • <kbd className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">Esc</kbd> to exit
            </p>
          </div>
        )}
      </div>

      {/* Bottom Technical & Export Bar (Visible only when options are ON) */}
      {showOptions && (
        <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
          {/* Detailed Face Geometry Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Classification</span>
              <span className="text-amber-300 font-bold">{analysis.shapeClassification}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">Planar Area</span>
              <span className="text-slate-200 font-semibold">{analysis.area.toFixed(4)}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">Perimeter</span>
              <span className="text-slate-200 font-semibold">{analysis.perimeter.toFixed(4)}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">Distance to Origin</span>
              <span className="text-slate-200 font-semibold">{analysis.planeDistance.toFixed(4)}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">Normal Vector</span>
              <span className="text-slate-400">
                ({analysis.planeNormal.map(n => n.toFixed(3)).join(', ')})
              </span>
            </div>
          </div>

          {/* Export & Download Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="max-2d-copy-points-btn"
              onClick={handleCopyPoints}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Copy 2D plane coordinates as JSON"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied Coordinates!' : 'Copy 2D Points'}</span>
            </button>

            <button
              id="max-2d-download-svg-btn"
              onClick={handleDownloadSVG}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download high-resolution SVG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
