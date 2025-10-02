import React, { useState, useRef } from 'react';
import { type SavedLesson } from '../types';
import SavedLessonsList from './SavedLessonsList';
import './Hero.css';


interface HeroProps {
  onGenerate: (plainText: string, richText: string) => void;
  isLoading: boolean;
  savedLessons: SavedLesson[];
  onLoadLesson: (lesson: SavedLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onGenerate, isLoading, savedLessons, onLoadLesson, onDeleteLesson }) => {
  const [error, setError] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plainText = editorRef.current?.innerText || '';
    const richText = editorRef.current?.innerHTML || '';
    
    if (plainText.trim().length < 150) { // Simple validation
        setError('Please enter at least 150 characters of text to generate a lesson.');
        return;
    }
    setError('');
    onGenerate(plainText, richText);
  };
  
  const handleInput = () => {
      if(error) setError('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 animate-fade-in">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-light mb-4">Transform Any Text into an ESL Lesson</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Paste any English article, story, or text below and instantly generate a complete lesson plan with vocabulary, a comprehension quiz, and discussion questions.
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div
            ref={editorRef}
            contentEditable={!isLoading}
            onInput={handleInput}
            className="rich-text-editor text-left"
            data-placeholder="Paste your article text here..."
            aria-label="Article text input"
          />
          {error && <p className="text-yellow-400 mt-2">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand-primary text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Lesson...
                </>
              ) : 'Generate Lesson'}
            </button>
          </div>
        </form>
      </div>

       {savedLessons.length > 0 && (
        <div className="mt-16 w-full max-w-4xl">
          <SavedLessonsList
            lessons={savedLessons}
            onLoad={onLoadLesson}
            onDelete={onDeleteLesson}
          />
        </div>
      )}
    </div>
  );
};

export default Hero;