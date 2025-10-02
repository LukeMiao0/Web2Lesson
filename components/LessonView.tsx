import React from 'react';
import { type LessonData } from '../types';
import SummarySection from './SummarySection';
import FlashcardSection from './FlashcardSection';
import ComprehensionQuiz from './ComprehensionQuiz';
import DiscussionQuestions from './DiscussionQuestions';

interface LessonViewProps {
  lessonData: LessonData;
  onRefreshQuiz: () => Promise<void>;
  isQuizLoading: boolean;
}

const LessonView: React.FC<LessonViewProps> = ({ lessonData, onRefreshQuiz, isQuizLoading }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-8">
        <SummarySection summary={lessonData.summary} />
        <FlashcardSection vocabulary={lessonData.vocabulary} />
        <DiscussionQuestions questions={lessonData.discussionQuestions} />
      </div>
      <div className="flex flex-col gap-8">
        <ComprehensionQuiz 
            questions={lessonData.comprehensionQuiz}
            onRefreshQuiz={onRefreshQuiz}
            isQuizLoading={isQuizLoading}
        />
      </div>
    </div>
  );
};

export default LessonView;