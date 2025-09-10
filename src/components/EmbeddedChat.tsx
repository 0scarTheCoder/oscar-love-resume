import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

  // Fuzzy string matching for typo tolerance
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Comprehensive knowledge base about Oscar
  const knowledgeBase = {
    personal: {
      name: 'Oscar Love',
      location: 'Perth, Western Australia',
      email: 'loevoh19@gmail.com',
      role: 'Finance & Consulting Graduate Candidate',
      education: 'Bachelor of Philosophy (Honours) in Computer Science and Software Engineering from UWA',
      graduation: 'July 2025',
      atar: '99.35',
      wam: '75',
      gpa: '6.0',
      experience_years: '6+',
      focus: 'Investment Banking and Management Consulting'
    },
    skills: {
      programming: ['Python', 'R', 'JavaScript', 'Java', 'TypeScript', 'HTML/CSS'],
      data_science: ['Statistical Analysis', 'Machine Learning', 'Data Visualization', 'Computational Statistics', 'Time Series Analysis', 'Bayesian Statistics'],
      tools: ['SQL', 'Git/GitHub', 'Jupyter', 'RStudio', 'Power BI', 'Excel', 'React', 'Node.js'],
      soft_skills: ['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Adaptability', 'Work Ethic'],
      financial: ['Financial Modeling', 'Quantitative Analysis', 'Data-Driven Decision Making', 'Strategic Problem-Solving']
    },
    experience: [
      {
        title: 'Software Developer',
        company: 'Private Consulting',
        period: 'August 2025 - November 2025',
        description: 'Created web applications as private consultant, developed frontend/backend solutions, built APIs and intelligent agents for client MVPs'
      },
      {
        title: 'Data Analyst',
        company: 'Invest America',
        period: 'April 2024 - July 2024',
        description: 'Designed data collection forms, integrated frontend/backend systems, created financial evaluation questionnaires, enhanced internal audits'
      },
      {
        title: 'Theatre Orderly',
        company: 'St John Of God\'s Hospital Subiaco',
        period: 'January 2022 - Current',
        description: 'Collaborate with multidisciplinary healthcare teams, work under pressure'
      },
      {
        title: 'Data Management Intern',
        company: 'Vitruvian',
        period: 'August 2021 - December 2021',
        description: 'Managed large datasets, developed data visualization tools, financial analysis experience'
      },
      {
        title: 'Private Tutor',
        company: 'Private Practice',
        period: 'January 2018 - Current',
        description: 'Mathematics, physics, and data science tutoring - demonstrates teaching and communication skills'
      },
      {
        title: 'Volleyball Referee',
        company: 'VWA',
        period: 'March 2021 - Current',
        description: 'Level 2 certified referee - quick decision making under pressure'
      }
    ],
    achievements: [
      '1st Place SLB Data Science Hackathon (October 2023)',
      '2nd Place UWA WHACK WesCEF Hackathon (September 2023)',
      'Australian Volleyball Representative (U17s, U18s, U19s) - Leadership experience',
      'Unisport Nationals Volleyball Champion (2022)',
      'ATAR 99.35 - Top 1% of students in Western Australia'
    ],
    interests: ['Gaming', 'Tech Innovation', 'Running', 'Music Production', 'Photography', 'Open Source'],
    availability: 'Actively seeking graduate opportunities, can start within 1-2 weeks'
  };

  // Legacy patterns - no longer used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const responsePatterns = {
    greetings: {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'sup', 'yo'],
      responses: [
        `Hello! 👋 I'm Oscar's AI assistant. I'm here to tell you about his passion for **investment banking and management consulting**, plus his strong analytical background. What would you like to know?`,
        `Hi there! 🤖 Welcome to Oscar's interactive portfolio. I can share details about his **quantitative skills**, **academic achievements** (ATAR 99.35!), or his **graduate aspirations**. How can I help?`,
        `Hey! 👨‍💻 Thanks for visiting Oscar's portfolio. I have comprehensive knowledge about his **finance career goals**, **data science expertise**, and **leadership experience**. Ask me anything!`
      ]
    },
    contact: {
      keywords: ['contact', 'reach', 'email', 'phone', 'call', 'touch', 'speak', 'talk', 'message', 'communicate', 'get in touch', 'reach out'],
      responses: [
        `📧 You can reach Oscar directly at **${knowledgeBase.personal.email}** for professional inquiries. He's very responsive to finance and consulting opportunities!`,
        `💬 Best way to contact Oscar is via email: **${knowledgeBase.personal.email}**. He typically responds within 24 hours, especially for graduate role discussions.`,
        `📞 For business discussions about investment banking or consulting positions, email **${knowledgeBase.personal.email}**. Oscar is actively seeking opportunities in these fields!`
      ]
    },
    hiring: {
      keywords: ['hire', 'job', 'work', 'opportunity', 'position', 'role', 'career', 'available', 'employment', 'recruiting', 'graduate', 'intern', 'analyst', 'trainee'],
      responses: [
        `🎯 Excellent! Oscar is actively seeking **graduate opportunities in investment banking and management consulting**. His analytical skills and ${knowledgeBase.personal.atar} ATAR make him an ideal candidate.`,
        `💼 Perfect timing! Oscar is available for graduate roles. With his **data science background** and **quantitative expertise**, he's particularly interested in finance and consulting positions.`,
        `🚀 Oscar is seeking his next challenge in the **finance industry**. His combination of technical skills and high academic performance (WAM ${knowledgeBase.personal.wam}) makes him perfect for corporate graduate programs.`,
        `⭐ Great news! Oscar is ${knowledgeBase.availability.toLowerCase()}. His **hackathon wins** and **leadership experience** demonstrate the problem-solving abilities consulting firms value.`
      ]
    },
    skills: {
      keywords: ['skills', 'experience', 'technology', 'tech', 'abilities', 'expertise', 'qualifications', 'python', 'r', 'data', 'analytics', 'statistics', 'programming', 'technical'],
      responses: [
        `🛠️ Oscar's analytical toolkit: **${knowledgeBase.skills.programming.slice(0,3).join(', ')}, Statistical Analysis, Machine Learning**. Perfect for quantitative roles in finance! He also has financial modeling experience.`,
        `💻 Technical expertise: **Data Science, Statistics, Programming (${knowledgeBase.skills.programming.slice(0,2).join('/')}/JavaScript)**. His academic focus on mathematics and statistics provides a strong foundation for financial analysis.`,
        `⚡ Key strengths: **${knowledgeBase.skills.financial.slice(0,3).join(', ')}**. Oscar's hackathon wins demonstrate his ability to solve complex problems under pressure - essential for consulting!`,
        `🔧 Core competencies: **${knowledgeBase.skills.data_science.slice(0,4).join(', ')}** plus strong soft skills like **${knowledgeBase.skills.soft_skills.slice(0,3).join(', ')}**.`
      ]
    },
    education: {
      keywords: ['education', 'degree', 'school', 'university', 'uwa', 'study', 'academic', 'atar', 'wam', 'grades', 'student', 'qualification'],
      responses: [
        `🎓 **${knowledgeBase.personal.education}**, graduating ${knowledgeBase.personal.graduation}. Specializing in **Data Science, Mathematics and Statistics** - perfect for finance careers.`,
        `📚 Academic excellence: **ATAR ${knowledgeBase.personal.atar}** (top 1% in WA), current **WAM ${knowledgeBase.personal.wam}**. Oscar's strong quantitative background is exactly what investment banks and consulting firms seek.`,
        `🏆 UWA Honours degree in Computer Science and Software Engineering with focus on analytical disciplines. This rigorous academic training is ideal preparation for finance and consulting careers.`,
        `📊 Oscar's academic background combines **technical rigor** with **analytical thinking** - graduating July 2025 with the quantitative skills that make graduates attractive to top-tier firms.`
      ]
    },
    achievements: {
      keywords: ['achievement', 'award', 'win', 'competition', 'hackathon', 'volleyball', 'success', 'accomplishment', 'recognition', 'honor'],
      responses: [
        `🏆 Notable achievements: **${knowledgeBase.achievements[0]}**, **${knowledgeBase.achievements[1]}**, plus **Australian Volleyball Representative** - demonstrating both analytical prowess and leadership.`,
        `🥇 Oscar's competitive edge: Multiple **hackathon victories** show problem-solving under pressure, while **national volleyball representation** demonstrates teamwork and leadership - key skills for consulting.`,
        `⭐ Track record of success: **Academic excellence (ATAR ${knowledgeBase.personal.atar})**, **hackathon wins**, and **national-level sports** showcase the well-rounded profile that finance firms value.`,
        `🎯 Proven performance: From **data science competitions** to **elite athletics**, Oscar consistently delivers results under pressure - exactly what investment banking demands.`
      ]
    },
    projects: {
      keywords: ['project', 'portfolio', 'website', 'work', 'examples', 'github', 'built', 'created', 'development', 'code', 'programming'],
      responses: [
        `📁 You're experiencing Oscar's work right now! This **interactive resume** features real-time data feeds, responsive design, and live analytics - demonstrating technical skills relevant to fintech and financial services.`,
        `💡 This portfolio showcases: **React/TypeScript development, real-time APIs, data visualization**. Oscar applies these technical skills to solve business problems - valuable in modern finance roles.`,
        `🔗 The **GitHub activity feed** shows Oscar's ongoing development work. His projects demonstrate both technical proficiency and business acumen - perfect for technology-focused finance roles.`,
        `🎨 Oscar's recent projects include **data visualization dashboards** and **interactive web applications**. These skills translate perfectly to financial modeling and client presentation tools.`
      ]
    },
    finance: {
      keywords: ['finance', 'banking', 'investment', 'consulting', 'analyst', 'financial', 'corporate', 'business', 'bank', 'firm', 'wall street', 'city', 'trading', 'markets'],
      responses: [
        `💰 Oscar is specifically targeting **investment banking** and **management consulting** roles. His quantitative background and analytical mindset are perfectly aligned with financial analysis and strategic problem-solving.`,
        `📈 With expertise in **statistical modeling, data analysis, and strategic problem-solving**, Oscar brings exactly the skills that modern financial services and consulting firms need.`,
        `🎯 Oscar's goal: Apply his **rigorous analytical skills** and **data-driven decision making** to drive value creation in investment banking and consulting. His academic excellence shows the work ethic these industries demand.`,
        `🏦 Perfect fit for finance: Oscar's **quantitative background**, **problem-solving abilities**, and **leadership experience** align perfectly with what investment banks and consulting firms seek in graduates.`
      ]
    },
    location: {
      keywords: ['location', 'where', 'based', 'perth', 'australia', 'remote', 'relocate', 'move', 'travel', 'geography'],
      responses: [
        `🌏 Oscar is based in **Perth, Western Australia** but is eager to relocate for the right opportunity, especially for graduate programs in major financial centers like Sydney, Melbourne, or internationally.`,
        `📍 Located in Perth, WA. Oscar is **completely flexible about location** and willing to relocate for graduate roles in investment banking or consulting firms anywhere in the world.`,
        `✈️ Perth-based but ready to move globally! Oscar understands that top finance and consulting opportunities are often in major financial hubs and is excited to relocate for career advancement.`,
        `🗺️ Geographic flexibility: Oscar can relocate anywhere for the right graduate opportunity. Distance is no barrier when it comes to joining a top-tier finance or consulting firm.`
      ]
    },
    availability: {
      keywords: ['when', 'available', 'start', 'timeline', 'soon', 'notice', 'timing', 'schedule', 'ready'],
      responses: [
        `📅 Oscar ${knowledgeBase.availability.toLowerCase()}. He's finishing his degree in July 2025 and can start immediately after graduation.`,
        `⚡ **Available now for interviews** and can start working immediately upon graduation (July 2025). For urgent projects or early-start programs, Oscar is flexible.`,
        `🗓️ Perfect timing! Oscar is actively interviewing and can begin full-time work from July 2025. He's also available for part-time or project work before graduation.`,
        `⏰ Ready to go! Oscar can start contributing immediately and is available for **summer internships, graduate programs starting mid-2025, or immediate project-based work**.`
      ]
    },
    salary: {
      keywords: ['salary', 'pay', 'compensation', 'money', 'wage', 'rate', 'package', 'remuneration', 'benefits'],
      responses: [
        `💼 Oscar's compensation expectations are **competitive and market-appropriate** for graduate roles in investment banking and consulting. He's open to discussing packages that reflect the value he brings.`,
        `📊 For salary discussions, it's best to contact Oscar directly at **${knowledgeBase.personal.email}**. He's reasonable and understands graduate market rates for finance and consulting roles.`,
        `💰 Oscar is focused on **total career opportunity** rather than just initial salary. He's interested in firms that offer strong training, mentorship, and career progression in finance.`
      ]
    }
  };

  // Intelligent response generation with natural language understanding
  const generateResponse = (userMessage: string): string => {
    const cleanMessage = userMessage.toLowerCase().trim();
    const words = cleanMessage.split(/\s+/).filter(word => word.length > 2);
    
    // Advanced intent detection
    const intents = {
      recent_experience: {
        keywords: ['recent', 'recently', 'latest', 'current', 'now', 'today', 'since', 'after', 'post', 'new'],
        triggers: ['done', 'experience', 'work', 'project', 'learning', 'study', 'graduate', 'graduation'],
        responses: [
          "Oscar is currently finishing his Honours degree at UWA and graduates in July 2025. He's been working as a Theatre Orderly at St John Of God's Hospital, which has given him valuable experience in high-pressure environments and teamwork.",
          "Since he's still completing his degree, Oscar's recent focus has been on his Honours project and maintaining his academic performance. He's also been actively participating in hackathons - winning first place in the SLB Data Science competition in October 2023.",
          "Oscar's most recent professional experience includes his ongoing role at the hospital and his tutoring work, where he helps students with mathematics and data science concepts. He's also been building this interactive portfolio to showcase his technical skills."
        ]
      },
      post_graduation: {
        keywords: ['after', 'since', 'post', 'graduated', 'graduation', 'degree', 'finished', 'completed'],
        context: ['experience', 'work', 'done', 'job'],
        responses: [
          "Actually, Oscar hasn't graduated yet - he's finishing his Honours degree and will graduate in July 2025. He's currently looking for graduate opportunities to start after graduation.",
          "Oscar is still completing his studies at UWA and will graduate in July 2025. He's actively seeking graduate positions in investment banking and consulting to begin after he finishes his degree.",
          "Just to clarify - Oscar is still a student finishing his Honours degree in July 2025. He's currently in his final semester and exploring career opportunities for post-graduation."
        ]
      },
      academic_performance: {
        keywords: ['grade', 'mark', 'score', 'atar', 'wam', 'academic', 'performance', 'study'],
        responses: [
          "Oscar achieved an ATAR of 99.35 and currently maintains a WAM of 75 (GPA 6.0) at UWA. He's focused on completing his Honours degree in Computer Science and Software Engineering.",
          "Academically, Oscar has performed well - his ATAR was 99.35 and he's maintaining solid grades at university level. He's specializing in Data Science and Statistics.",
          "Oscar's academic background includes strong performance in his ATAR (99.35) and he's currently working towards his Honours degree with a focus on quantitative disciplines."
        ]
      },
      skills_general: {
        keywords: ['skill', 'ability', 'expertise', 'good at', 'know', 'can do'],
        responses: [
          "Oscar's main strengths are in data analysis, statistical modeling, and programming. He works with Python, R, and JavaScript, and has experience in machine learning and data visualization.",
          "His skill set combines technical programming abilities with analytical thinking. He's particularly strong in quantitative analysis, which aligns well with finance and consulting roles.",
          "Oscar brings together data science expertise, programming skills, and problem-solving abilities. His hackathon successes show he can apply these skills effectively under pressure."
        ]
      },
      general_question: {
        responses: [
          "I can help you learn about Oscar's background, skills, experience, or how to get in touch with him. What specific aspect would you like to know more about?",
          "Feel free to ask me about Oscar's education, work experience, technical skills, achievements, or career goals. What interests you most?",
          "I'm here to answer questions about Oscar's professional background and aspirations. Is there something particular you'd like to discuss?",
          "You can ask me about Oscar's academic work, professional experience, skills, or future plans. What would be most helpful to know?"
        ]
      }
    };
    
    // Intent matching with context awareness
    let bestIntent: any = null;
    let highestScore = 0;
    
    Object.entries(intents).forEach(([intentName, intent]) => {
      let score = 0;
      
      // Keyword matching
      if ('keywords' in intent) {
        intent.keywords.forEach(keyword => {
          if (cleanMessage.includes(keyword)) {
            score += 2;
          }
          words.forEach(word => {
            const similarity = calculateSimilarity(word, keyword);
            if (similarity > 0.8) score += similarity;
          });
        });
      }
      
      // Contextual triggers
      const triggers = ('triggers' in intent) ? intent.triggers : (('context' in intent) ? intent.context : []);
      triggers.forEach(trigger => {
        if (cleanMessage.includes(trigger)) {
          score += 1.5;
        }
      });
      
      // Special handling for complex queries
      if (intentName === 'recent_experience') {
        const recentIndicators = ['recent', 'recently', 'latest', 'new', 'current'];
        const experienceIndicators = ['done', 'experience', 'work', 'learning', 'study'];
        
        const hasRecent = recentIndicators.some(word => cleanMessage.includes(word));
        const hasExperience = experienceIndicators.some(word => cleanMessage.includes(word));
        
        if (hasRecent && hasExperience) score += 3;
      }
      
      if (intentName === 'post_graduation') {
        const gradIndicators = ['graduate', 'graduation', 'degree', 'finished'];
        const timeIndicators = ['since', 'after', 'post'];
        
        const hasGrad = gradIndicators.some(word => cleanMessage.includes(word));
        const hasTime = timeIndicators.some(word => cleanMessage.includes(word));
        
        if (hasGrad && hasTime) score += 3;
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestIntent = { name: intentName, responses: intent.responses };
      }
    });
    
    // Generate response based on best intent
    if (bestIntent && highestScore > 1) {
      const responses = bestIntent.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Fallback to general response
    const generalResponses = intents.general_question.responses;
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  // Enhanced auto-response with better context
  const triggerAutoResponse = (userMessage: string) => {
    const response = generateResponse(userMessage);
    const typingDelay = Math.min(3500, 1000 + (response.length * 35));
    
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
        text: `Hi ${userInfo.name}! I'm Oscar's AI assistant. I'm equipped with comprehensive knowledge about his finance and consulting aspirations, academic achievements, and professional experience. What would you like to know about his background or career goals?`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#30C55A]/5 rounded-lg border border-[#30C55A]/30" style={{ boxShadow: 'inset 0 0 10px rgba(48,197,90,0.1)' }}>
      {/* User Form */}
      {showUserForm && (
        <div className="p-4 border-b border-[#30C55A]/50 bg-[#30C55A]/10 rounded-t-lg">
          <form onSubmit={handleUserFormSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-[#30C55A]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30C55A] focus:border-[#30C55A] bg-white text-black text-sm shadow-[0_0_10px_rgba(48,197,90,0.2)]"
                style={{ color: 'black !important', backgroundColor: 'white !important' }}
                placeholder="Enter your name to start chatting..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#30C55A] hover:bg-[#25A049] text-black font-bold py-2 px-4 rounded-md transition-colors text-sm shadow-[0_0_15px_rgba(48,197,90,0.4)] hover:shadow-[0_0_20px_rgba(48,197,90,0.6)]"
            >
              Start Chat with Oscar's AI
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
                <div className={`max-w-xs px-3 py-2 rounded-lg text-sm border ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-gray-700 text-white border-[#30C55A] shadow-[0_0_10px_rgba(48,197,90,0.3)]'
                }`}>
                  {message.sender === 'bot' && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs opacity-70 text-white">Oscar's AI Assistant</span>
                    </div>
                  )}
                  <p 
                    className="text-white" 
                    style={{ color: 'white !important' }}
                    dangerouslySetInnerHTML={{ 
                      __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: white;">$1</strong>') 
                    }} 
                  />
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-700 px-3 py-2 rounded-lg border border-[#30C55A] shadow-[0_0_10px_rgba(48,197,90,0.3)]">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs opacity-70 text-white">Oscar's AI is thinking...</span>
                  </div>
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
          <div className="border-t-2 border-[#30C55A]/50 p-3 bg-[#30C55A]/10 rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Oscar's finance goals, skills, or experience..."
                className="flex-1 px-3 py-2 border-2 border-[#30C55A]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30C55A] focus:border-[#30C55A] bg-white text-black text-sm shadow-[0_0_10px_rgba(48,197,90,0.2)]"
                style={{ color: 'black !important', backgroundColor: 'white !important' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-[#30C55A] hover:bg-[#25A049] disabled:bg-gray-600 text-black font-bold px-3 py-2 rounded-md transition-colors text-sm shadow-[0_0_15px_rgba(48,197,90,0.4)] hover:shadow-[0_0_20px_rgba(48,197,90,0.6)]"
              >
                ➤
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Try asking about investment banking, consulting, skills, or achievements!
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default EmbeddedChat;