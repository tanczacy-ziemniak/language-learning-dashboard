import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import styles from './TopicCard.module.css';

const TopicCard = ({ topic }) => {
  const { getTopicProgress } = useProgress();
  const progress = getTopicProgress(topic.id);
  
  // Calculate topic completion based on quiz attempts
  const hasAttemptedQuiz = progress.scores && progress.scores.length > 0;
  
  return (
    <div className={`${styles.topicCard} ${hasAttemptedQuiz ? styles.completed : ''}`}>
      <div className={styles.icon}>{topic.icon}</div>
      <h3>{topic.title}</h3>
      <div className={styles.level}>{topic.level}</div>
      <p>{topic.description}</p>
      
      <div className={styles.progress}>
        {hasAttemptedQuiz ? (
          <>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(progress.scores[progress.scores.length - 1].score / progress.scores[progress.scores.length - 1].totalQuestions) * 100}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>
              Last Score: {progress.scores[progress.scores.length - 1].score}/{progress.scores[progress.scores.length - 1].totalQuestions}
            </span>
          </>
        ) : (
          <span className={styles.progressText}>Not started yet</span>
        )}
      </div>
      
      <div className={styles.actions}>
        <Link to={`/topics/${topic.id}`} className="btn btn-secondary">
          Learn
        </Link>
        <Link to={`/quiz/${topic.id}`} className="btn btn-primary">
          {hasAttemptedQuiz ? 'Retake Quiz' : 'Take Quiz'}
        </Link>
      </div>
    </div>
  );
};

export default TopicCard;
