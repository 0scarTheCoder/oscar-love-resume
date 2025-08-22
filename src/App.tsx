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
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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
                  Real-time GitHub activity and interactive chat showcase my full-stack development capabilities
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <GitHubActivity />
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
