import React from 'react';
import SectionCard from './SectionCard';

interface SummarySectionProps {
  summary: string;
}

const SummaryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);


const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  return (
    <SectionCard title="Summary" icon={<SummaryIcon/>}>
        <p>{summary}</p>
    </SectionCard>
  );
};

export default SummarySection;