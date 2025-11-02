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
  const [selectedAnswer, setSelectedAnswer] = useState('');
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

    // 퀴즈 타입별 최소 아이템 개수 조건
    const minItems = quizType === 'word' ? 1 : 4;
    if (items.length < minItems) {
      setQuestions([{
        id: 'not-enough-data',
        question: `You need at least ${minItems} item${minItems > 1 ? 's' : ''} to create a quiz`,
        correctAnswer: '',
        answerType: 'polish', // default
        itemData: null
      }]);
      return;
    }

    // Shuffle and select up to 10 items
    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledItems.slice(0, 10);

    const generatedQuestions = selectedItems.map(item => {
      // Randomly decide answer type: 'polish' or 'english'
      const answerType = Math.random() < 0.5 ? 'polish' : 'english';
      return {
        id: item.id,
        question: answerType === 'polish' ? item.english : item.polish,
        correctAnswer: answerType === 'polish' ? item.polish : item.english,
        answerType,
        itemData: item
      };
    });

    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
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
  
  const handleAnswerInputChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (isChecking || !currentQuestion) return;

    setIsChecking(true);
    // 정답 비교 (공백 제거, 대소문자 무시)
    const userAnswer = selectedAnswer.trim().toLowerCase();
    const correctAnswer = currentQuestion.correctAnswer.trim().toLowerCase();
    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);

    setScore(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    if (!correct) {
      setWrongItems(prev => [...prev, currentQuestion.itemData]);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
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
                Go to <a href="content-manager">Content Manager</a> to add more {quizType}s.
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
                <div className={styles.polishWord}>
                  {currentQuestion.answerType === 'polish'
                    ? (
                      <>
                        Write the Polish vocabulary:<br />
                        <span className={styles.questionText}>{currentQuestion.question}</span>
                      </>
                    )
                    : (
                      <>
                        Write the meaning:<br />
                        <span className={styles.questionText}>{currentQuestion.question}</span>
                      </>
                    )
                  }
                </div>
                <form onSubmit={handleSubmitAnswer} className={styles.answerForm}>
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={handleAnswerInputChange}
                    disabled={isChecking}
                    className={styles.answerInput}
                    autoFocus
                  />
                  {/* 버튼을 input 아래에 배치, 마진 클래스 추가 */}
                  {!isChecking && (
                    <div>
                      <button
                        type="submit"
                        className={`${styles.submitButton} ${styles.submitButtonMargin}`}
                        disabled={!selectedAnswer.trim()}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </form>
                {isChecking && (
                  <div className={`${styles.feedback} ${isCorrect ? styles.correctFeedback : styles.incorrectFeedback}`}>
                    {isCorrect ? (
                      <p>Correct! ✓</p>
                    ) : (
                      <p>
                        Incorrect.<br />
                        The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                      </p>
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