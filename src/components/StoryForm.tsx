import React, { useState } from 'react';
import { Sparkles, Globe, Clock, Users, BookOpen, AlertCircle, Info, Flame } from 'lucide-react';
import { AgeGroup, StoryLength, SupportedLanguage } from '../types';

interface StoryFormProps {
  onSubmit: (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
  }) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  isUnsafeError?: boolean;
  defaultAgeGroup?: AgeGroup;
  userName?: string;
}

const EXAMPLE_TOPICS = [
  { label: '💧 Water Cycle', value: 'The Water Cycle' },
  { label: '🌱 Photosynthesis', value: 'Photosynthesis and Plant Food' },
  { label: '🚀 Solar System', value: 'The Solar System & Planets' },
  { label: '🍕 Fractions', value: 'Fractions and Sharing Fairly' },
  { label: '🌟 Honesty', value: 'Honesty and Telling the Truth' },
  { label: '🚦 Road Safety', value: 'Road Safety and Traffic Rules' },
  { label: '🌊 Pollution', value: 'Ocean Pollution and Marine Life' },
  { label: '⚡ Electricity', value: 'How Electricity Powers Our Homes' },
];

const AGE_OPTIONS: { id: AgeGroup; title: string; subtitle: string; badge: string; icon: string }[] = [
  {
    id: '5-7',
    title: 'Ages 5–7',
    subtitle: '120–180 words. Simple sentences, cute animal characters, gentle ending.',
    badge: 'Grade 1–2',
    icon: '🐣',
  },
  {
    id: '8-10',
    title: 'Ages 8–10',
    subtitle: '250–350 words. Fun adventure, explanations woven into the story.',
    badge: 'Grade 3–5',
    icon: '🦊',
  },
  {
    id: '11-14',
    title: 'Ages 11–14',
    subtitle: '400–550 words. Richer vocabulary, cause & effect, engaging dilemma.',
    badge: 'Grade 6–8',
    icon: '🦉',
  },
  {
    id: '15+',
    title: 'Ages 15+',
    subtitle: '500–700 words. Real-world systems, mature concepts & analytical reasoning.',
    badge: 'Grade 9+',
    icon: '🦅',
  },
];

const LANGUAGE_OPTIONS: { id: SupportedLanguage; label: string; native: string; flag: string }[] = [
  { id: 'English', label: 'English', native: 'English', flag: '🇬🇧' },
  { id: 'Hindi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { id: 'Tamil', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { id: 'Spanish', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { id: 'French', label: 'French', native: 'Français', flag: '🇫🇷' },
  { id: 'German', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
];

const LENGTH_OPTIONS: { id: StoryLength; label: string; desc: string }[] = [
  { id: 'short', label: 'Short', desc: 'Quick bite (3 mins)' },
  { id: 'medium', label: 'Medium', desc: 'Ideal standard story' },
  { id: 'long', label: 'Long', desc: 'Deep dive story' },
];

export const StoryForm: React.FC<StoryFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
  isUnsafeError,
  defaultAgeGroup,
  userName,
}) => {
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(defaultAgeGroup || '8-10');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [length, setLength] = useState<StoryLength>('medium');
  const [clientError, setClientError] = useState<string | null>(null);

  // Sync default age group if user logs in
  React.useEffect(() => {
    if (defaultAgeGroup) {
      setAgeGroup(defaultAgeGroup);
    }
  }, [defaultAgeGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setClientError('Please enter what you want to learn!');
      return;
    }
    if (cleanTopic.length > 100) {
      setClientError('Please keep topic under 100 characters.');
      return;
    }

    setClientError(null);
    onSubmit({
      topic: cleanTopic,
      age_group: ageGroup,
      language,
      length,
    });
  };

  const handleSelectExample = (val: string) => {
    setTopic(val);
    setClientError(null);
  };

  return (
    <div id="story-form-card" className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/40 p-6 sm:p-9 relative">
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
              {userName ? `Ready to Learn, ${userName}?` : 'Create Your Story'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {userName ? `Your personalized story and quiz will adapt to Age ${ageGroup}` : 'Choose your topic and see how Gemini personalizes the story for your age'}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {(clientError || errorMessage) && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-sm flex items-start gap-3 animate-fade-in ${
              isUnsafeError
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">
                {isUnsafeError ? 'Child Safety Guidance 🌱' : 'Just a moment'}
              </p>
              <p className="mt-0.5 leading-relaxed">{clientError || errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* 1. Topic Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="topic-input" className="block text-sm font-bold text-slate-800">
                1. What do you want to learn? <span className="text-indigo-600">*</span>
              </label>
              <span className={`text-xs font-mono ${topic.length > 90 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                {topic.length}/100
              </span>
            </div>

            <div className="relative">
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value.slice(0, 100));
                  if (clientError) setClientError(null);
                }}
                placeholder="e.g. The Water Cycle, Photosynthesis, Solar System, Honesty..."
                disabled={isLoading}
                maxLength={100}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-base focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Topic Chips */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular ideas (click to try):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_TOPICS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectExample(item.value)}
                    disabled={isLoading}
                    className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/60 text-slate-700 font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Age Group Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>2. Select Age Group</span>
              </label>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                Vocabulary adapts to age
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              The exact same topic produces a completely different story length, tone and depth for each age group.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGE_OPTIONS.map((item) => {
                const isSelected = ageGroup === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAgeGroup(item.id)}
                    disabled={isLoading}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-heading font-bold text-sm text-slate-900">
                          {item.title}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pr-2">
                      {item.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Language & Length Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>3. Select Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                disabled={isLoading}
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.label} ({lang.native})
                  </option>
                ))}
              </select>
            </div>

            {/* Length Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>4. Story Length</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LENGTH_OPTIONS.map((len) => {
                  const isSelected = length === len.id;
                  return (
                    <button
                      key={len.id}
                      type="button"
                      onClick={() => setLength(len.id)}
                      disabled={isLoading}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                      }`}
                      title={len.desc}
                    >
                      {len.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <strong>Live AI Personalization:</strong> Gemini will generate a custom educational story, vocabulary list, and 5 comprehension questions tailored specifically for this age level.
            </p>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isLoading || topic.trim().length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLoading || topic.trim().length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-300/60 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{isLoading ? 'Your Teacher is Writing...' : '✨ Create My Story'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
