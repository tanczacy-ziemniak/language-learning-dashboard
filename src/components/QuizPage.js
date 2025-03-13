import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import styles from './QuizPage.module.css';

const QuizPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuizType = queryParams.get('type') || 'word';
  
  const { words, expressions, updateWrongAnswers } = useData();
  
  const [quizType, setQuizType] = useState(initialQuizType);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [wrongItems, setWrongItems] = useState([]);
  
  // Get current question safely
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length
    ? questions[currentQuestionIndex]
    : null;
  
  // Prepare quiz questions
  const prepareQuiz = useCallback(() => {
    const items = quizType === 'word' ? words : expressions;
    
    // We need at least 4 items for a meaningful quiz
    if (items.length < 4) {
      setQuestions([{
        id: 'not-enough-data',
        question: `You need at least 4 ${quizType}s to create a quiz`,
        correctAnswer: '',
        options: []
      }]);
      return;
    }
    
    // Create a copy of items to shuffle
    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    
    // Take up to 10 items for the quiz
    const selectedItems = shuffledItems.slice(0, 10);
    
    const generatedQuestions = selectedItems.map(item => {
      // Get 3 random items for wrong answers
      const wrongAnswers = shuffledItems
        .filter(wrongItem => wrongItem.id !== item.id)
        .slice(0, 3)
        .map(wrongItem => wrongItem.english);
      
      // Create all options (correct + wrong) and shuffle them
      const options = [item.english, ...wrongAnswers]
        .sort(() => 0.5 - Math.random());
      
      return {
        id: item.id,
        question: item.polish,
        correctAnswer: item.english,
        options,
        itemData: item
      };
    });
    
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsChecking(false);
    setIsCorrect(null);
    setQuizCompleted(false);
    setScore({ correct: 0, total: 0 });
    setWrongItems([]);
  }, [quizType, words, expressions]);
  
  // Initialize quiz
  useEffect(() => {
    prepareQuiz();
  }, [prepareQuiz]);
  
  const handleAnswerSelect = (answer) => {
    if (isChecking) return;
    
    setSelectedAnswer(answer);
    setIsChecking(true);
    
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Update score
    setScore(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
    
    // Add to wrong answers if incorrect
    if (!correct) {
      setWrongItems(prev => [...prev, currentQuestion.itemData]);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsChecking(false);
      setIsCorrect(null);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      
      // Update wrong answers in context
      if (wrongItems.length > 0) {
        updateWrongAnswers(quizType === 'word' ? 'words' : 'expressions', wrongItems);
      }
    }
  };
  
  const handleRestartQuiz = () => {
    prepareQuiz();
  };
  
  const handleQuizTypeChange = (type) => {
    setQuizType(type);
  };
  
  // Check if we have enough data for a quiz
  const notEnoughData = currentQuestion?.id === 'not-enough-data';
  
  return (
    <div className={styles.quizPage}>
      <div className={styles.header}>
        <h1>Polish Language Quiz</h1>
        <p>Test your knowledge of Polish words and expressions</p>
      </div>
      
      <div className={styles.quizTypeSelection}>
        <button
          className={`${styles.quizTypeButton} ${quizType === 'word' ? styles.active : ''}`}
          onClick={() => handleQuizTypeChange('word')}
        >
          Words Quiz
        </button>
        <button
          className={`${styles.quizTypeButton} ${quizType === 'expression' ? styles.active : ''}`}
          onClick={() => handleQuizTypeChange('expression')}
        >
          Expressions Quiz
        </button>
      </div>
      
      {!quizCompleted ? (
        <div className={styles.quizContainer}>
          {notEnoughData ? (
            <div className={styles.notEnoughData}>
              <h2>{currentQuestion?.question}</h2>
              <p>
                Go to <a href="/content-manager">Content Manager</a> to add more {quizType}s.
              </p>
            </div>
          ) : currentQuestion ? (
            <>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className={styles.questionCount}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              
              <div className={styles.questionContainer}>
                <h2>What does this mean in English?</h2>
                <div className={styles.polishWord}>{currentQuestion.question}</div>
                
                <div className={styles.options}>
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`
                        ${styles.optionButton}
                        ${selectedAnswer === option ? styles.selected : ''}
                        ${isChecking && option === currentQuestion.correctAnswer ? styles.correct : ''}
                        ${isChecking && selectedAnswer === option && option !== currentQuestion.correctAnswer ? styles.incorrect : ''}
                      `}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isChecking}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {isChecking && (
                  <div className={`${styles.feedback} ${isCorrect ? styles.correctFeedback : styles.incorrectFeedback}`}>
                    {isCorrect ? (
                      <p>Correct! ✓</p>
                    ) : (
                      <p>Incorrect. The correct answer is: <strong>{currentQuestion.correctAnswer}</strong></p>
                    )}
                    
                    <button
                      className={styles.nextButton}
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.loading}>Loading questions...</div>
          )}
        </div>
      ) : (
        <div className={styles.quizResults}>
          <h2>Quiz Completed!</h2>
          
          <div className={styles.scoreCard}>
            <div className={styles.scoreCircle}>
              <div className={styles.soilBackground}></div>
              <span className={styles.potatoEmoji}>🥔</span>
              <span className={styles.scorePercentage}>
                {Math.round((score.correct / score.total) * 100)}%
              </span>
            </div>
            <p className={styles.scoreText}>
              You got <strong>{score.correct}</strong> out of <strong>{score.total}</strong> questions correct!
            </p>
          </div>
          
          {wrongItems.length > 0 && (
            <div className={styles.wrongItemsSection}>
              <h3>Words to Review:</h3>
              <div className={styles.wrongItemsList}>
                {wrongItems.map(item => (
                  <div key={item.id} className={styles.wrongItem}>
                    <div className={styles.wrongItemPolish}>{item.polish}</div>
                    <div className={styles.wrongItemEnglish}>{item.english}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            className={styles.restartButton}
            onClick={handleRestartQuiz}
          >
            Take Another Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;