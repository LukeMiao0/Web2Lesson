import React, { useState } from 'react';
import { type VocabularyItem } from '../types';
import SectionCard from './SectionCard';

interface VocabularySectionProps {
  vocabulary: VocabularyItem[];
  onAddWord: (word: string) => Promise<void>;
  isAddingWord: boolean;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const VocabularyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const SpeakerIcon = ({ isSpeaking }: { isSpeaking: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        {isSpeaking && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.07 4.93a10 10 0 010 14.14" />}
    </svg>
);


const VocabularySection: React.FC<VocabularySectionProps> = ({ vocabulary, onAddWord, isAddingWord }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [newWord, setNewWord] = useState('');
  const [addWordError, setAddWordError] = useState<string | null>(null);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const speakWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the accordion from toggling via parent element

    if (!('speechSynthesis' in window)) {
      console.error("Browser doesn't support text-to-speech.");
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    if (speakingWord === word) {
      window.speechSynthesis.cancel();
      setSpeakingWord(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any previous utterance

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    utterance.onstart = () => setSpeakingWord(word);
    utterance.onend = () => setSpeakingWord(null);
    utterance.onerror = () => setSpeakingWord(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleAddWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    setAddWordError(null);
    try {
        await onAddWord(newWord.trim());
        setNewWord(''); // Clear input on success
    } catch (error) {
        if (error instanceof Error) {
            setAddWordError(error.message);
        } else {
            setAddWordError("An unknown error occurred.");
        }
    }
  };

  const handleDownload = () => {
    const header = "Key Vocabulary List\n\n";
    const content = vocabulary.map(item => 
      `Word: ${item.word}\nDefinition: ${item.definition}\nExample: "${item.example}"`
    ).join('\n\n---\n\n');
    
    const textToSave = header + content;
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vocabulary-list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cardActions = (
    <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-gray-700 hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
    >
        <DownloadIcon />
        Download List
    </button>
  );


  return (
    <SectionCard title="Key Vocabulary" icon={<VocabularyIcon/>} actions={cardActions} style={{ animationDelay: '100ms' }}>
      <div className="mb-6 pb-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-brand-light mb-3">Add a New Word</h3>
        <form onSubmit={handleAddWordSubmit} className="flex flex-col sm:flex-row gap-2">
            <input 
                type="text"
                value={newWord}
                onChange={(e) => { setNewWord(e.target.value); setAddWordError(null); }}
                placeholder="Enter a word from the text..."
                className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition-colors"
                disabled={isAddingWord}
            />
            <button
                type="submit"
                disabled={isAddingWord || !newWord.trim()}
                className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isAddingWord ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                    </>
                ) : "Add Word"}
            </button>
        </form>
        {addWordError && <p className="text-red-400 text-sm mt-2">{addWordError}</p>}
      </div>

      <div className="space-y-3">
        {vocabulary.map((item, index) => (
          <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 transition-colors text-left"
              aria-expanded={openIndex === index}
              aria-controls={`vocab-content-${index}`}
            >
              <div className="flex items-center gap-3">
                 <button
                    onClick={(e) => { speakWord(item.word, e); toggleItem(index); }}
                    className={`relative z-10 p-1 rounded-full transition-colors ${speakingWord === item.word ? 'text-brand-primary bg-gray-800' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    aria-label={`Pronounce ${item.word}`}
                    title={`Pronounce ${item.word}`}
                  >
                    <SpeakerIcon isSpeaking={speakingWord === item.word} />
                </button>
                <span className="font-semibold text-lg text-brand-light">{item.word}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 text-brand-primary transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              id={`vocab-content-${index}`}
              className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
            >
              <div className="p-4 bg-brand-secondary space-y-2 text-left">
                <p><strong className="text-brand-primary">Definition:</strong> {item.definition}</p>
                <p className="italic text-gray-400"><strong className="text-brand-primary not-italic">Example:</strong> "{item.example}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default VocabularySection;