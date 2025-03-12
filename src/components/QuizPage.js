import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import defaultQuizzes from '../data/quizzes';
import defaultTopics from '../data/topics';
import { useProgress } from '../contexts/ProgressContext';
import MultipleChoice from './quiz/MultipleChoice';
import FillBlank from './quiz/FillBlank';
import Matching from './quiz/Matching';
import styles from './QuizPage.module.css';

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { updateQuizResult } = useProgress();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    // First check default quizzes
    let foundQuiz = defaultQuizzes[topicId];
    
    // If not found, check custom topics
    if (!foundQuiz) {
      const savedTopics = localStorage.getItem('custom-polish-topics');
      if (savedTopics) {
        const customTopics = JSON.parse(savedTopics);
        const customTopic = customTopics.find(t => t.id === topicId);
        
        if (customTopic && customTopic.quiz) {
          foundQuiz = customTopic.quiz;
        }
      }
    }
    
    setQuiz(foundQuiz);
  }, [topicId]);
  
  if (!quiz) {
    return (
      <div className="card">
        <h2>Quiz not found</h2>
        <p>The quiz you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }
  
  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate results
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach(question => {
      if (question.type === 'multiple-choice') {
        if (answers[question.id] === question.correctAnswer) {
          score++;
        }
      } else if (question.type === 'fill-blank') {
        const userAnswer = (answers[question.id] || '').trim().toLowerCase();
        const correctAnswer = question.correctAnswer.toLowerCase();
        if (userAnswer === correctAnswer) {
          score++;
        }
      } else if (question.type === 'matching') {
        // For matching, we need to check all pairs
        const userMatches = answers[question.id] || {};
        let allCorrect = true;
        
        for (const pair of question.pairs) {
          if (userMatches[pair.item] !== pair.match) {
            allCorrect = false;
            break;
          }
        }
        
        if (allCorrect) {
          score++;
        }
      }
    });
    return score;
  };
  
  const handleFinish = () => {
    const score = calculateScore();
    updateQuizResult(topicId, score, quiz.questions.length);
    navigate(`/topics/${topicId}`);
  };
  
  const question = quiz.questions[currentQuestion];
  
  // If showing results, calculate and show the score
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <div className={styles.quizResults}>
        <h2>Quiz Results</h2>
        <div className={styles.scoreCard}>
          <div className={styles.scoreHeader}>
            <h3>{quiz.title}</h3>
          </div>
          <div className={styles.scoreBody}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNumber}>{score}</span>
              <span className={styles.scoreTotal}>/{quiz.questions.length}</span>
            </div>
            <div className={styles.scorePercentage}>{percentage}%</div>
            <div className={styles.scoreMessage}>
              {percentage >= 80 ? 'Great job!' : percentage >= 60 ? 'Good effort!' : 'Keep practicing!'}
            </div>
          </div>
          <div className={styles.actions}>
            <button onClick={handleFinish} className="btn btn-primary">
              Finish
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render the current question
  return (
    <div className={styles.quizPage}>
      <header className={styles.header}>
        <h1>{quiz.title}</h1>
        <div className={styles.progress}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </header>
      
      <div className={styles.questionCard}>
        {question.type === 'multiple-choice' && (
          <MultipleChoice 
            question={question} 
            selectedAnswer={answers[question.id]} 
            onSelectAnswer={(answer) => handleAnswer(question.id, answer)}
          />
        )}
        
        {question.type === 'fill-blank' && (
          <FillBlank 
            question={question} 
            answer={answers[question.id] || ''} 
            onAnswerChange={(answer) => handleAnswer(question.id, answer)}
          />
        )}
        
        {question.type === 'matching' && (
          <Matching 
            question={question} 
            matches={answers[question.id] || {}} 
            onMatchChange={(matches) => handleAnswer(question.id, matches)}
          />
        )}
      </div>
      
      <div className={styles.navigation}>
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0} 
          className="btn btn-secondary"
        >
          Previous
        </button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <button 
            onClick={handleNext} 
            className="btn btn-primary"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            className="btn btn-primary"
          >
            Finish Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
