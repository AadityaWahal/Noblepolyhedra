import React from 'react';
import { NobleModelSummary } from '../types';
import {
  X,
  Sparkles,
  Landmark,
  Compass,
  Layers,
  ArrowRight,
  Play,
  Keyboard,
  Film,
  CheckCircle2,
} from 'lucide-react';

interface DiscoveryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModelId: (id: string) => void;
  onStartAutoTour: () => void;
}

export const DiscoveryGuideModal: React.FC<DiscoveryGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectModelId,
  onStartAutoTour,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Newly Discovered vs. Previously Discovered Polyhedra
              </h2>
              <p className="text-xs text-slate-400">
                How to navigate and step through all 146 noble polyhedra shapes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section 1: The Two Eras of Noble Polyhedra */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              The 146 Noble Polyhedra Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Newly Discovered */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    ✨ Newly Discovered (81)
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    2 DoF
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Discovered and systematically enumerated using 2-parameter algebraic polynomial equation systems.
                </p>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>• <strong>gC Orbit:</strong> 3 shapes</div>
                  <div>• <strong>gD Orbit:</strong> 16 shapes</div>
                  <div>• <strong>sC Orbit:</strong> 12 shapes</div>
                  <div>• <strong>sD Orbit:</strong> 50 shapes</div>
                </div>
                <button
                  onClick={() => {
                    onSelectModelId('gC-1.1');
                    onClose();
                  }}
                  className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Go to First New Shape (gC-1.1)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Previously Discovered */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 flex items-center gap-1.5 text-xs">
                    <Landmark className="w-3.5 h-3.5" />
                    🏛️ Classical (65)
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                    0 & 1 DoF
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Classical polyhedra known from historical literature (Plato, Kepler, Grünbaum, Miklowitz, and Hess).
                </p>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>• <strong>0 DoF Rigid (20):</strong> Platonic solids (T-1, C-1, O-1, D-1, I-1) & star facetings</div>
                  <div>• <strong>1 DoF Families (45):</strong> rC, rD, tC, tD, tI, tO</div>
                </div>
                <button
                  onClick={() => {
                    onSelectModelId('O-1');
                    onClose();
                  }}
                  className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Go to Platonic Octahedron (O-1)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: How to Change Between All of Them */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2.5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              Ways to Step Between Polyhedra ("First this one, then that one")
            </h3>

            <div className="space-y-2 text-slate-300 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">1</div>
                <div>
                  <div className="font-semibold text-slate-100 text-xs">Top Stepper Bar & Keyboard Arrows</div>
                  <div className="text-slate-400">
                    Use the <strong>&lt; Prev</strong> and <strong>Next &gt;</strong> buttons in the bar above the 3D viewer, or press the <kbd className="px-1 py-0.2 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">←</kbd> and <kbd className="px-1 py-0.2 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">→</kbd> arrow keys on your keyboard to instantly step through all 146 shapes in order.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">2</div>
                <div>
                  <div className="font-semibold text-slate-100 text-xs flex items-center gap-1.5">
                    <span>Auto-Tour / Presentation Mode</span>
                    <Play className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="text-slate-400">
                    Click <strong>Auto-Tour</strong> (or press <kbd className="px-1 py-0.2 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">Spacebar</kbd>) to sit back and watch the app cycle through shapes automatically every 3, 5, or 8 seconds.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">3</div>
                <div>
                  <div className="font-semibold text-slate-100 text-xs flex items-center gap-1.5">
                    <span>Floating 3-Shape Carousel</span>
                    <Film className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="text-slate-400">
                    Use the <strong>floating 3-shape dock</strong> at the bottom (Previous, Current, Next) to smoothly browse adjacent shapes with live preview animations.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">4</div>
                <div>
                  <div className="font-semibold text-slate-100 text-xs">Catalog Filter & Quick Search</div>
                  <div className="text-slate-400">
                    Use the catalog on the left to filter specifically to <strong>✨ Newly Discovered (81)</strong> or <strong>🏛️ Classical (67)</strong>, or search by face sides (e.g. 5-gon) and degree of freedom.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-800/80 border-t border-slate-700/80 flex items-center justify-between">
          <button
            onClick={() => {
              onStartAutoTour();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Auto-Tour Mode</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs transition-colors"
          >
            Got it, Let's Explore
          </button>
        </div>
      </div>
    </div>
  );
};
