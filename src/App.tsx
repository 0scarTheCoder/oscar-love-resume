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
      fontFamily: "'Space Grotesk', 'Roboto Mono', sans-serif",
      background: 'linear-gradient(-45deg, #0D1117, #161B22, #0D1117, #21262D)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .neon-glow {
          text-shadow: 0 0 5px #30C55A, 0 0 10px #30C55A, 0 0 15px #30C55A;
        }
        .neon-border {
          box-shadow: 0 0 5px #30C55A, 0 0 10px #30C55A, inset 0 0 10px rgba(48, 197, 90, 0.1);
        }
        .neon-text {
          color: #30C55A;
          text-shadow: 0 0 10px #30C55A;
        }
      `}</style>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-8 py-20 text-white">
          
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
          <p className="text-2xl neon-text font-medium mb-6">Full-Stack Developer</p>
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

        {/* About */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 neon-text">ABOUT</h2>
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <p className="text-xl text-gray-300 leading-relaxed">
              Passionate full-stack developer specializing in cutting-edge web technologies. 
              I architect scalable solutions using React, TypeScript, and Node.js while creating 
              exceptional user experiences that push the boundaries of modern web development.
            </p>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 neon-text">EXPERIENCE</h2>
          <div className="space-y-8">
            <div className="relative pl-8 border-l-4 border-[#30C55A] glow-border">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-[#30C55A] rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-bold text-white">Senior Full-Stack Developer</h3>
              <p className="neon-text text-lg mb-4">Tech Company • 2022 - Present</p>
              <ul className="text-gray-300 space-y-2 text-lg">
                <li>⚡ Architected scalable web applications with React, TypeScript & Node.js</li>
                <li>⚡ Implemented real-time features and seamless API integrations</li>
                <li>⚡ Led development of responsive, cutting-edge user interfaces</li>
              </ul>
            </div>
            <div className="relative pl-8 border-l-4 border-[#30C55A] glow-border">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-[#30C55A] rounded-full"></div>
              <h3 className="text-2xl font-bold text-white">Frontend Developer</h3>
              <p className="neon-text text-lg mb-4">Startup Inc • 2020 - 2022</p>
              <ul className="text-gray-300 space-y-2 text-lg">
                <li>⚡ Built modern React applications with advanced TypeScript</li>
                <li>⚡ Collaborated on pixel-perfect, award-winning UI implementations</li>
                <li>⚡ Optimized performance achieving 95+ Lighthouse scores</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Live Features */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 neon-text text-center">LIVE FEATURES</h2>
          <p className="text-xl text-gray-300 mb-12 text-center">
            Real-time data feeds and interactive components showcasing advanced technical capabilities
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        {/* Achievements */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 neon-text">ACHIEVEMENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: "🚀", title: "Built 20+ Web Applications", desc: "From simple landing pages to complex full-stack systems" },
              { icon: "⭐", title: "5-Star Client Ratings", desc: "Consistently delivering exceptional solutions on time" },
              { icon: "🔧", title: "Modern Tech Stack Expert", desc: "React, TypeScript, Node.js, AWS, and cutting-edge tools" },
              { icon: "🌍", title: "Global Remote Experience", desc: "Successfully collaborated with international teams" }
            ].map((achievement, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-[#30C55A] transform hover:scale-[1.02] transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  {achievement.title}
                </h3>
                <p className="text-gray-300 text-lg">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 neon-text">SKILLS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['React', 'TypeScript', 'Node.js', 'JavaScript', 'Python', 'AWS', 'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'REST APIs', 'GraphQL'].map((skill, index) => (
              <div key={skill} className="bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl text-center border border-gray-700 hover:border-[#30C55A] hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105">
                <span className="font-bold text-white">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 neon-text">EDUCATION</h2>
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-[#30C55A] transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">Self-Taught Developer</h3>
            <p className="neon-text text-lg mb-4">Continuous Learning • 2018 - Present</p>
            <p className="text-gray-300 text-lg">
              Passionate about mastering new technologies through hands-on projects, advanced courses, 
              and staying at the forefront of web development innovation.
            </p>
          </div>
        </section>

        {/* Hobbies */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 neon-text">INTERESTS & HOBBIES</h2>
          <div className="flex flex-wrap gap-4">
            {['🎮 Gaming', '📚 Tech Innovation', '🏃‍♂️ Running', '🎵 Music Production', '📷 Photography', '🌱 Open Source'].map((hobby, index) => (
              <span key={hobby} className="bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700 hover:border-[#30C55A] transition-all duration-300 transform hover:scale-105 text-lg font-medium">
                {hobby}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 border-t border-gray-800 pt-12 text-lg">
          <p className="neon-text">© 2024 OSCAR LOVE • Built with React & TypeScript • Always Evolving 🚀</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
