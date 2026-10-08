import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  FlaskConical,
  Rocket,
  History,
  HeartHandshake,
  Calculator,
  Leaf,
  Users,
} from 'lucide-react';
import { AgeGroup, SupportedLanguage, StoryLength } from '../types';

interface ExplorePageProps {
  onSelectTopic: (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
    autoLaunch?: boolean;
  }) => void;
}

interface CuratedTopic {
  id: string;
  category: 'science' | 'space' | 'history' | 'ethics' | 'math' | 'eco';
  title: string;
  emoji: string;
  hook: string;
  recommendedAge: AgeGroup;
  prompt: string;
  color: string;
}

const CURATED_TOPICS: CuratedTopic[] = [
  // Science & Nature
  {
    id: 'photosynthesis',
    category: 'science',
    title: 'How Plants Make Food',
    emoji: '🌱',
    hook: 'Discover the secret kitchen inside green leaves turning sunlight into sugar!',
    recommendedAge: '8-10',
    prompt: 'Photosynthesis and How Plants Eat Sunlight',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'volcanoes',
    category: 'science',
    title: 'The Fire Below: Volcanoes',
    emoji: '🌋',
    hook: 'Journey deep beneath Earth’s crust to see how magma and pressure build erupting giants.',
    recommendedAge: '8-10',
    prompt: 'How Volcanoes Form and Erupt',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'deep-ocean',
    category: 'science',
    title: 'Creatures of the Deep Sea',
    emoji: '🐙',
    hook: 'Meet glowing bioluminescent creatures swimming in the pitch-black Mariana Trench.',
    recommendedAge: '11-14',
    prompt: 'Bioluminescence and Extreme Life in Deep Ocean Trenches',
    color: 'from-blue-600 to-cyan-600',
  },

  // Space & Cosmos
  {
    id: 'mars-rover',
    category: 'space',
    title: 'The Mars Rover Adventure',
    emoji: '🤖',
    hook: 'Follow a robotic scientist exploring red dust dunes millions of miles from Earth.',
    recommendedAge: '8-10',
    prompt: 'How Mars Rovers Search for Clues of Water on the Red Planet',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'black-holes',
    category: 'space',
    title: 'Gravity & The Mystery of Black Holes',
    emoji: '🕳️',
    hook: 'What happens when a giant star collapses so dense that even light cannot escape?',
    recommendedAge: '11-14',
    prompt: 'Black Holes, Event Horizons, and Space-Time Gravity',
    color: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'moon-phases',
    category: 'space',
    title: 'Why Does the Moon Change Shape?',
    emoji: '🌙',
    hook: 'Watch the cosmic dance between the Sun, Earth, and Moon that creates crescents and full moons.',
    recommendedAge: '5-7',
    prompt: 'Why the Moon Changes Shape: Moon Phases for Kids',
    color: 'from-indigo-500 to-violet-600',
  },

  // History & Pioneers
  {
    id: 'marie-curie',
    category: 'history',
    title: 'Marie Curie’s Glowing Discovery',
    emoji: '🧪',
    hook: 'The courageous scientist who discovered radium and won two Nobel Prizes.',
    recommendedAge: '11-14',
    prompt: 'Marie Curie and the Discovery of Radioactivity',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'wright-brothers',
    category: 'history',
    title: 'First Flight at Kitty Hawk',
    emoji: '✈️',
    hook: 'Two brothers who tinkered with bicycles until they unlocked human flight.',
    recommendedAge: '8-10',
    prompt: 'The Wright Brothers and the Invention of the Airplane',
    color: 'from-sky-500 to-blue-600',
  },

  // Character & Values
  {
    id: 'honesty-courage',
    category: 'ethics',
    title: 'The Courage to Tell the Truth',
    emoji: '🌟',
    hook: 'Why admitting a mistake feels terrifying at first, but builds lifelong trust.',
    recommendedAge: '5-7',
    prompt: 'Honesty and Why Telling the Truth Makes Us Brave',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'teamwork-ants',
    category: 'ethics',
    title: 'The Ant Colony: Super Teamwork',
    emoji: '🐜',
    hook: 'How thousands of tiny creatures lift leaves and build bridges together without a boss.',
    recommendedAge: '5-7',
    prompt: 'Teamwork and Cooperation in an Ant Colony',
    color: 'from-lime-500 to-green-600',
  },

  // Math in Real Life
  {
    id: 'fractions-pizza',
    category: 'math',
    title: 'The Great Pizza Fraction Party',
    emoji: '🍕',
    hook: 'Halves, thirds, and eighths! See how fractions make sure every friend gets a fair slice.',
    recommendedAge: '8-10',
    prompt: 'Understanding Fractions through Sharing Pizza Fairly',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'fibonacci-nature',
    category: 'math',
    title: 'Nature’s Secret Code (Fibonacci)',
    emoji: '🐚',
    hook: 'Why sunflowers, seashells, and pinecones all follow the exact same mathematical spiral.',
    recommendedAge: '11-14',
    prompt: 'The Fibonacci Sequence and Golden Ratio in Nature',
    color: 'from-indigo-600 to-purple-600',
  },

  // Eco & Planet
  {
    id: 'honeybees-flowers',
    category: 'eco',
    title: 'The Busy Life of Honeybees',
    emoji: '🐝',
    hook: 'Without tiny buzzing pollinators, one-third of our favorite fruits wouldn’t exist!',
    recommendedAge: '5-7',
    prompt: 'Why Honeybees and Pollination are Essential to Earth',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'renewable-energy',
    category: 'eco',
    title: 'Catching Sun and Wind: Clean Energy',
    emoji: '💨',
    hook: 'How spinning wind turbines and shiny solar panels replace fossil fuels.',
    recommendedAge: '11-14',
    prompt: 'Renewable Energy: Solar and Wind Power for a Cleaner Planet',
    color: 'from-emerald-600 to-teal-700',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: Compass },
  { id: 'science', label: 'Science & Nature', icon: FlaskConical },
  { id: 'space', label: 'Space & Cosmos', icon: Rocket },
  { id: 'history', label: 'History & Pioneers', icon: History },
  { id: 'ethics', label: 'Values & Ethics', icon: HeartHandshake },
  { id: 'math', label: 'Real-Life Math', icon: Calculator },
  { id: 'eco', label: 'Eco & Planet', icon: Leaf },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectTopic }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('English');

  const filteredTopics =
    activeCategory === 'all'
      ? CURATED_TOPICS
      : CURATED_TOPICS.filter((t) => t.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Curated Discovery Library</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Explore Topics & Themed Worlds
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Pick any curiosity prompt below. FableSTEM will immediately spin it into an age-tailored STEM story and comprehension quiz!
        </p>
      </div>

      {/* Category Pills & Language Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Story Language Selector */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
          <span>Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
            className="font-semibold text-indigo-700 bg-transparent focus:outline-hidden cursor-pointer"
          >
            <option value="English">English 🇬🇧</option>
            <option value="Hindi">Hindi (हिंदी) 🇮🇳</option>
            <option value="Tamil">Tamil (தமிழ்) 🇮🇳</option>
            <option value="Spanish">Spanish (Español) 🇪🇸</option>
            <option value="French">French (Français) 🇫🇷</option>
            <option value="German">German (Deutsch) 🇩🇪</option>
          </select>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{topic.emoji}</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                  <Users className="w-3 h-3 text-indigo-500" />
                  <span>Age {topic.recommendedAge}</span>
                </span>
              </div>

              <h3 className="font-heading font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                {topic.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {topic.hook}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                {topic.prompt}
              </span>

              <button
                onClick={() =>
                  onSelectTopic({
                    topic: topic.prompt,
                    age_group: topic.recommendedAge,
                    language: selectedLanguage,
                    length: 'medium',
                    autoLaunch: true,
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
