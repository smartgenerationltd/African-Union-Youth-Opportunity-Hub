import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { ChatBubbleOvalLeftEllipsisIcon, XIcon, PaperAirplaneIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

// Mock chat instance for environments without an API key
const mockChat = {
  sendMessage: async (parts: { message: string }): Promise<{ text: string }> => {
    console.log("Using Mock Chat Service");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { text: "This is a mock response from the AI Mentor. In a real scenario, I would provide a helpful, context-aware answer to your question: '" + parts.message + "'" };
  }
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<Chat | typeof mockChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize chat on first open
    if (isOpen && !chat) {
      if (process.env.API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
              systemInstruction: 'You are an AI Mentor for African Youth. Your goal is to provide guidance, answer questions about opportunities, and help with career advice. Be encouraging, supportive, and knowledgeable about the African youth development landscape. Use markdown for formatting like bolding and bullet points.',
            },
          });
          setChat(newChat);
        } catch (error) {
          console.error("Failed to initialize Gemini Chat:", error);
          setChat(mockChat); // Fallback to mock if initialization fails
        }
      } else {
         setChat(mockChat);
      }
      
      setMessages([
        { role: 'model', text: t('chatbotWelcome') }
      ]);
    }
  }, [isOpen, chat, t]);

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-au-gold text-au-dark p-4 rounded-full shadow-lg hover:bg-au-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-au-gold transition-transform transform hover:scale-110 z-50"
        aria-label="Open AI Mentor Chat"
      >
        {isOpen ? <XIcon className="w-7 h-7" /> : <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up">
          <header className="bg-au-green text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-lg">AU Youth AI Mentor</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <XIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto bg-sky-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-au-green text-white rounded-br-none'
                        : 'bg-gray-200 text-au-dark rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl bg-gray-200 text-au-dark rounded-bl-none">
                      <p className="text-sm animate-pulse">AI is thinking...</p>
                  </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-2xl">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask your mentor..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-au-gold text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-au-green text-white p-2.5 rounded-full hover:bg-opacity-90 disabled:bg-gray-300 transition-colors"
                aria-label="Send Message"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
      <style>{`
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
