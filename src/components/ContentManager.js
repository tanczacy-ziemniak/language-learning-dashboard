import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import styles from './ContentManager.module.css';

const ContentManager = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  
  const [mode, setMode] = useState(tabParam === 'expression' ? 'expression' : 'word');
  
  // Context에서 데이터와 함수 가져오기
  const { words, expressions, addWord, addExpression } = useData();
  
  // 단어 상태
  const [currentWord, setCurrentWord] = useState({
    polish: '',
    english: '',
    example: '',
    notes: ''
  });
  
  // 표현 상태
  const [currentExpression, setCurrentExpression] = useState({
    polish: '',
    english: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // 파일 가져오기용 ref
  const fileInputRef = useRef(null);

  const validateWord = () => {
    const errors = {};
    if (!currentWord.polish.trim()) errors.polish = "Polish vocabulary is required";
    if (!currentWord.english.trim()) errors.english = "English translation is required";
    return errors;
  };

  const validateExpression = () => {
    const errors = {};
    if (!currentExpression.polish.trim()) errors.polish = "Polish expression is required";
    if (!currentExpression.english.trim()) errors.english = "English translation is required";
    return errors;
  };

  const handleWordChange = (e) => {
    const { name, value } = e.target;
    setCurrentWord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpressionChange = (e) => {
    const { name, value } = e.target;
    setCurrentExpression(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveWord = () => {
    const validationErrors = validateWord();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Context의 addWord 함수를 사용하여 단어 추가
    addWord(currentWord);
    
    // 폼 초기화
    setCurrentWord({
      polish: '',
      english: '',
      example: '',
      notes: ''
    });
    
    setErrors({});
    alert('단어가 성공적으로 저장되었습니다!');
  };

  const saveExpression = () => {
    const validationErrors = validateExpression();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Context의 addExpression 함수를 사용하여 표현 추가
    addExpression(currentExpression);
    
    // 폼 초기화
    setCurrentExpression({
      polish: '',
      english: '',
      notes: ''
    });
    
    setErrors({});
    alert('표현이 성공적으로 저장되었습니다!');
  };

  return (
    <div className={styles.contentManager}>
      <div className={styles.header}>
        <h1>Add Polish Learning Content</h1>
        <p>Add vocabulary and expressions to your Polish learning collection</p>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${mode === 'word' ? styles.active : ''}`}
          onClick={() => setMode('word')}
        >
          Add Vocabulary
        </button>
        <button 
          className={`${styles.tab} ${mode === 'expression' ? styles.active : ''}`}
          onClick={() => setMode('expression')}
        >
          Add Expression
        </button>
      </div>
      
      {mode === 'word' ? (
        <div className={styles.wordForm}>
          <h2>Add New Polish Vocabulary</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="polish">Polish Vocabulary:</label>
            <input
              type="text"
              id="polish"
              name="polish"
              value={currentWord.polish}
              onChange={handleWordChange}
              placeholder="e.g., książka"
            />
            {errors.polish && <div className={styles.error}>{errors.polish}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="english">Meaning:</label>
            <input
              type="text"
              id="english"
              name="english"
              value={currentWord.english}
              onChange={handleWordChange}
              placeholder="e.g., book"
            />
            {errors.english && <div className={styles.error}>{errors.english}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="example">Example Sentence (optional):</label>
            <textarea
              id="example"
              name="example"
              value={currentWord.example}
              onChange={handleWordChange}
              placeholder="e.g., Ta książka jest interesująca."
              rows="3"
            ></textarea>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes (optional):</label>
            <textarea
              id="notes"
              name="notes"
              value={currentWord.notes}
              onChange={handleWordChange}
              placeholder="Any additional notes about this word..."
              rows="2"
            ></textarea>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.saveButton}
              onClick={saveWord}
            >
              Save Word
            </button>
          </div>
          
          <div className={styles.recentItems}>
            <h3>Recently Added Vocabulary</h3>
            {words.length === 0 ? (
              <p className={styles.noItems}>No vocabulary added yet</p>
            ) : (
              <div className={styles.itemsList}>
                {words.slice(-5).reverse().map((word) => (
                  <div key={word.id} className={styles.item}>
                    <span className={styles.itemPolish}>{word.polish}</span>
                    <span className={styles.itemDivider}>-</span>
                    <span className={styles.itemEnglish}>{word.english}</span>
                  </div>
                ))}
                <Link to="/words" className={styles.viewAllLink}>View all</Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.expressionForm}>
          <h2>Add New Polish Expression</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="polish-expr">Polish Expression:</label>
            <textarea
              id="polish-expr"
              name="polish"
              value={currentExpression.polish}
              onChange={handleExpressionChange}
              placeholder="e.g., Nie ma za co"
              rows="2"
            ></textarea>
            {errors.polish && <div className={styles.error}>{errors.polish}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="english-expr">Meaning:</label>
            <textarea
              id="english-expr"
              name="english"
              value={currentExpression.english}
              onChange={handleExpressionChange}
              placeholder="e.g., You're welcome / Don't mention it"
              rows="2"
            ></textarea>
            {errors.english && <div className={styles.error}>{errors.english}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="notes-expr">Notes (optional):</label>
            <textarea
              id="notes-expr"
              name="notes"
              value={currentExpression.notes}
              onChange={handleExpressionChange}
              placeholder="Any additional notes about this expression..."
              rows="2"
            ></textarea>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.saveButton}
              onClick={saveExpression}
            >
              Save Expression
            </button>
          </div>
          
          <div className={styles.recentItems}>
            <h3>Recently Added Expressions</h3>
            {expressions.length === 0 ? (
              <p className={styles.noItems}>No expressions added yet</p>
            ) : (
              <div className={styles.itemsList}>
                {expressions.slice(-5).reverse().map((expression) => (
                  <div key={expression.id} className={styles.item}>
                    <span className={styles.itemPolish}>{expression.polish}</span>
                    <span className={styles.itemDivider}>-</span>
                    <span className={styles.itemEnglish}>{expression.english}</span>
                  </div>
                ))}
                <Link to="/expressions" className={styles.viewAllLink}>View all</Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={styles.navigation}>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default ContentManager;
