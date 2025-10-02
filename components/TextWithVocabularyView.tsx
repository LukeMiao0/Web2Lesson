import React from 'react';
import OriginalText from './OriginalText';
import VocabularySection from './VocabularySection';
import { type VocabularyItem } from '../types';

interface TextWithVocabularyViewProps {
  originalRichText: string;
  vocabulary: VocabularyItem[];
  onAddWord: (word: string) => Promise<void>;
  isAddingWord: boolean;
  onRemoveWord: (word: string) => void;
}

const TextWithVocabularyView: React.FC<TextWithVocabularyViewProps> = ({
  originalRichText,
  vocabulary,
  onAddWord,
  isAddingWord,
  onRemoveWord,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col">
        <OriginalText
          originalRichText={originalRichText}
          vocabulary={vocabulary}
          onAddWord={onAddWord}
          isAddingWord={isAddingWord}
          onRemoveWord={onRemoveWord}
        />
      </div>
      <div className="flex flex-col">
        <VocabularySection
          vocabulary={vocabulary}
          onAddWord={onAddWord}
          isAddingWord={isAddingWord}
        />
      </div>
    </div>
  );
};

export default TextWithVocabularyView;