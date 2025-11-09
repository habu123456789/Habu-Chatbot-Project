import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from './types';
import { sendMessageToHabu } from './services/geminiService';
import Header from './components/Header';
import MessageInput from './components/MessageInput';
import ChatBubble from './components/ChatBubble';
import LoadingIndicator from './components/LoadingIndicator';

// Fix: Add type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Namaste! Main Habu hoon. Aapki kya sahayata kar sakta hoon?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);


  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setMicError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setUserInput(prev => (prev ? prev + ' ' : '') + transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setMicError('माइक्रोफ़ोन का एक्सेस नहीं दिया गया। कृपया अपने ब्राउज़र की सेटिंग्स में जाकर इसे एनेबल करें।');
      } else {
        setMicError('Voice input mein kuch gadbad ho gayi. Kripya dobara koshish karein.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, []);

  const handleMicClick = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setMicError("माफ़ कीजिए, यह ब्राउज़र voice input support नहीं करता।");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setMicError(null);
      try {
        recognition.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setMicError('Voice input shuru nahi ho saka. Kripya microphone ki permission check karein.');
      }
    }
  }, [isListening]);


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    // Stop listening if user submits form
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMessage: Message = { role: 'user', content: userInput.trim() };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const habuResponse = await sendMessageToHabu(userInput.trim());
      const modelMessage: Message = { role: 'model', content: habuResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = 'Ek error aaya. Kripya thodi der baad koshish karein.';
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', content: errorMessage, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, isListening]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main ref={chatWindowRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-3">
             <div className="w-10 h-10 bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg">H</div>
            <LoadingIndicator />
          </div>
        )}
        {error && <div className="text-red-400 text-center text-sm">{error}</div>}
      </main>
      {micError && <div className="text-red-400 text-center text-sm px-4 pb-2">{micError}</div>}
      <MessageInput
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isListening={isListening}
        onMicClick={handleMicClick}
      />
    </div>
  );
};

export default App;