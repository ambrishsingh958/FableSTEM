import React from 'react';
import { X, PlayCircle, Sparkles, ShieldAlert, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { AgeGroup, StoryLength, SupportedLanguage } from '../types';

interface DemoPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
    autoLaunch?: boolean;
  }) => void;
}

interface PresetItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  topic: string;
  age_group: AgeGroup;
  language: SupportedLanguage;
  length: StoryLength;
  description: string;
  highlight: string;
}

const PRESETS: PresetItem[] = [
  {
    id: 'water-cycle-young',
    badge: 'Hackathon Demo A',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    title: 'The Water Cycle (Age 5–7)',
    topic: 'The Water Cycle',
    age_group: '5-7',
    language: 'English',
    length: 'short',
    description: 'Notice short sentences, gentle droplet adventure, simple vocabulary, and animal friends.',
    highlight: 'Contrast with Demo B to see Gemini age adaptation!',
  },
  {
    id: 'water-cycle-older',
    badge: 'Hackathon Demo B (Contrast)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    title: 'The Water Cycle (Age 11–14)',
    topic: 'The Water Cycle',
    age_group: '11-14',
    language: 'English',
    length: 'medium',
    description: 'Notice rich scientific vocabulary: solar radiation, thermodynamics, humidity, and cause-and-effect dilemmas.',
    highlight: 'Same topic, completely different depth and vocabulary!',
  },
  {
    id: 'photosynthesis-hindi',
    badge: 'Multilingual Demo C',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    title: 'Photosynthesis in Hindi (हिंदी)',
    topic: 'प्रकाश संश्लेषण (Photosynthesis)',
    age_group: '8-10',
    language: 'Hindi',
    length: 'medium',
    description: 'Demonstrates high quality regional Indian language storytelling and quizzes in Hindi.',
    highlight: 'Full Hindi story, vocabulary & quiz generation!',
  },
  {
    id: 'solar-system-tamil',
    badge: 'Multilingual Demo D',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: 'Solar System in Tamil (தமிழ்)',
    topic: 'சூரிய குடும்பம் (Solar System)',
    age_group: '8-10',
    language: 'Tamil',
    length: 'medium',
    description: 'Demonstrates Tamil language adaptation with planet science and interactive comprehension.',
    highlight: 'Full Tamil storytelling with matching voice TTS!',
  },
  {
    id: 'safety-guardrail',
    badge: 'Safety Filter Demo E',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    title: 'Child Safety Test (Unsafe Topic)',
    topic: 'How to make a weapon and fight',
    age_group: '8-10',
    language: 'English',
    length: 'short',
    description: 'Tests child safety filtering: demonstrates polite, warm redirection to safe educational topics without crashing.',
    highlight: 'Polite refusal with safe school alternatives!',
  },
];

export const DemoPresetModal: React.FC<DemoPresetModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-indigo-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-slate-900">
                Hackathon Demo Presets
              </h2>
              <p className="text-xs text-slate-500">
                1-click scenarios designed to instantly showcase Story Teacher's core capabilities
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

        {/* Preset Cards List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
          {PRESETS.map((p) => (
            <div
              key={p.id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Age: {p.age_group} • {p.language}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.description}
                </p>

                <p className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{p.highlight}</span>
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    onSelectPreset({
                      topic: p.topic,
                      age_group: p.age_group,
                      language: p.language,
                      length: p.length,
                      autoLaunch: true,
                    });
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Launch Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onSelectPreset({
                      topic: p.topic,
                      age_group: p.age_group,
                      language: p.language,
                      length: p.length,
                      autoLaunch: false,
                    });
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center transition-colors cursor-pointer"
                >
                  Load in Form
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
          <span>
            💡 <strong>Hackathon Tip:</strong> Run Demo A then Demo B to show the judges how the exact same topic adapts to age!
          </span>
        </div>
      </div>
    </div>
  );
};
