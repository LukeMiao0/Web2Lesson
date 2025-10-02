import React, { useMemo, useState, useEffect, useRef } from 'react';
import { type VocabularyItem } from '../types';
import SectionCard from './SectionCard';
import './OriginalText.css';

interface OriginalTextProps {
  originalRichText: string;
  vocabulary: VocabularyItem[];
  onAddWord: (word: string) => Promise<void>;
  isAddingWord: boolean;
  onRemoveWord: (word: string) => void;
}

const TextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// Menu that appears on text selection
interface SelectionMenuProps {
  x: number;
  y: number;
  word: string;
  isWordInVocab: boolean;
  isAddingWord: boolean;
  onAdd: (word: string) => Promise<void>;
  onRemove: (word: string) => void;
  onClose: () => void;
}

const SelectionMenu: React.FC<SelectionMenuProps> = ({ x, y, word, isWordInVocab, isAddingWord, onAdd, onRemove, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [addError, setAddError] = useState<string | null>(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleAddClick = async () => {
        setAddError(null);
        try {
            await onAdd(word);
            onClose();
        } catch (error) {
            setAddError(error instanceof Error ? error.message : "Failed to add word.");
        }
    };
    
    const handleRemoveClick = () => {
        onRemove(word);
        onClose();
    };

    return (
        <div 
            ref={menuRef}
            className="selection-menu"
            style={{ left: `${x}px`, top: `${y}px` }}
            // Prevent mouseup from propagating to the text container and closing the menu
            onMouseUp={(e) => e.stopPropagation()} 
        >
            <div className="selection-menu-content">
                <p className="selection-menu-word">"{word}"</p>
                {isWordInVocab ? (
                    <button onClick={handleRemoveClick} className="selection-menu-button remove">
                        Remove from Vocabulary
                    </button>
                ) : (
                    <button onClick={handleAddClick} disabled={isAddingWord} className="selection-menu-button add">
                        {isAddingWord ? 'Adding...' : 'Add to Vocabulary'}
                    </button>
                )}
                {addError && <p className="selection-menu-error">{addError}</p>}
            </div>
        </div>
    );
};


const OriginalText: React.FC<OriginalTextProps> = ({ originalRichText, vocabulary, onAddWord, isAddingWord, onRemoveWord }) => {
    
    const [menuState, setMenuState] = useState<{ x: number; y: number; word: string } | null>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    const vocabMap = useMemo(() => 
        new Map(vocabulary.map(item => [item.word.toLowerCase(), item])),
    [vocabulary]);

    const handleMouseUp = () => {
        // A brief delay allows the browser to finalize the selection, especially on double-click
        setTimeout(() => {
            const selection = window.getSelection();
            if (selection && selection.toString().trim() && selection.rangeCount > 0) {
                const selectedText = selection.toString().trim();
                // Simple validation: single word, no numbers, basic punctuation removed at ends
                const cleanWord = selectedText.replace(/^[.,/#!$%^&*;:{}=\-_`~()]+|[.,/#!$%^&*;:{}=\-_`~()]+$/g,"");

                if (cleanWord && !/\s/.test(cleanWord) && !/\d/.test(cleanWord)) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    setMenuState({
                        // Position menu above the selection
                        x: rect.left + rect.width / 2, // Center horizontally
                        y: rect.top, // Position above
                        word: cleanWord,
                    });
                } else {
                    setMenuState(null);
                }
            } else {
                // This case handles clicks without selection
                if(menuState) setMenuState(null);
            }
        }, 10);
    };
    
    const highlightedContent = useMemo(() => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalRichText;

        // 1. Sanitize pasted content: Remove inline styles to enforce the app's theme and responsiveness.
        // This fixes issues with unreadable font colors on the dark theme and layout-breaking styles.
        tempDiv.querySelectorAll('*').forEach(el => {
            el.removeAttribute('style');
        });

        // 2. Remove all hyperlinks, keeping their text content.
        tempDiv.querySelectorAll('a').forEach(link => {
            const text = document.createTextNode(link.innerText);
            link.parentNode?.replaceChild(text, link);
        });

        // 3. Proceed with highlighting vocabulary
        if (vocabulary.length === 0) {
            return { __html: tempDiv.innerHTML };
        }

        const words = vocabulary.map(item => item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        if (words.length === 0) return { __html: tempDiv.innerHTML };
        
        const vocabRegex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
        
        function traverseAndHighlight(node: Node) {
            if (node.nodeType === 3) { // Text node
                const text = node.textContent;
                if (text && vocabRegex.test(text)) {
                    const fragment = document.createDocumentFragment();
                    const parts = text.split(vocabRegex);
                    
                    parts.forEach((part, index) => {
                        if (index % 2 === 1) { // It's a vocab word
                            const span = document.createElement('span');
                            span.className = 'highlighted-word';
                            const vocabItem = vocabMap.get(part.toLowerCase());
                            if (vocabItem) {
                                span.dataset.definition = vocabItem.definition;
                                span.dataset.example = vocabItem.example;
                            }
                            span.textContent = part;
                            fragment.appendChild(span);
                        } else if (part) {
                            fragment.appendChild(document.createTextNode(part));
                        }
                    });
                    node.parentNode?.replaceChild(fragment, node);
                }
            } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
                // Element node, recurse
                Array.from(node.childNodes).forEach(traverseAndHighlight);
            }
        }

        traverseAndHighlight(tempDiv);
        return { __html: tempDiv.innerHTML };
    }, [originalRichText, vocabulary, vocabMap]);

    return (
        <SectionCard title="Original Text" icon={<TextIcon />} className="w-full">
            {menuState && (
                <SelectionMenu
                    x={menuState.x}
                    y={menuState.y}
                    word={menuState.word}
                    isWordInVocab={vocabMap.has(menuState.word.toLowerCase())}
                    onAdd={onAddWord}
                    isAddingWord={isAddingWord}
                    onRemove={onRemoveWord}
                    onClose={() => setMenuState(null)}
                />
            )}
            <div 
                ref={textContainerRef}
                onMouseUp={handleMouseUp}
                className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar text-lg leading-loose original-text-content"
                dangerouslySetInnerHTML={highlightedContent}
            >
            </div>
        </SectionCard>
    );
};

export default OriginalText;