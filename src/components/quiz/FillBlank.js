import React from 'react';
import styles from './QuizComponents.module.css';

const FillBlank = ({ question, answer, onAnswerChange }) => {
  return (
    <div className={styles.questionContainer}>
      <h3 className={styles.questionText}>{question.question}</h3>
      
      <div className={styles.fillBlank}>
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Your answer"
          className={styles.fillBlankInput}
        />
      </div>
    </div>
  );
};

export default FillBlank;
