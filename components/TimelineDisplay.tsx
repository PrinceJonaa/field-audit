import React from 'react';
import { TimelineEvent, ChoiceFork } from '../types';
import { SelectableText } from './SelectableText'; // Import SelectableText
import { LoadingSpinner } from './LoadingSpinner';

interface TimelineDisplayProps {
  timeline: TimelineEvent[];
  currentForks: ChoiceFork[];
  onSelectFork: (fork: ChoiceFork) => void;
  isLoadingNextForks: boolean;
  onTermSelect: (selectedText: string, targetRect: DOMRect | null) => void;
}

export const TimelineDisplay: React.FC<TimelineDisplayProps> = ({
  timeline,
  currentForks,
  onSelectFork,
  isLoadingNextForks,
  onTermSelect,
}) => {
  if (timeline.length === 0 && currentForks.length === 0 && !isLoadingNextForks) {
    return (
        <div className="mt-6 p-4 bg-gray-700 bg-opacity-30 rounded-lg text-center text-gray-400 text-sm">
            Initial choice vectors from your analysis (if any) will appear here, or after you make a choice if none were initially provided.
        </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <h3 className="text-xl font-semibold text-purple-300 mb-6">Choice Timeline & Next Vectors</h3>

      {/* Render Timeline Events */}
      {timeline.length > 0 && (
        <div className="mb-8 space-y-6 relative pl-5 before:content-[''] before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-500/50">
          {timeline.map((event, index) => (
            <div key={event.id} className="relative timeline-event-node">
              <div className="absolute left-[-22px] top-1.5 w-5 h-5 bg-purple-500 rounded-full border-2 border-gray-800"></div>
              <p className="text-xs text-gray-400 mb-1">Step {index + 1}</p>
              <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg shadow">
                <p className="font-semibold text-purple-300 mb-1">
                  <SelectableText onTermSelect={onTermSelect}>Choice Taken: <span className="font-normal text-gray-200">{event.choice}</span></SelectableText>
                </p>
                <p className="text-gray-300 text-sm">
                  <SelectableText onTermSelect={onTermSelect}>→ Potential Unfolding: <span className="text-gray-400">{event.outcome}</span></SelectableText>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Current Available Forks or Loading State */}
      {isLoadingNextForks && <LoadingSpinner />}

      {!isLoadingNextForks && currentForks.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-purple-400 mb-4">
            {timeline.length > 0 ? 'Next Potential Choice Vectors:' : 'Initial Choice Vectors:'}
          </h4>
          <div className="space-y-4">
            {currentForks.map((fork, index) => (
              <div key={index} className="p-4 bg-gray-700 hover:bg-gray-600/70 transition-colors duration-200 rounded-lg shadow-md border border-gray-600">
                <button
                  onClick={() => onSelectFork(fork)}
                  className="timeline-choice-button text-left w-full focus:outline-none group"
                  aria-label={`Select choice: ${fork.choice}`}
                >
                  <p className="font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-150 text-base mb-1">
                    {/* Choice text itself is a button, not selectable for glossary to avoid conflict */}
                    {fork.choice}
                  </p>
                </button>
                <p className="text-gray-300 text-sm pl-1">
                  <SelectableText onTermSelect={onTermSelect}>→ Potential Unfolding: <span className="text-gray-400">{fork.outcome}</span></SelectableText>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoadingNextForks && currentForks.length === 0 && timeline.length > 0 && (
        <p className="text-gray-400 text-center py-4">
          No further distinct choice vectors presented for this path, or the timeline has reached a point of convergence. You can continue the conversation with the Relational Mirror.
        </p>
      )}
       <style>{`
        .timeline-event-node:last-child::before {
          // Could add specific styling for the last node if needed, e.g. different dot or end of line.
        }
      `}</style>
    </div>
  );
};
