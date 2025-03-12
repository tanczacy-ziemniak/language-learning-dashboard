import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context with a default empty value
const DataContext = createContext({
  words: [],
  expressions: [],
  notes: '',
  streak: 0,
  lastUsedDate: null,
  wrongAnswers: { words: [], expressions: [] },
  addWord: () => {},
  addExpression: () => {},
  deleteWord: () => {},
  deleteExpression: () => {},
  saveNotes: () => {},
  updateWrongAnswers: () => {},
  exportAllData: () => {},
  importAllData: () => {}
});

// Custom hook for using the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [words, setWords] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [notes, setNotes] = useState('');
  const [streak, setStreak] = useState(0);
  const [lastUsedDate, setLastUsedDate] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState({ words: [], expressions: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
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
      
      // Load notes
      const savedNotes = localStorage.getItem('polish-notes');
      if (savedNotes) {
        setNotes(savedNotes);
      }
      
      // Load streak data
      const streakData = localStorage.getItem('polish-streak');
      if (streakData) {
        const { streak, lastUsed } = JSON.parse(streakData);
        setStreak(streak);
        setLastUsedDate(new Date(lastUsed));
      }
      
      // Load wrong answers data
      const wrongAnswersData = localStorage.getItem('polish-wrong-answers');
      if (wrongAnswersData) {
        setWrongAnswers(JSON.parse(wrongAnswersData));
      }
      
      setIsLoaded(true);
    };
    
    loadData();
    updateStreak();
  }, []);

  // Auto-save data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('polish-words', JSON.stringify(words));
    }
  }, [words, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('polish-expressions', JSON.stringify(expressions));
    }
  }, [expressions, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('polish-notes', notes);
    }
  }, [notes, isLoaded]);
  
  useEffect(() => {
    if (isLoaded && lastUsedDate) {
      const streakData = {
        streak,
        lastUsed: lastUsedDate.toISOString()
      };
      localStorage.setItem('polish-streak', JSON.stringify(streakData));
    }
  }, [streak, lastUsedDate, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('polish-wrong-answers', JSON.stringify(wrongAnswers));
    }
  }, [wrongAnswers, isLoaded]);
  
  // Update streak function
  const updateStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const storedStreak = localStorage.getItem('polish-streak');
    let currentStreak = 0;
    let lastUsed = null;
    
    if (storedStreak) {
      const streakData = JSON.parse(storedStreak);
      currentStreak = streakData.streak;
      lastUsed = new Date(streakData.lastUsed);
      lastUsed.setHours(0, 0, 0, 0); // Normalize to start of day
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastUsed.getTime() === today.getTime()) {
        // Already logged in today
      } else if (lastUsed.getTime() === yesterday.getTime()) {
        // Logged in yesterday, increment streak
        currentStreak += 1;
      } else {
        // Streak broken
        currentStreak = 1;
      }
    } else {
      // First visit
      currentStreak = 1;
    }
    
    // Save streak data
    const updatedStreakData = {
      streak: currentStreak,
      lastUsed: today.toISOString()
    };
    
    localStorage.setItem('polish-streak', JSON.stringify(updatedStreakData));
    setStreak(currentStreak);
    setLastUsedDate(today);
  };

  // Add word function
  const addWord = (word) => {
    const newWord = {
      ...word,
      id: Date.now()
    };
    setWords(prev => [...prev, newWord]);
    return newWord;
  };
  
  // Add expression function
  const addExpression = (expression) => {
    const newExpression = {
      ...expression,
      id: Date.now()
    };
    setExpressions(prev => [...prev, newExpression]);
    return newExpression;
  };
  
  // Delete word function
  const deleteWord = (id) => {
    setWords(prev => prev.filter(word => word.id !== id));
  };
  
  // Delete expression function
  const deleteExpression = (id) => {
    setExpressions(prev => prev.filter(expr => expr.id !== id));
  };
  
  // Save notes function
  const saveNotes = (newNotes) => {
    setNotes(newNotes);
  };
  
  // Update wrong answers function
  const updateWrongAnswers = (type, wrongItems) => {
    const currentWrongAnswers = [...wrongAnswers[type]];
    
    wrongItems.forEach(wrongItem => {
      const existingIndex = currentWrongAnswers.findIndex(item => item.id === wrongItem.id);
      
      if (existingIndex >= 0) {
        // Increment count for existing item
        currentWrongAnswers[existingIndex].count += 1;
      } else {
        // Add new item
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
    
    // Update state
    setWrongAnswers({
      ...wrongAnswers,
      [type]: currentWrongAnswers
    });
  };
  
  // Export all data function
  const exportAllData = () => {
    const allData = {
      words,
      expressions,
      streak: { streak, lastUsed: lastUsedDate?.toISOString() },
      wrongAnswers,
      notes
    };
    
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const fileName = `polish-learning-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    // Create download link and click it
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };
  
  // Import all data function
  const importAllData = (jsonData) => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!parsedData.words || !Array.isArray(parsedData.words)) {
        throw new Error('Invalid format: Missing or invalid words data');
      }
      
      if (!parsedData.expressions || !Array.isArray(parsedData.expressions)) {
        throw new Error('Invalid format: Missing or invalid expressions data');
      }
      
      // Import the data
      setWords(parsedData.words || []);
      setExpressions(parsedData.expressions || []);
      
      if (parsedData.streak) {
        setStreak(parsedData.streak.streak || 0);
        setLastUsedDate(parsedData.streak.lastUsed ? new Date(parsedData.streak.lastUsed) : null);
      }
      
      setWrongAnswers(parsedData.wrongAnswers || { words: [], expressions: [] });
      
      setNotes(parsedData.notes || '');
      
      return true;
    } catch (error) {
      console.error("Data import error:", error);
      return { error: error.message };
    }
  };

  // Context value
  const value = {
    words,
    expressions,
    notes,
    streak,
    lastUsedDate,
    wrongAnswers,
    addWord,
    addExpression,
    deleteWord,
    deleteExpression,
    saveNotes,
    updateWrongAnswers,
    exportAllData,
    importAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
