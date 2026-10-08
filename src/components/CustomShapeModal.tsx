import React, { useState } from 'react';
import { NoblePolyhedron } from '../types';
import { parseOFF } from '../utils/polyGeometry';
import { X, Upload, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';

interface CustomShapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCustomModel: (model: NoblePolyhedron) => void;
}

const SAMPLE_PRESETS: Record<string, { name: string; off: string }> = {
  octahedron: {
    name: 'Regular Octahedron (O-1)',
    off: `OFF
6 8 0
0.0 0.0 1.41421356
0.0 1.41421356 0.0
1.41421356 0.0 0.0
-1.41421356 0.0 0.0
0.0 -1.41421356 0.0
0.0 0.0 -1.41421356
3 0 1 2
3 0 2 4
3 1 2 5
3 5 3 1
3 3 0 4
3 3 4 5
3 1 3 0
3 2 5 4`,
  },
  great_dodecahedron: {
    name: 'Small Stellated / Noble Facet (tC-1.1)',
    off: `OFF
24 24 0
1.0 1.0 2.41421356
-1.0 1.0 2.41421356
-1.0 -1.0 2.41421356
1.0 -1.0 2.41421356
1.0 2.41421356 1.0
-1.0 2.41421356 1.0
-1.0 2.41421356 -1.0
1.0 2.41421356 -1.0
2.41421356 1.0 1.0
2.41421356 -1.0 1.0
2.41421356 -1.0 -1.0
2.41421356 1.0 -1.0
-2.41421356 1.0 1.0
-2.41421356 1.0 -1.0
-2.41421356 -1.0 -1.0
-2.41421356 -1.0 1.0
1.0 -2.41421356 1.0
-1.0 -2.41421356 1.0
-1.0 -2.41421356 -1.0
1.0 -2.41421356 -1.0
1.0 1.0 -2.41421356
-1.0 1.0 -2.41421356
-1.0 -1.0 -2.41421356
1.0 -1.0 -2.41421356
3 0 1 4
3 1 2 12
3 2 3 17
3 3 0 9
3 4 5 1
3 5 6 13
3 6 7 21
3 7 4 8
3 8 9 0
3 9 10 23
3 10 11 20
3 11 8 4
3 12 13 5
3 13 14 21
3 14 15 18
3 15 12 2
3 16 17 2
3 17 18 14
3 18 19 22
3 19 16 10
3 20 21 7
3 21 22 19
3 22 23 10
3 23 20 11`,
  },
  star_pentagon: {
    name: 'Pentagram Facet Star Noble (D-1)',
    off: `OFF
12 12 0
0.0 0.6180339887 1.6180339887
0.0 -0.6180339887 1.6180339887
0.0 0.6180339887 -1.6180339887
0.0 -0.6180339887 -1.6180339887
1.6180339887 0.0 0.6180339887
-1.6180339887 0.0 0.6180339887
1.6180339887 0.0 -0.6180339887
-1.6180339887 0.0 -0.6180339887
0.6180339887 1.6180339887 0.0
-0.6180339887 1.6180339887 0.0
0.6180339887 -1.6180339887 0.0
-0.6180339887 -1.6180339887 0.0
5 0 8 4 10 1
5 0 1 5 11 9
5 2 3 7 11 9
5 2 8 6 10 3
5 4 0 9 5 10
5 4 6 2 8 0
5 6 4 10 11 7
5 6 7 3 10 4
5 8 2 7 9 0
5 8 0 1 11 2
5 10 1 5 7 6
5 11 9 5 1 3`,
  },
};

export const CustomShapeModal: React.FC<CustomShapeModalProps> = ({
  isOpen,
  onClose,
  onLoadCustomModel,
}) => {
  const [inputText, setInputText] = useState(SAMPLE_PRESETS.octahedron.off);
  const [modelName, setModelName] = useState('Custom Polyhedron');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModelName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleLoad = () => {
    try {
      const parsed = parseOFF(inputText);
      if (parsed.vertices.length < 3 || parsed.faces.length < 1) {
        throw new Error('OFF file must contain at least 3 vertices and 1 face.');
      }

      const faceSides = parsed.faces[0]?.length || 3;
      const nv = parsed.vertices.length;
      const nf = parsed.faces.length;
      const ne = parsed.numEdges;
      const chi = nv - ne + nf;
      const genus = (2 - chi) / 2;

      const customPoly: NoblePolyhedron = {
        id: modelName || 'Custom-1',
        dof: 0,
        orbit: 'Custom',
        numVertices: nv,
        numFaces: nf,
        numEdges: ne,
        faceSides,
        eulerChar: chi,
        genus,
        vertices: parsed.vertices,
        faces: parsed.faces,
        rawOff: inputText,
        coordinatesDesc: `Custom user imported model with ${nv} vertices and ${nf} faces.`,
      };

      onLoadCustomModel(customPoly);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse OFF data. Please verify OFF format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Input Custom Poly Shape / OFF Model
              </h2>
              <p className="text-xs text-slate-400">
                Paste raw .OFF data or upload a file to extract its polyhedral face shapes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Presets:</span>
            {Object.entries(SAMPLE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => {
                  setInputText(preset.off);
                  setModelName(preset.name);
                  setErrorMsg(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
              >
                {preset.name}
              </button>
            ))}

            <label className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload .OFF File
              <input
                type="file"
                accept=".off,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Model Name / Identifier
            </label>
            <input
              type="text"
              value={modelName}
              onChange={e => setModelName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              placeholder="e.g. Custom-Poly-1"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center justify-between">
              <span>OFF Format Text (Vertices + Faces)</span>
              <span className="text-slate-500 font-normal">Header: OFF, then V F E, then coords & faces</span>
            </label>
            <textarea
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                setErrorMsg(null);
              }}
              rows={10}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-slate-300 focus:outline-none focus:border-amber-500 resize-none shadow-inner"
              placeholder="OFF&#10;8 6 0&#10;1 1 1&#10;..."
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-800/80 border-t border-slate-700/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            id="load-custom-poly-btn"
            onClick={handleLoad}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-md transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Parse & Get Poly Shape
          </button>
        </div>
      </div>
    </div>
  );
};
