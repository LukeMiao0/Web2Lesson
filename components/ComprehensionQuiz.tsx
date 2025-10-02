import React, { useState, useEffect } from 'react';
import { type QuizQuestion } from '../types';
import SectionCard from './SectionCard';

interface ComprehensionQuizProps {
  questions: QuizQuestion[];
  onRefreshQuiz: () => Promise<void>;
  isQuizLoading: boolean;
}

const QuizIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ComprehensionQuiz: React.FC<ComprehensionQuizProps> = ({ questions, onRefreshQuiz, isQuizLoading }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  const score = Object.keys(answers).reduce((acc, key) => {
    const index = parseInt(key, 10);
    return answers[index] === questions[index].correctAnswer ? acc + 1 : acc;
  }, 0);

  // Reset state whenever the questions array changes
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [questions]);

  const handleSelect = (questionIndex: number, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const getOptionClass = (questionIndex: number, option: string) => {
    if (!submitted) {
      return answers[questionIndex] === option ? 'bg-brand-primary' : 'bg-gray-700 hover:bg-gray-600';
    }
    const isCorrect = option === questions[questionIndex].correctAnswer;
    const isSelected = answers[questionIndex] === option;

    if (isCorrect) return 'bg-green-500 border-green-400';
    if (isSelected && !isCorrect) return 'bg-red-500 border-red-400';
    return 'bg-gray-700 border-gray-600 opacity-60';
  };
  
  return (
    <SectionCard title="Comprehension Quiz" icon={<QuizIcon/>} style={{ animationDelay: '200ms' }}>
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i}>
            <p className="font-semibold text-lg mb-3 text-brand-light">{i + 1}. {q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((option, j) => (
                <button
                  key={j}
                  onClick={() => handleSelect(i, option)}
                  disabled={submitted || isQuizLoading}
                  className={`p-3 rounded-lg text-left transition-all duration-200 border-2 border-transparent ${getOptionClass(i, option)}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
         <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!submitted ? (
                <button
                    onClick={() => setSubmitted(true)}
                    className="w-full sm:w-auto bg-brand-primary text-white font-bold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={Object.keys(answers).length !== questions.length || isQuizLoading}
                >
                    Submit Answers
                </button>
            ) : (
                <div className="w-full sm:w-auto text-center sm:text-left bg-gray-800 p-4 rounded-lg">
                    <p className="text-xl font-bold">Your Score: <span className="text-brand-primary">{score} / {questions.length}</span></p>
                </div>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
                <button
                    onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="flex-1 sm:flex-auto bg-brand-secondary text-brand-light font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    disabled={isQuizLoading}
                >
                    Reset
                </button>
                <button
                    onClick={onRefreshQuiz}
                    disabled={isQuizLoading}
                    className="flex-1 sm:flex-auto bg-brand-secondary text-brand-light font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isQuizLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" transform="rotate(270 12 12)"/>
                     </svg>
                    Reshuffle
                </button>
            </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ComprehensionQuiz;