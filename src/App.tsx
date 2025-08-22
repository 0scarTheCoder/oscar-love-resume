import React, { useState } from 'react';
import GitHubActivity from './components/GitHubActivity';
import TimeZoneDisplay from './components/TimeZoneDisplay';
import EmbeddedChat from './components/EmbeddedChat';
import EarthquakeFeed from './components/EarthquakeFeed';
import './App.css';

function App() {
  const [jobDescription, setJobDescription] = useState('');

  return (
    <div className="min-h-screen animated-background" style={{ 
      backgroundColor: '#0D1117',
      fontFamily: "'Space Grotesk', 'Roboto Mono', sans-serif"
    }}>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-8 py-20 text-white">
          
        {/* Profile Section */}
        <section className="text-center mb-20">
          <div className="inline-block p-1 rounded-full neon-border mb-8">
            <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-6xl">
              👨‍💻
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 neon-glow" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            OSCAR LOVE
          </h1>
          <p className="text-2xl neon-text font-medium mb-6">Data Science & Software Engineering Graduate</p>
          <div className="flex justify-center gap-8 text-gray-300 text-lg">
            <span className="hover:text-white transition-colors">📧 oscar.love.dev@gmail.com</span>
            <span className="hover:text-white transition-colors">🌐 Remote Worldwide</span>
          </div>
        </section>

        {/* AI Profile Tailoring */}
        <section className="mb-20 relative">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 neon-border">
            <h2 className="text-3xl font-bold mb-6 neon-text text-center">
              AI-POWERED PROFILE TAILORING
            </h2>
            <div className="space-y-6">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here to dynamically tailor my profile..."
                className="w-full h-40 bg-gray-900/80 text-white p-6 rounded-xl border-2 border-gray-700 focus:border-[#30C55A] focus:outline-none resize-none text-lg backdrop-blur-sm"
                style={{ textShadow: '0 0 5px rgba(255,255,255,0.3)' }}
              />
              <div className="text-center">
                <button className="bg-gradient-to-r from-[#30C55A] to-[#25A049] hover:from-[#25A049] hover:to-[#1E8F3E] text-black font-bold px-12 py-4 rounded-xl transition-all duration-300 text-lg neon-border transform hover:scale-105">
                  TAILOR PROFILE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="space-y-16">
            
            {/* About */}
            <section>
              <h2 className="text-4xl font-bold mb-8 neon-text">ABOUT</h2>
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300">
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  I'm a determined, hardworking, and friendly individual who gets on well with people 
                  of all ages. My excellent teamwork and leadership skills have been demonstrated through 
                  commitment to and experience in many sporting teams, including as a junior Australian 
                  volleyball representative.
                </p>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Recently graduated with a Bachelor of Philosophy (Honours) in Computer Science and Software 
                  Engineering from UWA (July 2025), majoring in Data Science, and Mathematics and Statistics. 
                  I'm passionate about using technology to solve real-world problems and always strive to 
                  improve and develop professionally.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: 'ATAR Score', value: '99.35' },
                  { label: 'Current WAM', value: '76' },
                  { label: 'Hackathon Wins', value: '2' },
                  { label: 'Years Experience', value: '6+' }
                ].map((stat, index) => (
                  <div key={stat.label} className="text-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300 transform hover:scale-105">
                    <div className="text-2xl font-bold neon-text mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-4xl font-bold mb-8 neon-text">SKILLS</h2>
              
              {/* Programming Languages */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-white">💻 Programming Languages</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Python', 'R', 'JavaScript', 'Java', 'TypeScript', 'HTML/CSS'].map((skill, index) => (
                    <div key={skill} className="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl text-center border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300 transform hover:scale-105">
                      <span className="font-bold text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Science & Analytics */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-white">📈 Data Science & Analytics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Statistical Analysis', 'Machine Learning', 'Data Visualization', 'Computational Statistics', 'Time Series Analysis', 'Bayesian Statistics'].map((skill, index) => (
                    <div key={skill} className="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl text-center border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300 transform hover:scale-105">
                      <span className="font-bold text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Technologies */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-white">🛠️ Tools & Technologies</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['SQL', 'Git/GitHub', 'Jupyter', 'RStudio', 'Power BI', 'Excel', 'React', 'Node.js'].map((skill, index) => (
                    <div key={skill} className="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl text-center border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300 transform hover:scale-105">
                      <span className="font-bold text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">👥 Leadership & Soft Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Adaptability', 'Work Ethic'].map((skill, index) => (
                    <div key={skill} className="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl text-center border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300 transform hover:scale-105">
                      <span className="font-bold text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-4xl font-bold mb-8 neon-text">EDUCATION</h2>
              <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300 transform hover:scale-[1.02]">
                <h3 className="text-2xl font-bold text-white mb-2">Bachelor of Philosophy (Honours)</h3>
                <p className="neon-text text-lg mb-4">University of Western Australia • July 2025</p>
                <p className="text-gray-300 text-lg mb-4">
                  Computer Science and Software Engineering Honours, majoring in Data Science, and Mathematics and Statistics
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold neon-text">99.35</div>
                    <div className="text-sm text-gray-400">ATAR Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold neon-text">76</div>
                    <div className="text-sm text-gray-400">Current WAM</div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-16">

            {/* Experience */}
            <section>
              <h2 className="text-4xl font-bold mb-8 neon-text">EXPERIENCE</h2>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-4 border-[#30C55A] glow-border">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#30C55A] rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-white">Theatre Orderly</h3>
                  <p className="neon-text text-lg mb-4">St John Of God's Hospital Subiaco • January 2022 - Current</p>
                  <ul className="text-gray-300 space-y-2 text-lg">
                    <li>⚡ Assist medical staff in operating theatre procedures</li>
                    <li>⚡ Maintain sterile environments and equipment</li>
                    <li>⚡ Provide patient care and support during surgical procedures</li>
                    <li>⚡ Collaborate with multidisciplinary healthcare teams</li>
                  </ul>
                </div>
                <div className="relative pl-8 border-l-4 border-[#30C55A] glow-border">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#30C55A] rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-white">Data Management Intern</h3>
                  <p className="neon-text text-lg mb-4">Vitruvian • August 2021 - December 2021</p>
                  <ul className="text-gray-300 space-y-2 text-lg">
                    <li>⚡ Managed and analyzed large datasets</li>
                    <li>⚡ Developed data visualization and reporting tools</li>
                    <li>⚡ Collaborated with senior data scientists on projects</li>
                    <li>⚡ Gained experience in statistical analysis and machine learning</li>
                  </ul>
                </div>
                <div className="relative pl-8 border-l-4 border-[#30C55A] glow-border">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#30C55A] rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-white">Private Tutor</h3>
                  <p className="neon-text text-lg mb-4">Private Practice • January 2018 - Current</p>
                  <ul className="text-gray-300 space-y-2 text-lg">
                    <li>⚡ Provide personalized academic support across multiple subjects</li>
                    <li>⚡ Develop tailored learning strategies for individual students</li>
                    <li>⚡ Help students achieve significant grade improvements</li>
                    <li>⚡ Specializing in mathematics, physics, and data science</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section>
              <h2 className="text-4xl font-bold mb-8 neon-text">ACHIEVEMENTS</h2>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: "🏆", title: "1st Place SLB Data Science Hackathon", desc: "Won first place among WA university students in October 2023" },
                  { icon: "🥈", title: "2nd Place UWA WHACK WesCEF Hackathon", desc: "Secured second place in September 2023" },
                  { icon: "🎯", title: "ATAR 99.35", desc: "Achieved top 1% of students in Western Australia" },
                  { icon: "🏐", title: "Australian Volleyball Representative", desc: "Selected for Australian teams U17s, U18s & U19s (2017-2019)" },
                  { icon: "🥇", title: "Unisport Nationals Volleyball Champion", desc: "Team member of championship-winning university team (2022)" }
                ].map((achievement, index) => (
                  <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transform hover:scale-[1.02] transition-all duration-300">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      {achievement.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Live Features */}
            <section>
              <h2 className="text-4xl font-bold mb-8 neon-text">LIVE FEATURES</h2>
              <p className="text-gray-300 mb-8">
                Real-time data feeds and interactive components showcasing technical capabilities
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
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-gray-700 hover:border-[#30C55A] flex flex-col h-96 transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl">💬</span>
                      INTERACTIVE AI CHAT
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#30C55A] rounded-full animate-pulse"></div>
                      <span className="text-sm neon-text font-bold">LIVE</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <EmbeddedChat />
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 border-t border-gray-800 pt-12 mt-20 text-lg">
          <p className="neon-text">© 2024 OSCAR LOVE • Built with React & TypeScript • Always Evolving 🚀</p>
        </footer>
      </div>
    </div>
  );
}

export default App;