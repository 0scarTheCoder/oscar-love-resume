import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Simple icon components
const MapPinIcon = () => <span className="text-sm">📍</span>;
const CalendarIcon = () => <span className="text-sm">📅</span>;
const BriefcaseIcon = () => <span className="text-lg">💼</span>;

const Experience: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const experiences = [
    {
      title: 'Theatre Orderly',
      company: 'St John Of God\'s Hospital Subiaco',
      location: 'Subiaco, WA',
      period: 'January 2022 - Current',
      current: true,
      description: [
        'Assist medical staff in operating theatre procedures',
        'Maintain sterile environments and equipment',
        'Provide patient care and support during surgical procedures',
        'Collaborate with multidisciplinary healthcare teams'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Volleyball Referee',
      company: 'VWA',
      location: 'Perth, WA',
      period: 'March 2021 - Current',
      current: true,
      description: [
        'Officiate volleyball matches at various competition levels',
        'Make quick, accurate decisions under pressure',
        'Maintain game flow and ensure fair play',
        'Level 2 certified referee'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Tutor',
      company: 'Private Practice',
      location: 'Perth, WA',
      period: 'January 2018 - Current',
      current: true,
      description: [
        'Provide personalized academic support across multiple subjects',
        'Develop tailored learning strategies for individual students',
        'Help students achieve significant grade improvements',
        'Specializing in mathematics, physics, and data science'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Support Worker',
      company: 'Cam Can',
      location: 'Perth, WA',
      period: 'September 2021 - September 2022',
      current: false,
      description: [
        'Provided care and support to individuals with disabilities',
        'Assisted with daily living activities and community participation',
        'Developed strong communication and empathy skills',
        'Maintained detailed care documentation'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Volleyball Coach',
      company: 'Hale School',
      location: 'Wembley Downs, WA',
      period: 'August 2021 - December 2021',
      current: false,
      description: [
        'Coached junior volleyball teams',
        'Developed training programs and skill development strategies',
        'Mentored young athletes in teamwork and sportsmanship',
        'Organized team competitions and events'
      ],
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Data Management Intern',
      company: 'Vitruvian',
      location: 'Perth, WA',
      period: 'August 2021 - December 2021',
      current: false,
      description: [
        'Managed and analyzed large datasets',
        'Developed data visualization and reporting tools',
        'Collaborated with senior data scientists on projects',
        'Gained experience in statistical analysis and machine learning'
      ],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Waiter',
      company: 'High Bench Espresso',
      location: 'West Perth, WA',
      period: 'May 2021 - November 2021',
      current: false,
      description: [
        'Provided excellent customer service in fast-paced environment',
        'Managed multiple tables and orders efficiently',
        'Worked collaboratively with kitchen and service staff',
        'Handled cash transactions and point-of-sale systems'
      ],
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Groundsman',
      company: 'Hale School',
      location: 'Wembley Downs, WA',
      period: 'January 2021 - March 2021',
      current: false,
      description: [
        'Maintained school grounds and sporting facilities',
        'Operated various groundskeeping equipment',
        'Supported school events and activities setup',
        'Worked independently and as part of maintenance team'
      ],
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Work Experience
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A diverse background spanning healthcare, sports, education, and technology
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 dark:bg-gray-700"></div>

          {experiences.map((experience, index) => (
            <motion.div
              key={`${experience.title}-${experience.company}`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative mb-12 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex`}
            >
              {/* Timeline Dot */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-8">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${experience.color}`}></div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-200 dark:border-gray-700 absolute -top-2 -left-2"></div>
              </div>

              {/* Content */}
              <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${experience.color} text-white`}>
                      <BriefcaseIcon />
                    </div>
                    {experience.current && (
                      <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs px-3 py-1 rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {experience.title}
                  </h3>

                  <div className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                    {experience.company}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPinIcon />
                      {experience.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon />
                      {experience.period}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {experience.description.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="text-gray-600 dark:text-gray-400 text-sm flex items-start"
                      >
                        <span className="text-primary-600 dark:text-primary-400 mr-2 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;