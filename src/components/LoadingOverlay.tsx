import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

interface LoadingOverlayProps {
  type: 'story' | 'quiz' | 'eval';
  topic?: string;
}

const STORY_MESSAGES = [
  '✨ Your teacher is writing your story...',
  'Finding the perfect words for your age group...',
  'Weaving in scientific facts and wonder...',
  'Crafting an inspiring takeaway...',
  'Polishing the vocabulary words...',
  'Almost ready to read! 🌱',
];

const QUIZ_MESSAGES = [
  '🧠 Creating questions strictly from your story...',
  'Designing multiple-choice challenges...',
  'Writing a thoughtful short-answer prompt...',
  'Checking that every question has a clear answer...',
  'Getting your quiz ready! 🎯',
];

const EVAL_MESSAGES = [
  '🔎 Story Teacher is reviewing your answers...',
  'Checking your ideas and understanding...',
  'Writing kind, personalized encouragement...',
  'Calculating your mastery score...',
  'Almost ready with your feedback! 🌟',
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ type, topic }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages =
    type === 'story'
      ? STORY_MESSAGES
      : type === 'quiz'
      ? QUIZ_MESSAGES
      : EVAL_MESSAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl border border-indigo-100 relative overflow-hidden">
        {/* Animated background aura */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Center Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-indigo-100 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-300">
            {type === 'story' ? (
              <BookOpen className="w-10 h-10 animate-float" />
            ) : type === 'quiz' ? (
              <Brain className="w-10 h-10 animate-bounce" />
            ) : (
              <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 mb-2">
          {type === 'story'
            ? 'Creating Your Story'
            : type === 'quiz'
            ? 'Building Your Quiz'
            : 'Grading with Care'}
        </h3>

        {topic && (
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-4">
            Topic: {topic}
          </p>
        )}

        {/* Rotating message */}
        <div className="min-h-[50px] flex items-center justify-center">
          <p className="text-sm font-medium text-slate-600 animate-fade-in key={messageIndex}">
            {messages[messageIndex]}
          </p>
        </div>

        {/* Animated step dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
