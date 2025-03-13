import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import styles from './NotesPage.module.css';

const NotesPage = () => {
  const { notes, saveNotes } = useData();
  const [notesList, setNotesList] = useState(notes?.list || []);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    // Initialize the notes list from context if available
    if (notes && notes.list) {
      setNotesList(notes.list);
    }
  }, [notes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSaveNote = () => {
    if (!currentNote.title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    let updatedNotes;
    
    if (isEditing && currentNote.id !== null) {
      // Update existing note
      updatedNotes = notesList.map(note => 
        note.id === currentNote.id ? { ...currentNote } : note
      );
    } else {
      // Create new note with a unique ID
      const newNote = { 
        ...currentNote, 
        id: Date.now(), 
        createdAt: new Date().toISOString()
      };
      updatedNotes = [...notesList, newNote];
    }

    // Save to context
    saveNotes({ list: updatedNotes });
    setNotesList(updatedNotes);
    
    // Reset current note form
    setCurrentNote({ title: '', content: '', id: null });
    setIsEditing(false);
    setIsSaved(true);
    alert('Your note has been saved!');
  };

  const editNote = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
    setIsSaved(true);
  };

  return (
    <div className={styles.notesPage}>
      <div className={styles.header}>
        <h1>Polish Learning Notes</h1>
        <p>Keep track of important grammar rules, tips, or anything else you want to remember</p>
      </div>

      <div className={styles.notesContainer}>
        <div className={styles.noteForm}>
          <h2>{isEditing ? 'Edit Note' : 'Create New Note'}</h2>
          <input
            type="text"
            name="title"
            value={currentNote.title}
            onChange={handleInputChange}
            placeholder="Enter note title"
            className={styles.titleInput}
          />
          <textarea
            name="content"
            value={currentNote.content}
            onChange={handleInputChange}
            placeholder="Start typing your note content here. For example:
            
• Conjugation rules for -ać verbs
• Polish cases and when to use them
• Common phrases for ordering food
• Grammar exceptions to remember"
            className={styles.contentInput}
          ></textarea>
          
          <div className={styles.notesActions}>
            {isEditing && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setCurrentNote({ title: '', content: '', id: null });
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            )}
            <button 
              className={`btn btn-primary ${isSaved && isEditing ? styles.saved : ''}`}
              onClick={handleSaveNote}
            >
              {isEditing ? (isSaved ? 'Saved ✓' : 'Update Note') : 'Save Note'}
            </button>
          </div>
        </div>
        
        <div className={styles.notesList}>
          <h2>Your Notes</h2>
          {notesList.length === 0 ? (
            <p className={styles.emptyMessage}>No notes yet. Create your first note!</p>
          ) : (
            <div className={styles.notesGrid}>
              {notesList.map(note => (
                <div key={note.id} className={styles.noteCard} onClick={() => editNote(note)}>
                  <h3>{note.title}</h3>
                  <p>{note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}</p>
                  <div className={styles.noteCardFooter}>
                    <span className={styles.noteDate}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
