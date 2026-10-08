import React from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  Star,
  Globe,
  Brain,
  Zap,
} from 'lucide-react';
import { SavedStoryItem, StudentBadge } from '../types';

interface BadgesPageProps {
  savedStories: SavedStoryItem[];
  onStartReading: () => void;
}

export const BadgesPage: React.FC<BadgesPageProps> = ({ savedStories, onStartReading }) => {
  const totalStories = savedStories.length;
  const quizzesTaken = savedStories.filter((s) => s.quizScore !== undefined).length;
  const perfectQuizzes = savedStories.filter(
    (s) => s.quizScore && s.quizScore.score === s.quizScore.total
  ).length;
  const multilingualStories = savedStories.filter((s) => s.language !== 'English').length;
  const olderStories = savedStories.filter((s) => s.age_group === '11-14' || s.age_group === '15+').length;

  const BADGES: StudentBadge[] = [
    {
      id: 'first-story',
      title: 'First Page Turned',
      description: 'Read or save your very first educational story in Story Teacher.',
      icon: '🐣',
      unlocked: totalStories >= 1,
      category: 'reading',
    },
    {
      id: 'story-worm',
      title: 'Story Explorer',
      description: 'Read and collect 3 different educational stories.',
      icon: '📚',
      unlocked: totalStories >= 3,
      category: 'reading',
    },
    {
      id: 'quiz-hero',
      title: 'Quiz Master (100%)',
      description: 'Score a perfect 5 out of 5 on any comprehension quiz!',
      icon: '🏆',
      unlocked: perfectQuizzes >= 1,
      category: 'quiz',
    },
    {
      id: 'quiz-trio',
      title: 'Comprehension Champ',
      description: 'Complete 3 comprehension quizzes after reading.',
      icon: '🎯',
      unlocked: quizzesTaken >= 3,
      category: 'quiz',
    },
    {
      id: 'polyglot',
      title: 'World Citizen',
      description: 'Read a story in Hindi (हिंदी), Tamil (தமிழ்) or another language.',
      icon: '🌍',
      unlocked: multilingualStories >= 1,
      category: 'polyglot',
    },
    {
      id: 'scholar-mind',
      title: 'Deep Thinker',
      description: 'Explore an advanced topic in the Age 11–14 or 15+ category.',
      icon: '🦉',
      unlocked: olderStories >= 1,
      category: 'reading',
    },
    {
      id: 'word-collector',
      title: 'Master Lexicographer',
      description: 'Collect 10 or more vocabulary words in your story library.',
      icon: '💎',
      unlocked: totalStories >= 2,
      category: 'science',
    },
    {
      id: 'curious-scientist',
      title: 'Star Inquirer',
      description: 'Ask Story Teacher about science, nature, or space.',
      icon: '🚀',
      unlocked: totalStories >= 1,
      category: 'science',
    },
  ];

  const unlockedCount = BADGES.filter((b) => b.unlocked).length;
  const level = unlockedCount >= 6 ? 'Master Scholar' : unlockedCount >= 3 ? 'Curious Explorer' : 'Apprentice Reader';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 mb-3">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Student Achievements</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Badge Room & Milestones
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Earn shiny badges as you read new stories, take quizzes, and explore topics in different languages!
        </p>
      </div>

      {/* Stats Summary Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-200 mb-10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
              Current Rank:
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
              {level} 🌟
            </h2>
            <p className="text-xs text-indigo-200 mt-1">
              You have unlocked {unlockedCount} of {BADGES.length} badges!
            </p>
          </div>

          {/* Stat counters */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300 block">
                {totalStories}
              </span>
              <span className="text-[11px] text-indigo-200 font-medium">Stories Read</span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-300 block">
                {quizzesTaken}
              </span>
              <span className="text-[11px] text-indigo-200 font-medium">Quizzes Taken</span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              <span className="font-heading font-black text-2xl sm:text-3xl text-violet-300 block">
                {perfectQuizzes}
              </span>
              <span className="text-[11px] text-indigo-200 font-medium">100% Scores</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${(unlockedCount / BADGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`p-5 rounded-3xl border transition-all text-center flex flex-col justify-between ${
              badge.unlocked
                ? 'bg-white border-amber-200 shadow-md shadow-amber-100/50 hover:scale-[1.02]'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl shadow-sm ${
                  badge.unlocked
                    ? 'bg-amber-100/80 ring-4 ring-amber-300/40 animate-pulse-glow'
                    : 'bg-slate-200 grayscale'
                }`}
              >
                {badge.icon}
              </div>

              <div className="flex items-center justify-center gap-1 mb-1">
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  {badge.title}
                </h3>
                {badge.unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {badge.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  badge.unlocked
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {badge.unlocked ? 'Unlocked 🌟' : 'Locked 🔒'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <button
          onClick={onStartReading}
          className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer"
        >
          Read a Story to Unlock More Badges ✨
        </button>
      </div>
    </div>
  );
};
