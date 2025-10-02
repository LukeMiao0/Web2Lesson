import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { type QuizQuestion, type StudentResult } from '../types';
import SectionCard from './SectionCard';

interface QuizResultsProps {
  questions: QuizQuestion[];
  results: StudentResult[];
}

const ResultsIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const QuizResults: React.FC<QuizResultsProps> = ({ questions, results }) => {

  const analysis = useMemo(() => {
    const totalParticipants = results.length;
    if (totalParticipants === 0) return null;

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = totalScore / totalParticipants;
    const averagePercentage = (averageScore / questions.length) * 100;

    const questionBreakdown = questions.map((q, qIndex) => {
      const data = q.options.map(option => ({
        option,
        count: results.filter(r => r.answers[qIndex] === option).length,
      }));
      return {
        question: q.question,
        correctAnswer: q.correctAnswer,
        data,
      };
    });

    return {
      totalParticipants,
      averagePercentage,
      questionBreakdown,
    };
  }, [results, questions]);

  return (
    <SectionCard title="Live Quiz Results" icon={<ResultsIcon />}>
      {results.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Waiting for student submissions... Scan a student's QR code to see results here.</p>
      ) : (
        <div className="space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Participants</p>
              <p className="text-3xl font-bold text-brand-light">{analysis?.totalParticipants}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Average Score</p>
              <p className="text-3xl font-bold text-brand-primary">{analysis?.averagePercentage.toFixed(1)}%</p>
            </div>
          </div>
          
          {/* Student Scores */}
          <div>
             <h3 className="text-xl font-bold text-brand-light mb-3">Leaderboard</h3>
             <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2 bg-gray-800 p-2 rounded-lg">
                <ul className="space-y-2">
                    {results
                        .slice() // Create a copy to sort
                        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
                        .map((result, index) => (
                            <li key={index} className="flex justify-between items-center bg-brand-secondary p-3 rounded-md">
                                <span className="font-semibold">{result.name}</span>
                                <span className="font-bold text-brand-primary">{result.score} / {questions.length}</span>
                            </li>
                    ))}
                </ul>
             </div>
          </div>

          {/* Question Breakdown */}
          <div>
            <h3 className="text-xl font-bold text-brand-light mb-4">Question Breakdown</h3>
            <div className="space-y-8">
              {analysis?.questionBreakdown.map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg">
                  <p className="font-semibold mb-4">{index + 1}. {item.question}</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={item.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="option" stroke="#A0AEC0" />
                        <YAxis allowDecimals={false} stroke="#A0AEC0" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
                            labelStyle={{ color: '#E2E8F0' }}
                        />
                        <Bar dataKey="count" name="Responses" fill="#00ADB5">
                            {item.data.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.option === item.correctAnswer ? '#48BB78' : '#00ADB5'} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-right mt-2 text-green-400">Correct Answer: {item.correctAnswer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </SectionCard>
  );
};

export default QuizResults;
