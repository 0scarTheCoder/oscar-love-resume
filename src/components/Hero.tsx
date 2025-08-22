import React from 'react';
import { motion } from 'framer-motion';
// Simple icon components
const DownloadIcon = () => <span className="text-lg">⬇️</span>;
const MailIcon = () => <span className="text-lg">✉️</span>;
const LinkedInIcon = () => <span className="text-lg">💼</span>;

const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-6xl font-bold">
            OL
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Oscar Love
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8"
        >
          <span className="text-gray-900 dark:text-white font-semibold">
            Data Science & Software Engineering Graduate
          </span>
          <br />
          <span>UWA Bachelor of Philosophy (Honours) - July 2025</span>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Hackathon winner, Australian volleyball representative, and passionate problem-solver 
          with expertise in computational statistics, machine learning, and full-stack development.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <DownloadIcon />
            Download Resume
          </motion.button>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-600 hover:text-white transition-colors"
          >
            <MailIcon />
            Get In Touch
          </motion.a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-6"
        >
          <motion.a
            href="https://linkedin.com/in/oscar-love-547120275"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, y: -2 }}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <LinkedInIcon />
          </motion.a>

          <motion.a
            href="mailto:loveoh19@gmail.com"
            whileHover={{ scale: 1.2, y: -2 }}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <MailIcon />
          </motion.a>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;