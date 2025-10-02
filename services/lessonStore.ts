import { type SavedLesson } from '../types';

const LESSONS_KEY = 'esl-genai-lessons';

export function getSavedLessons(): SavedLesson[] {
  try {
    const lessonsJson = localStorage.getItem(LESSONS_KEY);
    if (lessonsJson) {
      const lessons = JSON.parse(lessonsJson) as SavedLesson[];
      // Sort by newest first
      return lessons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (error) {
    console.error("Failed to load lessons from local storage:", error);
  }
  return [];
}

export function saveLesson(lesson: SavedLesson): void {
  try {
    const lessons = getSavedLessons();
    // Check if lesson with this ID already exists to avoid duplicates on resave
    const existingIndex = lessons.findIndex(l => l.id === lesson.id);
    if (existingIndex > -1) {
        lessons[existingIndex] = lesson;
    } else {
        lessons.unshift(lesson); // Add to the beginning
    }
    localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  } catch (error) {
    console.error("Failed to save lesson to local storage:", error);
  }
}

export function deleteLesson(lessonId: string): void {
  try {
    const lessons = getSavedLessons();
    const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
    localStorage.setItem(LESSONS_KEY, JSON.stringify(updatedLessons));
  } catch (error) {
    console.error("Failed to delete lesson from local storage:", error);
  }
}
