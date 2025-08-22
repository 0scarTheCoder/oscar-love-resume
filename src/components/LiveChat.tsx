import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaCircle, 
  FaUser,
  FaRobot
} from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'oscar' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered';
}

interface ChatUser {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen?: Date;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [showUserForm, setShowUserForm] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Oscar's status (simulate real-time)
  const [oscarStatus, setOscarStatus] = useState<ChatUser>({
    id: 'oscar',
    name: 'Oscar Love',
    isOnline: Math.random() > 0.3, // 70% chance online
    lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000) // Random last seen within 1 hour
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Simulate real-time status updates
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setOscarStatus(prev => ({
        ...prev,
        isOnline: Math.random() > 0.4, // 60% chance online
        lastSeen: prev.isOnline ? undefined : new Date()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(statusInterval);
  }, []);

  // Auto-responses and typing simulation
  const triggerAutoResponse = (userMessage: string) => {
    const responses = [
      "Thanks for reaching out! I'll get back to you soon.",
      "Hi there! I'm currently working on some exciting projects. Let me know what you'd like to discuss!",
      "Great to hear from you! I'm passionate about creating amazing web experiences.",
      "Hello! I'd love to chat about potential opportunities or projects.",
      "Thanks for the message! I'm always excited to connect with fellow developers and potential collaborators."
    ];

    const keywords = {
      'hello|hi|hey': "Hello! Thanks for visiting my portfolio. How can I help you today?",
      'hire|job|work|opportunity': "I'm definitely interested in new opportunities! Please tell me more about what you have in mind.",
      'project|collaboration|collaborate': "I'd love to hear about your project! What kind of application or website are you looking to build?",
      'skills|experience|technology': "I specialize in React, TypeScript, Node.js, and full-stack development. What specific technologies are you interested in?",
      'contact|email|phone': "You can reach me at oscar.love@example.com or use this chat for immediate responses!",
      'portfolio|website|resume': "Thanks for checking out my work! Is there a particular project you'd like to know more about?"
    };

    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Check for specific keywords
    const lowerMessage = userMessage.toLowerCase();
    for (const [pattern, specificResponse] of Object.entries(keywords)) {
      if (new RegExp(pattern).test(lowerMessage)) {
        response = specificResponse;
        break;
      }
    }

    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: oscarStatus.isOnline ? 'oscar' : 'bot',
        timestamp: new Date(),
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, autoMessage]);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);

    // Trigger auto-response
    triggerAutoResponse(message.text);
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name.trim()) {
      setShowUserForm(false);
      setIsConnected(true);
      
      // Welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Hi ${userInfo.name}! Welcome to my portfolio. I'm ${oscarStatus.isOnline ? 'currently online' : 'away right now but'} I'll respond as soon as possible. What brings you here today?`,
        sender: oscarStatus.isOnline ? 'oscar' : 'bot',
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages([welcomeMessage]);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
      >
        <div className="relative">
          {isOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaUser size={16} />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      oscarStatus.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Oscar Love</h3>
                    <p className="text-xs opacity-90">
                      {oscarStatus.isOnline ? (
                        <span className="flex items-center gap-1">
                          <FaCircle size={6} className="text-green-400" />
                          Online
                        </span>
                      ) : (
                        `Last seen ${formatTimeAgo(oscarStatus.lastSeen!)}`
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* User Info Form */}
            {showUserForm && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <form onSubmit={handleUserFormSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Start Chat
                  </button>
                </form>
              </div>
            )}

            {/* Messages */}
            {isConnected && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        {message.sender !== 'user' && (
                          <div className="flex items-center gap-2 mb-1">
                            {message.sender === 'oscar' ? <FaUser size={12} /> : <FaRobot size={12} />}
                            <span className="text-xs opacity-70">
                              {message.sender === 'oscar' ? 'Oscar' : 'Auto-reply'}
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {message.sender === 'user' && message.status && (
                            <span className="ml-1">
                              {message.status === 'sending' && '⏳'}
                              {message.status === 'sent' && '✓'}
                              {message.status === 'delivered' && '✓✓'}
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex space-x-2">
                    <input
                      ref={chatInputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-md transition-colors"
                    >
                      <FaPaperPlane size={16} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;