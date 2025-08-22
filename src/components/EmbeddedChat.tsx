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

  // Enhanced AI chatbot with comprehensive responses
  const triggerAutoResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      // Greetings
      'hello|hi|hey|good morning|good afternoon|hey there': [
        "Hello! 👋 I'm Oscar's AI assistant. I can tell you about his experience, projects, or how to get in touch with him!",
        "Hi there! 🤖 Welcome to Oscar's interactive portfolio. What would you like to know about his work?",
        "Hey! 👨‍💻 Thanks for checking out Oscar's portfolio. Ask me anything about his skills or projects!"
      ],
      
      // Contact & Communication
      'contact|reach|email|phone|call|touch|get in touch|speak|talk|message': [
        "📧 You can reach Oscar directly at **oscar.love.dev@gmail.com** for professional inquiries!",
        "📞 For business discussions, email **oscar.love.dev@gmail.com** - Oscar typically responds within 24 hours.",
        "💬 Best way to contact Oscar is via email: **oscar.love.dev@gmail.com**. You can also connect on LinkedIn!",
        "🔗 Email Oscar at **oscar.love.dev@gmail.com** or find him on LinkedIn. He's very responsive to messages!"
      ],
      
      // Hiring & Job Opportunities  
      'hire|job|work|opportunity|position|role|career|available|looking for work|open to|freelance|contract': [
        "🎯 Great news! Oscar is actively seeking new opportunities. He's open to both full-time roles and contract work.",
        "💼 Oscar is available for hire! He specializes in React, TypeScript, Node.js, and full-stack development. Email him at oscar.love.dev@gmail.com",
        "🚀 Perfect timing! Oscar is looking for his next challenge. He's experienced in modern web development and loves building innovative solutions.",
        "⭐ Oscar is currently open to opportunities! Whether it's a startup, enterprise role, or freelance project - let's discuss at oscar.love.dev@gmail.com"
      ],
      
      // Technical Skills & Experience
      'skills|experience|technology|tech|react|typescript|javascript|node|backend|frontend|stack|programming|languages|frameworks': [
        "🛠️ Oscar's core stack: **React, TypeScript, Node.js, Python**. He also works with AWS, Vercel, PostgreSQL, MongoDB, and modern DevOps tools.",
        "💻 Full-stack expertise: **Frontend** (React, Next.js, TypeScript, Tailwind), **Backend** (Node.js, Express, Python), **Databases** (PostgreSQL, MongoDB).",
        "🔧 Oscar excels at: Modern React development, TypeScript, REST/GraphQL APIs, cloud deployment, real-time features, and responsive design.",
        "⚡ Tech highlights: React ecosystem, TypeScript, serverless functions, database design, CI/CD pipelines, and building scalable web applications."
      ],
      
      // Projects & Portfolio
      'project|portfolio|website|work|examples|github|built|created|made': [
        "📁 You're experiencing Oscar's work right now! This interactive resume features real-time GitHub activity, live chat, and responsive design.",
        "🎨 Oscar's recent projects include e-commerce platforms, real-time dashboards, mobile-first web apps, and this very portfolio site you're on!",
        "🔗 Check out the GitHub activity feed on this page - it shows Oscar's live coding contributions and project updates.",
        "💡 This website showcases: React/TypeScript development, real-time APIs, responsive design, and interactive UI components like this chat!"
      ],
      
      // Salary & Rates
      'salary|pay|rate|cost|price|budget|compensation|money|charge': [
        "💰 Oscar's rates are competitive and depend on project scope. For detailed pricing, please reach out at oscar.love.dev@gmail.com with your requirements.",
        "📊 Compensation varies by project complexity and duration. Oscar provides transparent proposals - let's discuss your needs via email!",
        "💼 Oscar offers flexible pricing for different engagement types. Contact oscar.love.dev@gmail.com for a personalized quote.",
        "🎯 Rates depend on the project scope and timeline. Email oscar.love.dev@gmail.com with your requirements for accurate pricing."
      ],
      
      // Location & Remote Work
      'location|where|based|remote|timezone|travel|relocate': [
        "🌍 Oscar works remotely and is comfortable across different timezones. Check the timezone widget on this page to see his current availability!",
        "📍 Based in [Your Location], but Oscar works with teams globally. He's experienced in remote collaboration and async communication.",
        "⏰ Oscar is flexible with meeting times and has experience working with international teams. The live timezone display shows his schedule!",
        "🤝 100% comfortable with remote work! Oscar has worked with teams across multiple timezones and uses modern collaboration tools."
      ],
      
      // About Oscar
      'about|who|tell me about|background|story|person': [
        "👨‍💻 Oscar is a passionate full-stack developer who loves building innovative web applications that solve real problems.",
        "🚀 Oscar combines technical expertise with creative problem-solving. He enjoys working on projects that make a meaningful impact.",
        "⭐ Oscar is known for clean code, attention to detail, and collaborative approach. He's always eager to learn new technologies.",
        "💡 Oscar believes in building not just functional, but delightful user experiences. This interactive portfolio is a great example!"
      ],
      
      // Availability & Timeline
      'when|available|start|timeline|how soon|notice': [
        "📅 Oscar can typically start new projects within 1-2 weeks, depending on scope. For urgent projects, he's flexible with timelines.",
        "⚡ For the right opportunity, Oscar can begin immediately. Standard notice period is 1-2 weeks for most engagements.",
        "🗓️ Oscar's availability depends on project requirements. Contact oscar.love.dev@gmail.com to discuss specific timelines!",
        "⏰ Timeline is flexible based on project needs. Oscar prioritizes delivering quality work over rushing deadlines."
      ],
      
      // Education & Certifications
      'education|degree|school|university|certification|learning': [
        "🎓 Oscar is a continuous learner who stays current with modern web development practices through hands-on projects and industry resources.",
        "📚 Oscar's expertise comes from real-world experience building production applications and staying updated with latest tech trends.",
        "🔍 Oscar believes in practical learning - this interactive portfolio demonstrates his commitment to exploring new technologies!",
        "⭐ Oscar's knowledge is built through project experience, open-source contributions, and staying active in the developer community."
      ],
      
      // Company Size & Preferences
      'startup|enterprise|company size|team|big company|small team': [
        "🏢 Oscar has experience with both startups and larger organizations. He adapts well to different team sizes and company cultures.",
        "🚀 Oscar loves the energy of startups but also appreciates the resources and scale of larger companies. He's flexible!",
        "👥 Whether it's a 5-person startup or 500-person enterprise, Oscar brings the same dedication and collaborative spirit.",
        "⚡ Oscar thrives in environments where he can make meaningful contributions, regardless of company size."
      ]
    };

    let response = "Thanks for your question! I'm Oscar's AI assistant. I can help you learn about his skills, experience, projects, or how to contact him. What specifically interests you?";
    let matchedPattern = null;

    // Find the best match with priority for more specific patterns
    const sortedPatterns = Object.entries(responses).sort(([a], [b]) => b.split('|').length - a.split('|').length);
    
    for (const [pattern, responseList] of sortedPatterns) {
      if (new RegExp(pattern, 'i').test(lowerMessage)) {
        response = responseList[Math.floor(Math.random() * responseList.length)];
        matchedPattern = pattern;
        break;
      }
    }

    // Add contextual follow-up based on the type of question
    if (matchedPattern) {
      const followUps = {
        'contact': [" Feel free to mention you found him through this interactive portfolio!", " Let him know what type of project you're considering!", " Don't hesitate to reach out - he's very approachable!"],
        'hire|job': [" What type of role or project are you considering?", " Would you like to know more about his technical skills?", " Feel free to email him with your project details!"],
        'skills': [" Want to know more about any specific technology?", " Curious about his project experience?", " Any particular technical challenge you're facing?"],
        'project': [" Want to know more about his development process?", " Interested in discussing a similar project?", " Any specific features that caught your attention?"]
      };
      
      for (const [key, options] of Object.entries(followUps)) {
        if (new RegExp(key, 'i').test(matchedPattern)) {
          if (Math.random() > 0.3) { // 70% chance of follow-up
            response += options[Math.floor(Math.random() * options.length)];
          }
          break;
        }
      }
    }

    const typingDelay = Math.min(2500, 600 + (response.length * 25));
    
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