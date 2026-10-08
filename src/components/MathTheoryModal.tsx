import React from 'react';
import { NoblePolyhedron } from '../types';
import { X, BookOpen, Atom, Calculator, CheckCircle2, ShieldCheck } from 'lucide-react';

interface MathTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  polyhedron: NoblePolyhedron;
  isLightMode?: boolean;
}

export const MathTheoryModal: React.FC<MathTheoryModalProps> = ({
  isOpen,
  onClose,
  polyhedron,
  isLightMode = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div
        className={`relative w-full max-w-2xl rounded-2xl border shadow-xl overflow-hidden flex flex-col max-h-[85vh] transition-colors ${
          isLightMode ? 'bg-white border-stone-200 text-stone-800' : 'bg-slate-900 border-slate-700 text-slate-200'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-800/80 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg border ${
                isLightMode ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-classic-heading">
                Noble Polyhedra Theory & Orbit Data
              </h2>
              <p className={`text-[11px] ${isLightMode ? 'text-stone-500' : 'text-slate-400'}`}>
                Mathematical foundation &amp; geometric analysis of noble polyhedra
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLightMode ? 'text-stone-400 hover:text-stone-700 hover:bg-stone-100' : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-5 overflow-y-auto space-y-4 text-xs ${isLightMode ? 'text-stone-600' : 'text-slate-300'}`}>
          {/* Active Model Theoretical Details */}
          <div
            className={`p-4 rounded-xl border space-y-3 font-mono ${
              isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className={`flex items-center justify-between pb-2 border-b font-sans ${isLightMode ? 'border-stone-200' : 'border-slate-800'}`}>
              <h3 className={`text-sm font-bold font-classic-heading ${isLightMode ? 'text-stone-900' : 'text-amber-300'}`}>
                {polyhedron.id} (Orbit: {polyhedron.orbit}, {polyhedron.dof} DoF)
              </h3>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono ${
                  isLightMode ? 'bg-stone-200 text-stone-700' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Genus: {polyhedron.genus} | &chi; = {polyhedron.eulerChar}
              </span>
            </div>

            {polyhedron.coordinatesDesc && (
              <div>
                <span className="text-[11px] text-slate-400 block font-sans font-semibold mb-1">
                  Orbit Vertex Coordinates Formula:
                </span>
                <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-200 whitespace-pre-wrap">
                  {polyhedron.coordinatesDesc}
                </pre>
              </div>
            )}

            {polyhedron.polynomialDesc && (
              <div>
                <span className="text-[11px] text-slate-400 block font-sans font-semibold mb-1">
                  Minimal Polynomial & Parameter Roots:
                </span>
                <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 whitespace-pre-wrap">
                  {polyhedron.polynomialDesc}
                </pre>
              </div>
            )}
          </div>

          {/* Educational Explanation */}
          <div className="space-y-3 font-sans leading-relaxed">
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <Atom className="w-4 h-4 text-amber-400" />
              What is a Noble Polyhedron?
            </h4>
            <p>
              A polyhedron is <strong>noble</strong> if it is both:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li>
                <strong>Isogonal (vertex-transitive):</strong> For any two vertices $v_i, v_j$, there exists a symmetry of the polyhedron mapping $v_i$ onto $v_j$.
              </li>
              <li>
                <strong>Isohedral (face-transitive):</strong> For any two faces $F_i, F_j$, there exists a symmetry mapping $F_i$ onto $F_j$.
              </li>
            </ul>

            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-slate-200">
              <strong className="text-amber-300">The &ldquo;Poly Shape&rdquo; Principle:</strong> Because all faces are equivalent under symmetry, <strong>every face is congruent to the same fundamental polygon</strong> (the poly shape). This tool extracts and analyzes this fundamental poly shape in 2D and illustrates its arrangement in 3D.
            </div>

            <h4 className="text-sm font-semibold text-slate-100 pt-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-amber-400" />
              Degrees of Freedom (DoF)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <span className="font-bold text-amber-400 block mb-0.5">0 Degrees of Freedom</span>
                <p className="text-[11px] text-slate-400">
                  Fixed coordinates (Platonic &amp; Keplerian symmetries like T, O, C, CO, I, D, ID).
                </p>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <span className="font-bold text-amber-400 block mb-0.5">1 Degree of Freedom</span>
                <p className="text-[11px] text-slate-400">
                  Orbits defined by one continuous parameter $a$, fixed by roots of minimal polynomials.
                </p>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <span className="font-bold text-amber-400 block mb-0.5">2 Degrees of Freedom</span>
                <p className="text-[11px] text-slate-400">
                  Orbits defined by two parameters $(a, b)$, producing intricate geometric families.
                </p>
              </div>
            </div>

            {/* Copyright & Creator Attribution Section */}
            <div
              className={`p-3.5 rounded-xl border space-y-1.5 ${
                isLightMode ? 'bg-amber-50/60 border-amber-200/80' : 'bg-slate-900/90 border-amber-500/30'
              }`}
            >
              <h4 className={`text-xs font-bold font-classic-heading flex items-center gap-1.5 ${
                isLightMode ? 'text-amber-950' : 'text-amber-300'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                Copyright &amp; Ownership Statement
              </h4>
              <p className={`text-[11px] font-medium leading-relaxed ${isLightMode ? 'text-stone-800' : 'text-slate-200'}`}>
                © 2026 <strong>Webtigo</strong>. All rights reserved. All copyrights belong to Webtigo.
              </p>
              <p className={`text-[11px] leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-slate-400'}`}>
                Created by <strong>Member of Multiverse (Aaditya Wahal)</strong>. Powered by <strong>Webtigo Group</strong>.
              </p>
            </div>

            {/* Acknowledgements Section */}
            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <h4 className={`text-xs font-bold font-classic-heading flex items-center gap-1.5 ${
                isLightMode ? 'text-stone-900' : 'text-amber-300'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                Discovery Initiative &amp; Mathematical Acknowledgements
              </h4>
              <p className={`text-[11px] leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-slate-400'}`}>
                Special acknowledgment to <strong>Akshat Wahal</strong> (brother of Aaditya Wahal / Member of Multiverse), who conceived the original initiative and shared the vital idea and information that new polyhedra had been discovered. The initiative was his, inspiring the creation and 3D architectural realization by Member of Multiverse (Aaditya Wahal).
              </p>
              <p className={`text-[11px] leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-slate-400'}`}>
                Credit and appreciation to <strong>Plasmath</strong> for discovering and systematically solving the modern 2-degree-of-freedom noble polyhedral parameter systems, advancing the classical geometric foundations established by Branko Grünbaum, Peter McMullen, and historical polyhedral geometers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-sans">
            Noble Polyhedra Studio • Part of <strong>Webtigo Group</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
