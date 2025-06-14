
import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = "Error", message }) => {
  return (
    <div 
      className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-4" 
      role="alert"
      aria-live="assertive" 
    >
      <strong className="font-bold block sm:inline">{title}: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};
