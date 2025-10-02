import React from 'react';

interface ToastProps {
  message: string | null;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div 
        key={message} // Use key to re-trigger animation on new message
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-6 rounded-full shadow-lg z-50 animate-slide-in-up"
    >
      {message}
    </div>
  );
};

export default Toast;