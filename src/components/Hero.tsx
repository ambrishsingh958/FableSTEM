import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Compass, Trophy, HeartHandshake, ShieldCheck, Stars, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning, onExploreDemo }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20">
      {/* Decorative gradient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-amber-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Child Safety & Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-indigo-50 border border-indigo-200/80 text-indigo-800 shadow-2xs mb-6 hover:bg-indigo-100 transition-colors">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>FableSTEM • Child-Safe • Where Stories Ignite STEM Curiosity</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Hero Title & Tagline */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
          Kids find science & math boring.{' '}
          <span className="block mt-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-600 bg-clip-text text-transparent">
            They never get tired of stories.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed mb-8">
          <strong>FableSTEM</strong> teaches any school concept through a story a child won't want to stop reading — and checks whether they truly understood through interactive quizzes and book recommendations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-300/60 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Try Quick Demo</span>
          </button>
        </div>

        {/* Hero Visual Card */}
        <div className="relative max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-white to-indigo-50/50 p-4 sm:p-7 border border-indigo-100 shadow-xl shadow-indigo-100/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Visual illustration element */}
            <div className="relative flex items-center justify-center w-full sm:w-1/2 py-4">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-300">
                <BookOpen className="w-24 h-24 text-white/95 animate-float" />
                <div className="absolute top-3 right-3 p-2 bg-amber-400 rounded-2xl shadow-md text-amber-950">
                  <Stars className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="absolute -bottom-2 -left-2 px-3 py-1 bg-white rounded-full shadow-md text-xs font-bold text-indigo-700 border border-indigo-100 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 100% Tailored
                </div>
              </div>
            </div>

            {/* Quick Benefits list */}
            <div className="w-full sm:w-1/2 text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Personalized by Age</h4>
                  <p className="text-xs text-slate-600">From gentle picture-tales (Age 5–7) to deep analytical stories (Age 15+).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-indigo-100 text-indigo-700 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Multilingual Learning</h4>
                  <p className="text-xs text-slate-600">Learn in English, Hindi (हिंदी), Tamil (தமிழ்) and more.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-amber-100 text-amber-700 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Strict Story-Only Quizzes</h4>
                  <p className="text-xs text-slate-600">Every quiz question is verifiable directly from the story text.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-purple-100 text-purple-700 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Kind Teacher Feedback</h4>
                  <p className="text-xs text-slate-600">Praising effort first, explaining misconceptions with gentle hints.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step "How It Works" Section */}
        <div id="how-it-works-section" className="mt-20 pt-10 border-t border-indigo-100">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              The Learning Cycle
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              How FableSTEM Works
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Four simple steps from curiosity to true mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 rounded-md bg-indigo-50">01</span>
                <Compass className="w-5 h-5 text-indigo-500 group-hover:rotate-45 transition-transform" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1">Choose</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose any topic you want to learn, select your age group, language, and preferred story length.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-violet-600 px-2 py-0.5 rounded-md bg-violet-50">02</span>
                <BookOpen className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1">Discover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini creates a captivating story tailored for your vocabulary level, plus listen aloud with built-in voice.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-amber-600 px-2 py-0.5 rounded-md bg-amber-50">03</span>
                <Trophy className="w-5 h-5 text-amber-500 group-hover:bounce transition-transform" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1">Play</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Answer an interactive 5-question comprehension quiz generated strictly from what was taught in the story.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50">04</span>
                <HeartHandshake className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1">Grow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get your instant score and kind, encouraging AI feedback that explains mistakes and celebrates your curiosity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
