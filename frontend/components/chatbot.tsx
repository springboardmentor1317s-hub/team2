import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minus, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! 👋 I'm the CampusEventHub AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const generateResponse = (query: string) => {
    const q = query.toLowerCase();
    
    if (q.includes('register') || q.includes('signup') || q.includes('account')) {
      return "To register, click the 'Create Account' button on the login page. You can choose to register as a Student or an Event Organizer (College Admin).";
    }
    if (q.includes('event') && (q.includes('create') || q.includes('host'))) {
      return "If you are a College Admin, you can create events from your Dashboard using the 'Create Event' button.";
    }
    if (q.includes('password') || q.includes('login')) {
      return "If you're having trouble logging in, try using the demo credentials provided on the login screen, or contact support.";
    }
    if (q.includes('hackathon')) {
      return "We have some great Hackathons coming up! You can filter by 'Hackathon' on the Events page.";
    }
    if (q.includes('hello') || q.includes('hi')) {
      return "Hello! Feel free to ask me anything about CampusEventHub.";
    }
    if (q.includes('contact') || q.includes('support')) {
      return "You can reach our support team via the WhatsApp button in the corner, or email support@campuseventhub.com.";
    }
    
    return "I'm still learning! You can try asking about registration, creating events, or finding hackathons.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: generateResponse(userMsg.text),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with AI
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ease-in-out bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col
      ${isMinimized ? 'bottom-24 right-6 w-72 h-14' : 'bottom-24 right-6 w-80 sm:w-96 h-[500px]'}
    `}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white cursor-pointer"
           onClick={() => !isMinimized && setIsMinimized(true)}>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Campus AI Helper</h3>
            {!isMinimized && <p className="text-xs text-indigo-100 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isMinimized ? (
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }} className="p-1 hover:bg-white/20 rounded">
               <MessageSquare className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="p-1 hover:bg-white/20 rounded">
              <Minus className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;

