import React, { useState } from 'react';
import GitHubActivity from './components/GitHubActivity';
import TimeZoneDisplay from './components/TimeZoneDisplay';
import EmbeddedChat from './components/EmbeddedChat';
import EarthquakeFeed from './components/EarthquakeFeed';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [jobDescription, setJobDescription] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Roboto Mono', 'Space Grotesk', monospace" }}>
        {/* Header with Dark Mode Toggle */}
        <header className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          
          {/* Profile Section */}
          <section className="mb-16">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-6">
                👨‍💻
              </div>
              <h1 className="text-4xl font-bold mb-2">Oscar Love</h1>
              <p className="text-xl text-green-400 mb-4">Full-Stack Developer</p>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>📧 oscar.love.dev@gmail.com</span>
                <span>📍 Remote</span>
                <span>🌐 Available Worldwide</span>
              </div>
            </div>
          </section>

          {/* AI Profile Tailoring */}
          <section className="mb-16 bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-400">AI-Powered Profile Tailoring</h2>
            <div className="space-y-4">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here to tailor my profile..."
                className="w-full h-32 bg-gray-800 text-white p-4 rounded-md border border-gray-700 focus:border-green-400 focus:outline-none resize-none"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors">
                Tailor Profile
              </button>
            </div>
          </section>

          {/* About */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-green-400">About</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Passionate full-stack developer with expertise in React, TypeScript, Node.js, and modern web technologies. 
              I love building innovative solutions that solve real-world problems and create exceptional user experiences.
            </p>
          </section>

          {/* Experience */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Experience</h2>
            <div className="space-y-8">
              <div className="border-l-2 border-green-400 pl-6">
                <h3 className="text-xl font-bold">Senior Full-Stack Developer</h3>
                <p className="text-green-400 mb-2">Tech Company • 2022 - Present</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Built scalable web applications using React, TypeScript, and Node.js</li>
                  <li>• Implemented real-time features and API integrations</li>
                  <li>• Led development of responsive, user-friendly interfaces</li>
                </ul>
              </div>
              <div className="border-l-2 border-green-400 pl-6">
                <h3 className="text-xl font-bold">Frontend Developer</h3>
                <p className="text-green-400 mb-2">Startup Inc • 2020 - 2022</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Developed modern React applications with TypeScript</li>
                  <li>• Collaborated with design teams to implement pixel-perfect UIs</li>
                  <li>• Optimized performance and user experience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Live Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Live Features</h2>
            <p className="text-gray-300 mb-8">Real-time data feeds and interactive components showcasing my technical capabilities:</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GitHubActivity />
              <TimeZoneDisplay />
              <EarthquakeFeed />
              <div className="bg-gray-900 rounded-lg border border-gray-700 flex flex-col h-96">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">💬</span>
                    Interactive AI Chat
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">Live</span>
                  </div>
                </div>
                <div className="flex-1">
                  <EmbeddedChat />
                </div>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">🚀 Built 20+ Web Applications</h3>
                <p className="text-gray-300">From simple landing pages to complex full-stack applications</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">⭐ 5-Star Client Ratings</h3>
                <p className="text-gray-300">Consistently delivering high-quality solutions on time</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">🔧 Modern Tech Stack Expert</h3>
                <p className="text-gray-300">React, TypeScript, Node.js, AWS, and more</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">🌍 Global Remote Experience</h3>
                <p className="text-gray-300">Successfully collaborated with teams worldwide</p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['React', 'TypeScript', 'Node.js', 'JavaScript', 'Python', 'AWS', 'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'REST APIs', 'GraphQL'].map((skill) => (
                <div key={skill} className="bg-gray-900 px-4 py-2 rounded-md text-center border border-gray-700">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Education</h2>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold">Self-Taught Developer</h3>
              <p className="text-green-400 mb-2">Continuous Learning • 2018 - Present</p>
              <p className="text-gray-300">
                Passionate about learning through hands-on projects, online courses, and staying current with the latest web development trends and technologies.
              </p>
            </div>
          </section>

          {/* Hobbies */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Interests & Hobbies</h2>
            <div className="flex flex-wrap gap-3">
              {['🎮 Gaming', '📚 Reading Tech Blogs', '🏃‍♂️ Running', '🎵 Music Production', '📷 Photography', '🌱 Open Source'].map((hobby) => (
                <span key={hobby} className="bg-gray-900 px-4 py-2 rounded-md border border-gray-700">
                  {hobby}
                </span>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-gray-500 border-t border-gray-800 pt-8">
            <p>© 2024 Oscar Love • Built with React & TypeScript • Always evolving 🚀</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
