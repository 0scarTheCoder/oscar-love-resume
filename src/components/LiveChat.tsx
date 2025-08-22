import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Removed react-icons imports - using emojis instead for better TypeScript compatibility

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
  const [hasInitialized, setHasInitialized] = useState(false);
  
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
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize chat and status updates
  useEffect(() => {
    // Show initial notification after 3 seconds
    setTimeout(() => {
      if (!hasInitialized) {
        setUnreadCount(1);
        setHasInitialized(true);
      }
    }, 3000);

    // Simulate real-time status updates
    const statusInterval = setInterval(() => {
      setOscarStatus(prev => ({
        ...prev,
        isOnline: Math.random() > 0.4, // 60% chance online
        lastSeen: prev.isOnline ? undefined : new Date()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(statusInterval);
  }, [hasInitialized]);

  // Enhanced AI-style chatbot with conversation context
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  
  const triggerAutoResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Add message to conversation context
    setConversationContext(prev => [...prev, lowerMessage].slice(-5)); // Keep last 5 messages
    
    // Advanced keyword matching with context awareness
    const responses = {
      // Greetings & Initial Contact
      'hello|hi|hey|good morning|good afternoon': [
        "Hello! 👋 Welcome to my interactive portfolio. I'm Oscar's AI assistant.",
        "Hi there! 🤖 I'm an AI chatbot showcasing Oscar's development skills. How can I help?",
        "Hey! 👨‍💻 Thanks for visiting Oscar's portfolio. What brings you here today?",
        "Greetings! 🚀 I'm Oscar's AI assistant. Ready to discuss projects, skills, or opportunities?"
      ],
      
      // Hiring & Job Opportunities
      'hire|job|work|opportunity|position|role|career': [
        "🎯 Exciting! Oscar is actively seeking new opportunities. He specializes in React, TypeScript, and full-stack development.",
        "💼 Oscar would love to discuss potential roles! He's experienced in modern web development and always eager for new challenges.",
        "🚀 Great timing! Oscar is available for both contract work and full-time positions. What type of role are you considering?",
        "⭐ Perfect! Oscar's looking for opportunities to build amazing web applications. Tell me more about your company and the role!"
      ],
      
      // Technical Skills & Experience
      'skills|experience|technology|tech|react|typescript|javascript|node|backend|frontend': [
        "🛠️ Oscar's tech stack includes React, TypeScript, Node.js, Python, and modern deployment platforms like Vercel and AWS.",
        "💻 He's proficient in full-stack development: React/Next.js frontend, Node.js/Express backend, PostgreSQL/MongoDB databases.",
        "🔧 Oscar loves working with: React ecosystem, TypeScript, Tailwind CSS, real-time features (Socket.io), and cloud deployment.",
        "⚡ His expertise spans modern web development, API integration, database design, and creating interactive user experiences like this chat!"
      ],
      
      // Projects & Portfolio
      'project|portfolio|website|work|examples|github': [
        "📁 You're experiencing one of Oscar's projects right now! This live chat and GitHub activity feed demonstrate his real-time development skills.",
        "🎨 Oscar's portfolio showcases full-stack capabilities: this interactive resume, real-time features, and responsive design.",
        "🔗 Check out his GitHub activity feed on this page - it shows live coding activity and project contributions.",
        "💡 This very website demonstrates React, TypeScript, real-time APIs, and advanced UI/UX design!"
      ],
      
      // Collaboration & Communication
      'collaborate|team|communication|remote|timezone': [
        "🌍 Oscar works effectively across timezones! Check out the live timezone display on this page showing his availability.",
        "🤝 He's excellent at remote collaboration and has experience working with international teams.",
        "📞 Oscar values clear communication and uses modern tools for project management and team coordination.",
        "⏰ The timezone widget shows when he's typically available - he's flexible with meeting times for important discussions!"
      ],
      
      // Contact & Next Steps
      'contact|email|phone|reach|connect|meeting': [
        "📧 You can reach Oscar directly at oscar.love@example.com for serious inquiries.",
        "🗓️ Ready to schedule a call? Oscar's availability is shown in the timezone widget on this page.",
        "💬 For quick questions, feel free to continue chatting here - I'll make sure Oscar sees your messages!",
        "🔔 Leave your contact info and Oscar will get back to you personally within 24 hours."
      ],
      
      // Chatbot & AI Questions
      'chatbot|ai|bot|artificial|intelligence|how|what': [
        "🤖 I'm an AI assistant built to showcase Oscar's development skills! This chat demonstrates real-time messaging capabilities.",
        "💡 This chatbot is part of Oscar's portfolio - showing how he integrates AI-like features into web applications.",
        "🧠 I use keyword recognition and context awareness to provide relevant responses about Oscar's work and availability.",
        "⚡ Pretty cool, right? This kind of interactive feature is what Oscar builds for clients who want engaging user experiences!"
      ],
      
      // Pricing & Business
      'price|cost|rate|budget|proposal': [
        "💰 Oscar's rates are competitive and depend on project scope. He offers both hourly and project-based pricing.",
        "📊 For custom quotes, please share your project requirements and timeline - Oscar provides detailed proposals.",
        "💼 He works with startups to enterprise clients, with flexible engagement models to fit your budget.",
        "🎯 Every project gets a personalized proposal. The investment varies based on complexity and features needed."
      ]
    };

    let response = "Thanks for your message! I'm Oscar's AI assistant. Could you tell me more about what you're looking for?";
    let isContextual = false;

    // Enhanced keyword matching with priority
    for (const [pattern, responseList] of Object.entries(responses)) {
      if (new RegExp(pattern).test(lowerMessage)) {
        response = responseList[Math.floor(Math.random() * responseList.length)];
        isContextual = true;
        break;
      }
    }

    // Context-aware follow-up questions
    if (isContextual) {
      const followUps = [
        " What would you like to know more about?",
        " Is there anything specific you'd like to discuss?",
        " Feel free to ask me anything else!",
        " What's your next question?",
        " How can I help you further?"
      ];
      
      if (Math.random() > 0.3) { // 70% chance of follow-up
        response += followUps[Math.floor(Math.random() * followUps.length)];
      }
    }

    // Add personality based on conversation length
    if (conversationContext.length > 2) {
      const personalityTouches = [
        " 😊",
        " 🚀",
        " 💪",
        " ⭐",
        ""
      ];
      response += personalityTouches[Math.floor(Math.random() * personalityTouches.length)];
    }

    // Simulate realistic typing delay based on message length
    const typingDelay = Math.min(3000, 800 + (response.length * 30)); // 30ms per character, max 3s
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot', // Always show as bot for AI responses
        timestamp: new Date(),
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, autoMessage]);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, typingDelay);
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
      
      // Welcome messages from AI bot
      const welcomeMessages: Message[] = [
        {
          id: 'welcome-1',
          text: `Hi ${userInfo.name}! 👋 Welcome to Oscar's interactive portfolio.`,
          sender: 'bot',
          timestamp: new Date(),
          status: 'delivered'
        },
        {
          id: 'welcome-2', 
          text: `I'm Oscar's AI assistant, built to showcase his development skills. This chat demonstrates real-time messaging capabilities! 🤖`,
          sender: 'bot',
          timestamp: new Date(Date.now() + 1000),
          status: 'delivered'
        },
        {
          id: 'welcome-3',
          text: `Feel free to ask about Oscar's experience, projects, availability, or anything else. I'm here to help! 🚀`,
          sender: 'bot',
          timestamp: new Date(Date.now() + 2000),
          status: 'delivered'
        }
      ];
      
      // Send messages with realistic delays
      setMessages([welcomeMessages[0]]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, welcomeMessages[1]]);
      }, 1500);
      
      setTimeout(() => {
        setMessages(prev => [...prev, welcomeMessages[2]]);
      }, 3000);
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
        className="fixed bottom-6 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-colors border-2 border-white"
        style={{ zIndex: 9999 }}
      >
        <div className="relative text-2xl">
          {isOpen ? '✕' : '💬'}
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
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      👤
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
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
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
                  className="text-white hover:text-gray-200 transition-colors text-lg"
                >
                  ✕
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
                            <span className="text-xs">
                              {message.sender === 'oscar' ? '👤' : '🤖'}
                            </span>
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
                      ➤
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