import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { AgeGroup, SupportedLanguage, StoryLength, AgeComparisonData } from '../types';
import { compareAges } from '../services/api';

interface AgeLabPageProps {
  onLaunchStory: (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
    autoLaunch?: boolean;
  }) => void;
}

const PRESET_TOPICS = [
  'The Water Cycle',
  'Photosynthesis',
  'Gravity and Falling Objects',
  'Fractions and Fair Sharing',
  'Honesty and Trust',
  'Electricity and Circuits',
];

export const AgeLabPage: React.FC<AgeLabPageProps> = ({ onLaunchStory }) => {
  const [topicInput, setTopicInput] = useState('The Water Cycle');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<AgeComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunComparison = async (topicToUse?: string) => {
    const targetTopic = (topicToUse || topicInput).trim();
    if (!targetTopic) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await compareAges({ topic: targetTopic, language });
      setComparisonData(data);
    } catch (err: any) {
      setError(err?.message || 'Could not generate age comparison matrix.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-violet-50 border border-violet-200 text-violet-700 mb-3">
          <Layers className="w-3.5 h-3.5 text-violet-600" />
          <span>Pedagogical Age Lab</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Same Topic, 4 Different Ages
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Witness how Gemini transforms the exact same subject into completely tailored vocabulary, sentence structures, and pedagogical depths across developmental stages.
        </p>
      </div>

      {/* Topic Input Bar */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-indigo-100 p-5 sm:p-6 shadow-md shadow-indigo-100/30 mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Type any learning topic (e.g. Gravity, The Water Cycle)..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => handleRunComparison()}
            disabled={isLoading || !topicInput.trim()}
            className={`px-6 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLoading || !topicInput.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-300 hover:-translate-y-0.5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isLoading ? 'Analyzing Ages...' : 'Compare Ages'}</span>
          </button>
        </div>

        {/* Quick topic buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">Try quick:</span>
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setTopicInput(preset);
                handleRunComparison(preset);
              }}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Grid Results */}
      {comparisonData && (
        <div className="space-y-6 animate-fade-in">
          {/* Overview Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-sm flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Pedagogical Overview: </span>
              <span>{comparisonData.overview}</span>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonData.comparisons.map((stage) => {
              const isYoungest = stage.age_group === '5-7';
              const isOldest = stage.age_group === '15+';
              return (
                <div
                  key={stage.age_group}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                          Ages {stage.age_group}
                        </span>
                        <h3 className="font-heading font-extrabold text-base text-slate-900">
                          {stage.stage_name}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {stage.word_count_range}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                        Sample Excerpt:
                      </span>
                      <p className="text-xs text-slate-800 italic leading-relaxed">
                        "{stage.sample_excerpt}"
                      </p>
                    </div>

                    {/* Pedagogical Focus */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        Learning Focus:
                      </span>
                      <p className="text-xs text-slate-600 leading-normal">
                        {stage.focus}
                      </p>
                    </div>

                    {/* Key Vocabulary */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        Target Vocabulary:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {stage.key_vocabulary.map((w, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Why It Works */}
                    <p className="text-[11px] text-slate-500 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      💡 <strong>Why it works:</strong> {stage.why_it_works}
                    </p>
                  </div>

                  {/* Launch button */}
                  <button
                    onClick={() =>
                      onLaunchStory({
                        topic: comparisonData.topic,
                        age_group: stage.age_group,
                        language,
                        length: 'medium',
                        autoLaunch: true,
                      })
                    }
                    className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read Full Age {stage.age_group} Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Initial Educational Guide (shown before generation) */}
      {!comparisonData && !isLoading && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-indigo-100 p-6 sm:p-8 shadow-xs">
          <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>How FableSTEM Adapts to Cognitive Development</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-indigo-700 block mb-1">Ages 5–7 (Early Reader)</span>
              Focuses on concrete, tangible concepts through anthropomorphic characters (e.g. "Dewey the Raindrop"). Short clauses and reassuring outcomes.
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-indigo-700 block mb-1">Ages 8–10 (Curious Explorer)</span>
              Introduces adventurous quests. Scientific processes are explained inside the story action, making tricky vocabulary natural to absorb.
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-indigo-700 block mb-1">Ages 11–14 (Junior Scholar)</span>
              Engages with dilemmas, cause-and-effect chains, scientific hypotheses, and problem-solving reasoning.
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-indigo-700 block mb-1">Ages 15+ (Advanced Thinker)</span>
              Connects foundational concepts to systemic real-world applications, historical context, and critical ethical debates.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
