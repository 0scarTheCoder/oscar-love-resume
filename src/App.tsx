import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Removed unused import
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Accomplishments from './components/Accomplishments';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import GitHubActivity from './components/GitHubActivity';
import LiveChat from './components/LiveChat';
import TimeZoneDisplay from './components/TimeZoneDisplay';
import EmbeddedChat from './components/EmbeddedChat';
import EarthquakeFeed from './components/EarthquakeFeed';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode like the reference

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Hero />
          <About />
          <Accomplishments />
          <Experience />
          <Skills />
          <Projects />
          
          {/* Live Features Section */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Live Features
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Real-time data feeds, interactive chat, and live APIs showcase my full-stack development capabilities
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <GitHubActivity />
                  <EarthquakeFeed />
                </div>
                <div className="space-y-8">
                  <TimeZoneDisplay />
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-96">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">💬</span>
                        Interactive AI Chat
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <EmbeddedChat />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <Contact />
        </main>
        
        {/* Live Chat Widget */}
        <LiveChat />
      </div>
    </div>
  );
}

export default App;
