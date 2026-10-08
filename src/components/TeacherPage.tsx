import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Printer,
  BookOpen,
  FileText,
  Award,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Palette,
} from 'lucide-react';
import { SavedStoryItem, TeacherWorksheetData, AgeGroup } from '../types';
import { generateWorksheet } from '../services/api';

interface TeacherPageProps {
  savedStories: SavedStoryItem[];
  onOpenStory: (story: SavedStoryItem) => void;
}

export const TeacherPage: React.FC<TeacherPageProps> = ({ savedStories, onOpenStory }) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(
    savedStories.length > 0 ? savedStories[0].id : ''
  );
  const [worksheetData, setWorksheetData] = useState<TeacherWorksheetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  const activeStory = savedStories.find((s) => s.id === selectedStoryId) || savedStories[0];

  const handleGenerateWorksheet = async () => {
    if (!activeStory) return;
    setIsLoading(true);

    try {
      const data = await generateWorksheet({
        story: activeStory.story,
        title: activeStory.title,
        topic: activeStory.topic,
        age_group: activeStory.age_group,
        language: activeStory.language,
      });
      setWorksheetData(data);
    } catch (err: any) {
      alert(err?.message || 'Could not generate worksheet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 no-print">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Educator & Parent Toolkit</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Classroom Worksheets & Certificates
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Turn any generated story into classroom discussion guides, hands-on activities, and printable student mastery certificates.
        </p>
      </div>

      {/* Story Selector & Action Toolbar (No Print) */}
      <div className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-xs mb-8 no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-1">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Select Story from Library:
            </label>
            {savedStories.length > 0 ? (
              <select
                value={selectedStoryId}
                onChange={(e) => {
                  setSelectedStoryId(e.target.value);
                  setWorksheetData(null);
                }}
                className="w-full sm:max-w-md px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {savedStories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.topic} • Age {s.age_group})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No stories saved yet. Generate and save a story first to build its lesson plan!
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {activeStory && (
              <button
                onClick={handleGenerateWorksheet}
                disabled={isLoading}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isLoading ? 'Creating Guide...' : 'Create Lesson Plan'}</span>
              </button>
            )}

            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>{showCertificate ? 'Hide Certificate' : 'Print Certificate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Certificate Modal/View */}
      {showCertificate && (
        <div className="mb-10 bg-white rounded-3xl border-4 border-amber-400 p-8 sm:p-12 text-center shadow-xl shadow-amber-100/50 relative overflow-hidden print-only">
          {/* Decorative Corner Stars */}
          <div className="absolute top-4 left-4 text-amber-400 text-2xl">★</div>
          <div className="absolute top-4 right-4 text-amber-400 text-2xl">★</div>
          <div className="absolute bottom-4 left-4 text-amber-400 text-2xl">★</div>
          <div className="absolute bottom-4 right-4 text-amber-400 text-2xl">★</div>

          <div className="max-w-xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 block mb-1">
              OFFICIAL READING EXCELLENCE AWARD
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mb-2">
              Certificate of Mastery
            </h2>
            <p className="text-xs text-slate-500 mb-6 italic">
              Presented by FableSTEM in recognition of curiosity and comprehension
            </p>

            <div className="no-print mb-6">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Enter Student's Name:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="max-w-xs mx-auto px-4 py-2 rounded-xl border border-slate-300 text-center font-bold text-base focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              This certificate proudly honors
            </p>

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-indigo-700 underline decoration-amber-400 underline-offset-8 mb-6">
              {studentName || 'Curious Learner'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              for successfully reading and demonstrating comprehension of{' '}
              <strong>"{activeStory ? activeStory.title : 'Our Educational Story'}"</strong> on the topic of{' '}
              <strong>{activeStory ? activeStory.topic : 'General Science'}</strong>.
            </p>

            <div className="flex items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500">
              <div className="text-left">
                <span className="block font-bold text-slate-800">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span>Date Awarded</span>
              </div>

              <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-[10px] text-center shadow-md">
                SEAL OF MASTERY
              </div>

              <div className="text-right">
                <span className="block font-bold text-indigo-700 font-heading text-sm">
                  FableSTEM AI
                </span>
                <span>STEM Educational Tutor</span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="mt-8 no-print px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Award Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* Generated Lesson Plan Worksheet */}
      {worksheetData && activeStory && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-8 print-only">
          {/* Worksheet Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                FableSTEM • Classroom Worksheet & Lesson Guide
              </span>
              <h2 className="font-heading font-black text-2xl text-slate-900 mt-1">
                {activeStory.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Topic: {activeStory.topic} • Age Group: {activeStory.age_group} • Level: {activeStory.reading_level}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="no-print px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Worksheet</span>
            </button>
          </div>

          {/* 1. Learning Objective */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-sm text-indigo-900">
                Learning Objective:
              </h3>
              <p className="text-xs text-indigo-800 mt-0.5 leading-relaxed">
                {worksheetData.lesson_objective}
              </p>
            </div>
          </div>

          {/* 2. Discussion Questions */}
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Guided Discussion Questions for Students</span>
            </h3>
            <div className="space-y-2">
              {worksheetData.discussion_questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5"
                >
                  <span className="font-bold text-indigo-600">{idx + 1}.</span>
                  <span className="leading-relaxed">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Hands-On Activity */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <h3 className="font-heading font-extrabold text-sm text-amber-950 mb-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-700" />
              <span>Hands-On Activity: {worksheetData.hands_on_activity.title}</span>
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed mt-1">
              {worksheetData.hands_on_activity.instructions}
            </p>
          </div>

          {/* 4. Critical Thinking / Creative Writing */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 mb-1">
              Creative Response & Critical Thinking:
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {worksheetData.critical_thinking_prompt}
            </p>
            {/* Blank writing lines for student printout */}
            <div className="space-y-3 pt-2">
              <div className="border-b border-dashed border-slate-300 h-4" />
              <div className="border-b border-dashed border-slate-300 h-4" />
              <div className="border-b border-dashed border-slate-300 h-4" />
            </div>
          </div>

          {/* 5. Teacher Pedagogical Tip */}
          <div className="text-xs text-slate-500 bg-white p-4 rounded-2xl border border-slate-200/60">
            <strong>Pedagogical Teaching Tip:</strong> {worksheetData.teacher_tips}
          </div>
        </div>
      )}
    </div>
  );
};
