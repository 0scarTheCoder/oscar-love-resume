import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { knowledgeBase, Role } from '../data/knowledgeBase';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export { knowledgeBase };

// Fuzzy string matching for typo tolerance
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];
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

const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const fuzzyMatch = (words: string[], tokens: string[]): boolean =>
  words.some(word => tokens.some(token => calculateSimilarity(word, token) >= 0.8));

const pick = (responses: string[]): string =>
  responses[Math.floor(Math.random() * responses.length)];

const kb = knowledgeBase;
const email = kb.personal.email;

const describeRole = (role: Role): string => {
  const heading = role.company ? `${role.title}, ${role.company}` : role.title;
  const period = role.basis ? `${role.period}, ${role.basis}` : role.period;
  const detail = role.points.length ? ` ${role.points.join('. ')}.` : '';
  return `**${heading}** (${period}).${detail}`;
};

const roleLine = (role: Role): string => {
  const heading = role.company ? `${role.title}, ${role.company}` : role.title;
  const period = role.basis ? `${role.period}, ${role.basis}` : role.period;
  return `${heading} (${period})`;
};

const findRole = (company: string, title?: string): Role =>
  kb.experience.find(role => (title ? role.title.startsWith(title) : role.company.startsWith(company))) as Role;

// Questions that name a specific employer or role get that role's entry.
// Text matching `exclude` is ignored before the pattern is tested.
const roleMatchers: { role: Role; pattern: RegExp; exclude?: RegExp; fuzzy: string[] }[] = [
  {
    role: findRole('Entech'),
    pattern: /\bentech\b|delta ?flow|\bkpis?\b|legacy scripts|\bcredentials\b|employee.utilisation|work planning|productivity modelling|mining consultanc(y|ies)/,
    fuzzy: ['entech', 'deltaflow']
  },
  {
    role: findRole('Canetoad'),
    pattern: /cane ?toad|spatial database|mineral exploration|\bwamex\b|\bdigs\b|\bsarig\b|\bntgs\b|geoscience|\busgs\b|\bjurisdictions?\b|government agenc(y|ies)|data custodians?|licen[cs]e terms|permission audit|\btenements?\b|drill ?holes?|\bgis\b|google earth|\bmap(s|ping)?\b|\bgeolog\w*|\basx\b|british columbia|\bchile\b|\bquebec\b|\bmichigan\b|\bminnesota\b/,
    fuzzy: ['canetoad']
  },
  {
    role: findRole('Hodie'),
    pattern: /\bhodie\b|health monitoring|health platform|\bchatbots?\b/,
    exclude: /\b(are|r) (you|u) (an? )?(ai )?chatbots?|\bis this (an? )?(ai )?chatbots?/g,
    fuzzy: ['hodie']
  },
  { role: findRole('Robert Willis'), pattern: /robert willis|\bwillis\b|\balgorithms\b|\balgo(rithmic)? trading/, fuzzy: ['willis'] },
  { role: findRole('Invest America'), pattern: /invest america/, fuzzy: [] },
  { role: findRole('Vitruvian'), pattern: /\bvitruvian\b/, fuzzy: ['vitruvian'] },
  {
    role: findRole('Private consulting'),
    pattern: /private consult\w*|\bconsult(ing|ants?)\b/,
    exclude: /\b(management|mining) consult\w*/g,
    fuzzy: []
  },
  { role: findRole('St John'), pattern: /st\.? john|\bsjog\b|\bhospital\b|\border(ly|lies)\b/, fuzzy: ['hospital', 'orderly'] },
  { role: findRole('', 'Private Tutor'), pattern: /\btutor/, fuzzy: ['tutoring'] },
  { role: findRole('', 'Volleyball Referee'), pattern: /\breferee(s|d|ing)?\b|\bvwa\b/, fuzzy: ['referee', 'refereeing'] }
];

const matchesRole = (matcher: { pattern: RegExp; exclude?: RegExp }, question: string): boolean =>
  matcher.pattern.test(matcher.exclude ? question.replace(matcher.exclude, ' ') : question);

