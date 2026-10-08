import React, { useState } from 'react';
import {
  Sparkles,
  User,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  LogOut,
  BookOpen,
  Mail,
  Zap,
} from 'lucide-react';
import { UserProfile, AgeGroup } from '../types';

interface LoginPageProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onGoToStudio: () => void;
}

const AVATARS = [
  { id: 'fox', emoji: '🦊', label: 'Clever Fox' },
  { id: 'lion', emoji: '🦁', label: 'Brave Lion' },
  { id: 'owl', emoji: '🦉', label: 'Wise Owl' },
  { id: 'astronaut', emoji: '🚀', label: 'Cosmic Cadet' },
  { id: 'panda', emoji: '🐼', label: 'Gentle Panda' },
  { id: 'dolphin', emoji: '🐬', label: 'Ocean Explorer' },
  { id: 'unicorn', emoji: '🦄', label: 'Wonder Unicorn' },
  { id: 'dino', emoji: '🦖', label: 'Dino Scholar' },
];

// Google G Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onGoToStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'demo' | 'student' | 'teacher'>('google');

  // Google Sign-In State
  const [gmailInput, setGmailInput] = useState('ambrishsinghp@gmail.com');
  const [googleRole, setGoogleRole] = useState<'student' | 'teacher'>('student');
  const [googleAge, setGoogleAge] = useState<AgeGroup>('8-10');

  // Student Avatar State
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<AgeGroup>('8-10');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].emoji);

  // Teacher Form State
  const [teacherName, setTeacherName] = useState('');
  const [schoolClass, setSchoolClass] = useState('');

  // Validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google Sign-In Handler
  const handleGoogleSignIn = (emailAddress?: string) => {
    const emailToUse = (emailAddress || gmailInput).trim();
    if (!emailToUse || !emailToUse.includes('@')) {
      setErrorMsg('Please enter a valid Gmail address!');
      return;
    }

    // Derive a clean display name from email (e.g. "ambrishsinghp" -> "Ambrish Singh")
    const usernamePart = emailToUse.split('@')[0];
    const formattedName = usernamePart
      .replace(/[._-]/g, ' ')
      .replace(/\d+/g, '')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Google Learner';

    const profile: UserProfile = {
      id: `google-${Date.now()}`,
      role: googleRole,
      displayName: formattedName,
      email: emailToUse,
      authProvider: 'google',
      avatar: googleRole === 'teacher' ? '👩‍🏫' : '🌟',
      ageGroup: googleRole === 'student' ? googleAge : undefined,
      schoolOrClass: googleRole === 'teacher' ? 'Educator Classroom' : undefined,
      createdAt: new Date().toLocaleDateString('en-US'),
      streakDays: 2,
    };

    onLogin(profile);
  };

  // Student Form Handler
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = studentName.trim();
    if (!cleanName) {
      setErrorMsg('Please choose an explorer nickname!');
      return;
    }

    const profile: UserProfile = {
      id: `student-${Date.now()}`,
      role: 'student',
      displayName: cleanName,
      avatar: selectedAvatar,
      ageGroup: studentAge,
      authProvider: 'pin',
      createdAt: new Date().toLocaleDateString('en-US'),
      streakDays: 1,
    };

    onLogin(profile);
  };

  // Teacher Form Handler
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = teacherName.trim();
    if (!cleanName) {
      setErrorMsg('Please enter your educator or parent name!');
      return;
    }

    const profile: UserProfile = {
      id: `teacher-${Date.now()}`,
      role: 'teacher',
      displayName: cleanName,
      avatar: '👩‍🏫',
      schoolOrClass: schoolClass.trim() || 'Classroom Learning',
      authProvider: 'pin',
      createdAt: new Date().toLocaleDateString('en-US'),
      streakDays: 1,
    };

    onLogin(profile);
  };

  // Quick Demo Handlers
  const handleDemoStudent = () => {
    onLogin({
      id: 'demo-student-alex',
      role: 'student',
      displayName: 'Alex the Explorer',
      avatar: '🦊',
      ageGroup: '8-10',
      authProvider: 'demo',
      createdAt: 'Demo Session',
      streakDays: 3,
    });
  };

  const handleDemoTeacher = () => {
    onLogin({
      id: 'demo-teacher-harper',
      role: 'teacher',
      displayName: 'Ms. Harper',
      avatar: '👩‍🏫',
      schoolOrClass: 'Oakridge Elementary (Grade 4)',
      authProvider: 'demo',
      createdAt: 'Demo Session',
      streakDays: 5,
    });
  };

  const handleDemoSenior = () => {
    onLogin({
      id: 'demo-senior-jordan',
      role: 'student',
      displayName: 'Jordan (Scholar)',
      avatar: '🦉',
      ageGroup: '15+',
      authProvider: 'demo',
      createdAt: 'Demo Session',
      streakDays: 4,
    });
  };

  const handleDemoGuest = () => {
    onLogin({
      id: 'demo-guest',
      role: 'student',
      displayName: 'Guest Explorer',
      avatar: '🚀',
      ageGroup: '8-10',
      authProvider: 'demo',
      createdAt: 'Guest Session',
      streakDays: 1,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20 animate-fade-in">
      {/* Active User Card (when logged in) */}
      {currentUser ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-indigo-100 p-8 text-center shadow-xl shadow-indigo-100/40 relative">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 border-4 border-indigo-200 flex items-center justify-center text-5xl mx-auto mb-4 shadow-sm">
            {currentUser.avatar}
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
              {currentUser.role === 'teacher' ? 'Educator Account' : `Student (Age ${currentUser.ageGroup || '8-10'})`}
            </span>
            {currentUser.authProvider === 'google' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <GoogleIcon />
                <span>Google Account</span>
              </span>
            )}
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mb-1">
            Welcome back, {currentUser.displayName}!
          </h1>

          {currentUser.email && (
            <p className="text-xs text-slate-500 font-mono mb-4 flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </p>
          )}

          {currentUser.schoolOrClass && (
            <p className="text-xs text-slate-600 font-medium mb-4">
              {currentUser.schoolOrClass}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 my-6 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Account Mode:</span>
              <span className="font-bold text-slate-800 capitalize">
                {currentUser.role === 'teacher' ? 'Classroom Guide' : 'Student Learner'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Daily Streak:</span>
              <span className="font-bold text-amber-600">🔥 {currentUser.streakDays} Days</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToStudio}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Go to Story Studio</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold text-sm border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Switch</span>
            </button>
          </div>
        </div>
      ) : (
        /* Sign-In Options (Not Logged In) */
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe Educational Sign-In • Google Gmail & Instant Demo Ready</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Sign In to FableSTEM
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Log in with your Gmail account or pick an instant demo profile to get started!
            </p>
          </div>

          {/* Quick Demo Options Section (Highlighted Prominently) */}
          <div className="mb-8 bg-gradient-to-r from-amber-50 via-indigo-50/60 to-purple-50 rounded-3xl border border-amber-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>⚡ Instant Demo Access (No Password or Account Required):</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Click any demo profile to test Story Teacher immediately:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={handleDemoStudent}
                className="p-2.5 rounded-2xl bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="text-xl mb-0.5">🦊</div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-700">Alex (Age 8)</div>
                <div className="text-[10px] text-slate-500">Student Demo</div>
              </button>

              <button
                type="button"
                onClick={handleDemoTeacher}
                className="p-2.5 rounded-2xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="text-xl mb-0.5">👩‍🏫</div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">Ms. Harper</div>
                <div className="text-[10px] text-slate-500">Teacher Demo</div>
              </button>

              <button
                type="button"
                onClick={handleDemoSenior}
                className="p-2.5 rounded-2xl bg-white hover:bg-purple-50 hover:border-purple-300 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="text-xl mb-0.5">🦉</div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-purple-700">Jordan (Age 15+)</div>
                <div className="text-[10px] text-slate-500">Advanced Demo</div>
              </button>

              <button
                type="button"
                onClick={handleDemoGuest}
                className="p-2.5 rounded-2xl bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="text-xl mb-0.5">🚀</div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-amber-700">Guest Explorer</div>
                <div className="text-[10px] text-slate-500">Quick Guest</div>
              </button>
            </div>
          </div>

          {/* Card Container for Sign In Options */}
          <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/40 p-6 sm:p-9 relative">
            {/* Tab Selector */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('google');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'google'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <GoogleIcon />
                <span>Gmail / Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Kid Avatar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('teacher');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'teacher'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Educator</span>
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* TAB 1: Google / Gmail Sign In */}
            {activeTab === 'google' && (
              <div className="space-y-6">
                {/* 1-Tap Google Account Card (Pre-filled detected account) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Quick 1-Tap Google Sign-In:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn('ambrishsinghp@gmail.com')}
                    className="w-full p-3.5 rounded-2xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 flex items-center justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-700">
                        A
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 flex items-center gap-1.5">
                          <span>Continue as Ambrish Singh</span>
                          <GoogleIcon />
                        </div>
                        <div className="text-xs text-slate-500">ambrishsinghp@gmail.com</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Or enter another Gmail */}
                <div className="relative text-center my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative bg-white px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Or Sign In with Any Gmail
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Gmail Address:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={gmailInput}
                        onChange={(e) => {
                          setGmailInput(e.target.value);
                          setErrorMsg(null);
                        }}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="absolute left-3.5 top-3.5">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Role Option for Google Account */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Account Role:
                      </label>
                      <select
                        value={googleRole}
                        onChange={(e) => setGoogleRole(e.target.value as 'student' | 'teacher')}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                      >
                        <option value="student">Student / Learner</option>
                        <option value="teacher">Teacher / Parent</option>
                      </select>
                    </div>

                    {googleRole === 'student' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Age Group:
                        </label>
                        <select
                          value={googleAge}
                          onChange={(e) => setGoogleAge(e.target.value as AgeGroup)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                        >
                          <option value="5-7">Ages 5–7 (Early)</option>
                          <option value="8-10">Ages 8–10 (Explorer)</option>
                          <option value="11-14">Ages 11–14 (Scholar)</option>
                          <option value="15+">Ages 15+ (Advanced)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn()}
                    className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GoogleIcon />
                    <span>Sign In with Gmail</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Kid Explorer Avatar Sign In */}
            {activeTab === 'student' && (
              <form onSubmit={handleStudentSubmit} className="space-y-6">
                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Pick Your Explorer Character:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.emoji)}
                        className={`p-2.5 rounded-2xl text-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                          selectedAvatar === av.emoji
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300 scale-105'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                        title={av.label}
                      >
                        <span>{av.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nickname */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Explorer Nickname: <span className="text-indigo-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="e.g. Leo the Curious, Starlight Explorer..."
                    maxLength={30}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Age Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Your Age Group:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['5-7', '8-10', '11-14', '15+'] as AgeGroup[]).map((ag) => (
                      <button
                        key={ag}
                        type="button"
                        onClick={() => setStudentAge(ag)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          studentAge === ag
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Age {ag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Learning with Explorer Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 3: Educator / Parent Form */}
            {activeTab === 'teacher' && (
              <form onSubmit={handleTeacherSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Educator / Parent Name: <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => {
                      setTeacherName(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="e.g. Mrs. Sharma, Teacher David, Homeschool Guide..."
                    maxLength={40}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Class or School Name (Optional):
                  </label>
                  <input
                    type="text"
                    value={schoolClass}
                    onChange={(e) => setSchoolClass(e.target.value)}
                    placeholder="e.g. Lincoln Elementary (Grade 3), Science Club..."
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Enter Educator & Classroom Mode</span>
                </button>
              </form>
            )}

            {/* Privacy reminder footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FableSTEM is 100% child-safe, ad-free, and COPPA friendly.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
