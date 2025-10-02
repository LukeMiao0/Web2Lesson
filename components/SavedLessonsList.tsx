import React from 'react';
import { type SavedLesson } from '../types';

interface SavedLessonsListProps {
  lessons: SavedLesson[];
  onLoad: (lesson: SavedLesson) => void;
  onDelete: (lessonId: string) => void;
}

const SavedLessonsList: React.FC<SavedLessonsListProps> = ({ lessons, onLoad, onDelete }) => {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
      <div className="bg-brand-secondary rounded-xl shadow-lg w-full flex flex-col animate-slide-in-up">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-brand-light text-left">My Saved Lessons</h2>
        </div>
        <div className="p-6 space-y-4">
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">You haven't saved any lessons yet.</p>
              <p className="text-gray-500">Once you do, they'll appear here for easy access.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {lessons.map(lesson => (
                <div key={lesson.id} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-gray-700 hover:shadow-md">
                    <div className="flex-grow text-left">
                    <h3 className="font-bold text-xl text-brand-light">{lesson.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">Saved on {formatDate(lesson.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 self-stretch sm:self-center">
                    <button onClick={() => onLoad(lesson)} className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex-1 sm:flex-initial">Load</button>
                    <button onClick={() => onDelete(lesson.id)} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex-1 sm:flex-initial">Delete</button>
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default SavedLessonsList;