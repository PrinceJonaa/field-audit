import React from 'react';

export interface SelectableTextProps {
  children: React.ReactNode;
  onTermSelect: (selectedText: string, targetRect: DOMRect | null) => void;
  className?: string; // Optional className for custom styling of the span
}

export const SelectableText: React.FC<SelectableTextProps> = ({ children, onTermSelect, className }) => {
  const handleMouseUp = (event: React.MouseEvent<HTMLSpanElement>) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    // Only trigger if actual text is selected, to avoid interfering with button clicks within this component
    if (selectedText && selectedText.length > 2) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      onTermSelect(selectedText, rect || null);
    } else {
      // If no text is selected, or selection is too short,
      // check if the click was on a button or link inside the selectable text.
      // If not, then clear the tooltip.
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest('button, a[href], .timeline-choice-button')) {
         onTermSelect('', null); // Clear any existing tooltip if click is not on interactive element or valid selection
      }
    }
  };
  return <span onMouseUp={handleMouseUp} className={className}>{children}</span>;
};
