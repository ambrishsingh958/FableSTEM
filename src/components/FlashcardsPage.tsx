import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  RotateCw,
  CheckCircle2,
  XCircle,
  Trophy,
  Brain,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { VocabularyItem, SavedStoryItem } from '../types';

interface FlashcardsPageProps {
  savedStories: SavedStoryItem[];
  onOpenStory: (story: SavedStoryItem) => void;
}

const DEFAULT_VOCABULARY: (VocabularyItem & { topic: string })[] = [
  {
    word: 'Photosynthesis',
    meaning: 'The process green plants use to turn sunlight, water, and air into delicious food.',
    example: 'Leaves catch sunlight so photosynthesis can make food for the tree.',
    topic: 'Plant Biology',
  },
  {
    word: 'Evaporation',
    meaning: 'When liquid water warms up from the sun and turns into invisible vapor that rises.',
    example: 'Puddles on the sidewalk disappear on a hot afternoon due to evaporation.',
    topic: 'Water Cycle',
  },
  {
    word: 'Condensation',
    meaning: 'When cool air causes water vapor to turn back into tiny liquid droplets that form clouds.',
    example: 'Condensation made the cold glass of lemonade sweat on the table.',
    topic: 'Water Cycle',
  },
  {
    word: 'Gravity',
    meaning: 'The invisible pulling force that keeps our feet on the ground and planets in orbit.',
    example: 'Gravity pulled the dropped apple straight toward the grass.',
    topic: 'Physics',
  },
  {
    word: 'Bioluminescence',
    meaning: 'Light produced naturally by living creatures like fireflies and deep-sea fish.',
    example: 'The jellyfish glowed in the dark ocean through bioluminescence.',
    topic: 'Marine Science',
  },
  {
    word: 'Resilience',
    meaning: 'The ability to recover quickly from difficulties, learn from mistakes, and keep trying.',
    example: 'Her resilience helped her rebuild the fallen sandcastle even stronger.',
    topic: 'Character',
  },
  {
    word: 'Atmosphere',
    meaning: 'The protective layer of gases surrounding Earth that gives us air to breathe.',
    example: 'The atmosphere shields living things from the harsh cold of space.',
    topic: 'Earth Science',
  },
  {
    word: 'Orbit',
    meaning: 'The curved cosmic path an object travels around a star or planet.',
    example: 'It takes Earth 365 days to complete one full orbit around the Sun.',
    topic: 'Astronomy',
  },
];

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ savedStories }) => {
  // Aggregate vocabulary from saved stories + defaults
  const userVocab: (VocabularyItem & { topic: string })[] = [];
  savedStories.forEach((s) => {
    if (s.vocabulary) {
      s.vocabulary.forEach((v) => {
        userVocab.push({ ...v, topic: s.topic });
      });
    }
  });

  const allVocab = userVocab.length > 0 ? [...userVocab, ...DEFAULT_VOCABULARY] : DEFAULT_VOCABULARY;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameAnswered, setGameAnswered] = useState<boolean | null>(null);

  const currentItem = allVocab[currentIndex % allVocab.length];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setGameAnswered(null);
    setCurrentIndex((prev) => (prev + 1) % allVocab.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setGameAnswered(null);
    setCurrentIndex((prev) => (prev - 1 + allVocab.length) % allVocab.length);
  };

  // Mini quiz options for game mode
  const currentOptions = [
    currentItem.word,
    ...allVocab
      .filter((v) => v.word !== currentItem.word)
      .slice(0, 3)
      .map((v) => v.word),
  ].sort(() => 0.5 - Math.random());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 mb-3">
          <Brain className="w-3.5 h-3.5 text-amber-600" />
          <span>Word Explorer Arcade</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Vocabulary & Flashcards
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Flip cards to learn definitions, listen to real audio pronunciations, and test your memory!
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => {
            setIsGameMode(false);
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            !isGameMode
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          📖 Flashcard Explorer
        </button>

        <button
          onClick={() => {
            setIsGameMode(true);
            setIsFlipped(false);
            setGameAnswered(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isGameMode
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🎮 Match the Meaning Quiz
        </button>
      </div>

      {/* 1. Flashcard Mode */}
      {!isGameMode ? (
        <div className="max-w-lg mx-auto">
          {/* Card container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[320px] bg-white rounded-3xl border-2 border-indigo-100 hover:border-indigo-300 p-8 shadow-xl shadow-indigo-100/40 flex flex-col justify-between transition-all hover:scale-[1.01] relative group"
          >
            {/* Top Bar on Card */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {currentItem.topic}
              </span>
              <span className="font-mono">
                {currentIndex + 1} of {allVocab.length}
              </span>
            </div>

            {/* Front vs Back Content */}
            {!isFlipped ? (
              <div className="text-center my-auto py-6">
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest block mb-2">
                  Vocabulary Word
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mb-4 tracking-tight">
                  {currentItem.word}
                </h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentItem.word);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>Pronounce Word</span>
                </button>
              </div>
            ) : (
              <div className="text-center my-auto py-4 space-y-3">
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block">
                  Meaning & Definition
                </span>
                <p className="font-heading font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                  {currentItem.meaning}
                </p>
                {currentItem.example && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    "{currentItem.example}"
                  </p>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(`${currentItem.word}. ${currentItem.meaning}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Read Meaning Aloud</span>
                </button>
              </div>
            )}

            {/* Bottom prompt on Card */}
            <div className="text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-1.5 pt-3 border-t border-slate-100">
              <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
              <span>{isFlipped ? 'Click card to see word' : 'Click card to flip definition'}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              onClick={handlePrevCard}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              ← Previous
            </button>

            <span className="text-xs text-slate-500 font-medium">
              Space / Click to Flip
            </span>

            <button
              onClick={handleNextCard}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-300 transition-colors cursor-pointer"
            >
              Next Word →
            </button>
          </div>
        </div>
      ) : (
        /* 2. Mini Game Quiz Mode */
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-xl shadow-amber-100/30">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-amber-600">
              Score: {gameScore} Points
            </span>
            <span className="text-xs text-slate-400">
              Word #{currentIndex + 1}
            </span>
          </div>

          <div className="mb-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Which word matches this definition?
            </span>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900">
              "{currentItem.meaning}"
            </h3>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentOptions.map((opt, idx) => {
              const isCorrect = opt === currentItem.word;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (gameAnswered === null) {
                      if (isCorrect) {
                        setGameScore((prev) => prev + 10);
                        setGameAnswered(true);
                      } else {
                        setGameAnswered(false);
                      }
                    }
                  }}
                  disabled={gameAnswered !== null}
                  className={`p-4 rounded-2xl border text-center font-heading font-bold text-sm transition-all cursor-pointer ${
                    gameAnswered !== null
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {gameAnswered !== null && (
            <div className="text-center pt-2">
              <div
                className={`p-3 rounded-2xl text-xs font-bold mb-4 flex items-center justify-center gap-2 ${
                  gameAnswered
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {gameAnswered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bingo! +10 Points!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Correct word was: {currentItem.word}</span>
                  </>
                )}
              </div>

              <button
                onClick={handleNextCard}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Next Word Challenge →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
