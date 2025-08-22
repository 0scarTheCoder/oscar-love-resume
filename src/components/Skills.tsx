import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Simple icon components
const CodeIcon = () => <span className="text-xl">💻</span>;
const DatabaseIcon = () => <span className="text-xl">🗄️</span>;
const TrendingIcon = () => <span className="text-xl">📈</span>;
const UsersIcon = () => <span className="text-xl">👥</span>;
const GitIcon = () => <span className="text-xl">🔧</span>;
const ToolIcon = () => <span className="text-lg">⚙️</span>;

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: CodeIcon,
      color: 'from-blue-500 to-blue-600',
      skills: [
        { name: 'Python', level: 90 },
        { name: 'R', level: 85 },
        { name: 'JavaScript', level: 80 },
        { name: 'Java', level: 75 },
        { name: 'TypeScript', level: 75 },
        { name: 'HTML/CSS', level: 85 }
      ]
    },
    {
      title: 'Data Science & Analytics',
      icon: TrendingIcon,
      color: 'from-green-500 to-green-600',
      skills: [
        { name: 'Statistical Analysis', level: 90 },
        { name: 'Machine Learning', level: 85 },
        { name: 'Data Visualization', level: 88 },
        { name: 'Computational Statistics', level: 92 },
        { name: 'Time Series Analysis', level: 80 },
        { name: 'Bayesian Statistics', level: 75 }
      ]
    },
    {
      title: 'Databases & Tools',
      icon: DatabaseIcon,
      color: 'from-purple-500 to-purple-600',
      skills: [
        { name: 'SQL', level: 85 },
        { name: 'Git/GitHub', level: 80 },
        { name: 'Jupyter', level: 90 },
        { name: 'RStudio', level: 88 },
        { name: 'Power BI', level: 70 },
        { name: 'Excel', level: 85 }
      ]
    },
    {
      title: 'Soft Skills',
      icon: UsersIcon,
      color: 'from-orange-500 to-orange-600',
      skills: [
        { name: 'Leadership', level: 95 },
        { name: 'Teamwork', level: 98 },
        { name: 'Communication', level: 90 },
        { name: 'Problem Solving', level: 92 },
        { name: 'Adaptability', level: 88 },
        { name: 'Work Ethic', level: 95 }
      ]
    }
  ];

  const certifications = [
    {
      name: 'Working with Children Check',
      status: 'Current',
      icon: UsersIcon,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      name: 'C-class Driver\'s License',
      status: 'Current',
      icon: ToolIcon,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Level 2 Volleyball Referee',
      status: 'Current',
      icon: UsersIcon,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'First Aid Certificate',
      status: 'Current',
      icon: ToolIcon,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      name: 'Bronze Medallion Surf Life Saving',
      status: 'Exp. 2024',
      icon: ToolIcon,
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A comprehensive skill set spanning technical expertise and leadership capabilities
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white mr-4`}>
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ width: 0 }}
                      animate={inView ? { width: '100%' } : {}}
                      transition={{ duration: 0.8, delay: categoryIndex * 0.1 + skillIndex * 0.1 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.1 }}
                          className={`h-2 bg-gradient-to-r ${category.color} rounded-full`}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white mr-4">
              <GitIcon />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Certifications & Accreditations
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`${cert.color} mr-3`}>
                    <IconComponent />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {cert.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cert.status}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;