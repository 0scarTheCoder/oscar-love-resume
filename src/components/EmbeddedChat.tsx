import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const EmbeddedChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [showUserForm, setShowUserForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI chatbot responses (same as LiveChat)
  const triggerAutoResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      'hello|hi|hey|good morning|good afternoon': [
        "Hello! 👋 Welcome to my interactive portfolio. I'm Oscar's AI assistant.",
        "Hi there! 🤖 I'm an AI chatbot showcasing Oscar's development skills. How can I help?",
        "Hey! 👨‍💻 Thanks for visiting Oscar's portfolio. What brings you here today?"
      ],
      'hire|job|work|opportunity|position|role|career': [
        "🎯 Exciting! Oscar is actively seeking new opportunities. He specializes in React, TypeScript, and full-stack development.",
        "💼 Oscar would love to discuss potential roles! He's experienced in modern web development and always eager for new challenges.",
        "🚀 Great timing! Oscar is available for both contract work and full-time positions. What type of role are you considering?"
      ],
      'skills|experience|technology|tech|react|typescript|javascript|node|backend|frontend': [
        "🛠️ Oscar's tech stack includes React, TypeScript, Node.js, Python, and modern deployment platforms like Vercel and AWS.",
        "💻 He's proficient in full-stack development: React/Next.js frontend, Node.js/Express backend, PostgreSQL/MongoDB databases.",
        "🔧 Oscar loves working with: React ecosystem, TypeScript, Tailwind CSS, real-time features, and cloud deployment."
      ],
      'project|portfolio|website|work|examples|github': [
        "📁 You're experiencing one of Oscar's projects right now! This live chat demonstrates his real-time development skills.",
        "🎨 Oscar's portfolio showcases full-stack capabilities: this interactive resume, real-time features, and responsive design.",
        "🔗 Check out his GitHub activity feed on this page - it shows live coding activity and project contributions."
      ]
    };

    let response = "Thanks for your message! I'm Oscar's AI assistant. Could you tell me more about what you're looking for?";

    for (const [pattern, responseList] of Object.entries(responses)) {
      if (new RegExp(pattern).test(lowerMessage)) {
        response = responseList[Math.floor(Math.random() * responseList.length)];
        break;
      }
    }

    const typingDelay = Math.min(2000, 500 + (response.length * 20));
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, autoMessage]);
    }, typingDelay);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    triggerAutoResponse(message.text);
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name.trim()) {
      setShowUserForm(false);
      
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Hi ${userInfo.name}! 👋 I'm Oscar's AI assistant. Ask me about his skills, projects, or availability!`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* User Form */}
      {showUserForm && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <form onSubmit={handleUserFormSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                placeholder="Enter your name to start chatting..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm"
            >
              Start Chat
            </button>
          </form>
        </div>
      )}

      {/* Messages */}
      {!showUserForm && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {message.sender === 'bot' && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs">🤖</span>
                      <span className="text-xs opacity-70">AI Assistant</span>
                    </div>
                  )}
                  <p>{message.text}</p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-600 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md transition-colors text-sm"
              >
                ➤
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmbeddedChat;