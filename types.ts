// types.ts

export interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LessonData {
  summary: string;
  vocabulary: VocabularyItem[];
  comprehensionQuiz: QuizQuestion[];
  discussionQuestions: string[];
}

// Represents a lesson that is saved to local storage
export interface SavedLesson extends LessonData {
    id: string;
    title: string;
    originalText: string;
    originalRichText: string;
    createdAt: string;
}

// Represents a student's submitted quiz results
// FIX: Added missing StudentResult type to resolve import error in QuizResults.tsx.
export interface StudentResult {
  name: string;
  answers: Record<number, string>;
  score: number;
}
