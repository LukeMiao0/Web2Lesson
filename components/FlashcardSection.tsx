import React, { useState } from 'react';
import { type VocabularyItem } from '../types';
import SectionCard from './SectionCard';

const FlashcardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2" />
    </svg>
);

interface FlashcardSectionProps {
  vocabulary: VocabularyItem[];
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({ vocabulary }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (vocabulary.length === 0) {
    return (
      <SectionCard title="Vocabulary Flashcards" icon={<FlashcardIcon />}>
        <p className="text-center text-gray-400">No vocabulary words available to create flashcards.</p>
      </SectionCard>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
    }, 200); // Allow time for flip-back animation
  };
  
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
    }, 200);
  };

  const currentWord = vocabulary[currentIndex];

  return (
    <SectionCard title="Vocabulary Flashcards" icon={<FlashcardIcon />} style={{ animationDelay: '200ms' }}>
      <div className="h-64 [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div 
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          {/* Front */}
          <div className="absolute w-full h-full [backface-visibility:hidden] bg-gray-700 rounded-lg flex items-center justify-center p-4 shadow-lg">
            <h3 className="text-3xl md:text-4xl font-bold text-center text-brand-light">{currentWord.word}</h3>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-brand-primary rounded-lg flex flex-col justify-center p-6 text-left text-white shadow-lg">
            <p className="text-lg mb-2"><strong className="font-semibold text-brand-dark">Definition:</strong> {currentWord.definition}</p>
            <p className="italic text-gray-800"><strong className="font-semibold text-brand-dark not-italic">Example:</strong> "{currentWord.example}"</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button 
            onClick={handlePrev}
            className="bg-brand-secondary text-brand-light font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Prev
        </button>
        <span className="font-semibold text-gray-400">{currentIndex + 1} / {vocabulary.length}</span>
        <button 
            onClick={handleNext}
            className="bg-brand-secondary text-brand-light font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </SectionCard>
  );
};

export default FlashcardSection;
