// Single source of facts about Oscar for the chat assistant.
// Used by the site (fallback answers) and by chat-worker (model prompt).

export interface Role {
  title: string;
  company: string;
  period: string;
  basis?: string;
  points: string[];
}

// Knowledge base about Oscar. Content mirrors his current CV.
export const knowledgeBase = {
  personal: {
    name: 'Oscar Love',
    location: 'Perth, Western Australia',
    email: 'loveoh19@gmail.com',
    github: 'https://github.com/0scarTheCoder',
    github_username: '0scarTheCoder',
    linkedin: 'https://www.linkedin.com/in/oscar-love',
    role: 'Data Analyst and Software Developer',
    focus: 'Data platforms, pipelines and analytics in the mining sector',
    atar: '99.35',
    atar_year: '2020'
  },
  education: [
    {
      title: 'Honours in computer science and software engineering',
      institution: 'UWA',
      period: 'July 2024 to December 2025',
      completed: 'December 2025',
      wam: '75',
      points: [
        'Research applying reservoir computing and minimum description length to time series prediction in chaotic systems',
        'Applied to mining operations forecasting, equipment maintenance prediction and operational analytics'
      ]
    },
    {
      title: 'Bachelor of Philosophy in data science, mathematics and statistics',
      institution: 'UWA',
      period: 'February 2021 to June 2024',
      completed: 'June 2024',
      wam: '78',
      points: [] as string[]
    }
  ],
  skills: {
    languages: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'R', 'Julia', 'HTML', 'CSS'],
    data: ['PostgreSQL', 'PostGIS', 'NoSQL', 'SSMS', 'Schema design', 'Ingestion and ETL pipelines', 'Data governance and provenance'],
    analytics: ['Machine learning', 'Statistical modelling', 'Discrete event simulation', 'Time series analysis', 'Bayesian statistics', 'Power BI'],
    engineering: ['Git and GitHub', 'Continuous integration', 'Node.js', 'React', 'Jupyter', 'RStudio'],
    soft_skills: ['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Adaptability', 'Work Ethic']
  },
  experience: [
    {
      title: 'Software Developer and Data Analyst (Contract)',
      company: 'Entech Pty Ltd',
      period: 'March 2026 to present',
      points: [
        'One of two developers commercialising DeltaFlow GUI in research and development, to open a new revenue stream for a multinational mining consultancy',
        'Discrete event simulation and productivity modelling: built a repeatable simulation data pipeline with documentation, feeding Power BI dashboards and improving stakeholder access to KPIs',
        'Refactored legacy scripts, moved database credentials into environment configuration, standardised repository structure and continuous integration',
        'Built web templates and applications to localise work planning and present visualisations and measurements supporting employee-utilisation reporting'
      ]
    },
    {
      title: 'Software Developer and Data Analyst (Partner)',
      company: 'Canetoad AI',
      period: 'March 2026 to present',
      points: [
        'Built and govern a spatial database behind the mineral exploration platform. PostgreSQL with PostGIS',
        'Data from eighteen jurisdictions outside Australia and counting, plus WAMEX, DIGS, SARIG, NTGS and Geoscience Australia',
        'Secured most of that access by writing to government agencies and negotiating licence terms, including British Columbia, Chile, Quebec, Michigan, Minnesota and the USGS. Maintain a documented source permission audit',
        'Built Google Earth-style layered map visualisations exposing tenement feeds, drill holes and geological boundaries as toggleable GIS layers',
        'Developed pattern-recognition models over ASX mining announcements, correlating language signals with share-price movement'
      ]
    },
    {
      title: 'Software Developer',
      company: 'Hodie Labs',
      period: 'September 2025 to March 2026',
      points: [
        'Lead and only developer of a health monitoring platform, built from the ground up with React, Node.js and an integrated database',
        'Built interactive dashboards and a chatbot interface for conversational analytics queries, plus custom APIs and backend services'
      ]
    },
    {
      title: 'Software Engineering Partner',
      company: 'Robert Willis Algorithms',
      period: 'September 2025 to present',
      points: [
        'Python trading strategies combining statistical analysis with quantitative modelling',
        'Automated trading algorithms incorporating machine learning, and real-time data processing supporting market analysis'
      ]
    },
    {
      title: 'Software Developer (Internship)',
      company: 'Private consulting',
      period: 'August to November 2025',
      points: [
        'Full-stack web applications, custom APIs and intelligent agents for small business and start-up clients'
      ]
    },
    {
      title: 'Data Analyst (Internship)',
      company: 'Invest America',
      period: 'April to July 2024',
      points: [
        'Designed data-collection forms and integrated frontend and backend systems to improve data accessibility and analytics'
      ]
    },
    {
      title: 'Data Management Intern',
      company: 'Vitruvian',
      period: 'August to December 2021',
      points: [
        'Analysed large financial datasets and built reporting dashboards for senior management'
      ]
    },
    {
      title: 'Theatre Orderly',
      company: "St John Of God's Hospital Subiaco",
      period: 'January 2022 to current',
      basis: 'casual',
      points: ['Collaborate with multidisciplinary healthcare teams']
    },
    {
      title: 'Private Tutor',
      company: '',
      period: 'January 2018 to current',
      basis: 'casual',
      points: ['Mathematics, physics and data science tutoring']
    },
    {
      title: 'Volleyball Referee (Level 2)',
      company: 'VWA',
      period: 'March 2021 to current',
      basis: 'casual',
      points: [] as string[]
    }
  ] as Role[],
  achievements: [
    '1st Place SLB Data Science Hackathon (October 2023)',
    '2nd Place UWA WHACK WesCEF Hackathon (September 2023)',
    'ATAR 99.35 (2020)',
    'Australian Junior Indoor Volleyball Representative (2018 and 2019)',
    'WA Indoor Volleyball 2017 to 2019 (Captain 2017, MVP 2018 and 2019)',
    'Unisport Nationals Volleyball champions (2022)',
    'Unisport Nationals Netball runners up (2024)'
  ],
  accreditations: [
    'Working with Children Check',
    'National Police Clearance',
    'C-class driver licence',
    'Level 2 Volleyball Referee',
    'Surf Life Saving Bronze Medallion',
    "Silver Duke of Edinburgh's Award"
  ],
  interests: ['Gaming', 'Tech Innovation', 'Running', 'Music Production', 'Photography', 'Open Source']
};
