import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { type QuizQuestion } from '../types';

interface StudentQuizTakerProps {
  questions: QuizQuestion[];
}

const StudentQuizTaker: React.FC<StudentQuizTakerProps> = ({ questions }) => {
  const [name, setName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (submitted && qrCodeRef.current) {
      const submissionData = {
        name,
        answers,
      };
      QRCode.toCanvas(qrCodeRef.current, JSON.stringify(submissionData), { width: 320, margin: 2, errorCorrectionLevel: 'L' }, (error: Error | null) => {
        if (error) console.error(error);
      });
    }
  }, [submitted, name, answers]);

  const handleSelect = (questionIndex: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  if (submitted) {
    return (
      <div className="bg-brand-dark min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="bg-brand-secondary rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Quiz Submitted!</h1>
          <p className="text-gray-300 mb-6 text-lg">Thank you, {name}. Please show this QR code to your instructor.</p>
          <div className="bg-white p-4 rounded-lg inline-block">
            <canvas ref={qrCodeRef} />
          </div>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="bg-brand-dark min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
        <form 
            onSubmit={(e) => { e.preventDefault(); if (name.trim()) setHasStarted(true); }}
            className="bg-brand-secondary rounded-xl shadow-lg p-8 text-center max-w-sm w-full"
        >
          <h1 className="text-3xl font-bold text-brand-light mb-4">Join the Quiz</h1>
          <p className="text-gray-400 mb-6">Please enter your name to begin.</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition-colors text-lg text-center"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-6 w-full bg-brand-primary text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            Start Quiz
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark min-h-screen text-white font-sans p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-primary text-center mb-2">Comprehension Quiz</h1>
        <p className="text-center text-gray-400 mb-8 text-lg">Hi, {name}! Please answer the questions below.</p>
        <div className="space-y-8">
          {questions.map((q, i) => (
            <div key={i} className="bg-brand-secondary p-6 rounded-lg shadow-md">
              <p className="font-semibold text-xl mb-4 text-brand-light">{i + 1}. {q.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((option, j) => (
                  <button
                    key={j}
                    onClick={() => handleSelect(i, option)}
                    className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${answers[i] === option ? 'bg-brand-primary border-cyan-300' : 'bg-gray-700 hover:bg-gray-600 border-transparent'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center pt-4">
            <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length !== questions.length}
                className="w-full sm:w-auto bg-green-600 text-white font-bold text-lg py-3 px-12 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
            >
                Submit My Answers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizTaker;