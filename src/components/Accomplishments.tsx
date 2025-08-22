import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Simple icon components
const AwardIcon = () => <span className="text-xl">🏆</span>;
const BookIcon = () => <span className="text-xl">📚</span>;
const HeartIcon = () => <span className="text-xl">❤️</span>;
const FilterIcon = () => <span className="text-sm">🔍</span>;

const Accomplishments: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const accomplishments = [
    {
      category: 'academic',
      icon: BookIcon,
      title: '1st Place SLB Data Science Hackathon',
      description: 'Won first place among WA university students in October 2023',
      date: 'October 2023',
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'academic',
      icon: BookIcon,
      title: '2nd Place UWA WHACK WesCEF Hackathon',
      description: 'Secured second place in September 2023',
      date: 'September 2023',
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'academic',
      icon: BookIcon,
      title: 'ATAR 99.35',
      description: 'Achieved top 1% of students in Western Australia',
      date: '2020',
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'academic',
      icon: BookIcon,
      title: 'Cygnet Prose English Award',
      description: 'Recognition for excellence in English literature',
      date: '2020',
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'academic',
      icon: BookIcon,
      title: 'Physics & Chemistry Olympiads Distinction',
      description: 'Distinction level performance in national science competitions',
      date: '2019, 2020',
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'academic',
      icon: BookIcon,
      title: 'High Distinction Australian Maths Competition',
      description: 'Consistent high distinction results over multiple years',
      date: '2013-2020',
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'sporting',
      icon: AwardIcon,
      title: 'Unisport Nationals Volleyball Champion',
      description: 'Team member of championship-winning university team',
      date: '2022',
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'sporting',
      icon: AwardIcon,
      title: 'Australian Indoor Volleyball Schools Cup 1st Place',
      description: 'Won national championship with school team (honours)',
      date: '2020',
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'sporting',
      icon: AwardIcon,
      title: 'Australian Indoor Volleyball Representative',
      description: 'Selected for Australian teams U17s, U18s & U19s',
      date: '2017-2019',
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'sporting',
      icon: AwardIcon,
      title: 'WA State Volleyball Team Captain & MVP',
      description: 'Captain in 2017, MVP in 2018 & 2019',
      date: '2017-2019',
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'service',
      icon: HeartIcon,
      title: 'Silver Duke of Edinburgh Award',
      description: 'Completed challenging service, skill, and adventure requirements',
      date: '2018, 2019',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const categories = [
    { key: 'all', label: 'All', count: accomplishments.length },
    { key: 'academic', label: 'Academic', count: accomplishments.filter(a => a.category === 'academic').length },
    { key: 'sporting', label: 'Sporting', count: accomplishments.filter(a => a.category === 'sporting').length },
    { key: 'service', label: 'Service', count: accomplishments.filter(a => a.category === 'service').length }
  ];

  const filteredAccomplishments = activeFilter === 'all' 
    ? accomplishments 
    : accomplishments.filter(a => a.category === activeFilter);

  return (
    <section id="accomplishments" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Accomplishments
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A collection of achievements spanning academic excellence, sporting success, and community service
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveFilter(category.key)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeFilter === category.key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-gray-600'
              }`}
            >
              <FilterIcon />
              {category.label}
              <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Accomplishments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccomplishments.map((accomplishment, index) => {
            const IconComponent = accomplishment.icon;
            return (
              <motion.div
                key={`${accomplishment.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${accomplishment.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${accomplishment.color} text-white mr-4`}>
                      <IconComponent />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {accomplishment.date}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {accomplishment.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {accomplishment.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Accomplishments;