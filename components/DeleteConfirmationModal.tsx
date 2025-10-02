import React, { useState, useEffect } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lessonTitle: string;
}

const CONFIRMATION_TEXT = 'DELETE';

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, lessonTitle }) => {
  const [inputValue, setInputValue] = useState('');

  // Reset input when modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow closing animation
      setTimeout(() => setInputValue(''), 200);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isConfirmed = inputValue.toLowerCase() === CONFIRMATION_TEXT.toLowerCase();

  const handleConfirm = () => {
    if(isConfirmed) {
        onConfirm();
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-brand-secondary rounded-xl shadow-lg p-6 sm:p-8 m-4 max-w-md w-full animate-slide-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <h2 className="text-2xl font-bold text-red-400 mb-4">Confirm Deletion</h2>
        <p className="text-gray-300 mb-2">
          This action is irreversible and will permanently delete the lesson:
        </p>
        <p className="text-brand-light font-semibold bg-gray-800 p-2 rounded-md mb-6 truncate">
          {lessonTitle}
        </p>
        <p className="text-gray-300 mb-2">
          Please type <strong className="text-red-400 font-bold">{CONFIRMATION_TEXT}</strong> below to confirm.
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors text-center font-mono"
          autoFocus
        />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;