
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="bg-gray-700 text-gray-200 self-start rounded-r-2xl rounded-tl-2xl px-5 py-4 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
