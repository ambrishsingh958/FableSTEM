/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StoryForm } from './components/StoryForm';
import { StoryView } from './components/StoryView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { LibraryModal } from './components/LibraryModal';
import { DemoPresetModal } from './components/DemoPresetModal';
import { ExplorePage } from './components/ExplorePage';
import { AgeLabPage } from './components/AgeLabPage';
import { FlashcardsPage } from './components/FlashcardsPage';
import { BadgesPage } from './components/BadgesPage';
import { TeacherPage } from './components/TeacherPage';
import { LoginPage } from './components/LoginPage';
import { Footer } from './components/Footer';
import {
  StoryData,
  QuizData,
  EvaluationResult,
  AgeGroup,
  SupportedLanguage,
  StoryLength,
  SavedStoryItem,
  ActiveNavTab,
  UserProfile,
} from './types';
import { generateStory, generateQuiz, evaluateQuiz, ApiError } from './services/api';

const LOCAL_STORAGE_KEY = 'story_teacher_saved_library_v1';
const USER_STORAGE_KEY = 'story_teacher_active_user_v1';

export default function App() {
  // Navigation: Primary Tab
  const [currentTab, setCurrentTab] = useState<ActiveNavTab>('studio');

  // Studio Flow View State: 'landing' | 'story' | 'quiz' | 'result'
  const [view, setView] = useState<'landing' | 'story' | 'quiz' | 'result'>('landing');

  // Active User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user to storage', e);
    }
    setCurrentTab('studio');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not remove user from storage', e);
    }
  };

  // Active Story & Quiz Data
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Loading States
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnsafeError, setIsUnsafeError] = useState(false);

  // Modals
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Saved Stories in Browser Storage
  const [savedStories, setSavedStories] = useState<SavedStoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync saved stories with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedStories));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [savedStories]);

  // Handler: Generate Story
  const handleGenerateStory = async (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
  }) => {
    setCurrentTab('studio');
    setIsLoadingStory(true);
    setErrorMessage(null);
    setIsUnsafeError(false);
    setQuizData(null);
    setUserAnswers({});
    setEvaluation(null);

    try {
      const result = await generateStory(params);
      setStoryData(result);
      setView('story');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      if (err instanceof ApiError && err.isUnsafe) {
        setIsUnsafeError(true);
        setErrorMessage(err.message);
      } else {
        setIsUnsafeError(false);
        setErrorMessage(
          err.message || 'Oops! Something went wrong while creating your story. Please try again.'
        );
      }
      setView('landing');
      document.getElementById('story-form-card')?.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setIsLoadingStory(false);
    }
  };

  // Handler: Start Quiz
  const handleTakeQuiz = async () => {
    if (!storyData) return;

    if (quizData && quizData.questions && quizData.questions.length > 0) {
      setView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoadingQuiz(true);
    setErrorMessage(null);

    try {
      const quiz = await generateQuiz({
        story: storyData.story,
        title: storyData.title,
        age_group: storyData.age_group,
        language: storyData.language,
      });

      setQuizData(quiz);
      setUserAnswers({});
      setView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Could not create quiz questions. Please try again.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Handler: Submit Quiz Answers
  const handleSubmitQuiz = async (answers: Record<number, string>) => {
    if (!storyData || !quizData) return;

    setUserAnswers(answers);
    setIsEvaluating(true);

    try {
      const evalResult = await evaluateQuiz({
        story: storyData.story,
        questions: quizData.questions,
        user_answers: answers,
        age_group: storyData.age_group,
        language: storyData.language,
      });

      setEvaluation(evalResult);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Automatically record story in savedStories if not already saved, or update score
      setSavedStories((prev) => {
        const existingIndex = prev.findIndex(
          (s) => s.title === storyData.title && s.topic === storyData.topic
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quizScore: {
              score: evalResult.score,
              total: evalResult.total,
            },
          };
          return updated;
        } else {
          const newStory: SavedStoryItem = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            topic: storyData.topic,
            title: storyData.title,
            age_group: storyData.age_group,
            language: storyData.language,
            story: storyData.story,
            reading_level: storyData.reading_level,
            vocabulary: storyData.vocabulary,
            takeaway: storyData.takeaway,
            quizScore: {
              score: evalResult.score,
              total: evalResult.total,
            },
          };
          return [newStory, ...prev];
        }
      });
    } catch (err: any) {
      alert(err.message || 'Could not evaluate answers. Please try submitting again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Handler: Save Story to Local Library
  const handleSaveStory = (story: StoryData) => {
    const isAlreadySaved = savedStories.some(
      (s) => s.title === story.title && s.topic === story.topic
    );

    if (isAlreadySaved) return;

    const newItem: SavedStoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      topic: story.topic,
      title: story.title,
      age_group: story.age_group,
      language: story.language,
      story: story.story,
      reading_level: story.reading_level,
      vocabulary: story.vocabulary,
      takeaway: story.takeaway,
    };

    setSavedStories((prev) => [newItem, ...prev]);
  };

  // Handler: Load Saved Story from Library
  const handleSelectSavedStory = (item: SavedStoryItem) => {
    const loadedData: StoryData = {
      title: item.title,
      story: item.story,
      reading_level: item.reading_level,
      takeaway: item.takeaway,
      vocabulary: item.vocabulary,
      topic: item.topic,
      age_group: item.age_group,
      language: item.language,
      length: 'medium',
      timestamp: Date.now(),
    };

    setStoryData(loadedData);
    setQuizData(null);
    setUserAnswers({});
    setEvaluation(null);
    setCurrentTab('studio');
    setView('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Delete from Library
  const handleDeleteStory = (id: string) => {
    setSavedStories((prev) => prev.filter((s) => s.id !== id));
  };

  // Handler: Clear Library
  const handleClearLibrary = () => {
    if (window.confirm('Are you sure you want to clear all saved stories?')) {
      setSavedStories([]);
    }
  };

  // Handler: Preset Selection
  const handleSelectPreset = (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
    autoLaunch?: boolean;
  }) => {
    setCurrentTab('studio');
    if (params.autoLaunch) {
      handleGenerateStory({
        topic: params.topic,
        age_group: params.age_group,
        language: params.language,
        length: params.length,
      });
    } else {
      setView('landing');
      setTimeout(() => {
        const input = document.getElementById('topic-input') as HTMLInputElement | null;
        if (input) {
          input.value = params.topic;
          input.focus();
        }
        document.getElementById('story-form-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const isCurrentStorySaved = Boolean(
    storyData &&
      savedStories.some(
        (s) => s.title === storyData.title && s.topic === storyData.topic
      )
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        savedStoriesCount={savedStories.length}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Story Studio */}
        {currentTab === 'studio' && (
          <div>
            {view === 'landing' && (
              <div>
                <Hero
                  onStartLearning={() => {
                    document.getElementById('story-form-card')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onExploreDemo={() => setIsDemoOpen(true)}
                />
                <StoryForm
                  onSubmit={handleGenerateStory}
                  isLoading={isLoadingStory}
                  errorMessage={errorMessage}
                  isUnsafeError={isUnsafeError}
                  defaultAgeGroup={currentUser?.ageGroup}
                  userName={currentUser?.displayName}
                />
              </div>
            )}

            {view === 'story' && storyData && (
              <StoryView
                storyData={storyData}
                onTakeQuiz={handleTakeQuiz}
                onNewStory={() => {
                  setView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSaveStory={handleSaveStory}
                isSaved={isCurrentStorySaved}
                isLoadingQuiz={isLoadingQuiz}
              />
            )}

            {view === 'quiz' && quizData && storyData && (
              <QuizView
                questions={quizData.questions}
                storyTitle={storyData.title}
                onBackToStory={() => setView('story')}
                onSubmitQuiz={handleSubmitQuiz}
                isSubmitting={isEvaluating}
              />
            )}

            {view === 'result' && evaluation && quizData && storyData && (
              <ResultView
                evaluation={evaluation}
                questions={quizData.questions}
                userAnswers={userAnswers}
                storyData={storyData}
                onReadStoryAgain={() => setView('story')}
                onNewStory={() => {
                  setView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        {/* Tab 2: Explore Library */}
        {currentTab === 'explore' && (
          <ExplorePage
            onSelectTopic={(params) => {
              handleGenerateStory({
                topic: params.topic,
                age_group: params.age_group,
                language: params.language,
                length: params.length,
              });
            }}
          />
        )}

        {/* Tab 3: Age Lab */}
        {currentTab === 'agelab' && (
          <AgeLabPage
            onLaunchStory={(params) => {
              handleGenerateStory({
                topic: params.topic,
                age_group: params.age_group,
                language: params.language,
                length: params.length,
              });
            }}
          />
        )}

        {/* Tab 4: Flashcards & Word Explorer */}
        {currentTab === 'flashcards' && (
          <FlashcardsPage
            savedStories={savedStories}
            onOpenStory={handleSelectSavedStory}
          />
        )}

        {/* Tab 5: Badges Room */}
        {currentTab === 'badges' && (
          <BadgesPage
            savedStories={savedStories}
            onStartReading={() => {
              setCurrentTab('studio');
              setView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tab 6: Educator & Parent Toolkit */}
        {currentTab === 'teacher' && (
          <TeacherPage
            savedStories={savedStories}
            onOpenStory={handleSelectSavedStory}
          />
        )}

        {/* Tab 7: Login & Explorer Profile */}
        {currentTab === 'login' && (
          <LoginPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onGoToStudio={() => {
              setCurrentTab('studio');
              setView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Loading Overlays */}
      {isLoadingStory && (
        <LoadingOverlay type="story" topic={storyData?.topic} />
      )}
      {isLoadingQuiz && (
        <LoadingOverlay type="quiz" topic={storyData?.title} />
      )}
      {isEvaluating && (
        <LoadingOverlay type="eval" topic={storyData?.title} />
      )}

      {/* Modals */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedStories={savedStories}
        onSelectStory={handleSelectSavedStory}
        onDeleteStory={handleDeleteStory}
        onClearLibrary={handleClearLibrary}
      />

      <DemoPresetModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
