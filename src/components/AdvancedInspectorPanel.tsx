import React, { useState } from 'react';
import { PolyShapeAnalysis, NoblePolyhedron } from '../types';
import {
  generatePolyShapeSVG,
  triggerDownload,
  generateOBJ,
} from '../utils/polyGeometry';
import {
  Copy,
  Check,
  Download,
  FileCode,
  Maximize2,
} from 'lucide-react';

interface AdvancedInspectorPanelProps {
  analysis: PolyShapeAnalysis;
  polyhedron: NoblePolyhedron;
  selectedFaceIndex: number;
  onMaximize2DPlane?: () => void;
  isLightMode?: boolean;
}

export const AdvancedInspectorPanel: React.FC<AdvancedInspectorPanelProps> = ({
  analysis,
  polyhedron,
  selectedFaceIndex,
  onMaximize2DPlane,
  isLightMode = true,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [showVertexLabels, setShowVertexLabels] = useState(true);
  const [showEdgeLengths, setShowEdgeLengths] = useState(true);
  const [showAngleLabels, setShowAngleLabels] = useState(true);
  const [exportTab, setExportTab] = useState<'coordinates' | 'svg' | 'off' | 'obj'>('coordinates');

  const copyToClipboard = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Download handlers
  const handleDownloadSVG = () => {
    const svgStr = generatePolyShapeSVG(analysis, {
      width: 600,
      height: 600,
      showVertices: showVertexLabels,
      showLengths: showEdgeLengths,
      showAngles: showAngleLabels,
      darkMode: !isLightMode,
    });
    triggerDownload(`${polyhedron.id}_face_${selectedFaceIndex}_polyshape.svg`, svgStr, 'image/svg+xml');
  };

  const handleDownloadOFF = () => {
    triggerDownload(`${polyhedron.id}.off`, polyhedron.rawOff || '', 'text/plain');
  };

  const handleDownloadOBJ = () => {
    const objStr = generateOBJ(polyhedron);
    triggerDownload(`${polyhedron.id}.obj`, objStr, 'text/plain');
  };

  // Code formats for export
  const getCoordinatesCode = () => {
    return JSON.stringify(
      analysis.points2D.map(p => ({
        vertexId: p.vertexIndex3D,
        x: Number(p.x.toFixed(5)),
        y: Number(p.y.toFixed(5)),
      })),
      null,
      2
    );
  };

  const getPythonCoordsCode = () => {
    const pts = analysis.points2D.map(p => `(${p.x.toFixed(6)}, ${p.y.toFixed(6)})`).join(', ');
    return `# Fundamental Poly Shape 2D Coordinates for ${polyhedron.id}\nface_poly = [${pts}]\n# Vertex 3D Indices: [${analysis.vertexIndices.join(', ')}]`;
  };

  return (
    <div className={`space-y-3.5 transition-colors ${isLightMode ? 'text-stone-800' : 'text-slate-200'}`}>
      {/* 2D Poly Shape Visualizer Card with Angles & Coordinates */}
      <div
        className={`relative flex flex-col items-center justify-center p-3 rounded-xl border shadow-xs transition-colors ${
          isLightMode ? 'bg-white border-stone-200' : 'bg-slate-950/60 border-slate-800/80 shadow-inner'
        }`}
      >
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono ${
              isLightMode
                ? 'bg-stone-100 border-stone-200 text-stone-700'
                : 'bg-slate-900/85 backdrop-blur border-slate-700/50 text-slate-300'
            }`}
          >
            <span>2D Plane</span>
          </div>
          {onMaximize2DPlane && (
            <button
              id="advanced-maximize-2d-btn"
              onClick={onMaximize2DPlane}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium transition-colors shadow-xs ${
                isLightMode
                  ? 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border-slate-700'
              }`}
              title="Maximize 2D Face Plane Screen"
            >
              <Maximize2 className={`w-3 h-3 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
              <span>Maximize</span>
            </button>
          )}
        </div>

        <div
          className={`absolute top-2 right-2 z-10 flex items-center gap-0.5 p-0.5 rounded-md border text-[11px] ${
            isLightMode
              ? 'bg-stone-100 border-stone-200'
              : 'bg-slate-900/85 backdrop-blur border-slate-700/50'
          }`}
        >
          <button
            onClick={() => setShowVertexLabels(!showVertexLabels)}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              showVertexLabels
                ? isLightMode
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'bg-amber-500/20 text-amber-300 font-medium'
                : isLightMode
                  ? 'text-stone-500 hover:text-stone-800'
                  : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Vertex Indices"
          >
            Vertices
          </button>
          <button
            onClick={() => setShowEdgeLengths(!showEdgeLengths)}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              showEdgeLengths
                ? isLightMode
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'bg-amber-500/20 text-amber-300 font-medium'
                : isLightMode
                  ? 'text-stone-500 hover:text-stone-800'
                  : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Edge Lengths"
          >
            Lengths
          </button>
          <button
            onClick={() => setShowAngleLabels(!showAngleLabels)}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              showAngleLabels
                ? isLightMode
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'bg-amber-500/20 text-amber-300 font-medium'
                : isLightMode
                  ? 'text-stone-500 hover:text-stone-800'
                  : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Corner Angles"
          >
            Angles
          </button>
        </div>

        {/* SVG Canvas */}
        <div
          className={`w-full max-w-[320px] aspect-square flex items-center justify-center overflow-hidden my-2 ${
            onMaximize2DPlane ? 'cursor-pointer group' : ''
          }`}
          onClick={onMaximize2DPlane}
          title={onMaximize2DPlane ? 'Click to open Maximized 2D Plane' : undefined}
          dangerouslySetInnerHTML={{
            __html: generatePolyShapeSVG(analysis, {
              width: 300,
              height: 300,
              showVertices: showVertexLabels,
              showLengths: showEdgeLengths,
              showAngles: showAngleLabels,
              showAxes: true,
              darkMode: !isLightMode,
            }),
          }}
        />

        <div
          className={`w-full flex items-center justify-between text-[11px] pt-1 border-t font-mono ${
            isLightMode ? 'border-stone-200 text-stone-500' : 'border-slate-800 text-slate-400'
          }`}
        >
          <span>{analysis.sideCount} Edges / Vertices</span>
          <span>{analysis.isRegular ? 'Regular' : analysis.isEquilateral ? 'Equilateral' : 'Irregular'}</span>
          {analysis.isSelfIntersecting && (
            <span className={isLightMode ? 'text-rose-600 font-semibold' : 'text-rose-400 font-semibold'}>
              Self-Intersecting
            </span>
          )}
        </div>
      </div>

      {/* Mathematical Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div
          className={`p-2 rounded-lg border shadow-xs ${
            isLightMode ? 'bg-white border-stone-200' : 'bg-slate-800/50 border-slate-700/50'
          }`}
        >
          <span className={`text-[10px] font-mono uppercase tracking-wider block ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            Sides (n)
          </span>
          <span className={`text-base font-bold font-mono ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
            {analysis.sideCount}
          </span>
          <span className={`text-[10px] block mt-0.5 ${isLightMode ? 'text-amber-800' : 'text-amber-400/80'}`}>
            {analysis.isEquilateral ? 'Equal edges' : 'Varied edges'}
          </span>
        </div>

        <div
          className={`p-2 rounded-lg border shadow-xs ${
            isLightMode ? 'bg-white border-stone-200' : 'bg-slate-800/50 border-slate-700/50'
          }`}
        >
          <span className={`text-[10px] font-mono uppercase tracking-wider block ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            Perimeter
          </span>
          <span className={`text-base font-bold font-mono ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
            {analysis.perimeter.toFixed(4)}
          </span>
          <span className={`text-[10px] block mt-0.5 ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            avg: {(analysis.perimeter / analysis.sideCount).toFixed(4)}
          </span>
        </div>

        <div
          className={`p-2 rounded-lg border shadow-xs ${
            isLightMode ? 'bg-white border-stone-200' : 'bg-slate-800/50 border-slate-700/50'
          }`}
        >
          <span className={`text-[10px] font-mono uppercase tracking-wider block ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            Planar Area
          </span>
          <span className={`text-base font-bold font-mono ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
            {analysis.area.toFixed(4)}
          </span>
          <span className={`text-[10px] block mt-0.5 ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            Shoelace metric
          </span>
        </div>

        <div
          className={`p-2 rounded-lg border shadow-xs ${
            isLightMode ? 'bg-white border-stone-200' : 'bg-slate-800/50 border-slate-700/50'
          }`}
        >
          <span className={`text-[10px] font-mono uppercase tracking-wider block ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            Plane Dist.
          </span>
          <span className={`text-base font-bold font-mono ${isLightMode ? 'text-stone-900' : 'text-slate-100'}`}>
            {analysis.planeDistance.toFixed(4)}
          </span>
          <span className={`text-[10px] block mt-0.5 ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            from origin (0,0,0)
          </span>
        </div>
      </div>

      {/* Detailed Geometric Properties Accordion / Table */}
      <div
        className={`p-3 rounded-lg border text-xs space-y-1.5 font-mono shadow-xs ${
          isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-800/40 border-slate-700/50'
        }`}
      >
        <div
          className={`flex items-center justify-between font-sans font-semibold text-xs border-b pb-1.5 ${
            isLightMode ? 'border-stone-200 text-stone-800' : 'border-slate-700/50 text-slate-300'
          }`}
        >
          <span>Face Dimensions & Coordinates</span>
          <span className={`text-[11px] font-mono ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
            3D Vertex IDs: [{analysis.vertexIndices.join(', ')}]
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <div>
            <span className={isLightMode ? 'text-stone-500' : 'text-slate-400'}>Edge Lengths: </span>
            <span className={isLightMode ? 'text-stone-800 font-semibold' : 'text-slate-200'}>
              {analysis.edgeLengths.map(l => l.toFixed(3)).join(', ')}
            </span>
          </div>
          <div>
            <span className={isLightMode ? 'text-stone-500' : 'text-slate-400'}>Corner Angles: </span>
            <span className={isLightMode ? 'text-stone-800 font-semibold' : 'text-slate-200'}>
              {analysis.interiorAnglesDeg.map(a => `${a.toFixed(1)}°`).join(', ')}
            </span>
          </div>
          <div className="col-span-2">
            <span className={isLightMode ? 'text-stone-500' : 'text-slate-400'}>Face Normal (3D): </span>
            <span className={isLightMode ? 'text-amber-800 font-semibold' : 'text-amber-300'}>
              ({analysis.planeNormal.map(n => n.toFixed(4)).join(', ')})
            </span>
          </div>
          <div className="col-span-2">
            <span className={isLightMode ? 'text-stone-500' : 'text-slate-400'}>Plane Equation: </span>
            <span className={isLightMode ? 'text-amber-800 font-semibold' : 'text-amber-300'}>
              {analysis.planeNormal[0].toFixed(3)}x + {analysis.planeNormal[1].toFixed(3)}y + {analysis.planeNormal[2].toFixed(3)}z = {analysis.planeDistance.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Get Poly Shape Export Tabs (Coding & Formats) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLightMode ? 'text-stone-800' : 'text-slate-200'}`}>
            <FileCode className={`w-3.5 h-3.5 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`} />
            Export Data
          </span>
          <div
            className={`flex items-center gap-0.5 p-0.5 rounded-md border text-[11px] ${
              isLightMode ? 'bg-stone-100 border-stone-200' : 'bg-slate-800 border-slate-700'
            }`}
          >
            <button
              onClick={() => setExportTab('coordinates')}
              className={`px-2 py-0.5 rounded transition-colors ${
                exportTab === 'coordinates'
                  ? isLightMode
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'bg-amber-500 text-slate-950 font-semibold'
                  : isLightMode
                    ? 'text-stone-600 hover:text-stone-900'
                    : 'text-slate-400'
              }`}
            >
              2D Points
            </button>
            <button
              onClick={() => setExportTab('svg')}
              className={`px-2 py-0.5 rounded transition-colors ${
                exportTab === 'svg'
                  ? isLightMode
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'bg-amber-500 text-slate-950 font-semibold'
                  : isLightMode
                    ? 'text-stone-600 hover:text-stone-900'
                    : 'text-slate-400'
              }`}
            >
              SVG
            </button>
            <button
              onClick={() => setExportTab('off')}
              className={`px-2 py-0.5 rounded transition-colors ${
                exportTab === 'off'
                  ? isLightMode
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'bg-amber-500 text-slate-950 font-semibold'
                  : isLightMode
                    ? 'text-stone-600 hover:text-stone-900'
                    : 'text-slate-400'
              }`}
            >
              .OFF
            </button>
            <button
              onClick={() => setExportTab('obj')}
              className={`px-2 py-0.5 rounded transition-colors ${
                exportTab === 'obj'
                  ? isLightMode
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'bg-amber-500 text-slate-950 font-semibold'
                  : isLightMode
                    ? 'text-stone-600 hover:text-stone-900'
                    : 'text-slate-400'
              }`}
            >
              .OBJ
            </button>
          </div>
        </div>

        <div
          className={`relative rounded-lg p-3 border font-mono text-[11px] max-h-44 overflow-y-auto shadow-xs ${
            isLightMode
              ? 'bg-stone-50 border-stone-200 text-stone-800'
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}
        >
          {exportTab === 'coordinates' && (
            <div className="space-y-2">
              <pre>{getCoordinatesCode()}</pre>
              <div className={`pt-2 border-t text-[10px] ${isLightMode ? 'border-stone-200 text-stone-500' : 'border-slate-800 text-slate-400'}`}>
                <pre>{getPythonCoordsCode()}</pre>
              </div>
            </div>
          )}

          {exportTab === 'svg' && (
            <pre className={`whitespace-pre-wrap break-all ${isLightMode ? 'text-amber-900' : 'text-amber-300/90'}`}>
              {generatePolyShapeSVG(analysis, { width: 400, height: 400, darkMode: !isLightMode })}
            </pre>
          )}

          {exportTab === 'off' && (
            <pre className="whitespace-pre-wrap">{polyhedron.rawOff || ''}</pre>
          )}

          {exportTab === 'obj' && (
            <pre className="whitespace-pre-wrap">{generateOBJ(polyhedron)}</pre>
          )}

          {/* Floating Copy & Download Buttons (Small) */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              id="copy-shape-data-btn"
              onClick={() => {
                let textToCopy = '';
                if (exportTab === 'coordinates') textToCopy = getCoordinatesCode();
                else if (exportTab === 'svg') textToCopy = generatePolyShapeSVG(analysis, { width: 400, height: 400, darkMode: !isLightMode });
                else if (exportTab === 'off') textToCopy = polyhedron.rawOff || '';
                else if (exportTab === 'obj') textToCopy = generateOBJ(polyhedron);

                copyToClipboard(textToCopy, exportTab);
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs shadow-xs transition-colors ${
                isLightMode
                  ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Copy code to clipboard"
            >
              {copiedFormat === exportTab ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-stone-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {exportTab === 'svg' && (
              <button
                id="download-svg-btn"
                onClick={handleDownloadSVG}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold shadow-xs border transition-colors ${
                  isLightMode
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-500'
                }`}
                title="Download SVG file"
              >
                <Download className="w-3 h-3" />
                <span>SVG</span>
              </button>
            )}

            {exportTab === 'off' && (
              <button
                id="download-off-btn"
                onClick={handleDownloadOFF}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold shadow-xs border transition-colors ${
                  isLightMode
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-500'
                }`}
                title="Download .OFF 3D Model"
              >
                <Download className="w-3 h-3" />
                <span>.OFF</span>
              </button>
            )}

            {exportTab === 'obj' && (
              <button
                id="download-obj-btn"
                onClick={handleDownloadOBJ}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold shadow-xs border transition-colors ${
                  isLightMode
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-500'
                }`}
                title="Download .OBJ 3D Model"
              >
                <Download className="w-3 h-3" />
                <span>.OBJ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
