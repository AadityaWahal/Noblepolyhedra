import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Cookie,
  Info,
  Mail,
  X,
  ExternalLink,
  Lock,
  Globe,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'cookies' | 'about' | 'contact';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  isLightMode?: boolean;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
  isLightMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isLightMode
            ? 'bg-white border-stone-200 text-stone-900 shadow-stone-900/10'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/40'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg font-classic-heading tracking-wide truncate">
                Legal, Privacy &amp; Editorial Transparency
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                Noble Polyhedra &bull; Webtigo Group &bull; Updated October 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-transparent hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            title="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-stone-200 dark:border-slate-800 px-4 sm:px-6 bg-stone-50/70 dark:bg-slate-950/40 text-xs font-medium overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold shrink-0 ${
              activeTab === 'privacy'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold shrink-0 ${
              activeTab === 'terms'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold shrink-0 ${
              activeTab === 'cookies'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold shrink-0 ${
              activeTab === 'about'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Us &amp; Team</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all font-semibold shrink-0 ${
              activeTab === 'contact'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact &amp; Support</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 scrollbar-thin space-y-6 text-xs sm:text-[13px] leading-relaxed">
          {/* TAB 1: PRIVACY POLICY (GOOGLE ADSENSE COMPLIANT) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
                <strong>Google AdSense Compliance Notice:</strong> This privacy policy explains how <strong>Noble Polyhedra</strong> (published by Webtigo Group) collects, uses, and protects visitor information, including third-party advertising cookies served via Google AdSense.
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  1. Information We Collect
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  We collect minimal data necessary to deliver interactive 3D mathematical simulations and user personalization:
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-slate-300 pl-2">
                  <li><strong>Local Storage Data:</strong> We store client-side preferences (such as dark/light display mode, active shading theme, and bookmarked/favorited 3D shapes) directly in your browser's local storage.</li>
                  <li><strong>Optional Account Data:</strong> If you sign in via Clerk, we receive your email and public profile name to synchronize bookmarks across devices.</li>
                  <li><strong>Server Log Files:</strong> Like standard web hosts, our serverless hosting infrastructure (Vercel) automatically logs IP addresses, browser types, internet service providers (ISPs), date/time stamps, referring/exit pages, and click counts for operational analytics and security.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  2. Google AdSense &amp; Advertising Cookies
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  Third-party vendors, including <strong>Google</strong>, use cookies to serve ads based on a user's prior visits to our website or other websites on the internet.
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-slate-300 pl-2">
                  <li>Google's use of advertising cookies enables it and its partners to serve personalized ads to you based on your visits to <strong>noblepolyhedra.vercel.app</strong> and/or other sites on the Internet.</li>
                  <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold inline-flex items-center gap-1">Google Ads Settings <ExternalLink className="w-3 h-3" /></a>.</li>
                  <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold inline-flex items-center gap-1">www.aboutads.info <ExternalLink className="w-3 h-3" /></a>.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  3. Cookies and Web Beacons
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  Noble Polyhedra uses cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize web page content based on visitors' browser type or other information.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  4. Third-Party Privacy Policies
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  Noble Polyhedra's Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of third-party ad servers such as Google AdSense for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  5. GDPR &amp; CCPA Privacy Rights
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), users have the right to request access to their personal data, request rectification or erasure of their personal information, and restrict or object to data processing. If you make a request, we will respond within one calendar month.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  6. Children's Information (COPPA)
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  Noble Polyhedra is an educational mathematics resource. We do not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child provided this information on our website, please contact us immediately and we will promptly remove such information from our records.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  1. Acceptance of Terms
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  By accessing and using <strong>Noble Polyhedra</strong> (noblepolyhedra.vercel.app), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  2. Intellectual Property &amp; Copyright Ownership
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  All copyrights to the digital platform, 3D rendering pipeline, code, and catalog layout are held by <strong>Webtigo</strong> and powered by <strong>Webtigo Group</strong>.
                </p>
                <p className="text-stone-600 dark:text-slate-300">
                  The creator and lead architect of the application is <strong>Member of Multiverse (Aaditya Wahal)</strong>. The initiative and initial idea to catalog the newly discovered polyhedra was sparked by <strong>Akshat Wahal</strong> (brother of Aaditya Wahal).
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  3. Educational &amp; Academic Fair Use
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  Permission is granted to view, inspect, and analyze 3D geometric models for personal, educational, scientific, and academic research purposes. You may cite this catalog in academic publications and classrooms with appropriate attribution:
                </p>
                <div className="p-3 rounded-lg bg-stone-100 dark:bg-slate-950 font-mono text-xs border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  Aaditya Wahal &amp; Webtigo Group. &quot;Noble Polyhedra: Interactive 3D Solid Shape Studio.&quot; (2026). https://noblepolyhedra.vercel.app
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  4. Disclaimer of Warranties
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  The 3D models and geometric formulas on this website are provided &quot;as is&quot; for educational and computational geometry visualization. While we rigorously test vertex coordinates, face plans, and symmetry orbits against published literature, Webtigo Group makes no warranties, expressed or implied, regarding commercial merchantability or fitness for manufacturing.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  What Are Cookies?
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  Cookies are tiny files downloaded to your computer or mobile device to improve your experience. This policy describes what information they gather, how we use it, and why we sometimes need to store these cookies.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  Cookies We Use
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`p-3.5 rounded-xl border ${isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-amber-600 mb-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Strictly Essential</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400">
                      Stores dark/light mode preference and active 3D camera settings so the UI renders smoothly.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-blue-600 mb-1">
                      <Cookie className="w-3.5 h-3.5" />
                      <span>User Favorites &amp; Bookmarks</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400">
                      Stores your saved polyhedra study list and Clerk authentication token if you sign in.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-600 mb-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Google AdSense</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400">
                      Third-party advertising cookies used by Google to serve relevant ads and measure ad performance.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  Disabling Cookies
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  You can prevent the setting of cookies by adjusting your browser settings (see your browser Help for instructions). Note that disabling cookies will disable the functionality and features of this and many other websites.
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: ABOUT US & EDITORIAL TEAM */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  About Noble Polyhedra &amp; Mission
                </h4>
                <p className="text-stone-600 dark:text-slate-300">
                  <strong>Noble Polyhedra</strong> is an open scientific and educational platform providing a complete, interactive 3D WebGL atlas of all <strong>146 noble polyhedra</strong>.
                </p>
                <p className="text-stone-600 dark:text-slate-300">
                  In geometry, a <strong>noble polyhedron</strong> is a 3D solid figure that is simultaneously <strong>isogonal</strong> (all vertices are transitive under the symmetry group) and <strong>isohedral</strong> (all faces are transitive under the symmetry group).
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className={`p-4 rounded-xl border ${isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs uppercase tracking-wider font-classic-heading">Creator &amp; Lead Architect</span>
                  </div>
                  <p className="font-semibold text-sm text-amber-700 dark:text-amber-400">
                    Member of Multiverse (Aaditya Wahal)
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Designed and authored the 3D WebGL visualization studio, facet normal extraction algorithms, interactive multi-grid filters, and geometric database.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs uppercase tracking-wider font-classic-heading">Initiative &amp; Discovery Lead</span>
                  </div>
                  <p className="font-semibold text-sm text-amber-700 dark:text-amber-400">
                    Akshat Wahal
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Brother of Aaditya Wahal. He was the one who provided the initial initiative and research indicating that new continuous families of noble polyhedra were discovered in modern mathematics.
                  </p>
                </div>
              </div>

              <section className="space-y-2 pt-2">
                <h4 className="font-bold text-sm sm:text-base font-classic-heading text-amber-700 dark:text-amber-400">
                  Scientific Foundations &amp; Literature
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-stone-600 dark:text-slate-300 pl-2">
                  <li><strong>Branko Grünbaum (1999):</strong> <em>&quot;Are your polyhedra the same as my polyhedra?&quot;</em> &mdash; Established the modern rigorous definitions of polyhedra with self-intersecting faces and classified 0-DoF and 1-DoF families.</li>
                  <li><strong>Stevanović et al. (2020):</strong> <em>&quot;Continuous families of noble polyhedra with two degrees of freedom&quot;</em> &mdash; Discovered previously unknown continuous 2-DoF families with tetrahedral, octahedral, and icosahedral symmetry.</li>
                </ul>
              </section>
            </div>
          )}

          {/* TAB 5: CONTACT & SUPPORT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 text-xs">
                <div className="font-bold text-sm text-amber-900 dark:text-amber-200 mb-1">
                  We Welcome Academic Inquiries, Feedback &amp; Contributions
                </div>
                <p className="text-stone-700 dark:text-slate-300">
                  Whether you are a mathematician, educator, student, or researcher, we would love to hear from you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl border space-y-2 ${isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider font-classic-heading">
                    <Mail className="w-4 h-4" />
                    <span>Publisher &amp; General Support</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-slate-300">
                    For website feedback, copyright inquiries, or advertising partnership questions:
                  </p>
                  <p className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">
                    somiwahal6287@gmail.com
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Organization: Webtigo Group
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${isLightMode ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider font-classic-heading">
                    <Globe className="w-4 h-4" />
                    <span>Editorial &amp; Mathematics Team</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-slate-300">
                    To report coordinate discrepancies, submit geometric models, or discuss scientific citations:
                  </p>
                  <p className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">
                    aaditya.wahal@webtigo.org
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Lead: Member of Multiverse (Aaditya Wahal)
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isLightMode ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'}`}>
                <h4 className="font-bold text-xs uppercase tracking-wider font-classic-heading text-stone-700 dark:text-slate-300">
                  Response Commitment
                </h4>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  We typically respond to academic and user inquiries within 24 to 48 business hours. For urgent bug reports regarding 3D WebGL rendering performance on specific devices or mobile browsers, please include your browser and operating system version.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-slate-400 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>AdSense &amp; GDPR Compliant Legal Documentation</span>
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
