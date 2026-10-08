import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Check, X, Send, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  storyTitle: string;
  onBackToStory: () => void;
  onSubmitQuiz: (answers: Record<number, string>) => void;
  isSubmitting: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  storyTitle,
  onBackToStory,
  onSubmitQuiz,
  isSubmitting,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;

  const handleSelectAnswer = (ans: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ans,
    }));
    setShowIncompleteAlert(false);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount >= totalQuestions;

  const handleSubmit = () => {
    if (!isAllAnswered) {
      setShowIncompleteAlert(true);
      return;
    }
    onSubmitQuiz(answers);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-20 animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBackToStory}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Story</span>
        </button>

        <div className="text-right">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quiz for:
          </p>
          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
            {storyTitle}
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-3xl border border-indigo-100 p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-base text-slate-900">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {currentQ.type === 'mcq'
                ? 'Multiple Choice'
                : currentQ.type === 'tf'
                ? 'True / False'
                : 'Short Answer'}
            </span>
          </div>

          <span className="text-xs font-bold text-slate-500">
            {answeredCount} / {totalQuestions} answered
          </span>
        </div>

        {/* Step indicator dots & bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined && answers[q.id].trim().length > 0;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex-1 h-full border-r border-white transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600'
                    : isAnswered
                    ? 'bg-emerald-400'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Jump to Question ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Question Selector Pills */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined && answers[q.id].trim().length > 0;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300 ring-2 ring-indigo-300'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Incomplete warning notification */}
      {showIncompleteAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">Almost there!</p>
            <p className="text-xs mt-0.5">
              Please answer all 5 questions before submitting to get your complete score and teacher feedback.
            </p>
          </div>
        </div>
      )}

      {/* Current Question Card */}
      <div className="quiz-card bg-white rounded-3xl border border-indigo-100 p-6 sm:p-9 shadow-xl shadow-indigo-100/40 mb-6">
        <div className="mb-6">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
            Comprehension Check
          </span>
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 mt-1 leading-snug">
            {currentQ.question}
          </h2>
        </div>

        {/* 1. Multiple Choice Options */}
        {currentQ.type === 'mcq' && currentQ.options && (
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelected = answers[currentQ.id] === option;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(option)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {letter}
                  </div>
                  <span className="font-medium text-sm sm:text-base text-slate-800 leading-normal flex-1">
                    {option}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. True / False Options */}
        {currentQ.type === 'tf' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['True', 'False'].map((val) => {
              const isSelected = answers[currentQ.id]?.toLowerCase() === val.toLowerCase();
              const isTrue = val === 'True';
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectAnswer(val)}
                  className={`p-6 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? isTrue
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-red-600 bg-red-50 ring-2 ring-red-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isSelected
                          ? isTrue
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isTrue ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                    </div>
                    <span className="font-heading font-extrabold text-lg text-slate-900">
                      {val}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Short Answer Field */}
        {currentQ.type === 'short' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-500">
              Type your answer in your own words based on what happened in the story:
            </label>
            <textarea
              rows={4}
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleSelectAnswer(e.target.value)}
              placeholder="Write what you remember or understood from the story..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Don't worry about perfect spelling — Story Teacher checks your ideas and meaning!</span>
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-2xl font-bold text-sm border flex items-center gap-1.5 transition-all cursor-pointer ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentIndex < totalQuestions - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-300 flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-7 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isSubmitting
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-300 hover:-translate-y-0.5'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Story Teacher is Grading...' : 'Submit Answers ✨'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
