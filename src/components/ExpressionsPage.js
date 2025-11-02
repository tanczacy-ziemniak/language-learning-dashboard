import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import styles from './ExpressionsPage.module.css';

const ExpressionsPage = () => {
  const { expressions, deleteExpression } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'polish', 'english'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  const handleDeleteExpression = (id) => {
    if (window.confirm('Are you sure you want to delete this expression?')) {
      deleteExpression(id);
    }
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // If clicking the same column, toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a different column, set it as the sort column
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Filter expressions based on search term
  const filteredExpressions = expressions.filter(expression => 
    expression.polish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expression.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort expressions based on sort criteria
  const sortedExpressions = [...filteredExpressions].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'dateAdded') {
      comparison = a.id - b.id;
    } else if (sortBy === 'polish') {
      comparison = a.polish.localeCompare(b.polish);
    } else if (sortBy === 'english') {
      comparison = a.english.localeCompare(b.english);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className={styles.expressionsPage}>
      <div className={styles.header}>
        <h1>Polish Expressions Collection</h1>
        <p>All the Polish expressions you've added to your collection</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search expressions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.count}>
          {filteredExpressions.length} {filteredExpressions.length === 1 ? 'expression' : 'expressions'}
        </div>
        <Link to="/content-manager?tab=expression" className="btn btn-primary">
          Add New Expression
        </Link>
      </div>

      {expressions.length === 0 ? (
        <div className="card">
          <h3>No Contents</h3>
          <p>Start adding Polish expressions!</p>
        </div>
      ) : (
        <>
          {filteredExpressions.length === 0 ? (
            <div className="card">
              <h3>No Matching Expressions</h3>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className={styles.expressionsGrid}>
              {sortedExpressions.map(expression => (
                <div key={expression.id} className={styles.expressionCard}>
                  <div className={styles.expressionPolish}>{expression.polish}</div>
                  <div className={styles.expressionEnglish}>{expression.english}</div>
                  
                  {expression.notes && (
                    <div className={styles.expressionNotes}>
                      <strong>Notes:</strong> {expression.notes}
                    </div>
                  )}
                  
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteExpression(expression.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpressionsPage;
