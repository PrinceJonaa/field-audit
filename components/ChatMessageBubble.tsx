import React from 'react';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser 
    ? "bg-purple-600 text-white self-end rounded-lg rounded-br-none" 
    : "bg-gray-600 text-gray-200 self-start rounded-lg rounded-bl-none";
  
  const timeFormatter = new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className={`flex mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`py-2 px-4 shadow ${bubbleClasses} max-w-[80%] sm:max-w-[70%] break-words`}>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-purple-200' : 'text-gray-400'} text-right`}>
          {timeFormatter.format(message.timestamp)}
        </p>
      </div>
    </div>
  );
};
