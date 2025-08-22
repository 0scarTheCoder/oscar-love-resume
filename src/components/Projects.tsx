import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Simple icon components
const ExternalLinkIcon = () => <span className="text-sm">🔗</span>;
const GithubIcon = () => <span className="text-sm">📂</span>;
const AwardIcon = () => <span className="text-xl">🏆</span>;
const CodeIcon = () => <span className="text-xl">💻</span>;
const DatabaseIcon = () => <span className="text-xl">🗄️</span>;
const BarChartIcon = () => <span className="text-xl">📊</span>;

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const projects = [
    {
      title: 'SLB Data Science Hackathon - Winner',
      description: 'Developed an innovative data science solution that earned first place among WA university students. Created a comprehensive analysis and predictive model addressing real-world industry challenges.',
      technologies: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Jupyter'],
      category: 'Data Science',
      status: 'Competition Winner',
      icon: AwardIcon,
      color: 'from-yellow-500 to-yellow-600',
      achievements: ['1st Place', 'Best Technical Implementation', 'Industry Recognition']
    },
    {
      title: 'UWA WHACK WesCEF Hackathon - 2nd Place',
      description: 'Built a comprehensive solution during a 48-hour hackathon focusing on sustainable technology. Demonstrated strong teamwork and rapid prototyping skills under tight deadlines.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      category: 'Full Stack',
      status: '2nd Place Winner',
      icon: CodeIcon,
      color: 'from-blue-500 to-blue-600',
      achievements: ['2nd Place', 'Best UI/UX Design', 'Team Collaboration Award']
    },
    {
      title: 'Time Series Prediction with Neural Networks',
      description: 'Comparative analysis of regularisation techniques in machine learning for time series prediction of deterministic dynamics. Focus on optimising neural network creation and performance.',
      technologies: ['Python', 'TensorFlow', 'NumPy', 'Matplotlib', 'Statistical Analysis'],
      category: 'Machine Learning',
      status: 'Research Project',
      icon: BarChartIcon,
      color: 'from-green-500 to-green-600',
      achievements: ['Academic Recognition', 'Published Research', 'Advanced Techniques']
    },
    {
      title: 'Healthcare Data Management System',
      description: 'Developed during internship at Vitruvian. Created tools for managing and analyzing large healthcare datasets with focus on data visualization and statistical reporting.',
      technologies: ['R', 'SQL', 'Power BI', 'Excel', 'Statistical Modeling'],
      category: 'Data Analytics',
      status: 'Professional Project',
      icon: DatabaseIcon,
      color: 'from-purple-500 to-purple-600',
      achievements: ['Industry Application', 'Real-world Impact', 'Professional Development']
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Showcasing award-winning projects and technical achievements in data science, 
            machine learning, and full-stack development
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Project Header */}
                <div className={`h-2 bg-gradient-to-r ${project.color}`}></div>
                
                <div className="p-6">
                  {/* Status Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${project.color} text-white`}>
                      <IconComponent />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* Category */}
                  <div className="text-primary-600 dark:text-primary-400 font-medium mb-4 text-sm">
                    {project.category}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Key Achievements:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.achievements.map((achievement, achievementIndex) => (
                        <span
                          key={achievementIndex}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`bg-gradient-to-r ${project.color} bg-opacity-10 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 bg-gradient-to-r ${project.color} text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
                    >
                      <ExternalLinkIcon />
                      Learn More
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <GithubIcon />
                      Code
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-primary-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interested in My Work?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              I'm always excited to discuss new opportunities, collaborate on innovative projects, 
              or share insights about data science and software development.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <ExternalLinkIcon />
              Get In Touch
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;