// Job referees (references) are never published. Volleyball refereeing is a role.
const refereeRequest = /\b(referees|references?|referee (details?|contacts?|names?))\b/;
const refereeingContext = /volleyball|\bvwa\b/;
const refereeResponse = `Referee details are not published here. Please email Oscar at **${email}**.`;

// Pay or leaving questions that name an employer get the neutral answer, not the role entry.
const sensitiveRoleQuestion = /\b(salary|salaries|pay|paid|compensation|wages?|remuneration|package|leav(e|ing)|quit|resign\w*|happy|poach\w*)\b/;

const neutralHiring = `Oscar currently works as a software developer and data analyst at Entech and as a partner at Canetoad AI. For opportunities or collaboration, please email him at **${email}**.`;

const relocationResponse = `Oscar is based in ${kb.personal.location}. For questions about relocation or opportunities, please email him at **${email}**.`;

const educationResponse = (question: string): string => {
  const [honours, bachelor] = kb.education;
  const base = `Oscar completed ${honours.title.toLowerCase()} at ${honours.institution} (${honours.period}, WAM ${honours.wam}) and a ${bachelor.title} at ${bachelor.institution} (${bachelor.period}, WAM ${bachelor.wam}). His ATAR was ${kb.personal.atar} (${kb.personal.atar_year}).`;
  if (/research|thesis|dissertation|honou?rs|reservoir|chaotic|chaos|description length/.test(question)) {
    return `${base} His honours work: ${honours.points.join('. ')}.`;
  }
  return base;
};

const recentWorkResponse = `Since March 2026 Oscar has worked as a software developer and data analyst at Entech and as a partner at Canetoad AI. At Entech he is one of two developers commercialising DeltaFlow GUI, and works on discrete event simulation and productivity modelling. At Canetoad AI he built and governs a spatial database behind the mineral exploration platform, using PostgreSQL with PostGIS.`;

const fallbackResponses = [
  "I can help you learn about Oscar's background, skills, experience, or how to get in touch with him. What specific aspect would you like to know more about?",
  "Feel free to ask me about Oscar's education, work experience, technical skills or achievements. What interests you most?",
  "I'm here to answer questions about Oscar's professional background. Is there something particular you'd like to discuss?",
  "You can ask me about Oscar's academic work, professional experience or skills. What would be most helpful to know?"
];

interface Intent {
  pattern: RegExp;
  fuzzy: string[];
  respond: (question: string) => string;
}

