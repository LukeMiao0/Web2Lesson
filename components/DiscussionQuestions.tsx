import React from 'react';
import SectionCard from './SectionCard';

interface DiscussionQuestionsProps {
  questions: string[];
}

const DiscussionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h4M5 8h2a2 2 0 012 2v6a2 2 0 01-2 2H5" />
    </svg>
);


const DiscussionQuestions: React.FC<DiscussionQuestionsProps> = ({ questions }) => {
  return (
    <SectionCard title="Discussion Questions" icon={<DiscussionIcon/>} style={{ animationDelay: '300ms' }}>
      <ul className="space-y-4 list-disc list-inside">
        {questions.map((q, i) => (
          <li key={i} className="text-lg">{q}</li>
        ))}
      </ul>
    </SectionCard>
  );
};

export default DiscussionQuestions;