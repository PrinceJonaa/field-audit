
import React, { useState, useMemo, useEffect } from 'react';

export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string; // Optional category for future use
}

interface GlossaryModalProps {
  terms: GlossaryTerm[];
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ terms, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = useMemo(() => {
    if (!searchTerm.trim()) {
      return terms.sort((a, b) => a.term.localeCompare(b.term));
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return terms
      .filter(
        (item) =>
          item.term.toLowerCase().includes(lowerSearchTerm) ||
          item.definition.toLowerCase().includes(lowerSearchTerm)
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, searchTerm]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out"
      onClick={onClose} // Close on backdrop click
      aria-modal="true"
      role="dialog"
      aria-labelledby="glossary-title"
    >
      <div 
        className="bg-gray-800 text-gray-100 p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-purple-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="glossary-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Relational Math Glossary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close glossary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <input
          type="text"
          placeholder="Search terms or definitions..."
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-200 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search glossary terms"
        />

        <div className="overflow-y-auto flex-grow pr-2 custom-scrollbar">
          {filteredTerms.length > 0 ? (
            <dl>
              {filteredTerms.map((item) => (
                <div key={item.term} className="mb-5 pb-3 border-b border-gray-700 last:border-b-0 last:mb-0">
                  <dt className="text-lg font-semibold text-purple-300">{item.term}</dt>
                  <dd className="mt-1 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{item.definition}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-gray-400 text-center py-4">No terms found matching your search.</p>
          )}
        </div>
      </div>
      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937; /* gray-800 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563; /* gray-600 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; /* gray-500 */
        }
      `}
      </style>
    </div>
  );
};
