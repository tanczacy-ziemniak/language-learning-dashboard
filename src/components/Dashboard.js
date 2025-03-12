import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultTopics from '../data/topics';
import { useProgress } from '../contexts/ProgressContext';
import TopicCard from './TopicCard';
import ProgressChart from './ProgressChart';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { getOverallProgress } = useProgress();
  const [topics, setTopics] = useState(defaultTopics);

  // Load custom topics from localStorage
  useEffect(() => {
    const savedTopics = localStorage.getItem('custom-polish-topics');
    if (savedTopics) {
      const customTopics = JSON.parse(savedTopics);
      // Combine default topics with custom topics
      setTopics([...defaultTopics, ...customTopics]);
    }
  }, []);

  const overallProgress = getOverallProgress(topics);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Language Learning Dashboard</h1>
        <p>Track your progress and take quizzes to improve your language skills</p>
      </div>

      <div className={styles.progressSection}>
        <h2>Your Progress</h2>
        <div className={styles.progressStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{overallProgress.completedTopics}</span>
            <span className={styles.statLabel}>Topics Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{overallProgress.totalTopics - overallProgress.completedTopics}</span>
            <span className={styles.statLabel}>Topics Remaining</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{Math.round(overallProgress.percentage)}%</span>
            <span className={styles.statLabel}>Overall Completion</span>
          </div>
        </div>
        <ProgressChart percentage={overallProgress.percentage} />
      </div>

      <div className={styles.topicsSection}>
        <h2>Learning Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>

      <div className={styles.recommendationsSection}>
        <h2>Recommended Next Steps</h2>
        {overallProgress.completedTopics < topics.length ? (
          <div className="card">
            <h3>Continue Learning</h3>
            <p>You still have topics to complete. Keep going with your language journey!</p>
            {topics.filter(topic => {
              const progress = getOverallProgress([topic]);
              return progress.percentage < 100;
            }).slice(0, 1).map(topic => (
              <Link key={topic.id} to={`/topics/${topic.id}`} className="btn btn-primary">
                Continue with {topic.title}
              </Link>
            ))}
          </div>
        ) : (
          <div className="card">
            <h3>Congratulations!</h3>
            <p>You've completed all topics. Consider reviewing difficult ones or moving to more advanced material.</p>
          </div>
        )}
        
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Create Your Own Content</h3>
          <p>Create custom Polish language learning materials with our content manager.</p>
          <Link to="/content-manager" className="btn btn-primary">
            Go to Content Manager
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
