import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import defaultTopics from '../data/topics';
import defaultQuizzes from '../data/quizzes';
import { useProgress } from '../contexts/ProgressContext';
import styles from './TopicPage.module.css';

const TopicPage = () => {
  const { topicId } = useParams();
  const { getTopicProgress } = useProgress();
  const [topic, setTopic] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const progress = getTopicProgress(topicId);
  
  useEffect(() => {
    // First check default topics
    let foundTopic = defaultTopics.find(t => t.id === topicId);
    let foundQuiz = defaultQuizzes[topicId];
    
    // If not found, check custom topics
    if (!foundTopic) {
      const savedTopics = localStorage.getItem('custom-polish-topics');
      if (savedTopics) {
        const customTopics = JSON.parse(savedTopics);
        foundTopic = customTopics.find(t => t.id === topicId);
        
        // Custom topics have quiz embedded in them
        if (foundTopic && foundTopic.quiz) {
          foundQuiz = foundTopic.quiz;
        }
      }
    }
    
    setTopic(foundTopic);
    setQuiz(foundQuiz);
  }, [topicId]);
  
  if (!topic) {
    return (
      <div className="card">
        <h2>Topic not found</h2>
        <p>The topic you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className={styles.topicPage}>
      <header className={styles.header}>
        <h1>
          <span className={styles.icon}>{topic.icon}</span>
          {topic.title}
        </h1>
        <div className={styles.level}>{topic.level}</div>
        <p>{topic.description}</p>
      </header>

      <div className={styles.sections}>
        <h2>Learning Materials</h2>
        {topic.sections.map((section, index) => (
          <div key={index} className={`card ${styles.section}`}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>

      <div className={styles.quizSection}>
        <h2>Test Your Knowledge</h2>
        <div className="card">
          <h3>{quiz?.title || 'Topic Quiz'}</h3>
          <p>{quiz?.description || 'Test your understanding of this topic with a short quiz.'}</p>
          
          {progress.scores && progress.scores.length > 0 && (
            <div className={styles.results}>
              <h4>Previous Results</h4>
              <ul>
                {progress.scores.slice(-3).reverse().map((result, index) => (
                  <li key={index}>
                    <span>{new Date(result.date).toLocaleDateString()}: </span>
                    <span className={styles.score}>{result.score}/{result.totalQuestions} ({Math.round(result.score / result.totalQuestions * 100)}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {quiz ? (
            <div className={styles.quizActions}>
              <Link to={`/quiz/${topicId}`} className="btn btn-primary">
                {progress.scores && progress.scores.length > 0 ? 'Retake Quiz' : 'Take Quiz'}
              </Link>
            </div>
          ) : (
            <p>No quiz available for this topic yet.</p>
          )}
        </div>
      </div>
      
      <div className={styles.navigation}>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default TopicPage;
