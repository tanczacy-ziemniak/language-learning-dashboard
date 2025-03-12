import React, { useState } from 'react';
import styles from './QuizComponents.module.css';

const Matching = ({ question, matches, onMatchChange }) => {
  // For drag and drop functionality
  const [draggedItem, setDraggedItem] = useState(null);
  
  const handleDragStart = (item) => {
    setDraggedItem(item);
  };
  
  const handleDrop = (match) => {
    if (draggedItem) {
      const updatedMatches = { ...matches, [draggedItem]: match };
      onMatchChange(updatedMatches);
      setDraggedItem(null);
    }
  };
  
  // For click selection
  const handleItemClick = (item) => {
    setDraggedItem(draggedItem === item ? null : item);
  };
  
  const handleMatchClick = (match) => {
    if (draggedItem) {
      const updatedMatches = { ...matches, [draggedItem]: match };
      onMatchChange(updatedMatches);
      setDraggedItem(null);
    }
  };
  
  // Get all items and possible matches
  const items = question.pairs.map(pair => pair.item);
  const possibleMatches = question.pairs.map(pair => pair.match);
  
  // Helper to find which item is matched with a match
  const getMatchedItem = (match) => {
    return Object.keys(matches).find(key => matches[key] === match) || null;
  };
  
  return (
    <div className={styles.questionContainer}>
      <h3 className={styles.questionText}>{question.question}</h3>
      
      <div className={styles.matching}>
        <div className={styles.matchingItems}>
          <h4>Items</h4>
          {items.map((item, index) => (
            <div
              key={index}
              className={`${styles.matchingItem} ${draggedItem === item ? styles.dragging : ''} ${matches[item] ? styles.matched : ''}`}
              onClick={() => handleItemClick(item)}
              draggable
              onDragStart={() => handleDragStart(item)}
            >
              {item}
              {matches[item] && (
                <span className={styles.matchedWith}> → {matches[item]}</span>
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.matchingOptions}>
          <h4>Matches</h4>
          {possibleMatches.map((match, index) => {
            const matchedItem = getMatchedItem(match);
            return (
              <div
                key={index}
                className={`${styles.matchingOption} ${matchedItem ? styles.matched : ''}`}
                onClick={() => handleMatchClick(match)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(match)}
              >
                {match}
                {matchedItem && (
                  <span className={styles.matchedWith}> ← {matchedItem}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Matching;
