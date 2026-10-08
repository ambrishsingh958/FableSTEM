import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Printer,
  Sparkles,
  Heart,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { EvaluationResult, QuizQuestion, StoryData } from '../types';
import { SuggestedResources } from './SuggestedResources';

interface ResultViewProps {
  evaluation: EvaluationResult;
  questions: QuizQuestion[];
  userAnswers: Record<number, string>;
  storyData: StoryData;
  onReadStoryAgain: () => void;
  onNewStory: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  evaluation,
  questions,
  userAnswers,
  storyData,
  onReadStoryAgain,
  onNewStory,
}) => {
  const percentage = Math.round((evaluation.score / evaluation.total) * 100);

  // Trigger celebration confetti if score is great
  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#f59e0b', '#10b981', '#8b5cf6'],
        });
      } catch (e) {
        // Fallback gracefully if canvas-confetti is unavailable
      }
    }
  }, [percentage]);

  const getScoreHeadline = () => {
    if (percentage === 100) return 'Perfect Score! 🏆 Outstanding!';
    if (percentage >= 80) return 'Great Job! 🌟 You Understood It So Well!';
    if (percentage >= 60) return 'Good Effort! 👏 You Learned a Lot!';
    return 'Nice Try! 🌱 Keep Exploring & Growing!';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 animate-fade-in">
      {/* Celebration Score Hero Card */}
      <div className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl shadow-indigo-300/40 relative overflow-hidden mb-10">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider mb-5 shadow-sm">
            <Trophy className="w-4 h-4" />
            <span>Comprehension Complete</span>
          </div>

          {/* Large Circular Score Indicator */}
          <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-indigo-700/60" />
            <div
              className="absolute inset-0 rounded-full border-8 border-amber-400 border-t-transparent -rotate-45 transition-all duration-1000"
              style={{
                borderColor: percentage >= 80 ? '#fbbf24' : percentage >= 60 ? '#34d399' : '#f87171',
              }}
            />
            <div className="text-center">
              <span className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-white block">
                {evaluation.score}
                <span className="text-2xl text-indigo-300">/{evaluation.total}</span>
              </span>
              <span className="text-xs font-bold text-amber-300 block">{percentage}% Mastery</span>
            </div>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mb-3">
            {getScoreHeadline()}
          </h1>

          {/* AI Teacher's Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-sm sm:text-base leading-relaxed text-center font-medium">
            <p className="flex items-center justify-center gap-2 mb-1 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Story Teacher's Feedback:
            </p>
            "{evaluation.summary}"
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 no-print">
            <button
              onClick={onNewStory}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🔄 Tell Me a New Story</span>
            </button>

            <button
              onClick={onReadStoryAgain}
              className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/30 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 Read Story Again</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              title="Print your quiz certificate & review sheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Result</span>
            </button>
          </div>
        </div>
      </div>

      {/* Per-Question Detailed Review */}
      <div className="space-y-5 mb-10">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-slate-900">
              Question-by-Question Review
            </h2>
            <p className="text-xs text-slate-500">
              See what you mastered and learn from the kind explanations
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {questions.length} Questions Evaluated
          </span>
        </div>

        {questions.map((question, index) => {
          const fb = evaluation.feedback.find((f) => f.id === question.id) || {
            id: question.id,
            correct: false,
            comment: 'Good attempt!',
          };
          const userAnswer = userAnswers[question.id] || '(No answer provided)';
          const isCorrect = fb.correct;
          const isPartial = fb.partial;

          return (
            <div
              key={question.id}
              className={`p-6 rounded-3xl border transition-all ${
                isCorrect
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : isPartial
                  ? 'bg-white border-indigo-200 shadow-xs'
                  : 'bg-white border-amber-200 shadow-xs'
              }`}
            >
              {/* Question Header & Status Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    Q{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 capitalize">
                    {question.type === 'mcq'
                      ? 'Multiple Choice'
                      : question.type === 'tf'
                      ? 'True / False'
                      : 'Short Answer'}
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isPartial
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Correct! 🌟</span>
                    </>
                  ) : isPartial ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Partial Credit ✨</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Almost There! 📖</span>
                    </>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h3 className="font-heading font-bold text-base text-slate-900 mb-3">
                {question.question}
              </h3>

              {/* Learner's Answer vs Correct */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 block mb-1">Your Answer:</span>
                  <span
                    className={`font-semibold ${
                      isCorrect
                        ? 'text-emerald-700'
                        : isPartial
                        ? 'text-indigo-700'
                        : 'text-amber-800'
                    }`}
                  >
                    {userAnswer}
                  </span>
                </div>

                {!isCorrect && (
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="font-bold text-emerald-800 block mb-1">
                      Expected from Story:
                    </span>
                    <span className="font-semibold text-emerald-900">
                      {fb.correct_answer || question.answer}
                    </span>
                  </div>
                )}
              </div>

              {/* Kind AI Feedback Comment */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs sm:text-sm text-indigo-950 flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-900">Teacher's Note: </span>
                  <span>{fb.comment}</span>
                  {question.explanation && (
                    <p className="text-slate-600 mt-1 italic text-xs">
                      Hint from story: "{question.explanation}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Books and Educational Websites */}
      <SuggestedResources
        topic={storyData.topic}
        books={storyData.suggested_books}
        websites={storyData.suggested_websites}
      />

      {/* Bottom Summary Bar */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left no-print">
        <div>
          <h4 className="font-heading font-extrabold text-base text-slate-900">
            Keep the learning adventure going!
          </h4>
          <p className="text-xs text-slate-600">
            Try the same topic with an older age group, or choose an exciting new topic.
          </p>
        </div>
        <button
          onClick={onNewStory}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Choose Next Topic</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
