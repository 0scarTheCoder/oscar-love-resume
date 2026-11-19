import React from 'react';

// Shown at #/tailor while the profile tailoring feature is being rebuilt.
const Maintenance: React.FC = () => (
  <div
    className="min-h-screen animated-background flex items-center justify-center px-6 sm:px-8 text-white"
    style={{ backgroundColor: '#0D1117', fontFamily: "'Space Grotesk', 'Roboto Mono', sans-serif" }}
  >
    <div className="max-w-xl w-full text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 neon-border">
      <div className="text-5xl mb-6" aria-hidden="true">
        🛠️
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 neon-text">MAINTENANCE IN PROGRESS</h1>
      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10">
        AI profile tailoring is being rebuilt and is not available yet. Please check back soon.
      </p>
      <a
        href="#/"
        className="inline-block bg-gradient-to-r from-[#30C55A] to-[#25A049] hover:from-[#25A049] hover:to-[#1E8F3E] text-black font-bold px-10 py-4 rounded-xl transition-all duration-300 text-lg neon-border transform hover:scale-105"
      >
        BACK TO PROFILE
      </a>
    </div>
  </div>
);

export default Maintenance;
