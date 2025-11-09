
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const bubbleClasses = isUser
    ? 'bg-indigo-600 text-white self-end rounded-l-2xl rounded-tr-2xl'
    : message.isError 
      ? 'bg-red-800/80 text-red-100 self-start rounded-r-2xl rounded-tl-2xl border border-red-600'
      : 'bg-gray-700 text-gray-200 self-start rounded-r-2xl rounded-tl-2xl';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start items-start space-x-3';
  
  return (
    <div className={containerClasses}>
       {!isUser && (
           <div className="w-10 h-10 bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-md">H</div>
       )}
      <div className={`max-w-md lg:max-w-2xl px-5 py-3 shadow-md ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
