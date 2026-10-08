import React from 'react';
import {
  BookOpen,
  Sparkles,
  Bookmark,
  PlayCircle,
  Compass,
  Layers,
  Brain,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import { ActiveNavTab, UserProfile } from '../types';

interface NavbarProps {
  currentTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenLibrary: () => void;
  onOpenDemo: () => void;
  savedStoriesCount: number;
  currentUser: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLibrary,
  onOpenDemo,
  savedStoriesCount,
  currentUser,
}) => {
  const NAV_ITEMS: { id: ActiveNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'studio', label: 'Story Studio', icon: BookOpen },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'agelab', label: 'Age Lab', icon: Layers },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'badges', label: 'Badges', icon: Trophy },
    { id: 'teacher', label: 'Educators', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-2xs no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main top bar */}
        <div className="h-16 flex items-center justify-between gap-2">
          {/* Logo and Brand */}
          <button
            onClick={() => onSelectTab('studio')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-hidden shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Fable<span className="text-indigo-600">STEM</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Hackathon Demo Quick Switcher */}
            <button
              onClick={onOpenDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all hover:scale-[1.02] shadow-2xs cursor-pointer"
              title="Fast 1-click presets for live demonstration"
            >
              <PlayCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Demo</span> Presets
            </button>

            {/* Library Button */}
            <button
              onClick={onOpenLibrary}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
              {savedStoriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                  {savedStoriesCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Button */}
            {currentUser ? (
              <button
                onClick={() => onSelectTab('login')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 transition-all cursor-pointer"
                title={`Active account: ${currentUser.displayName} (${currentUser.email || currentUser.role})`}
              >
                <span className="text-base">{currentUser.avatar}</span>
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.displayName}</span>
                {currentUser.authProvider === 'google' && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-1 rounded-md">
                    G
                  </span>
                )}
                <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-md text-amber-600 font-extrabold border border-amber-200">
                  🔥{currentUser.streakDays}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Sub Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
