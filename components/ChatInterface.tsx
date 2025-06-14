
import React, { useRef, useEffect } from 'react';
import { ChatMessage, GeminiError } from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentMessage: string;
  onCurrentMessageChange: (text: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  error: GeminiError | null;
  analysisContextAvailable: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentMessage,
  onCurrentMessageChange,
  onSendMessage,
  isLoading,
  error,
  analysisContextAvailable,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const prevIsChatLoadingRef = useRef<boolean>(isLoading);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (prevIsChatLoadingRef.current && !isLoading && chatInputRef.current) {
      // Chat was loading, and now it's not. Focus input.
      // A small delay can ensure the DOM is updated and element is focusable.
      setTimeout(() => chatInputRef.current?.focus(), 0);
    }
    prevIsChatLoadingRef.current = isLoading; // Update previous state for the next render
  }, [isLoading]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && currentMessage.trim()) {
        onSendMessage();
      }
    }
  };

  if (!analysisContextAvailable) {
    return (
      <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg text-center text-gray-400">
        Complete a field analysis to begin a conversation with the Relational Mirror.
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <h3 className="text-xl font-semibold text-purple-300 mb-4">Relational Mirror Conversation</h3>
      
      <div className="h-80 max-h-[50vh] overflow-y-auto p-4 bg-gray-700 bg-opacity-30 rounded-lg space-y-4 mb-4 border border-gray-600">
        {messages.length === 0 && !isLoading && (
          <p className="text-gray-500 text-center py-4">Ask a question about your analysis to begin the conversation...</p>
        )}
        {messages.map(msg => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
          <div className="flex justify-start">
            <div className="bg-gray-600 text-white p-3 rounded-lg max-w-xs lg:max-w-md animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
         <div 
           className="bg-red-900 bg-opacity-40 border border-red-700 text-red-300 px-3 py-2 rounded-md mb-3 text-sm" 
           role="alert"
           aria-live="assertive"
         >
          <strong>Chat Error:</strong> {error.message}
        </div>
      )}

      <div className="flex items-start space-x-3">
        <textarea
          ref={chatInputRef}
          rows={2}
          className="flex-grow p-3 bg-gray-700 bg-opacity-70 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-400 resize-none disabled:opacity-50"
          placeholder="Ask a question or share a reflection..."
          value={currentMessage}
          onChange={(e) => onCurrentMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !analysisContextAvailable}
          aria-label="Chat message input"
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || !currentMessage.trim() || !analysisContextAvailable}
          className="px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          aria-label="Send chat message"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
