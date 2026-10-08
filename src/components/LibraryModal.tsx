import React from 'react';
import { X, BookOpen, Trash2, Calendar, Award, Globe, ArrowRight } from 'lucide-react';
import { SavedStoryItem } from '../types';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedStories: SavedStoryItem[];
  onSelectStory: (story: SavedStoryItem) => void;
  onDeleteStory: (id: string) => void;
  onClearLibrary: () => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  savedStories,
  onSelectStory,
  onDeleteStory,
  onClearLibrary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-indigo-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-slate-900">
                My Story Library
              </h2>
              <p className="text-xs text-slate-500">
                {savedStories.length} {savedStories.length === 1 ? 'story' : 'stories'} saved locally in your browser
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {savedStories.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-800">
                No stories saved yet
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Whenever you create a story, click "Save Story" to keep it here so you can read it anytime!
              </p>
            </div>
          ) : (
            savedStories.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {item.topic}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {item.language}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500" /> Age {item.age_group}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {item.title}
                  </h3>

                  {item.quizScore && (
                    <p className="text-xs font-semibold text-emerald-600">
                      Quiz Score: {item.quizScore.score}/{item.quizScore.total} (
                      {Math.round((item.quizScore.score / item.quizScore.total) * 100)}%)
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectStory(item);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteStory(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {savedStories.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Saved strictly in your browser (LocalStorage).
            </span>
            <button
              onClick={onClearLibrary}
              className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              Clear All Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
