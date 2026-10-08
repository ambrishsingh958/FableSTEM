import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Lock, Sparkles, AlertCircle, X, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<'safety' | 'privacy' | 'about' | null>(null);

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Fable<span className="text-indigo-400">STEM</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-sm">
              Where stories ignite STEM curiosity. Teaching science, math, and school concepts through stories children never want to stop reading.
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>No account required. We don't ask for personal information.</span>
            </p>
          </div>

          {/* Guidelines & Safety */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-3">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setModalContent('safety')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Child-Safe Filtering
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalContent('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Zero Data Storage Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalContent('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pedagogical Framework
                </button>
              </li>
            </ul>
          </div>

          {/* AI Powered */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-3">
              Built With
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Gemini AI</span>
              </li>
              <li>
                <span className="text-slate-400">Model: gemini-3.8-flash</span>
              </li>
              <li>
                <span className="text-slate-400">Framework: React 19 + Express</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Disclaimer & Copyright */}
        <div className="space-y-4 text-xs text-slate-500">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5 text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>AI & Education Disclaimer:</strong> FableSTEM uses Gemini AI to craft engaging stories and comprehension quizzes. AI can occasionally make mistakes — check important school information with a teacher or trusted educational resource.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left pt-2">
            <p>© {new Date().getFullYear()} FableSTEM. Designed for children, learners, parents, and educators worldwide.</p>
            <p className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for curious minds</span>
            </p>
          </div>
        </div>
      </div>

      {/* Safety / Privacy Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {modalContent === 'safety' && (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  Child Safety & Guardrails
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Story Teacher is built with multiple safety layers specifically for young learners:
                </p>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>Active Content Filtering:</strong> Unsafe topics (violence, hate, weapons, adult themes) are automatically detected and politely redirected to safe school-friendly topics.</li>
                  <li><strong>Strict Story-Only Quizzes:</strong> Comprehension questions are bound solely to the generated story, ensuring safe, focused learning.</li>
                  <li><strong>Kind Teacher Tone:</strong> AI evaluation is strictly prompted to praise before correcting, maintaining positive reinforcement.</li>
                </ul>
              </div>
            )}

            {modalContent === 'privacy' && (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  Privacy Policy & Student Safety
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We believe educational tools for children must respect privacy by default:
                </p>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>No Account Required:</strong> Anyone can read and take quizzes without entering a name, email, password, or school ID.</li>
                  <li><strong>Zero Personal Data:</strong> We do not ask for or collect names, addresses, or phone numbers.</li>
                  <li><strong>Local History:</strong> Your saved stories and quiz progress exist exclusively in your browser's private local storage.</li>
                </ul>
              </div>
            )}

            {modalContent === 'about' && (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  Our Pedagogical Framework
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Story Teacher is rooted in narrative learning theory — that humans remember complex concepts much better when experienced through stories rather than rote memorization:
                </p>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>Age Adaptation:</strong> 5–7 focuses on sensory repetition; 8–10 on exploration; 11–14 on cause and effect; 15+ on real-world systems.</li>
                  <li><strong>Immediate Retrieval Practice:</strong> Comprehension quizzes solidify learning immediately after reading.</li>
                  <li><strong>Encouraging Evaluation:</strong> Learning thrives on curiosity, not criticism.</li>
                </ul>
              </div>
            )}

            <button
              onClick={() => setModalContent(null)}
              className="mt-6 w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
