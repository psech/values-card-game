const initialData = {
  cards: {
    'value-1': {
      id: 'value-1',
      title: 'Accountable',
      description: 'Takes responsibility for both actions and outcomes.',
    },
    'value-2': {
      id: 'value-2',
      title: 'Achievement',
      description: 'Aspires to the highest levels of excellence.',
    },
    'value-3': {
      id: 'value-3',
      title: 'Authority',
      description: 'Possessing power over decisions, people and assets.',
    },
    'value-4': {
      id: 'value-4',
      title: 'Balance',
      description: 'Balancing time and effort between work, home, and hobbies.',
    },
    'value-5': {
      id: 'value-5',
      title: 'Change',
      description:
        'Looking forward to and valuing change, continuous improvement, doing things differently.',
    },
    'value-6': {
      id: 'value-6',
      title: 'Commitment',
      description:
        'Being bound emotionally or intellectually to a course of action, dedication.',
    },
    'value-7': {
      id: 'value-7',
      title: 'Competence',
      description:
        'Possessing the skill, knowledge, and ability to effectively perform.',
    },
    'value-8': {
      id: 'value-8',
      title: 'Courage',
      description:
        'Willing to take calculated risks and step outside of your comfort zone.',
    },
    'value-9': {
      id: 'value-9',
      title: 'Creativity/Innovation',
      description:
        'Thinking outside the box; trying new ways of accomplishing a goal.',
    },
    'value-10': {
      id: 'value-10',
      title: 'Customer Satisfaction',
      description: 'Achieving excellence in customer satisfaction.',
    },
    'value-11': {
      id: 'value-11',
      title: 'Diversity',
      description: 'Respecting a variety of cultures/lifestyles.',
    },
    'value-12': {
      id: 'value-12',
      title: 'Effectiveness',
      description: 'Executing with precision to achieve results.',
    },
    'value-13': {
      id: 'value-13',
      title: 'Efficiency',
      description:
        'Producing results in a timely manner with minimal waste, expense, or unnecessary effort.',
    },
    'value-14': {
      id: 'value-14',
      title: 'Fairness',
      description: 'Treating people and being treated equally.',
    },
    'value-15': {
      id: 'value-15',
      title: 'Faith/Religion',
      description: 'Belief in a higher power.',
    },
    'value-16': {
      id: 'value-16',
      title: 'Family',
      description: 'Being with family, both quality and quantity of time.',
    },
    'value-17': {
      id: 'value-17',
      title: 'Fitness',
      description: 'Being physically fit; optimal well-being.',
    },
    'value-18': {
      id: 'value-18',
      title: 'Fun',
      description: 'Playfulness, ability to laugh and express humor, joking.',
    },
    'value-19': {
      id: 'value-19',
      title: 'Growth',
      description: 'Investing in lifelong learning and personal development.',
    },
    'value-20': {
      id: 'value-20',
      title: 'Honesty',
      description: 'Being truthful, sincere.',
    },
    'value-21': {
      id: 'value-21',
      title: 'Independence',
      description: 'Free from the influence, guidance, or control of others.',
    },
    'value-22': {
      id: 'value-22',
      title: 'Integrity',
      description:
        'Words and deeds match up; I am who I am, no matter where I am or who I am with.',
    },
    'value-23': {
      id: 'value-23',
      title: 'Knowledge',
      description: 'Subject matter expert, educated via experience or study.',
    },
    'value-24': {
      id: 'value-24',
      title: 'Legacy',
      description:
        'Making a difference today with tomorrow in mind, succession.',
    },
    'value-25': {
      id: 'value-25',
      title: 'Loyalty',
      description: 'Being faithful to a person, ideal, custom, cause, or duty.',
    },
    'value-26': {
      id: 'value-26',
      title: 'Money/Wealth',
      description: 'An abundance of valuable material possession, riches.',
    },
    'value-27': {
      id: 'value-27',
      title: 'Passion',
      description: 'Intense emotional excitement, boundless enthusiasm.',
    },
    'value-28': {
      id: 'value-28',
      title: 'Perfection',
      description: 'Reaching the highest attainable standard, details.',
    },
    'value-29': {
      id: 'value-29',
      title: 'Quality',
      description: 'Reaching a standard of excellence.',
    },
    'value-30': {
      id: 'value-30',
      title: 'Recognition',
      description: 'Giving and receiving acknowledgement for achievements.',
    },
    'value-31': {
      id: 'value-31',
      title: 'Simplicity',
      description: 'Lack of complexity or complication.',
    },
    'value-32': {
      id: 'value-32',
      title: 'Status',
      description:
        'Holding a position of importance, high standing, or prestige.',
    },
    'value-33': {
      id: 'value-33',
      title: 'Structure',
      description: 'Formality, process, and systems.',
    },
    'value-34': {
      id: 'value-34',
      title: 'Teamwork',
      description: 'Cooperative effort by a group or team.',
    },
    'value-35': {
      id: 'value-35',
      title: 'Trust',
      description:
        'Firm reliance on the integrity, ability, or character of others.',
    },
    'value-36': {
      id: 'value-36',
      title: 'Urgency',
      description: 'Fast, swift, and action oriented.',
    },
    'value-37': {
      id: 'value-37',
      title: 'Volunteerism/Service',
      description: 'Serving the community, non-profit organizations.',
    },
    'value-38': {
      id: 'value-38',
      title: 'Wisdom',
      description:
        'Having deep understanding, insight, and knowledge; the ability to make good judgments.',
    },
  },
  steps: {
    'step-1': {
      id: 'step-1',
      title: 'Deck of cards',
      description: '',
      cardIds: [
        'value-1',
        'value-2',
        'value-3',
        'value-4',
        'value-5',
        'value-6',
        'value-7',
        'value-8',
        'value-9',
        'value-10',
        'value-11',
        'value-12',
        'value-13',
        'value-14',
        'value-15',
        'value-16',
        'value-17',
        'value-18',
        'value-19',
        'value-20',
        'value-21',
        'value-22',
        'value-23',
        'value-24',
        'value-25',
        'value-26',
        'value-27',
        'value-28',
        'value-29',
        'value-30',
        'value-31',
        'value-32',
        'value-33',
        'value-34',
        'value-35',
        'value-36',
        'value-37',
        'value-38',
      ],
    },
    'step-2': {
      id: 'step-2',
      title: 'The most important values',
      description: 'Please drag values that matter to you.',
      cardIds: [],
    },
    'step-3': {
      id: 'step-3',
      title: 'The less important values',
      description: 'Please drag value that are less important.',
      cardIds: [],
    },
    'step-4': {
      id: 'step-4',
      title: 'Top 8 values',
      description: 'Please select top 8 values from the important ones.',
      cardIds: [],
    },
    'step-5': {
      id: 'step-5',
      title: 'Top 5 values',
      description: 'Please select top 5 values.',
      cardIds: [],
    },
    'step-6': {
      id: 'step-6',
      title: 'Top 3 values',
      description: 'Finally, (I promise) please select top 3 values.',
      cardIds: [],
    },
  },
  stepGroups: {
    'step-group-1': {
      id: 'step-group-1',
      steps: ['step-1'],
    },
    'step-group-2': {
      id: 'step-group-2',
      steps: ['step-2', 'step-3'],
    },
    'step-group-3': {
      id: 'step-group-3',
      steps: ['step-4'],
    },
    'step-group-4': {
      id: 'step-group-4',
      steps: ['step-5'],
    },
    'step-group-5': {
      id: 'step-group-5',
      steps: ['step-6'],
    },
  },
  currentStep: 1, // 1 as I want to start with steps 1 and 2 displayed
};

export default initialData;
