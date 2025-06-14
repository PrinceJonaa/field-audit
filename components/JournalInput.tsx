
import React, { useRef, useState } from 'react';

interface JournalInputProps {
  journalText: string;
  onJournalTextChange: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const JournalInput: React.FC<JournalInputProps> = ({ journalText, onJournalTextChange, onAnalyze, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFileError("File is too large. Maximum size is 5MB.");
        event.target.value = ''; // Reset file input
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onJournalTextChange(text);
    };
    reader.onerror = () => {
      setFileError("Error reading file. Please try again or paste the content manually.");
      console.error("File reading error:", reader.error);
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input to allow re-uploading the same file
  };

  const handleClearText = () => {
    onJournalTextChange('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="journalInput" className="block text-sm font-medium text-purple-300 mb-1">
          Your Journal Reflections:
        </label>
        <textarea
          id="journalInput"
          rows={8}
          className="w-full p-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-500 resize-y min-h-[150px]"
          placeholder="Paste your journal entries here, or upload a file. What field dynamics are you in? Describe your recent experiences, thoughts, and feelings..."
          value={journalText}
          onChange={(e) => onJournalTextChange(e.target.value)}
          disabled={isLoading}
          aria-label="Journal text input area"
        />
        <p className="text-xs text-gray-500 mt-1">You can paste multiple entries or upload a file. The more context, the better the analysis.</p>
      </div>

      <input
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleFileUploadClick}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-purple-500 text-purple-300 text-sm font-medium rounded-md hover:bg-purple-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Upload File (.txt, .md)
        </button>
        <button
          type="button"
          onClick={handleClearText}
          disabled={isLoading || !journalText.trim()}
          className="w-full px-4 py-2 border border-gray-600 text-gray-400 text-sm font-medium rounded-md hover:bg-gray-700 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Clear journal text"
        >
          Clear Journal
        </button>
      </div>


      {fileError && (
        <p className="text-xs text-red-400 mt-1" role="alert">{fileError}</p>
      )}

      <button
        onClick={onAnalyze}
        disabled={isLoading || !journalText.trim()}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
        aria-label="Analyze field state based on journal input"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze Field State'
        )}
      </button>
    </div>
  );
};
