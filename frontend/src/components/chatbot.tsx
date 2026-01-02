import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const KNOWLEDGE_BASE = [
  {
    category: "Registration",
    keywords: ["register", "signup", "account", "join", "create account"],
    answer:
      "To register, click 'Create Account' on the login page. You can join as a Student to explore events or as an Admin to create and manage events!",
  },
  {
    category: "Events",
    keywords: ["event", "create", "host", "organize", "post"],
    answer:
      "Admins can create and manage events! Go to your Dashboard and click the 'Create New Event' button to fill in event details.",
  },
  {
    category: "Hackathons",
    keywords: ["hackathon", "coding", "tech", "programming"],
    answer:
      "We love Hackathons! You can find them by typing 'hackathon' in the search bar on the Discovery page.",
  },
  {
    category: "Support",
    keywords: ["help", "support", "contact", "email", "whatsapp", "problem"],
    answer:
      "Need a human? You can email support@campuseventhub.com or click the WhatsApp icon for instant chat.",
  },
];

const INITIAL_SUGGESTIONS = [
  "How to register?",
  "Host an event",
  "Find Hackathons",
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! 👋 I'm your Campus Assistant. Choose a topic below or ask me anything!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getResponse = (query: string) => {
    const q = query.toLowerCase();
    const entry = KNOWLEDGE_BASE.find((item) =>
      item.keywords.some((key) => q.includes(key))
    );
    return entry
      ? entry.answer
      : "I'm not quite sure about that yet. Try asking about 'registration' or 'events'.";
  };

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getResponse(messageText),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* 1. TRIGGER BUTTON - Matches WhatsApp Alignment */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[100px] right-6 bg-indigo-600 text-white w-[50px] h-[50px] rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center z-50 group"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            Chat with AI
          </span>
        </button>
      )}

      {/* 2. MAIN CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-[100px] right-6 w-72 sm:w-80 h-[450px] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col z-50 transition-all duration-300">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-bold text-sm">Campus AI Helper</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Quick Suggestions */}
              {!isTyping && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {INITIAL_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {isTyping && (
                <div className="text-xs text-gray-400 animate-pulse">
                  Assistant is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-100 text-gray-900 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
