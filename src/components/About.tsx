import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const stats = [
    { label: 'ATAR Score', value: '99.35' },
    { label: 'Current WAM', value: '75' },
    { label: 'Hackathon Wins', value: '2' },
    { label: 'Years Experience', value: '6+' }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-8 text-white">
              <div className="text-8xl font-bold opacity-20 mb-4">OL</div>
              <h3 className="text-2xl font-bold mb-4">Oscar Love</h3>
              <p className="text-primary-100">
                Finance & Consulting Graduate Candidate
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Analytically-driven Computer Science and Software Engineering graduate with expertise in 
              quantitative analysis, statistical modeling, and data-driven decision making. Strong academic 
              performance (ATAR 99.35, WAM 75, GPA 6.0) combined with proven leadership capabilities demonstrated 
              through junior Australian volleyball representation and competitive hackathon success.
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Bachelor of Philosophy (Honours) from The University of Western Australia (July 2025), 
              specializing in Data Science, Mathematics and Statistics. Seeking to apply rigorous analytical 
              skills, financial modeling expertise, and strategic problem-solving abilities to drive value 
              creation in investment banking and management consulting environments.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;