// Topic intents, checked in order: the first matching intent answers.
const intents: Intent[] = [
  {
    // Hiring, career, availability, timeline, salary and relocation
    pattern: /\b(hir(e|ed|ing)|job (offer|opening|opportunit\w*)s?|new job|open positions?|opportunit(y|ies)|vacanc(y|ies)|recruit\w*|employable|unemployed|available|availability|start(ing)? date|(can|could|would|will) (he|oscar) start|start (work|soon|immediately|right away)|notice|timeline|salary|salaries|pay|paid|compensation|wages?|rates?|charges?|remuneration|package|relocat\w*|mov(e|ing)|remote(ly)?|overseas|interstate|melbourne|sydney|brisbane|adelaide|canberra|interview\w*|careers?|looking for|seeking|open to|consider|offer\w*|opening|appl(y|ying|ied) (for|to|anywhere)|job applications?|visa|work rights|citizen\w*|sponsor\w*|leav(e|ing)|quit|resign\w*|poach\w*|freelanc\w*|collaborat\w*|management consult\w*|investment bank\w*)\b/,
    fuzzy: ['salary', 'available', 'availability', 'relocate', 'relocation', 'opportunity', 'opportunities', 'interview', 'career'],
    respond: question =>
      /relocat|\bmov(e|ing)\b|\bremote|overseas|interstate|melbourne|sydney|brisbane|adelaide|canberra/.test(question) || fuzzyMatch(question.split(/\s+/), ['relocate', 'relocation'])
        ? relocationResponse
        : neutralHiring
  },
  {
    // Graduation and student status
    pattern: /graduat\w*|\bstudents?\b|still studying|finish(ed)? (his |uni|university|the )?(degree|studies|honours)|completed (his )?(degree|studies|honours)/,
    fuzzy: ['graduate', 'graduated', 'graduation'],
    respond: () => 'Oscar completed his honours degree at UWA in December 2025 and has worked at Entech and Canetoad AI since March 2026.'
  },
  {
    // Finance
    pattern: /\b(financ\w*|banking|banks?|invest(ment|ing|or)s?|trading|traders?|markets?|quant\w*|stocks?)\b/,
    fuzzy: ['finance', 'financial', 'trading', 'investment'],
    respond: () => "Oscar's finance-related work is with Robert Willis Algorithms, where he builds Python trading strategies and automated trading algorithms."
  },
  {
    // Education
    pattern: /\b(education|educational|educated|gpa|reservoir computing|chaotic|chaos|minimum description length|maths?|mathematics|phd|masters|high school|degrees?|universit(y|ies)|uni|uwa|stud(y|ied|ies|ying)|academic\w*|atar|wam|grades?|marks?|honou?rs|bachelor|thesis|dissertation|research|qualifications?|school|major(ed|s)?)\b/,
    fuzzy: ['education', 'university', 'degree', 'studied', 'honours', 'academic', 'qualification'],
    respond: educationResponse
  },
  {
    // Recent and current work
    pattern: /\b(recent(ly)?|latest|lately|current(ly)?|now|nowadays|these days|at the moment|working on|present|what does (he|oscar) do(?! for fun| in (his|the) (free|spare) time| outside)|where does (he|oscar) work|who does (he|oscar) work for|is (he|oscar) employed|(his|oscar's) (current |present )?(role|job|position)(?! history)|job title|mining|mines?)\b/,
    fuzzy: ['recent', 'recently', 'latest', 'current', 'currently'],
    respond: () => recentWorkResponse
  },
  {
    // Contact
    pattern: /\b(contact|e-?mail|reach|get in touch|linkedin|phone|call|message)\b/,
    fuzzy: ['contact', 'email', 'linkedin'],
    respond: () => `You can reach Oscar by email at **${email}**. His LinkedIn is ${kb.personal.linkedin} and his GitHub is ${kb.personal.github}.`
  },
  {
    // Location
    pattern: /\b(locat(ed|ion)|based|lives?|living|perth|city|where is|where's|where in|time ?zone)\b/,
    fuzzy: ['location', 'located'],
    respond: () => `Oscar is based in ${kb.personal.location}.`
  },
  {
    // Achievements
    pattern: /\b(achievements?|accomplishments?|awards?|hackathons?|volleyball|netball|won|wins?|winner|prizes?|sports?|competitions?|unisport|captain|mvp|placings?|champion\w*|represent\w*)\b/,
    fuzzy: ['achievement', 'achievements', 'hackathon', 'volleyball', 'netball', 'awards'],
    respond: () => `Oscar's achievements: ${kb.achievements.join('; ')}.`
  },
  {
    // Accreditations
    pattern: /\b(accreditations?|certif\w*|licen[cs]es?|police|clearances?|working with children|wwcc|bronze medallion|duke of edinburgh|driver'?s?)\b/,
    fuzzy: ['accreditation', 'accreditations', 'certification', 'licence'],
    respond: () => `Oscar's accreditations: ${kb.accreditations.join(', ')}.`
  },
  {
    // Projects and code
    pattern: /\b(projects?|portfolio|github|repos?|repositor(y|ies)|code|website)\b/,
    fuzzy: ['project', 'projects', 'github', 'portfolio'],
    respond: () => `Oscar's code is on GitHub at ${kb.personal.github}. His current work includes DeltaFlow GUI at Entech and a spatial database behind the Canetoad AI mineral exploration platform. Ask about Entech or Canetoad AI for more detail.`
  },
  {
    // Skills
    pattern: /\b(skills?|technical|technolog(y|ies)|tech|stack|languages?|programming|coding|python|sql|javascript|typescript|java|julia|html|css|postgres\w*|postgis|nosql|ssms|etl|pipelines?|governance|machine learning|statistic\w*|simulation|bayesian|power bi|git|react|node|jupyter|rstudio|tools?|good at|expertise|abilit(y|ies)|strengths?|leadership|analytics|continuous integration|ci\/?cd|schema|databases?|apis?|front ?end|back ?end|full.?stack|time series|modelling|data science|does (he|oscar) know|(know|knows|use|uses|using|write|writes|code in|program in|experience (with|in)) (r|c)|(r|c) programming)\b|c\+\+/,
    fuzzy: ['skills', 'python', 'programming', 'languages', 'technology', 'expertise'],
    respond: () =>
      `Oscar's skills. **Languages:** ${kb.skills.languages.join(', ')}. **Data:** ${kb.skills.data.join(', ')}. **Analytics:** ${kb.skills.analytics.join(', ')}. **Engineering:** ${kb.skills.engineering.join(', ')}. **Soft skills:** ${kb.skills.soft_skills.join(', ')}.`
  },
  {
    // Interests
    pattern: /\b(interests?|hobb(y|ies)|free time|spare time|fun|outside (of )?work|gaming|music|photography|running)\b/,
    fuzzy: ['interests', 'hobbies'],
    respond: () => `Oscar's interests: ${kb.interests.join(', ')}.`
  },
  {
    // Work history
    pattern: /\b(experienced?|work(ed|s|ing)?|employment|employers?|employed|roles?|jobs?|positions?|background|resume|cv|history|interns?|internships?|compan(y|ies))\b/,
    fuzzy: ['experience', 'employment', 'background'],
    respond: () => `Oscar's roles: ${kb.experience.map(roleLine).join('; ')}. Ask about any of them for more detail.`
  }
];

// General intents, tried only after every topic and typo-tolerant match.
const generalIntents: Intent[] = [
  {
    // Who is Oscar
    pattern: /\b(who|about|summary|introduce|overview|tell me)\b/,
    fuzzy: [],
    respond: () => `${kb.personal.name} is a ${kb.personal.role.toLowerCase()}, based in ${kb.personal.location}. His focus is ${kb.personal.focus.charAt(0).toLowerCase()}${kb.personal.focus.slice(1)}.`
  },
  {
    // Greetings
    pattern: /^(hello|hi|hey|g'?day|good (morning|afternoon|evening)|greetings|howdy)\b/,
    fuzzy: [],
    respond: () => "Hello! I'm Oscar's assistant. I can tell you about his work at Entech and Canetoad AI, his skills, education and achievements."
  }
];

// Pure question-to-answer function. Exact matches are tried before
// typo-tolerant ones, and named employers before general intents.
export const generateResponse = (question: string): string => {
  const cleanMessage = question.toLowerCase().trim();
  const words = cleanMessage.split(/[^a-z0-9+']+/).filter(word => word.length > 3);

  if (refereeRequest.test(cleanMessage) && !refereeingContext.test(cleanMessage)) {
    return refereeResponse;
  }

  const namedRoles = roleMatchers.filter(matcher => matchesRole(matcher, cleanMessage));
  if (namedRoles.length) {
    if (sensitiveRoleQuestion.test(cleanMessage)) {
      return neutralHiring;
    }
    return namedRoles.map(matcher => describeRole(matcher.role)).join(' ');
  }

  // A question joined by "and" (or similar) can cover two topics: answer both.
  const parts = cleanMessage.split(/\s+(?:and|plus|as well as)\s+|\s*[&;,]\s*/).filter(Boolean);
  const partAnswers: string[] = [];
  const answered: Intent[] = [];
  parts.forEach(part => {
    const intent = intents.find(candidate => candidate.pattern.test(part));
    if (intent && !answered.includes(intent) && answered.length < 2) {
      answered.push(intent);
      partAnswers.push(intent.respond(part));
    }
  });
  if (partAnswers.length) {
    return partAnswers.join(' ');
  }

  const exactIntent = intents.find(intent => intent.pattern.test(cleanMessage));
  if (exactIntent) {
    return exactIntent.respond(cleanMessage);
  }

  const fuzzyRoles = roleMatchers.filter(matcher => fuzzyMatch(words, matcher.fuzzy));
  if (fuzzyRoles.length) {
    return fuzzyRoles.map(matcher => describeRole(matcher.role)).join(' ');
  }

  const fuzzyIntent = intents.find(intent => fuzzyMatch(words, intent.fuzzy));
  if (fuzzyIntent) {
    return fuzzyIntent.respond(cleanMessage);
  }

  const generalIntent = generalIntents.find(intent => intent.pattern.test(cleanMessage));
  if (generalIntent) {
    return generalIntent.respond(cleanMessage);
  }

  return pick(fallbackResponses);
};

// AI chat endpoint (the Cloudflare Worker in chat-worker/). Empty means built-in rules only.
const CHAT_API_URL = (process.env.REACT_APP_CHAT_API_URL || '').replace(/\/+$/, '');
const MAX_QUESTION_CHARS = 600;
const MAX_HISTORY_TURNS = 12;

type ChatTurn = { role: 'user' | 'assistant'; content: string };

// The recent conversation in the shape the worker expects: it must start with a visitor message.
export const toTurns = (history: Message[]): ChatTurn[] => {
  const turns = history
    .filter(message => message.id !== 'welcome')
    .map(message => ({ role: message.sender === 'user' ? ('user' as const) : ('assistant' as const), content: message.text }))
    .slice(-MAX_HISTORY_TURNS);
  while (turns.length && turns[0].role !== 'user') turns.shift();
  return turns;
};

// Returns the model's reply, or null when the caller should fall back to the built-in rules.
export const askAssistant = async (turns: ChatTurn[]): Promise<string | null> => {
  if (!CHAT_API_URL || !turns.length) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`${CHAT_API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: turns }),
      signal: controller.signal
    });
    if (response.status === 429) {
      return "I'm getting a lot of questions right now. Please try again in a minute.";
    }
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data?.reply === 'string' && data.reply.trim() ? data.reply.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const EmbeddedChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [showUserForm, setShowUserForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-bot`, text, sender: 'bot', timestamp: new Date() }]);
  };

  // Ask the AI model. If it is not configured or fails, answer from the built-in rules instead.
  const respondTo = async (userMessage: string, history: Message[]) => {
    setIsTyping(true);
    const started = Date.now();
    let reply = await askAssistant(toTurns(history));
    if (!reply) {
      reply = generateResponse(userMessage);
      const typingDelay = Math.min(2500, 800 + reply.length * 20);
      const remaining = typingDelay - (Date.now() - started);
      if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
    }
    if (!mounted.current) return;
    setIsTyping(false);
    addBotMessage(reply);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || isTyping) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const history = [...messages, message];
    setMessages(history);
    setNewMessage('');
    respondTo(message.text, history);
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name.trim()) {
      setShowUserForm(false);
      
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Hi ${userInfo.name}! I'm Oscar's assistant. I can tell you about his work at Entech and Canetoad AI, his skills, education and achievements.`,
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm border ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-gray-700 text-white border-[#30C55A] shadow-[0_0_10px_rgba(48,197,90,0.3)]'
                }`}>
                  {message.sender === 'bot' && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs opacity-70 text-white">Oscar's AI Assistant</span>
                    </div>
                  )}
                  {/* Rendered as React nodes, so visitor-typed text is never treated as HTML. */}
                  <p className="text-white whitespace-pre-line" style={{ color: 'white' }}>
                    {message.text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                      i % 2 === 1 ? <strong key={i} style={{ color: 'white' }}>{part}</strong> : part
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
                maxLength={MAX_QUESTION_CHARS}
                placeholder="Ask about Oscar's experience, skills or education..."
                className="flex-1 px-3 py-2 border-2 border-[#30C55A]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30C55A] focus:border-[#30C55A] bg-white text-black text-sm shadow-[0_0_10px_rgba(48,197,90,0.2)]"
                style={{ color: 'black !important', backgroundColor: 'white !important' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="bg-[#30C55A] hover:bg-[#25A049] disabled:bg-gray-600 text-black font-bold px-3 py-2 rounded-md transition-colors text-sm shadow-[0_0_15px_rgba(48,197,90,0.4)] hover:shadow-[0_0_20px_rgba(48,197,90,0.6)]"
              >
                ➤
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {CHAT_API_URL ? "Answers are AI-generated from Oscar's CV and can contain mistakes." : 'Try asking about Entech, Canetoad AI, skills or achievements.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default EmbeddedChat;