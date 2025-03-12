import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './QuizPage.module.css';

const QuizPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuizType = queryParams.get('type') || 'word';
  const quizMode = queryParams.get('mode') || '20'; // '20', 'all', or 'review'
  
  const [quizType, setQuizType] = useState(initialQuizType); // 'word' or 'expression'
  const [words, setWords] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState({ words: [], expressions: [] });
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswersInCurrentQuiz, setWrongAnswersInCurrentQuiz] = useState([]);
  
  // Load words, expressions, and wrong answers from localStorage
  useEffect(() => {
    // Load words
    const savedWords = localStorage.getItem('polish-words');
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    }
    
    // Load expressions
    const savedExpressions = localStorage.getItem('polish-expressions');
    if (savedExpressions) {
      setExpressions(JSON.parse(savedExpressions));
    }
    
    // Load wrong answers
    const savedWrongAnswers = localStorage.getItem('polish-wrong-answers');
    if (savedWrongAnswers) {
      setWrongAnswers(JSON.parse(savedWrongAnswers));
    }
  }, []);
  
  // Prepare quiz when quiz type changes or data is loaded
  useEffect(() => {
    prepareQuiz();
  }, [quizType, words, expressions, wrongAnswers, quizMode]);
  
  // Function to prepare a new quiz
  const prepareQuiz = () => {
    let items = quizType === 'word' ? words : expressions;
    let quizItems = [];
    
    // Need at least 5 items to generate a quiz with 4 options
    if (items.length < 5) {
      setCurrentQuiz([]);
      return;
    }
    
    // Select items based on quiz mode
    if (quizMode === 'review') {
      const reviewItems = quizType === 'word' ? wrongAnswers.words : wrongAnswers.expressions;
      
      if (reviewItems.length === 0) {
        // Not enough review items, fall back to regular mode
        quizItems = [...items].sort(() => 0.5 - Math.random());
      } else {
        // Find the actual items from the words/expressions arrays
        quizItems = [];
        reviewItems.forEach(reviewItem => {
          const foundItem = items.find(item => item.id === reviewItem.id);
          if (foundItem) {
            quizItems.push(foundItem);
          }
        });
        
        // Ensure we have at least 5 items
        if (quizItems.length < 5) {
          // Add some random items to make up the difference
          const otherItems = items.filter(item => 
            !quizItems.some(qi => qi.id === item.id)
          ).sort(() => 0.5 - Math.random());
          
          quizItems = [...quizItems, ...otherItems.slice(0, 5 - quizItems.length)];
        }
        
        // Shuffle the review items
        quizItems = quizItems.sort(() => 0.5 - Math.random());
      }
    } else {
      // Regular mode or all mode - shuffle the items
      quizItems = [...items].sort(() => 0.5 - Math.random());
    }
    
    // For '20' mode, take only 20 items (or all if less than 20)
    if (quizMode === '20' && quizItems.length > 20) {
      quizItems = quizItems.slice(0, 20);
    }
    
    // Create quiz questions
    const quiz = quizItems.map(item => {
      // Get 3 random incorrect options
      const otherItems = items.filter(i => i.id !== item.id);
      const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      // Create options including the correct answer
      const options = [
        { id: item.id, text: item.english },
        ...shuffledOthers.map(i => ({ id: i.id, text: i.english }))
      ];
      
      // Shuffle options
      const shuffledOptions = options.sort(() => 0.5 - Math.random());
      
      return {
        id: item.id,
        itemId: item.id,
        polish: item.polish,
        english: item.english,
        question: item.polish,
        options: shuffledOptions,
        correctAnswer: item.english
      };
    });
    
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setWrongAnswersInCurrentQuiz([]);
  };
  
  const handleAnswerSelect = (option) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const currentQuestion = currentQuiz[currentQuestionIndex];
    if (option.text === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    } else {
      // Track wrong answers for later review
      setWrongAnswersInCurrentQuiz(prev => [
        ...prev, 
        {
          id: currentQuestion.itemId,
          polish: currentQuestion.polish,
          english: currentQuestion.english
        }
      ]);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      updateWrongAnswersStats();
    }
  };
  
  const updateWrongAnswersStats = () => {
    // Update wrong answers in local storage for review later
    if (wrongAnswersInCurrentQuiz.length === 0) return;
    
    const type = quizType === 'word' ? 'words' : 'expressions';
    const currentWrongAnswers = [...wrongAnswers[type]];
    
    wrongAnswersInCurrentQuiz.forEach(wrongItem => {
      const existingIndex = currentWrongAnswers.findIndex(item => item.id === wrongItem.id);
      
      if (existingIndex >= 0) {
        // Increment count for existing wrong answer
        currentWrongAnswers[existingIndex].count += 1;
      } else {
        // Add new wrong answer
        currentWrongAnswers.push({
          id: wrongItem.id,
          polish: wrongItem.polish,
          english: wrongItem.english,
          count: 1
        });
      }
    });
    
    // Sort by count (highest first)
    currentWrongAnswers.sort((a, b) => b.count - a.count);
    
    // Update state and local storage
    const newWrongAnswers = {
      ...wrongAnswers,
      [type]: currentWrongAnswers
    };
    
    setWrongAnswers(newWrongAnswers);
    localStorage.setItem('polish-wrong-answers', JSON.stringify(newWrongAnswers));
  };
  
  const startNewQuiz = () => {
    prepareQuiz();
  };
  
  // If there aren't enough items for a quiz
  if ((quizType === 'word' && words.length < 5) || 
      (quizType === 'expression' && expressions.length < 5)) {
    return (
      <div className={styles.quizPage}>
        <div className={styles.header}>
          <h1>Polish Learning Quiz</h1>
          <p>Test your knowledge of Polish words and expressions</p>
        </div>
        
        <div className={styles.quizTypeSelector}>
          <button 
            className={`${styles.quizTypeButton} ${quizType === 'word' ? styles.active : ''}`}
            onClick={() => setQuizType('word')}
          >
            Words Quiz
          </button>
          <button 
            className={`${styles.quizTypeButton} ${quizType === 'expression' ? styles.active : ''}`}
            onClick={() => setQuizType('expression')}
          >
            Expressions Quiz
          </button>
        </div>
        
        <div className="card">
          <h3>Not Enough Content for Quiz</h3>
          <p>You need at least 5 {quizType === 'word' ? 'words' : 'expressions'} to create a quiz.</p>
          <p>Current count: {quizType === 'word' ? words.length : expressions.length}</p>
          <a 
            href={quizType === 'word' ? '/content-manager' : '/content-manager?tab=expression'}
            className="btn btn-primary"
          >
            Add more {quizType === 'word' ? 'words' : 'expressions'}
          </a>
        </div>
      </div>
    );
  }
  
  // If showing quiz results
  if (showResults) {
    return (
      <div className={styles.quizPage}>
        <div className={styles.header}>
          <h1>Quiz Results</h1>
        </div>
        
        <div className={styles.resultsCard}>
          <h2>Your Score: {score}/{currentQuiz.length}</h2>
          <div className={styles.scorePercent}>
            {Math.round((score / currentQuiz.length) * 100)}%
          </div>
          
          <div className={styles.resultMessage}>
            {score === currentQuiz.length ? 
              'Perfect! You got all questions right!' : 
              score > currentQuiz.length * 0.8 ?
                'Great job! Nearly perfect!' :
                score > currentQuiz.length * 0.6 ?
                  'Good work! Keep practicing!' :
                  'Keep studying! You can improve your score!'}
          </div>
          
          {wrongAnswersInCurrentQuiz.length > 0 && (
            <div className={styles.wrongAnswersList}>
              <h3>Review These Items:</h3>
              <ul>
                {wrongAnswersInCurrentQuiz.map((item, index) => (
                  <li key={index}>
                    <span className={styles.reviewPolish}>{item.polish}</span>
                    <span className={styles.reviewEnglish}>{item.english}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button className="btn btn-primary" onClick={startNewQuiz}>
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }
  
  // Showing current question
  const currentQuestion = currentQuiz[currentQuestionIndex];
  
  return (
    <div className={styles.quizPage}>
      <div className={styles.header}>
        <h1>Polish {quizType === 'word' ? 'Words' : 'Expressions'} Quiz</h1>
        <p>{quizMode === 'review' ? 'Review Mode' : 
            quizMode === 'all' ? 'All Items Mode' : 'Standard Mode'}</p>
      </div>
      
      <div className={styles.quizTypeSelector}>
        <button 
          className={`${styles.quizTypeButton} ${quizType === 'word' ? styles.active : ''}`}
          onClick={() => setQuizType('word')}
          disabled={isAnswered}
        >
          Words Quiz
        </button>
        <button 
          className={`${styles.quizTypeButton} ${quizType === 'expression' ? styles.active : ''}`}
          onClick={() => setQuizType('expression')}
          disabled={isAnswered}
        >
          Expressions Quiz
        </button>
      </div>
      
      <div className={styles.quizContainer}>
        <div className={styles.progress}>
          <div className={styles.progressText}>
            Question {currentQuestionIndex + 1} of {currentQuiz.length}
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className={styles.questionCard}>
          <div className={styles.questionPolish}>{currentQuestion.question}</div>
          <div className={styles.questionPrompt}>What does this mean?</div>
          
          <div className={styles.options}>
            {currentQuestion.options.map((option, index) => (
              <button 
                key={option.id}
                className={`${styles.option} ${
                  selectedAnswer === option ? 
                    (option.text === currentQuestion.correctAnswer ? styles.correct : styles.incorrect) : 
                    ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                {option.text}
              </button>
            ))}
          </div>
          
          {isAnswered && (
            <div className={styles.feedback}>
              {selectedAnswer.text === currentQuestion.correctAnswer ? (
                <div className={styles.correctFeedback}>Correct!</div>
              ) : (
                <div className={styles.incorrectFeedback}>
                  <p>Incorrect!</p>
                  <p>The correct answer is: <strong>{currentQuestion.correctAnswer}</strong></p>
                </div>
              )}
              
              <button className="btn btn-primary" onClick={handleNextQuestion}>
                {currentQuestionIndex < currentQuiz.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.quizScore}>
          Current Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
