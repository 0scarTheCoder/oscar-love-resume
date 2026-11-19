import { generateResponse, knowledgeBase } from './EmbeddedChat';

const EMAIL = 'loveoh19@gmail.com';

const FORBIDDEN =
  /investment banking|management consulting|graduate (opportunit|role|program|candidate)|still a student|hasn't graduated|finishing his|1-2 weeks|GPA|\bEY\b|sole developer|the spatial database|[–—]/i;

// Extra stale or private content that must never appear.
const ALSO_FORBIDDEN =
  /seeking|can start|willing to relocate|eager to relocate|6\.0|July 2025|Level 3|netball champions|referees? (available|on request)|loveo19|undefined|\[object/i;

const questions: Record<string, string> = {
  greeting: 'hello',
  hiring: 'are you available for hire?',
  availability: 'when can he start?',
  salary: 'what salary is he expecting?',
  relocation: 'would he relocate to Sydney?',
  career: 'what are his career goals?',
  graduateRoles: 'is he looking for graduate roles in investment banking or management consulting?',
  education: 'what did he study?',
  honours: 'what was his honours research?',
  recent: 'what has he been doing recently?',
  finance: 'does he have finance experience?',
  graduation: 'has he graduated?',
  student: 'is he still a student?',
  entech: 'what does he do at Entech?',
  canetoad: 'tell me about Canetoad',
  hodie: 'what was Hodie Labs?',
  robertWillis: 'what is Robert Willis Algorithms?',
  privateConsulting: 'tell me about his private consulting',
  investAmerica: 'what did he do at Invest America?',
  vitruvian: 'what about Vitruvian?',
  stJohn: 'does he work at St John of God?',
  tutoring: 'tell me about his tutoring',
  refereeing: 'tell me about his refereeing',
  skills: 'what are his skills?',
  achievements: 'what are his achievements?',
  accreditations: 'what accreditations does he hold?',
  contact: 'how can I contact him?',
  location: 'where is he based?',
  projects: 'can I see his projects?',
  interests: 'what are his hobbies?',
  experience: 'what is his work experience?',
  about: 'who is Oscar?',
  typo: 'what is his educaton?',
  nonsense: 'purple monkey dishwasher zzz',
  empty: ''
};

const ask = (key: string): string => generateResponse(questions[key]);

describe('generateResponse', () => {
  const neutral = `Oscar currently works as a software developer and data analyst at Entech and as a partner at Canetoad AI. For opportunities or collaboration, please email him at **${EMAIL}**.`;

  test.each(['hiring', 'availability', 'salary', 'career', 'graduateRoles'])(
    '%s gets the neutral answer pointing to his email',
    key => {
      expect(ask(key)).toBe(neutral);
    }
  );

  test('relocation is neutral and points to his email', () => {
    const answer = ask('relocation');
    expect(answer).toContain('based in Perth, Western Australia');
    expect(answer).toContain(EMAIL);
    expect(answer).not.toMatch(/willing|happy to|flexible|anywhere/i);
  });

  test('greeting', () => {
    expect(ask('greeting')).toBe(
      "Hello! I'm Oscar's assistant. I can tell you about his work at Entech and Canetoad AI, his skills, education and achievements."
    );
  });

  test('education covers both degrees, WAMs and ATAR', () => {
    const answer = ask('education');
    expect(answer).toContain('honours in computer science and software engineering at UWA');
    expect(answer).toContain('July 2024 to December 2025, WAM 75');
    expect(answer).toContain('Bachelor of Philosophy in data science, mathematics and statistics');
    expect(answer).toContain('February 2021 to June 2024, WAM 78');
    expect(answer).toContain('99.35 (2020)');
    expect(ask('typo')).toBe(answer);
    expect(ask('honours')).toContain('reservoir computing and minimum description length');
  });

  test('recent work summarises Entech and Canetoad AI', () => {
    const answer = ask('recent');
    expect(answer).toContain('Since March 2026');
    expect(answer).toContain('one of two developers commercialising DeltaFlow GUI');
    expect(answer).toContain('a spatial database behind the mineral exploration platform');
    expect(answer).toContain('PostgreSQL with PostGIS');
  });

  test('finance points to Robert Willis Algorithms', () => {
    expect(ask('finance')).toBe(
      "Oscar's finance-related work is with Robert Willis Algorithms, where he builds Python trading strategies and automated trading algorithms."
    );
  });

  test.each(['graduation', 'student'])('%s says he completed honours in December 2025', key => {
    expect(ask(key)).toBe(
      'Oscar completed his honours degree at UWA in December 2025 and has worked at Entech and Canetoad AI since March 2026.'
    );
  });

  const employers: [string, string, string, string][] = [
    ['entech', 'Software Developer and Data Analyst (Contract), Entech Pty Ltd', 'March 2026 to present', 'One of two developers commercialising DeltaFlow GUI'],
    ['canetoad', 'Software Developer and Data Analyst (Partner), Canetoad AI', 'March 2026 to present', 'Built and govern a spatial database behind the mineral exploration platform'],
    ['hodie', 'Software Developer, Hodie Labs', 'September 2025 to March 2026', 'Lead and only developer of a health monitoring platform'],
    ['robertWillis', 'Software Engineering Partner, Robert Willis Algorithms', 'September 2025 to present', 'Python trading strategies'],
    ['privateConsulting', 'Software Developer (Internship), Private consulting', 'August to November 2025', 'Full-stack web applications, custom APIs and intelligent agents'],
    ['investAmerica', 'Data Analyst (Internship), Invest America', 'April to July 2024', 'Designed data-collection forms'],
    ['vitruvian', 'Data Management Intern, Vitruvian', 'August to December 2021', 'Analysed large financial datasets'],
    ['stJohn', "Theatre Orderly, St John Of God's Hospital Subiaco", 'January 2022 to current, casual', 'healthcare teams'],
    ['tutoring', 'Private Tutor', 'January 2018 to current, casual', 'Mathematics, physics and data science tutoring'],
    ['refereeing', 'Volleyball Referee (Level 2), VWA', 'March 2021 to current, casual', 'Level 2']
  ];

  test.each(employers)('%s question gets that role', (key, heading, period, detail) => {
    const answer = ask(key);
    expect(answer).toContain(`**${heading}**`);
    expect(answer).toContain(`(${period})`);
    expect(answer).toContain(detail);
  });

  test('every bullet of every role is reachable word for word', () => {
    const entech = ask('entech');
    knowledgeBase.experience[0].points.forEach(point => expect(entech).toContain(point));
    const canetoad = ask('canetoad');
    knowledgeBase.experience[1].points.forEach(point => expect(canetoad).toContain(point));
  });

  test('two employers in one question returns both roles', () => {
    const answer = generateResponse('compare Entech and Canetoad');
    expect(answer).toContain('Entech Pty Ltd');
    expect(answer).toContain('Canetoad AI');
  });

  test('skills lists the four CV groups plus soft skills', () => {
    const answer = ask('skills');
    ['Python', 'SQL', 'Julia', 'PostGIS', 'Data governance and provenance', 'Discrete event simulation', 'Power BI', 'Continuous integration', 'RStudio', 'Leadership'].forEach(
      skill => expect(answer).toContain(skill)
    );
    expect(answer).not.toMatch(/financial model/i);
  });

  test('achievements use the confirmed Unisport results', () => {
    const answer = ask('achievements');
    expect(answer).toContain('1st Place SLB Data Science Hackathon');
    expect(answer).toContain('2nd Place UWA WHACK WesCEF Hackathon');
    expect(answer).toContain('ATAR 99.35 (2020)');
    expect(answer).toContain('Australian Junior Indoor Volleyball Representative (2018 and 2019)');
    expect(answer).toContain('Captain 2017, MVP 2018 and 2019');
    expect(answer).toContain('Unisport Nationals Volleyball champions (2022)');
    expect(answer).toContain('Unisport Nationals Netball runners up (2024)');
  });

  test('accreditations', () => {
    const answer = ask('accreditations');
    knowledgeBase.accreditations.forEach(item => expect(answer).toContain(item));
  });

  test('contact gives the email, LinkedIn and GitHub', () => {
    const answer = ask('contact');
    expect(answer).toContain(EMAIL);
    expect(answer).toContain('https://www.linkedin.com/in/oscar-love ');
    expect(answer).toContain('https://github.com/0scarTheCoder');
  });

  test('location', () => {
    expect(ask('location')).toBe('Oscar is based in Perth, Western Australia.');
  });

  test('work experience lists all ten roles, CV roles first', () => {
    const answer = ask('experience');
    const order = ['Entech Pty Ltd', 'Canetoad AI', 'Hodie Labs', 'Robert Willis Algorithms', 'Private consulting', 'Invest America', 'Vitruvian', 'Theatre Orderly', 'Private Tutor', 'Volleyball Referee (Level 2)'];
    const positions = order.map(name => answer.indexOf(name));
    positions.forEach(position => expect(position).toBeGreaterThan(-1));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test('about uses the role and focus', () => {
    expect(ask('about')).toBe(
      'Oscar Love is a data analyst and software developer, based in Perth, Western Australia. His focus is data platforms, pipelines and analytics in the mining sector.'
    );
  });

  test.each(['nonsense', 'empty'])('%s question gets a general prompt', key => {
    for (let i = 0; i < 30; i++) {
      expect(ask(key)).toMatch(/Oscar's/);
      expect(ask(key)).toMatch(/\?$/);
    }
  });

  test('knowledge base has no stale fields and the right email', () => {
    expect(knowledgeBase.personal.email).toBe(EMAIL);
    expect(knowledgeBase.personal.role).toBe('Data Analyst and Software Developer');
    expect(knowledgeBase.personal.focus).toBe('Data platforms, pipelines and analytics in the mining sector');
    expect(knowledgeBase.personal).not.toHaveProperty('gpa');
    expect(knowledgeBase.personal).not.toHaveProperty('experience_years');
    expect(knowledgeBase).not.toHaveProperty('availability');
    expect(knowledgeBase.skills).not.toHaveProperty('financial');
    expect(knowledgeBase.experience).toHaveLength(10);
  });

  describe('review findings', () => {
    const referee = `Referee details are not published here. Please email Oscar at **${EMAIL}**.`;
    const recentStart = 'Since March 2026 Oscar has worked as a software developer and data analyst at Entech';
    const skillsStart = "Oscar's skills. **Languages:**";
    const rolesStart = "Oscar's roles:";
    const educationStart = 'Oscar completed honours in computer science and software engineering at UWA';
    const role = (name: string) => `**${name}`;

    test.each(['who are his referees', 'Who are his referees?', 'can I get references', 'can you give me a reference', 'referee details please'])(
      'job referee request "%s" is not answered with a role',
      question => {
        expect(generateResponse(question)).toBe(referee);
      }
    );

    test.each(['tell me about his refereeing', 'is he a volleyball referee', 'what level referee is he', 'he referees volleyball?', 'what is VWA'])(
      'refereeing question "%s" still gets the role',
      question => {
        expect(generateResponse(question)).toContain('**Volleyball Referee (Level 2), VWA** (March 2021 to current, casual).');
      }
    );

    test('work history marks the three older roles as casual', () => {
      const answer = ask('experience');
      expect(answer).toContain("Theatre Orderly, St John Of God's Hospital Subiaco (January 2022 to current, casual)");
      expect(answer).toContain('Private Tutor (January 2018 to current, casual)');
      expect(answer).toContain('Volleyball Referee (Level 2), VWA (March 2021 to current, casual)');
      expect(answer).toContain('Entech Pty Ltd (March 2026 to present);');
    });

    test.each([
      'we have an opening',
      'is he applying anywhere',
      'what companies has he applied to',
      'how much does he charge',
      'is he unemployed',
      'visa status',
      'does he have work rights',
      'is he interested in management consulting',
      'does he want investment banking',
      'when can oscar start',
      'what is his start date',
      'Entech salary',
      'does he want to leave Entech',
      'is he happy at Entech',
      'what does Canetoad pay him'
    ])('hiring style question "%s" gets the neutral answer', question => {
      expect(generateResponse(question)).toBe(neutral);
    });

    test.each(['would he consider a role in Melbourne', 'would he move to Brisbane', 'can he work remotely'])(
      'relocation style question "%s" gets the neutral relocation answer',
      question => {
        expect(generateResponse(question)).toBe(
          `Oscar is based in Perth, Western Australia. For questions about relocation or opportunities, please email him at **${EMAIL}**.`
        );
      }
    );

    test.each([
      'What is his current job?',
      'what is his job title',
      'what is his role',
      'where does he work',
      'who does he work for',
      'is he employed',
      'what does he do',
      'mining',
      'mining experience'
    ])('current work question "%s" gets the recent work summary', question => {
      expect(generateResponse(question)).toContain(recentStart);
    });

    test.each(['What jobs has he had?', 'past jobs', 'first job', 'what positions has he held', 'his job history'])(
      'work history question "%s" gets the role list',
      question => {
        expect(generateResponse(question)).toContain(rolesStart);
      }
    );

    test('background questions are not captured by the hiring intent', () => {
      expect(generateResponse('How did he start coding?')).toContain(skillsStart);
      expect(generateResponse('when did he start at Entech')).toContain(role('Software Developer and Data Analyst (Contract), Entech Pty Ltd'));
      expect(generateResponse('What did he do in consulting?')).toContain(role('Software Developer (Internship), Private consulting'));
      expect(generateResponse('is oscar a consultant')).toContain(role('Software Developer (Internship), Private consulting'));
    });

    test.each([
      'Does he know R?',
      'Does he know C?',
      'does he use r',
      'experience with C',
      'continuous integration',
      'ci/cd',
      'data science',
      'database',
      'api',
      'frontend',
      'backend',
      'time series'
    ])('skills question "%s" gets the skills list', question => {
      expect(generateResponse(question)).toContain(skillsStart);
    });

    test('achievement and interest questions are not captured by earlier intents', () => {
      expect(generateResponse('did he represent australia')).toContain('Australian Junior Indoor Volleyball Representative (2018 and 2019)');
      expect(generateResponse('what does he do for fun')).toBe(
        "Oscar's interests: Gaming, Tech Innovation, Running, Music Production, Photography, Open Source."
      );
      expect(generateResponse('what does he do in his spare time')).toContain("Oscar's interests:");
      expect(generateResponse('where in Australia is he?')).toBe('Oscar is based in Perth, Western Australia.');
    });

    test('typos and word forms inside a sentence still reach education', () => {
      expect(generateResponse('tell me about his educaton')).toBe(ask('education'));
      expect(generateResponse("What's his educational background?")).toBe(ask('education'));
    });

    test.each(['what is his GPA', 'gpa', 'maths', 'does he have a phd'])('"%s" gets the education answer with WAMs only', question => {
      const answer = generateResponse(question);
      expect(answer).toBe(ask('education'));
      expect(answer).not.toMatch(/gpa/i);
    });

    test.each(['reservoir computing', 'chaotic systems', 'minimum description length'])('"%s" gets the honours research', question => {
      const answer = generateResponse(question);
      expect(answer).toContain(educationStart);
      expect(answer).toContain('Research applying reservoir computing and minimum description length to time series prediction in chaotic systems');
    });

    test('two part questions answer both parts', () => {
      const both = generateResponse('skills and education');
      expect(both).toContain('**Languages:**');
      expect(both).toContain('WAM 75');
      const sentence = generateResponse('what are his skills and where did he study?');
      expect(sentence).toContain('**Languages:**');
      expect(sentence).toContain('WAM 78');
      const pair = generateResponse('education and achievements');
      expect(pair).toContain('WAM 75');
      expect(pair).toContain('1st Place SLB Data Science Hackathon');
      expect(generateResponse('skills and languages')).toBe(ask('skills'));
    });

    test.each([
      'WAMEX',
      'ASX',
      'what jurisdictions',
      'which government agencies',
      'GIS',
      'google earth',
      'drill holes',
      'tenements',
      'British Columbia',
      'licence terms'
    ])('Canetoad AI term "%s" gets that role', question => {
      expect(generateResponse(question)).toContain(role('Software Developer and Data Analyst (Partner), Canetoad AI'));
    });

    test.each(['KPIs', 'legacy scripts', 'credentials', 'employee utilisation', 'work planning', 'mining consultancy'])(
      'Entech term "%s" gets that role',
      question => {
        expect(generateResponse(question)).toContain(role('Software Developer and Data Analyst (Contract), Entech Pty Ltd'));
      }
    );

    test('Hodie Labs and Robert Willis terms get those roles', () => {
      expect(generateResponse('did he build a chatbot')).toContain(role('Software Developer, Hodie Labs'));
      expect(generateResponse('are you a chatbot?')).not.toContain('Hodie Labs');
      expect(generateResponse('algorithms')).toContain(role('Software Engineering Partner, Robert Willis Algorithms'));
    });

    test('no review question produces forbidden content', () => {
      [
        'who are his referees', 'is oscar a consultant', 'what is his GPA', 'is he unemployed', 'visa status', 'are you a chatbot?',
        'would he consider a role in Melbourne', 'skills and education', 'what does he do for fun', 'did he represent australia'
      ].forEach(question => {
        for (let i = 0; i < 10; i++) {
          const answer = generateResponse(question);
          expect(answer).not.toMatch(FORBIDDEN);
          expect(answer).not.toMatch(ALSO_FORBIDDEN);
        }
      });
    });
  });

  test('no answer contains forbidden or stale content', () => {
    Object.values(questions).forEach(question => {
      for (let i = 0; i < 40; i++) {
        const answer = generateResponse(question);
        expect(answer.length).toBeGreaterThan(0);
        expect(answer).not.toMatch(FORBIDDEN);
        expect(answer).not.toMatch(ALSO_FORBIDDEN);
        const emails = answer.match(/[\w.+-]+@[\w.-]+\.\w+/g) || [];
        emails.forEach(found => expect(found).toBe(EMAIL));
      }
    });
  });
});
