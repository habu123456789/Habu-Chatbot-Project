import React from 'react';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isListening: boolean;
  onMicClick: () => void;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a3 3 0 00-3 3v6a3 3 0 106 0V5a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2H3v2a9 9 0 008 8.94V23h2v-2.06A9 9 0 0021 12v-2h-2z" />
    </svg>
);


const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSubmit, isLoading, isListening, onMicClick }) => {
  
  const getPlaceholderText = () => {
    if (isListening) return 'Bolna shuru karein...';
    if (isLoading) return 'Habu soch raha hai...';
    return 'Habu se baat karein...';
  };
  
  return (
    <footer className="bg-gray-800/70 backdrop-blur-sm p-4 sticky bottom-0 border-t border-gray-700">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto flex items-center space-x-2 md:space-x-3">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={getPlaceholderText()}
          disabled={isLoading}
          className="flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={onMicClick}
          disabled={isLoading}
          className={`flex-shrink-0 text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200 ${isListening ? 'bg-red-600 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'}`}
          aria-label="Use microphone"
        >
          <MicrophoneIcon className="w-6 h-6" />
        </button>
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="flex-shrink-0 bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors duration-200 transform active:scale-95"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </footer>
  );
};

export default MessageInput;