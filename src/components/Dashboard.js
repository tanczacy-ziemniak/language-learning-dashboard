import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Log something to help with debugging
  console.log('Dashboard rendering, useData:', useData);
  
  const { 
    words, 
    expressions, 
    streak, 
    wrongAnswers,
    exportAllData, 
    importAllData 
  } = useData();
  
  // Log the values to check
  console.log('Dashboard data:', { words, expressions, streak, wrongAnswers });
  
  const fileInputRef = useRef(null);
  
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = importAllData(event.target.result);
      
      if (result === true) {
        alert('Data successfully imported!');
      } else if (result && result.error) {
        alert(`Data import error: ${result.error}`);
      }
      
      // Reset file input
      fileInputRef.current.value = '';
    };
    
    reader.readAsText(file);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Polish Learning Dashboard</h1>
        <p>Track your progress and take quizzes to improve your Polish language skills</p>
      </div>

      <div className={styles.statsSection}>
        <h2>Your Progress</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📚</div>
            <div className={styles.statTitle}>Words</div>
            <div className={styles.statNumber}>{words.length}</div>
            <Link to="/words" className={styles.statLink}>View all words →</Link>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💬</div>
            <div className={styles.statTitle}>Expressions</div>
            <div className={styles.statNumber}>{expressions.length}</div>
            <Link to="/expressions" className={styles.statLink}>View all expressions →</Link>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔥</div>
            <div className={styles.statTitle}>Daily Streak</div>
            <div className={styles.statNumber}>{streak}</div>
            <div className={styles.statSubtext}>
              days in a row
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backupSection}>
        <h2>데이터 백업 및 복원</h2>
        <div className={styles.backupCard}>
          <p>모든 학습 데이터(단어, 표현, 스트릭, 노트 등)을 한 번에 백업하거나 복원할 수 있습니다.</p>
          
          <div className={styles.backupButtons}>
            <button 
              className={styles.exportButton}
              onClick={exportAllData}
              disabled={words.length === 0 && expressions.length === 0}
            >
              모든 데이터 내보내기
            </button>
            
            <div className={styles.importWrapper}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportData}
                accept=".json"
                id="import-all-data"
                className={styles.fileInput}
              />
              <label htmlFor="import-all-data" className={styles.importButton}>
                데이터 가져오기
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.quizSection}>
        <h2>How Far Can You Go?</h2>
        <div className={styles.quizCards}>
          <div className={styles.quizCard}>
            <h3>Words Challenge</h3>
            <p>Test your knowledge on all {words.length} Polish words you've learned</p>
            <Link to="/quiz?type=word&mode=all" className="btn btn-primary">
              Start Words Quiz
            </Link>
          </div>
          
          <div className={styles.quizCard}>
            <h3>Expressions Challenge</h3>
            <p>Test your knowledge on all {expressions.length} Polish expressions you've learned</p>
            <Link to="/quiz?type=expression&mode=all" className="btn btn-primary">
              Start Expressions Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.wrongAnswersSection}>
        <h2>Words & Expressions to Review</h2>
        {(wrongAnswers.words.length === 0 && wrongAnswers.expressions.length === 0) ? (
          <div className="card">
            <p>No difficult words or expressions yet. Take some quizzes to see what you need to practice!</p>
          </div>
        ) : (
          <div className={styles.reviewCards}>
            {wrongAnswers.words.length > 0 && (
              <div className={styles.reviewCard}>
                <h3>Difficult Words</h3>
                <ul className={styles.reviewList}>
                  {wrongAnswers.words.slice(0, 3).map((item, index) => (
                    <li key={index} className={styles.reviewItem}>
                      <span className={styles.reviewPolish}>{item.polish}</span>
                      <span className={styles.reviewEnglish}>{item.english}</span>
                      <span className={styles.reviewCount}>
                        Missed {item.count} {item.count === 1 ? 'time' : 'times'}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/quiz?type=word&mode=review" className="btn btn-secondary">
                  Practice Difficult Words
                </Link>
              </div>
            )}
            
            {wrongAnswers.expressions.length > 0 && (
              <div className={styles.reviewCard}>
                <h3>Difficult Expressions</h3>
                <ul className={styles.reviewList}>
                  {wrongAnswers.expressions.slice(0, 3).map((item, index) => (
                    <li key={index} className={styles.reviewItem}>
                      <span className={styles.reviewPolish}>{item.polish}</span>
                      <span className={styles.reviewEnglish}>{item.english}</span>
                      <span className={styles.reviewCount}>
                        Missed {item.count} {item.count === 1 ? 'time' : 'times'}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/quiz?type=expression&mode=review" className="btn btn-secondary">
                  Practice Difficult Expressions
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.addContentSection}>
        <h2>Expand Your Polish Vocabulary</h2>
        <div className={styles.addButtons}>
          <Link to="/content-manager" className="btn btn-primary">
            Add New Words
          </Link>
          <Link to="/content-manager?tab=expression" className="btn btn-primary">
            Add New Expressions
          </Link>
          <Link to="/notes" className="btn btn-secondary">
            View Your Notes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
