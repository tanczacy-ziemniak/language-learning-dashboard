import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  return useContext(ProgressContext);
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('language-learning-progress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  // Save progress to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('language-learning-progress', JSON.stringify(progress));
  }, [progress]);

  // Update quiz results
  const updateQuizResult = (topicId, score, totalQuestions) => {
    setProgress(prevProgress => {
      const topicProgress = prevProgress[topicId] || { 
        completed: false, 
        scores: [] 
      };
      
      return {
        ...prevProgress,
        [topicId]: {
          ...topicProgress,
          completed: true,
          scores: [...topicProgress.scores, { 
            score, 
            totalQuestions, 
            date: new Date().toISOString() 
          }]
        }
      };
    });
  };

  // Get topic progress
  const getTopicProgress = (topicId) => {
    return progress[topicId] || { completed: false, scores: [] };
  };

  // Get overall progress
  const getOverallProgress = (topics) => {
    const totalTopics = topics.length;
    const completedTopics = topics.filter(topic => 
      progress[topic.id] && progress[topic.id].completed
    ).length;
    
    return {
      completedTopics,
      totalTopics,
      percentage: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0
    };
  };

  const value = {
    progress,
    updateQuizResult,
    getTopicProgress,
    getOverallProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
