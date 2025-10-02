import React from 'react';
import { type LessonData } from '../types';

interface NavbarProps {
  currentLesson: { data: LessonData; id?: string } | null;
  onNewLesson: () => void;
  onSaveLesson: () => void;
  onDeleteLesson: (id: string) => void;
}

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const Navbar: React.FC<NavbarProps> = ({ currentLesson, onNewLesson, onSaveLesson, onDeleteLesson }) => {
  return (
    <nav className="bg-brand-secondary shadow-lg p-4 sticky top-0 z-50 animate-fade-in-down">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewLesson}>
            <svg className="h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-light">English Lessons for InfoTech</h1>
        </div>
        <div className="flex gap-2 sm:gap-4">
          {currentLesson ? (
            <>
              <button
                onClick={onSaveLesson}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                <SaveIcon />
                <span className="hidden sm:inline">{currentLesson.id ? 'Update Saved' : 'Save Lesson'}</span>
              </button>
              {currentLesson.id && (
                  <button
                    onClick={() => onDeleteLesson(currentLesson.id!)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
                  >
                    <DeleteIcon />
                     <span className="hidden sm:inline">Delete</span>
                  </button>
              )}
              <button
                onClick={onNewLesson}
                className="bg-gray-700 hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Start Over
              </button>
            </>
          ) : (
             <button
                onClick={onNewLesson}
                className="bg-gray-700 hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                New Lesson
              </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;