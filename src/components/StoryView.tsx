import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Bookmark,
  Printer,
  Check,
  Award,
  Globe,
  Tag,
  Lightbulb,
} from 'lucide-react';
import { StoryData } from '../types';
import { SuggestedResources } from './SuggestedResources';

interface StoryViewProps {
  storyData: StoryData;
  onTakeQuiz: () => void;
  onNewStory: () => void;
  onSaveStory: (story: StoryData) => void;
  isSaved: boolean;
  isLoadingQuiz?: boolean;
}

export const StoryView: React.FC<StoryViewProps> = ({
  storyData,
  onTakeQuiz,
  onNewStory,
  onSaveStory,
  isSaved,
  isLoadingQuiz,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [readingTheme, setReadingTheme] = useState<'white' | 'sepia' | 'dark'>('white');
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  // Web Speech API language mapping
  const getLanguageCode = (lang: string): string => {
    switch (lang) {
      case 'Hindi':
        return 'hi-IN';
      case 'Tamil':
        return 'ta-IN';
      case 'Spanish':
        return 'es-ES';
      case 'French':
        return 'fr-FR';
      case 'German':
        return 'de-DE';
      default:
        return 'en-US';
    }
  };

  // Speech synthesis handlers
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your current browser.');
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Prepare full text to read
    const textToRead = `${storyData.title}. ${storyData.story}. ${
      storyData.takeaway ? 'Teacher takeaway: ' + storyData.takeaway : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = getLanguageCode(storyData.language);
    utterance.rate = speechRate;
    utterance.pitch = 1.05; // Slightly friendlier pitch for children

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Split story text into clean paragraphs
  const paragraphs = storyData.story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          onClick={onNewStory}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-white border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Topic</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Print button */}
          <button
            onClick={handlePrint}
            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Print story and vocabulary worksheet"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Worksheet</span>
          </button>

          {/* Save to Library */}
          <button
            onClick={() => {
              onSaveStory(storyData);
              setCopiedNotification(true);
              setTimeout(() => setCopiedNotification(false), 2000);
            }}
            className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-700 hover:text-indigo-600 border-slate-200'
            }`}
          >
            {isSaved || copiedNotification ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Saved to Library</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Story</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Story Container */}
      <article className="story-card bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/30 overflow-hidden mb-8">
        {/* Story Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-10 text-white relative">
          {/* Background decorative sparks */}
          <div className="absolute top-4 right-4 text-indigo-300/40">
            <Sparkles className="w-20 h-20" />
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
              <Tag className="w-3 h-3 text-amber-300" />
              <span>{storyData.topic}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-xs">
              <Award className="w-3 h-3" />
              <span>{storyData.reading_level}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-900/60 text-indigo-100 border border-white/20">
              <Globe className="w-3 h-3" />
              <span>{storyData.language}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white">
              <span>Age {storyData.age_group}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2 relative z-10">
            {storyData.title}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">
            An original educational STEM story crafted by FableSTEM
          </p>
        </div>

        {/* Read-Aloud Toolbar */}
        <div className="bg-indigo-50/80 px-6 py-3.5 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeak}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isPlaying && !isPaused
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-300/40'
              }`}
            >
              {isPlaying ? (
                isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Resume Story</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Reading</span>
                  </>
                )
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>🔊 Read Aloud</span>
                </>
              )}
            </button>

            {isPlaying && (
              <button
                onClick={handleStopSpeak}
                className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Stop reading"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}

            {isPlaying && !isPaused && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-indigo-700 font-semibold px-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Story Teacher is reading aloud...</span>
              </div>
            )}
          </div>

          {/* Speed & Comfort selector */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
            {/* Font Size */}
            <div className="flex items-center gap-1.5">
              <span>Text Size:</span>
              <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    fontSize === 'large' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                  }`}
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize('huge')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    fontSize === 'huge' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                  }`}
                >
                  A++
                </button>
              </div>
            </div>

            {/* Reading Theme */}
            <div className="flex items-center gap-1.5">
              <span>Theme:</span>
              <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setReadingTheme('white')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    readingTheme === 'white' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => setReadingTheme('sepia')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    readingTheme === 'sepia' ? 'bg-amber-700 text-amber-100' : 'text-amber-800'
                  }`}
                >
                  Cream
                </button>
                <button
                  onClick={() => setReadingTheme('dark')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    readingTheme === 'dark' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  Night
                </button>
              </div>
            </div>

            {/* Voice Speed */}
            <div className="flex items-center gap-1.5">
              <span>Voice:</span>
              <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setSpeechRate(0.85)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    speechRate === 0.85 ? 'bg-indigo-600 text-white' : 'text-slate-600'
                  }`}
                >
                  0.85x
                </button>
                <button
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    speechRate === 1.0 ? 'bg-indigo-600 text-white' : 'text-slate-600'
                  }`}
                >
                  1.0x
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Story Text Content with theme styles */}
        <div
          className={`p-6 sm:p-10 space-y-6 leading-relaxed transition-colors ${
            readingTheme === 'sepia'
              ? 'bg-[#fcf8ed] text-amber-950 font-serif'
              : readingTheme === 'dark'
              ? 'bg-slate-900 text-slate-100'
              : 'bg-white text-slate-800'
          } ${
            fontSize === 'huge'
              ? 'text-xl sm:text-2xl leading-10'
              : fontSize === 'large'
              ? 'text-lg sm:text-xl leading-9'
              : 'text-base sm:text-lg leading-8'
          }`}
        >
          {paragraphs.map((para, idx) => (
            <p key={idx} className="first-letter:font-bold first-letter:text-slate-900 leading-8">
              {para}
            </p>
          ))}

          {/* Teacher Takeaway Box */}
          {storyData.takeaway && (
            <div className="mt-8 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3.5 text-amber-950">
              <div className="p-2 rounded-xl bg-amber-200/70 text-amber-800 shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-amber-900">
                  🌟 Teacher's Takeaway:
                </h3>
                <p className="text-xs sm:text-sm font-medium text-amber-800 mt-1 italic">
                  "{storyData.takeaway}"
                </p>
              </div>
            </div>
          )}

          {/* Key Facts Summary (if present) */}
          {storyData.key_facts && storyData.key_facts.length > 0 && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Key Concepts Taught:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {storyData.key_facts.map((fact, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 flex items-start gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      {/* Vocabulary Section */}
      {storyData.vocabulary && storyData.vocabulary.length > 0 && (
        <section className="mb-10 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                Word Bank & Vocabulary
              </h3>
              <p className="text-xs text-slate-500">
                Key terms from the story with age-friendly definitions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {storyData.vocabulary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading font-extrabold text-sm text-indigo-700 group-hover:text-indigo-800">
                    {item.word}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    Word #{idx + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {item.meaning}
                </p>
                {item.example && (
                  <p className="text-[11px] text-slate-500 italic mt-2 pt-2 border-t border-slate-200/60">
                    "{item.example}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Books and Educational Websites */}
      <SuggestedResources
        topic={storyData.topic}
        books={storyData.suggested_books}
        websites={storyData.suggested_websites}
      />

      {/* Bottom CTA: Take Quiz */}
      <div className="no-print bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-9 text-white text-center shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="max-w-xl mx-auto relative z-10">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Comprehension Check
          </span>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mt-3 mb-2">
            Ready to test your understanding?
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 mb-6">
            Gemini has prepared 5 quick questions based strictly on the story you just read.
          </p>

          <button
            onClick={onTakeQuiz}
            disabled={isLoadingQuiz}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-base shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            {isLoadingQuiz ? (
              <span>Preparing Your Quiz...</span>
            ) : (
              <>
                <span>Take the Quiz</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
