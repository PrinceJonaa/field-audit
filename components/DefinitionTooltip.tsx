import React from 'react';

interface DefinitionTooltipProps {
  term: string;
  definition: string;
  x: number;
  y: number;
  onClose: () => void;
}

export const DefinitionTooltip: React.FC<DefinitionTooltipProps> = ({ term, definition, x, y, onClose }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    transform: 'translateX(-50%)', // Center the tooltip on the x coordinate
    zIndex: 100, // Ensure it's above other content
    width: '256px', // Equivalent to w-64
    maxWidth: '90vw', // Ensure it doesn't overflow too much on small screens
  };

  return (
    <div
      style={style}
      className="p-3 bg-gray-700 text-gray-200 rounded-lg shadow-xl border border-purple-600"
      role="tooltip"
      // Add a slight animation for appearing
      // onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing if not desired
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-purple-300">{term}</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-100 transition-colors p-1 -mr-1 -mt-1 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Close tooltip"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-sm leading-relaxed">{definition}</p>
    </div>
  );
};
