const quizzes = {
  'vocabulary-basics': {
    title: 'Basic Vocabulary Quiz',
    description: 'Test your knowledge of basic vocabulary words.',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the word for "hello" in Spanish?',
        options: ['Bonjour', 'Hola', 'Ciao', 'Hallo'],
        correctAnswer: 'Hola'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which color is "rouge" in French?',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctAnswer: 'Red'
      },
      {
        id: 3,
        type: 'fill-blank',
        question: 'The Spanish word for "thank you" is ______.',
        correctAnswer: 'gracias'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'What is the number "five" in German?',
        options: ['vier', 'fünf', 'sechs', 'sieben'],
        correctAnswer: 'fünf'
      },
      {
        id: 5,
        type: 'matching',
        question: 'Match the words with their meanings:',
        pairs: [
          { item: 'agua', match: 'water' },
          { item: 'fuego', match: 'fire' },
          { item: 'tierra', match: 'earth' },
          { item: 'aire', match: 'air' }
        ]
      }
    ]
  },
  'grammar-basics': {
    title: 'Basic Grammar Quiz',
    description: 'Test your understanding of fundamental grammar rules.',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Which is the correct word order in English?',
        options: [
          'Subject-Verb-Object',
          'Verb-Subject-Object',
          'Object-Subject-Verb',
          'Subject-Object-Verb'
        ],
        correctAnswer: 'Subject-Verb-Object'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which sentence uses the present tense correctly?',
        options: [
          'I going to the store.',
          'I goes to the store.',
          'I go to the store.',
          'I will go to the store.'
        ],
        correctAnswer: 'I go to the store.'
      },
      {
        id: 3,
        type: 'fill-blank',
        question: 'You need to use ____ before a singular noun that starts with a consonant sound.',
        correctAnswer: 'a'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'Which is NOT a subject pronoun in English?',
        options: ['I', 'You', 'Him', 'They'],
        correctAnswer: 'Him'
      },
      {
        id: 5,
        type: 'matching',
        question: 'Match the pronouns with their correct possessive forms:',
        pairs: [
          { item: 'I', match: 'my' },
          { item: 'you', match: 'your' },
          { item: 'he', match: 'his' },
          { item: 'she', match: 'her' }
        ]
      }
    ]
  },
  'common-expressions': {
    title: 'Common Expressions Quiz',
    description: 'Test your knowledge of everyday phrases and idioms.',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What does the expression "break a leg" mean?',
        options: [
          'To physically injure someone',
          'Good luck',
          'To run away',
          'To dance'
        ],
        correctAnswer: 'Good luck'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which phrase would you use to ask for the bill in a restaurant?',
        options: [
          'Can I have the menu, please?',
          'Can I have the check, please?',
          'I want to order, please.',
          'Where is the bathroom?'
        ],
        correctAnswer: 'Can I have the check, please?'
      },
      {
        id: 3,
        type: 'fill-blank',
        question: 'The expression "to be under the ______" means to be feeling sick.',
        correctAnswer: 'weather'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'What does "it\'s raining cats and dogs" mean?',
        options: [
          'It\'s raining heavily',
          'It\'s raining animals',
          'It\'s a strange weather phenomenon',
          'It\'s a light drizzle'
        ],
        correctAnswer: 'It\'s raining heavily'
      },
      {
        id: 5,
        type: 'matching',
        question: 'Match these idioms with their meanings:',
        pairs: [
          { item: 'piece of cake', match: 'something easy' },
          { item: 'cost an arm and a leg', match: 'very expensive' },
          { item: 'hit the books', match: 'study hard' },
          { item: 'pull yourself together', match: 'calm down' }
        ]
      }
    ]
  },
  'advanced-grammar': {
    title: 'Advanced Grammar Quiz',
    description: 'Test your knowledge of complex grammar structures.',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Which of the following is a correct second conditional sentence?',
        options: [
          'If I will win the lottery, I will buy a house.',
          'If I win the lottery, I would buy a house.',
          'If I won the lottery, I would buy a house.',
          'If I had won the lottery, I would buy a house.'
        ],
        correctAnswer: 'If I won the lottery, I would buy a house.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Identify the passive voice sentence:',
        options: [
          'They built the bridge last year.',
          'The bridge was built last year.',
          'The bridge is very strong.',
          'They are building the bridge now.'
        ],
        correctAnswer: 'The bridge was built last year.'
      },
      {
        id: 3,
        type: 'fill-blank',
        question: 'In the sentence "She asked me whether I would come to her party", "whether I would come to her party" is a(n) _______ clause.',
        correctAnswer: 'subordinate'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'Which word is NOT a modal verb?',
        options: ['Can', 'Should', 'Must', 'Want'],
        correctAnswer: 'Want'
      },
      {
        id: 5,
        type: 'matching',
        question: 'Match the clause types with their examples:',
        pairs: [
          { item: 'Relative clause', match: 'The man who called yesterday is my uncle.' },
          { item: 'Adverbial clause', match: 'I\'ll call you when I arrive.' },
          { item: 'Noun clause', match: 'What you said surprised me.' },
          { item: 'Main clause', match: 'She went to the store.' }
        ]
      }
    ]
  }
};

export default quizzes;
