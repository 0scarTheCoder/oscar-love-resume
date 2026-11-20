import React, { useEffect, useState } from 'react';
import GitHubActivity from './components/GitHubActivity';
import TimeZoneDisplay from './components/TimeZoneDisplay';
import EmbeddedChat from './components/EmbeddedChat';
import EarthquakeFeed from './components/EarthquakeFeed';
import Contact from './components/Contact';
import Maintenance from './components/Maintenance';
import './App.css';

// ---------------------------------------------------------------------------
// Page content. Kept in step with Oscar's CV (last synced 19 November 2026).
// Titles, dates and bullets are word for word from the CV.
// ---------------------------------------------------------------------------

const TAILOR_ROUTE = '#/tailor';

const about = [
  "I am a data analyst and software developer working in the mining sector. I build and govern the data platforms that sit underneath analytics: a spatial database behind Canetoad's mineral exploration product, assembled from government sources across eighteen jurisdictions and loaded into PostgreSQL with PostGIS, and discrete event simulation and productivity modelling at Entech, where I am one of two developers commercialising DeltaFlow GUI.",
  "My work spans data engineering, pipelines and integrations, governance and provenance, and the quality and compliance side of making data trustworthy, supported by UWA honours in computer science and software engineering and a bachelor's degree in data science, mathematics and statistics.",
  'Much of this work is about risk as much as analysis: knowing where data came from, what its licence permits and whether a result can be reproduced. Working in SQL, Python and R, I turn operational data into reporting for clients and colleagues, and use it to establish where a problem sits, whether in the software, the mine design or the process behind it. I work alongside experienced mining consultants and correspond directly with government data custodians. Mining was new to me when I started and I learned it on the job.',
];

const stats = [
  { label: 'ATAR (2020)', value: '99.35' },
  { label: 'Honours WAM', value: '75' },
  { label: 'Bachelor WAM', value: '78' },
  { label: 'Hackathon Placings', value: '2' },
];

const skillGroups = [
  {
    title: '💻 Languages',
    items: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'R', 'Julia', 'HTML', 'CSS'],
  },
  {
    title: '🗄️ Data',
    items: ['PostgreSQL', 'PostGIS', 'NoSQL', 'SSMS', 'Schema design', 'Ingestion and ETL pipelines', 'Data governance and provenance'],
  },
  {
    title: '📈 Analytics',
    items: ['Machine learning', 'Statistical modelling', 'Discrete event simulation', 'Time series analysis', 'Bayesian statistics', 'Power BI'],
  },
  {
    title: '🛠️ Engineering',
    items: ['Git and GitHub', 'Continuous integration', 'Node.js', 'React', 'Jupyter', 'RStudio'],
  },
  {
    title: '👥 Leadership & Soft Skills',
    items: ['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Adaptability', 'Work Ethic'],
  },
];

const education = [
  {
    title: 'Honours, Computer Science and Software Engineering',
    meta: 'UWA • July 2024 to December 2025 • WAM 75',
    points: [
      'Research applying reservoir computing and minimum description length to time series prediction in chaotic systems',
      'Applied to mining operations forecasting, equipment maintenance prediction and operational analytics',
    ],
  },
  {
    title: 'Bachelor of Philosophy, Data Science, Mathematics and Statistics',
    meta: 'UWA • February 2021 to June 2024 • WAM 78',
    points: [],
  },
  {
    title: 'ATAR (2020)',
    meta: '99.35',
    points: [],
  },
];

const accreditations = [
  'Working with Children Check',
  'National Police Clearance',
  'C-class driver licence',
  'Level 2 Volleyball Referee',
  'Surf Life Saving Bronze Medallion',
  "Silver Duke of Edinburgh's Award",
];

