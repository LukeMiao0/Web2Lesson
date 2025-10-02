import React, { useState, useEffect, useCallback } from 'react';
import { type LessonData, type VocabularyItem, type QuizQuestion, type SavedLesson } from './types';
import { generateLessonFromText, generateNewQuiz, defineWord } from './services/geminiService';
import * as lessonStore from './services/lessonStore';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import LessonView from './components/LessonView';
import TextWithVocabularyView from './components/TextWithVocabularyView';
import Toast from './components/Toast';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

type View = 'lesson' | 'text';

function App() {
  const [currentLesson, setCurrentLesson] = useState<{ data: LessonData; originalText: string; originalRichText: string; id?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('text');

  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isAddingWord, setIsAddingWord] = useState(false);

  const [savedLessons, setSavedLessons] = useState<SavedLesson[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<SavedLesson | null>(null);

  useEffect(() => {
    // Load saved lessons for teacher mode
    setSavedLessons(lessonStore.getSavedLessons());
  }, []);

  // Effect to manage toast timeout
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleGenerateLesson = useCallback(async (plainText: string, richText: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentLesson(null);
    try {
      const lessonData = await generateLessonFromText(plainText);
      setCurrentLesson({ data: lessonData, originalText: plainText, originalRichText: richText });
      setActiveView('text'); // Default to the reading view first
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while generating the lesson.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefreshQuiz = useCallback(async () => {
    if (!currentLesson) return;
    setIsQuizLoading(true);
    try {
      const newQuestions = await generateNewQuiz(currentLesson.originalText);
      setCurrentLesson(prev => prev ? { ...prev, data: { ...prev.data, comprehensionQuiz: newQuestions } } : null);
    } catch (err) {
      console.error("Failed to refresh quiz:", err);
      setToastMessage("Failed to get new questions.");
    } finally {
      setIsQuizLoading(false);
    }
  }, [currentLesson]);

  const handleAddWord = useCallback(async (word: string) => {
    if (!currentLesson) return;
    setIsAddingWord(true);
    try {
      const { definition, example } = await defineWord(word, currentLesson.originalText);
      const newVocabItem: VocabularyItem = { word, definition, example };
      
      setCurrentLesson(prev => {
        if (!prev) return null;
        if (prev.data.vocabulary.some(v => v.word.toLowerCase() === word.toLowerCase())) {
            return prev;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            vocabulary: [...prev.data.vocabulary, newVocabItem].sort((a,b) => a.word.localeCompare(b.word)),
          }
        };
      });
    } catch (err) {
        console.error("Failed to add word:", err);
        throw err;
    } finally {
      setIsAddingWord(false);
    }
  }, [currentLesson]);

  const handleRemoveWord = useCallback((wordToRemove: string) => {
    setCurrentLesson(prev => {
      if (!prev) return null;
      return {
        ...prev,
        data: {
          ...prev.data,
          vocabulary: prev.data.vocabulary.filter(item => item.word.toLowerCase() !== wordToRemove.toLowerCase()),
        }
      };
    });
  }, []);

  const handleSaveLesson = useCallback(() => {
    if (!currentLesson) return;

    const isUpdate = !!currentLesson.id;
    
    const title = isUpdate
        ? savedLessons.find(l => l.id === currentLesson.id)!.title
        : currentLesson.originalText.substring(0, 50).split(' ').slice(0, -1).join(' ') + '...';

    const lessonToSave: SavedLesson = {
        id: currentLesson.id || `lesson-${Date.now()}`,
        title,
        createdAt: new Date().toISOString(),
        originalText: currentLesson.originalText,
        originalRichText: currentLesson.originalRichText,
        ...currentLesson.data,
    };
    
    lessonStore.saveLesson(lessonToSave);
    setSavedLessons(lessonStore.getSavedLessons());
    setCurrentLesson(prev => prev ? { ...prev, id: lessonToSave.id } : null);
    setToastMessage(isUpdate ? "Lesson Updated!" : "Lesson Saved!");
  }, [currentLesson, savedLessons]);


  const handleLoadLesson = (lesson: SavedLesson) => {
    setCurrentLesson({
        data: {
            summary: lesson.summary,
            vocabulary: lesson.vocabulary,
            comprehensionQuiz: lesson.comprehensionQuiz,
            discussionQuestions: lesson.discussionQuestions,
        },
        originalText: lesson.originalText,
        originalRichText: lesson.originalRichText || lesson.originalText, // Fallback for older saved lessons
        id: lesson.id,
    });
    setActiveView('text');
  };

  // This now opens the confirmation modal
  const handleDeleteLesson = (lessonId: string) => {
    const lesson = savedLessons.find(l => l.id === lessonId);
    if (lesson) {
        setLessonToDelete(lesson);
    }
  };
  
  // This is called from the modal to perform the deletion
  const handleConfirmDelete = () => {
    if (!lessonToDelete) return;

    lessonStore.deleteLesson(lessonToDelete.id);
    setSavedLessons(lessonStore.getSavedLessons());
    setToastMessage("Lesson Deleted.");

    if (currentLesson?.id === lessonToDelete.id) {
        handleNewLesson();
    }
    setLessonToDelete(null); // Close the modal
  };

  const handleNewLesson = () => {
    setCurrentLesson(null);
    setError(null);
    setIsLoading(false);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <LoadingSpinner />
          <p className="mt-4 text-xl text-brand-light">Generating your lesson...</p>
          <p className="mt-2 text-gray-400">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return <ErrorDisplay message={error} onRetry={() => handleGenerateLesson(currentLesson?.originalText || '', currentLesson?.originalRichText || '')} />;
    }

    if (currentLesson) {
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="flex border-2 border-gray-700 rounded-lg p-1 bg-brand-secondary max-w-max mx-auto">
             <button
                 onClick={() => setActiveView('text')}
                 className={`px-6 py-2 rounded-md transition-colors font-semibold ${activeView === 'text' ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
             >
                 Read & Build
             </button>
             <button
                 onClick={() => setActiveView('lesson')}
                 className={`px-6 py-2 rounded-md transition-colors font-semibold ${activeView === 'lesson' ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
             >
                 Interactive Activities
             </button>
         </div>
          
          {activeView === 'lesson' && (
            <LessonView 
              lessonData={currentLesson.data}
              onRefreshQuiz={handleRefreshQuiz}
              isQuizLoading={isQuizLoading}
            />
          )}

          {activeView === 'text' && (
            <TextWithVocabularyView
              originalRichText={currentLesson.originalRichText}
              vocabulary={currentLesson.data.vocabulary}
              onAddWord={handleAddWord}
              isAddingWord={isAddingWord}
              onRemoveWord={handleRemoveWord}
            />
          )}
        </div>
      );
    }
    
    return (
        <Hero 
            onGenerate={handleGenerateLesson} 
            isLoading={isLoading} 
            savedLessons={savedLessons}
            onLoadLesson={handleLoadLesson}
            onDeleteLesson={handleDeleteLesson}
        />
    );
  };

  return (
    <div className="bg-brand-dark text-white min-h-screen font-sans">
      <Navbar 
        currentLesson={currentLesson}
        onNewLesson={handleNewLesson}
        onSaveLesson={handleSaveLesson}
        onDeleteLesson={handleDeleteLesson}
      />
      <main className="container mx-auto p-4 sm:p-8">
        {renderContent()}
      </main>
      <Toast message={toastMessage} />
      <DeleteConfirmationModal
        isOpen={!!lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onConfirm={handleConfirmDelete}
        lessonTitle={lessonToDelete?.title || ''}
      />
    </div>
  );
}

export default App;