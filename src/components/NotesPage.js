import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import styles from './NotesPage.module.css';

const NotesPage = () => {
  const { notes, saveNotes } = useData();
  const [localNotes, setLocalNotes] = useState(notes);
  const [isSaved, setIsSaved] = useState(true);

  const handleNotesChange = (e) => {
    setLocalNotes(e.target.value);
    setIsSaved(false);
  };

  const handleSaveNotes = () => {
    saveNotes(localNotes);
    setIsSaved(true);
    alert('Your notes have been saved!');
  };

  return (
    <div className={styles.notesPage}>
      <div className={styles.header}>
        <h1>Polish Learning Notes</h1>
        <p>Keep track of important grammar rules, tips, or anything else you want to remember</p>
      </div>

      <div className={styles.notesContainer}>
        <div className={styles.notesEditor}>
          <textarea
            value={localNotes}
            onChange={handleNotesChange}
            placeholder="Start typing your notes here. For example:
            
• Conjugation rules for -ać verbs
• Polish cases and when to use them
• Common phrases for ordering food
• Grammar exceptions to remember"
          ></textarea>
        </div>
        
        <div className={styles.notesActions}>
          <button 
            className={`btn btn-primary ${isSaved ? styles.saved : ''}`}
            onClick={handleSaveNotes}
          >
            {isSaved ? 'Saved ✓' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