const experience = [
  {
    title: 'Software Developer and Data Analyst (Contract)',
    company: 'Entech Pty Ltd',
    period: 'March 2026 to present',
    points: [
      'One of two developers commercialising DeltaFlow GUI in research and development, to open a new revenue stream for a multinational mining consultancy',
      'Discrete event simulation and productivity modelling: built a repeatable simulation data pipeline with documentation, feeding Power BI dashboards and improving stakeholder access to KPIs',
      'Refactored legacy scripts, moved database credentials into environment configuration, standardised repository structure and continuous integration',
      'Built web templates and applications to localise work planning and present visualisations and measurements supporting employee-utilisation reporting',
    ],
  },
  {
    title: 'Software Developer and Data Analyst (Partner)',
    company: 'Canetoad AI',
    period: 'March 2026 to present',
    points: [
      'Built and govern a spatial database behind the mineral exploration platform. PostgreSQL with PostGIS',
      'Data from eighteen jurisdictions outside Australia and counting, plus WAMEX, DIGS, SARIG, NTGS and Geoscience Australia',
      'Secured most of that access by writing to government agencies and negotiating licence terms, including British Columbia, Chile, Quebec, Michigan, Minnesota and the USGS. Maintain a documented source permission audit',
      'Built Google Earth-style layered map visualisations exposing tenement feeds, drill holes and geological boundaries as toggleable GIS layers',
      'Developed pattern-recognition models over ASX mining announcements, correlating language signals with share-price movement',
    ],
  },
  {
    title: 'Software Developer',
    company: 'Hodie Labs',
    period: 'September 2025 to March 2026',
    points: [
      'Lead and only developer of a health monitoring platform, built from the ground up with React, Node.js and an integrated database',
      'Built interactive dashboards and a chatbot interface for conversational analytics queries, plus custom APIs and backend services',
    ],
  },
  {
    title: 'Software Engineering Partner',
    company: 'Robert Willis Algorithms',
    period: 'September 2025 to present',
    points: [
      'Python trading strategies combining statistical analysis with quantitative modelling',
      'Automated trading algorithms incorporating machine learning, and real-time data processing supporting market analysis',
    ],
  },
  {
    title: 'Software Developer (Internship)',
    company: 'Private consulting',
    period: 'August to November 2025',
    points: ['Full-stack web applications, custom APIs and intelligent agents for small business and start-up clients'],
  },
  {
    title: 'Data Analyst (Internship)',
    company: 'Invest America',
    period: 'April to July 2024',
    points: [
      'Designed data-collection forms and integrated frontend and backend systems to improve data accessibility and analytics',
    ],
  },
  {
    title: 'Data Management Intern',
    company: 'Vitruvian',
    period: 'August to December 2021',
    points: ['Analysed large financial datasets and built reporting dashboards for senior management'],
  },
  // Casual roles that are not on the CV. Oscar confirmed all three are current.
  {
    title: 'Theatre Orderly',
    company: "St John Of God's Hospital Subiaco",
    period: 'January 2022 - Current',
    points: [
      'Assist medical staff in operating theatre procedures',
      'Maintain sterile environments and equipment',
      'Provide patient care and support during surgical procedures',
      'Collaborate with multidisciplinary healthcare teams',
    ],
  },
  {
    title: 'Private Tutor',
    company: 'Private Practice',
    period: 'January 2018 - Current',
    points: [
      'Provide personalised academic support across multiple subjects',
      'Develop tailored learning strategies for individual students',
      'Help students achieve significant grade improvements',
      'Specialising in mathematics, physics, and data science',
    ],
  },
  {
    title: 'Volleyball Referee',
    company: 'VWA',
    period: 'March 2021 - Current',
    points: [
      'Officiate volleyball matches at various competition levels',
      'Make quick, accurate decisions under pressure',
      'Maintain game flow and ensure fair play',
      'Level 2 certified referee',
    ],
  },
];

const achievements = [
  { title: '1st Place SLB Data Science Hackathon', desc: 'Won first place among WA university students in October 2023' },
  { title: '2nd Place UWA WHACK WesCEF Hackathon', desc: 'Secured second place in September 2023' },
  { title: 'ATAR 99.35', desc: 'Achieved top 1% of students in Western Australia' },
  { title: 'Australian Junior Indoor Volleyball Representative', desc: '2018 and 2019' },
  { title: 'WA Indoor Volleyball', desc: '2017 to 2019. Captain 2017, MVP 2018 and 2019' },
  { title: 'Unisport Nationals', desc: 'Volleyball champions 2022, netball runners up 2024' },
];


const cardClass =
  'bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300';
