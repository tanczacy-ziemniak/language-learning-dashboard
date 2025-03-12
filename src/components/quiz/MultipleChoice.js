import React from 'react';
import styles from './QuizComponents.module.css';

const MultipleChoice = ({ question, selectedAnswer, onSelectAnswer }) => {
  return (
    <div className={styles.questionContainer}>
      <h3 className={styles.questionText}>{question.question}</h3>
      
      <div className={styles.options}>
        {question.options.map((option, index) => (
          <div 
            key={index}
            className={`${styles.option} ${selectedAnswer === option ? styles.selected : ''}`}
            onClick={() => onSelectAnswer(option)}
          >
            <span className={styles.optionIndex}>{String.fromCharCode(65 + index)}</span>
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
