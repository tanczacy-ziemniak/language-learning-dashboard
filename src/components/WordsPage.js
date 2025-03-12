import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import styles from './WordsPage.module.css';

const WordsPage = () => {
  const { words, deleteWord } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'polish', 'english'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  const handleDeleteWord = (id) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      deleteWord(id);
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

  // Filter words based on search term
  const filteredWords = words.filter(word => 
    word.polish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort words based on sort criteria
  const sortedWords = [...filteredWords].sort((a, b) => {
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
    <div className={styles.wordsPage}>
      <div className={styles.header}>
        <h1>Polish Words Collection</h1>
        <p>All the Polish words you've added to your collection</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.count}>
          {filteredWords.length} {filteredWords.length === 1 ? 'word' : 'words'}
        </div>
        <Link to="/content-manager" className="btn btn-primary">
          Add New Word
        </Link>
      </div>

      {words.length === 0 ? (
        <div className="card">
          <h3>No Words Yet</h3>
          <p>Start adding Polish words to your collection!</p>
          <Link to="/content-manager" className="btn btn-primary">
            Add Your First Word
          </Link>
        </div>
      ) : (
        <>
          {filteredWords.length === 0 ? (
            <div className="card">
              <h3>No Matching Words</h3>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className={styles.wordsTable}>
              <table>
                <thead>
                  <tr>
                    <th 
                      className={sortBy === 'polish' ? styles.sorted : ''}
                      onClick={() => handleSortChange('polish')}
                    >
                      Polish 
                      {sortBy === 'polish' && (
                        <span className={styles.sortIcon}>
                          {sortOrder === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                    <th 
                      className={sortBy === 'english' ? styles.sorted : ''}
                      onClick={() => handleSortChange('english')}
                    >
                      English
                      {sortBy === 'english' && (
                        <span className={styles.sortIcon}>
                          {sortOrder === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                    <th>Example</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedWords.map(word => (
                    <tr key={word.id}>
                      <td className={styles.polish}>{word.polish}</td>
                      <td>{word.english}</td>
                      <td className={styles.example}>{word.example}</td>
                      <td className={styles.notes}>{word.notes}</td>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteWord(word.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WordsPage;