const chipClass = `${cardClass} px-4 py-3 text-center transform hover:scale-105 flex items-center justify-center`;

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash;
      setRoute((previous) => {
        // Only jump to the top when entering or leaving the maintenance page,
        // so in-page anchors such as #contact keep working.
        if (next === TAILOR_ROUTE || previous === TAILOR_ROUTE) {
          window.scrollTo(0, 0);
        }
        return next;
      });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Keep this after all hooks.
  if (route === TAILOR_ROUTE) {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen animated-background overflow-x-hidden" style={{ 
      backgroundColor: '#0D1117',
      fontFamily: "'Space Grotesk', 'Roboto Mono', sans-serif"
    }}>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20 text-white">
          
        {/* Profile Section */}
        <section className="text-center mb-14 sm:mb-20">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 neon-glow" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            OSCAR LOVE
          </h1>
          <p className="text-xl sm:text-2xl neon-text font-medium mb-6">Data Analyst and Software Developer</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-gray-300 text-base sm:text-lg">
            <a href="mailto:loveoh19@gmail.com" className="hover:text-white transition-colors">📧 loveoh19@gmail.com</a>
            <a href="https://github.com/0scarTheCoder" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              💻 GitHub: 0scarTheCoder
            </a>
            <span className="hover:text-white transition-colors">📍 Perth, Western Australia</span>
          </div>
        </section>

        {/* AI Profile Tailoring */}
        <section className="mb-14 sm:mb-20 relative">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-8 neon-border">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 neon-text text-center">
              AI-POWERED PROFILE TAILORING
            </h2>
            <div className="space-y-6">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here to dynamically tailor my profile..."
                className="w-full h-40 bg-gray-900/80 text-white p-4 sm:p-6 rounded-xl border-2 border-gray-700 focus:border-[#30C55A] focus:outline-none resize-none text-base sm:text-lg backdrop-blur-sm"
                style={{ textShadow: '0 0 5px rgba(255,255,255,0.3)' }}
              />
              <div className="text-center">
                <button
                  onClick={() => { window.location.hash = TAILOR_ROUTE; }}
                  className="bg-gradient-to-r from-[#30C55A] to-[#25A049] hover:from-[#25A049] hover:to-[#1E8F3E] text-black font-bold px-8 sm:px-12 py-4 rounded-xl transition-all duration-300 text-lg neon-border transform hover:scale-105"
                >
                  TAILOR PROFILE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="space-y-16 min-w-0">
            
            {/* About */}
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text">ABOUT</h2>
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-5 sm:p-8 border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300 space-y-6">
                {about.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className={`${cardClass} text-center p-4 transform hover:scale-105`}>
                    <div className="text-2xl font-bold neon-text mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text">SKILLS</h2>
              {skillGroups.map((group, index) => (
                <div key={group.title} className={index < skillGroups.length - 1 ? 'mb-10' : ''}>
                  <h3 className="text-2xl font-bold mb-6 text-white">{group.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {group.items.map((skill) => (
                      <div key={skill} className={chipClass}>
                        <span className="font-bold text-white text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Education */}
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text">EDUCATION</h2>
              <div className="space-y-6">
                {education.map((entry) => (
                  <div key={entry.title} className={`${cardClass} p-5 sm:p-8 transform hover:scale-[1.02]`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{entry.title}</h3>
                    <p className="neon-text text-lg">{entry.meta}</p>
                    {entry.points.length > 0 && (
                      <ul className="text-gray-300 space-y-2 text-lg mt-4">
                        {entry.points.map((point) => (
                          <li key={point}>⚡ {point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Accreditations */}
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text">ACCREDITATIONS</h2>
              <div className="grid grid-cols-2 gap-4">
                {accreditations.map((item) => (
                  <div key={item} className={chipClass}>
                    <span className="font-bold text-white text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-16 min-w-0">
            
            {/* Experience */}
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text">EXPERIENCE</h2>
              <div className="space-y-8">
                {experience.map((role) => (
                  <div key={`${role.company}-${role.title}`} className="relative pl-6 sm:pl-8 border-l-4 border-[#30C55A] glow-border">
                    <div className="absolute -left-[10px] top-0 w-4 h-4 bg-[#30C55A] rounded-full animate-pulse"></div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{role.title}</h3>
                    <p className="neon-text text-lg mb-4">{role.company} • {role.period}</p>
                    <ul className="text-gray-300 space-y-2 text-lg">
                      {role.points.map((point) => (
                        <li key={point}>⚡ {point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text">ACHIEVEMENTS</h2>
              <div className="space-y-6">
                {achievements.map((achievement) => (
                  <div key={achievement.title} className={`${cardClass} p-6 transform hover:scale-[1.02]`}>
                    <h3 className="text-lg font-bold mb-3">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Live Features */}
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text">LIVE FEATURES</h2>
              <p className="text-lg text-gray-300 mb-8">
                Real-time data feeds and interactive components showcasing advanced technical capabilities
              </p>
              <div className="space-y-6">
                <div className="transform hover:scale-[1.02] transition-all duration-300">
                  <GitHubActivity />
                </div>
                <div className="transform hover:scale-[1.02] transition-all duration-300">
                  <TimeZoneDisplay />
                </div>
                <div className="transform hover:scale-[1.02] transition-all duration-300">
                  <EarthquakeFeed />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Dashboard preview - static snapshot served from /demo, independent of any backend */}
        <section className="mt-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text text-center">DASHBOARD PREVIEW</h2>
          <a
            href={`${process.env.PUBLIC_URL}/demo/commodities.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gray-900/80 backdrop-blur-sm rounded-xl border-4 border-[#30C55A] shadow-[0_0_40px_rgba(48,197,90,0.6)] hover:shadow-[0_0_60px_rgba(48,197,90,0.8)] transition-all duration-300 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 bg-black">
                <img
                  src={`${process.env.PUBLIC_URL}/demo-preview.jpg`}
                  alt="Canetoad ASX materials dashboard, commodities page"
                  loading="lazy"
                  width={1200}
                  height={675}
                  className="w-full h-auto block"
                />
              </div>
              <div className="lg:col-span-2 p-5 sm:p-8 flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl font-bold text-[#30C55A] mb-3">Canetoad ASX Materials Dashboard</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  A click-through snapshot of the analytics dashboard from my work at Canetoad AI. Browse the commodity,
                  sector heat, announcement and ranking pages, replayed as of 19 August 2026.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Static copy with data through 18 August 2026. Not live data and not financial advice. Search and
                  filters are switched off.
                </p>
                <span className="inline-block self-start bg-[#30C55A] group-hover:bg-[#25A049] text-black font-bold py-3 px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(48,197,90,0.4)]">
                  OPEN PREVIEW ➤
                </span>
              </div>
            </div>
          </a>
        </section>

        {/* Interactive AI Chat - Full Width */}
        <section className="mt-20 mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 neon-text text-center">INTERACTIVE AI CHAT</h2>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border-4 border-[#30C55A] shadow-[0_0_40px_rgba(48,197,90,0.6)] hover:shadow-[0_0_60px_rgba(48,197,90,0.8)] flex flex-col h-[36rem] sm:h-[32rem] transform hover:scale-[1.01] transition-all duration-300 p-2 sm:p-4 glow-border" style={{ boxShadow: 'inset 0 0 20px rgba(48,197,90,0.2), 0 0 40px rgba(48,197,90,0.6)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b-2 border-[#30C55A] bg-[#30C55A]/10 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-bold text-[#30C55A] flex items-center gap-3 neon-text">
                <span className="text-3xl">💬</span>
                Ask Me Anything About Oscar
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#30C55A] rounded-full animate-pulse shadow-[0_0_10px_rgba(48,197,90,0.8)]"></div>
                <span className="text-sm neon-text font-bold">LIVE AI ASSISTANT</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 p-2 sm:p-4 bg-[#30C55A]/10 rounded-b-lg border-2 border-[#30C55A] border-t-0" style={{ background: 'linear-gradient(135deg, rgba(48,197,90,0.15) 0%, rgba(48,197,90,0.05) 100%)', boxShadow: 'inset 0 0 15px rgba(48,197,90,0.2)' }}>
              <EmbeddedChat />
            </div>
          </div>
        </section>
      </div>

      {/* Contact Section - Full Width */}
      <Contact />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 text-white">
        {/* Footer */}
        <footer className="text-center text-gray-400 border-t border-gray-800 py-12 text-base sm:text-lg">
          <p className="neon-text">© 2026 OSCAR LOVE • Built with React & TypeScript • Always Evolving</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
