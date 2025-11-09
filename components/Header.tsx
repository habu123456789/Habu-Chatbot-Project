
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">H</div>
        <h1 className="text-xl font-bold text-gray-100 tracking-wide">Habu - Hindi Chatbot</h1>
      </div>
    </header>
  );
};

export default Header;
