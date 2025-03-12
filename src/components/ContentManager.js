import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ContentManager.module.css';

const ContentManager = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState({
    id: '',
    title: '',
    description: '',
    icon: '🇵🇱',
    level: 'Beginner',
    sections: [{ title: '', content: '' }]
  });
  const [currentQuiz, setCurrentQuiz] = useState({
    title: '',
    description: '',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      }
    ]
  });
  const [mode, setMode] = useState('topic'); // 'topic' or 'quiz'
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [errors, setErrors] = useState({});

  // Load saved topics from localStorage
  useEffect(() => {
    const savedTopics = localStorage.getItem('custom-polish-topics');
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    }
  }, []);

  // Save topics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('custom-polish-topics', JSON.stringify(topics));
  }, [topics]);

  const validateTopic = () => {
    const errors = {};
    if (!currentTopic.id.trim()) errors.id = "ID is required";
    if (!currentTopic.title.trim()) errors.title = "Title is required";
    if (!currentTopic.description.trim()) errors.description = "Description is required";
    
    // Validate each section
    const sectionErrors = [];
    currentTopic.sections.forEach((section, index) => {
      const sectionError = {};
      if (!section.title.trim()) sectionError.title = "Section title is required";
      if (!section.content.trim()) sectionError.content = "Section content is required";
      if (Object.keys(sectionError).length > 0) {
        sectionErrors[index] = sectionError;
      }
    });
    
    if (sectionErrors.length > 0) errors.sections = sectionErrors;
    
    return errors;
  };

  const validateQuiz = () => {
    const errors = {};
    if (!currentQuiz.title.trim()) errors.title = "Title is required";
    if (!currentQuiz.description.trim()) errors.description = "Description is required";
    
    // Validate each question
    const questionErrors = [];
    currentQuiz.questions.forEach((question, index) => {
      const qError = {};
      if (!question.question.trim()) qError.question = "Question text is required";
      
      if (question.type === 'multiple-choice') {
        // Check if options are filled and correct answer is set
        let hasEmptyOption = false;
        question.options.forEach((option, i) => {
          if (!option.trim()) hasEmptyOption = true;
        });
        if (hasEmptyOption) qError.options = "All options must be filled";
        if (!question.options.includes(question.correctAnswer)) {
          qError.correctAnswer = "Correct answer must be one of the options";
        }
      } else if (question.type === 'fill-blank') {
        if (!question.correctAnswer.trim()) {
          qError.correctAnswer = "Correct answer is required";
        }
      }
      
      if (Object.keys(qError).length > 0) {
        questionErrors[index] = qError;
      }
    });
    
    if (questionErrors.length > 0) errors.questions = questionErrors;
    
    return errors;
  };

  const handleTopicChange = (e) => {
    const { name, value } = e.target;
    setCurrentTopic(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setCurrentTopic(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const addSection = () => {
    setCurrentTopic(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }]
    }));
  };

  const removeSection = (index) => {
    setCurrentTopic(prev => {
      const updatedSections = [...prev.sections];
      updatedSections.splice(index, 1);
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuiz(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setCurrentQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setCurrentQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = value;
      
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions
      };
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const handleQuestionTypeChange = (index, type) => {
    setCurrentQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      
      // Create a new question with the selected type
      let newQuestion;
      
      if (type === 'multiple-choice') {
        newQuestion = {
          ...updatedQuestions[index],
          type,
          options: updatedQuestions[index].options || ['', '', '', ''],
          correctAnswer: ''
        };
      } else if (type === 'fill-blank') {
        newQuestion = {
          ...updatedQuestions[index],
          type,
          correctAnswer: ''
        };
      } else if (type === 'matching') {
        newQuestion = {
          ...updatedQuestions[index],
          type,
          pairs: [
            { item: '', match: '' },
            { item: '', match: '' }
          ]
        };
      }
      
      updatedQuestions[index] = newQuestion;
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const addQuestion = () => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions, 
        {
          id: prev.questions.length + 1,
          type: 'multiple-choice',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setCurrentQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      // Re-assign IDs
      updatedQuestions.forEach((q, i) => {
        q.id = i + 1;
      });
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const addPair = (questionIndex) => {
    setCurrentQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      
      if (question.type === 'matching') {
        updatedQuestions[questionIndex] = {
          ...question,
          pairs: [...question.pairs, { item: '', match: '' }]
        };
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const removePair = (questionIndex, pairIndex) => {
    setCurrentQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      
      if (question.type === 'matching') {
        const updatedPairs = [...question.pairs];
        updatedPairs.splice(pairIndex, 1);
        
        updatedQuestions[questionIndex] = {
          ...question,
          pairs: updatedPairs
        };
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const handlePairChange = (questionIndex, pairIndex, field, value) => {
    setCurrentQuiz(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      
      if (question.type === 'matching') {
        const updatedPairs = [...question.pairs];
        updatedPairs[pairIndex] = {
          ...updatedPairs[pairIndex],
          [field]: value
        };
        
        updatedQuestions[questionIndex] = {
          ...question,
          pairs: updatedPairs
        };
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const saveTopic = () => {
    const validationErrors = validateTopic();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if topic with this ID already exists
    const existingTopicIndex = topics.findIndex(t => t.id === currentTopic.id);

    let updatedTopics;
    if (existingTopicIndex >= 0) {
      // Update existing topic
      updatedTopics = [...topics];
      updatedTopics[existingTopicIndex] = currentTopic;
    } else {
      // Add new topic
      updatedTopics = [...topics, currentTopic];
    }

    setTopics(updatedTopics);
    
    // Reset form
    setCurrentTopic({
      id: '',
      title: '',
      description: '',
      icon: '🇵🇱',
      level: 'Beginner',
      sections: [{ title: '', content: '' }]
    });
    
    setErrors({});
    alert('Topic saved successfully!');
  };

  const saveQuiz = () => {
    const validationErrors = validateQuiz();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Find the topic to add/update quiz for
    const updatedTopics = [...topics];
    const topicIndex = updatedTopics.findIndex(t => t.id === selectedTopicId);
    
    if (topicIndex >= 0) {
      // Add quiz to the topic
      const updatedTopic = {
        ...updatedTopics[topicIndex],
        quiz: currentQuiz
      };
      
      updatedTopics[topicIndex] = updatedTopic;
      setTopics(updatedTopics);
      
      // Reset form
      setCurrentQuiz({
        title: '',
        description: '',
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
          }
        ]
      });
      
      setSelectedTopicId(null);
      setErrors({});
      alert('Quiz saved successfully!');
    } else {
      alert('Please select a topic first!');
    }
  };

  const editTopic = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      setCurrentTopic(topic);
      setMode('topic');
    }
  };

  const editQuiz = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic && topic.quiz) {
      setCurrentQuiz(topic.quiz);
      setSelectedTopicId(topicId);
      setMode('quiz');
    } else if (topic) {
      // Create a new quiz for this topic
      setCurrentQuiz({
        title: `${topic.title} Quiz`,
        description: `Test your knowledge of ${topic.title}`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
          }
        ]
      });
      setSelectedTopicId(topicId);
      setMode('quiz');
    }
  };

  const deleteTopic = (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
      setTopics(topics.filter(t => t.id !== topicId));
    }
  };

  return (
    <div className={styles.contentManager}>
      <div className={styles.header}>
        <h1>Polish Learning Content Manager</h1>
        <p>Create and manage your custom Polish language learning materials</p>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${mode === 'topic' ? styles.active : ''}`}
          onClick={() => setMode('topic')}
        >
          Create Topic
        </button>
        <button 
          className={`${styles.tab} ${mode === 'quiz' ? styles.active : ''}`}
          onClick={() => setMode('quiz')}
        >
          Create Quiz
        </button>
      </div>
      
      {mode === 'topic' ? (
        <div className={styles.topicForm}>
          <h2>Create/Edit Topic</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="id">Topic ID (unique identifier, no spaces):</label>
            <input
              type="text"
              id="id"
              name="id"
              value={currentTopic.id}
              onChange={handleTopicChange}
              placeholder="e.g., polish-greetings"
            />
            {errors.id && <div className={styles.error}>{errors.id}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Topic Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={currentTopic.title}
              onChange={handleTopicChange}
              placeholder="e.g., Polish Greetings"
            />
            {errors.title && <div className={styles.error}>{errors.title}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={currentTopic.description}
              onChange={handleTopicChange}
              placeholder="Describe what this topic covers"
              rows="3"
            ></textarea>
            {errors.description && <div className={styles.error}>{errors.description}</div>}
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="icon">Icon:</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={currentTopic.icon}
                onChange={handleTopicChange}
                placeholder="Emoji or icon character"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="level">Level:</label>
              <select
                id="level"
                name="level"
                value={currentTopic.level}
                onChange={handleTopicChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <h3>Learning Sections</h3>
          {currentTopic.sections.map((section, index) => (
            <div key={index} className={styles.sectionContainer}>
              <h4>Section {index + 1}</h4>
              
              <div className={styles.formGroup}>
                <label htmlFor={`section-title-${index}`}>Section Title:</label>
                <input
                  type="text"
                  id={`section-title-${index}`}
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                  placeholder="e.g., Common Greetings"
                />
                {errors.sections && errors.sections[index] && errors.sections[index].title && 
                  <div className={styles.error}>{errors.sections[index].title}</div>
                }
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor={`section-content-${index}`}>Content:</label>
                <textarea
                  id={`section-content-${index}`}
                  value={section.content}
                  onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                  placeholder="The learning content for this section"
                  rows="4"
                ></textarea>
                {errors.sections && errors.sections[index] && errors.sections[index].content && 
                  <div className={styles.error}>{errors.sections[index].content}</div>
                }
              </div>
              
              {currentTopic.sections.length > 1 && (
                <button 
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeSection(index)}
                >
                  Remove Section
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button"
            className={styles.addButton}
            onClick={addSection}
          >
            Add Section
          </button>
          
          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.saveButton}
              onClick={saveTopic}
            >
              Save Topic
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.quizForm}>
          <h2>Create/Edit Quiz</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="topic-select">Select Topic:</label>
            <select
              id="topic-select"
              value={selectedTopicId || ''}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              <option value="">-- Select a topic --</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
          
          {selectedTopicId && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="quiz-title">Quiz Title:</label>
                <input
                  type="text"
                  id="quiz-title"
                  name="title"
                  value={currentQuiz.title}
                  onChange={handleQuizChange}
                  placeholder="e.g., Polish Greetings Quiz"
                />
                {errors.title && <div className={styles.error}>{errors.title}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="quiz-description">Description:</label>
                <textarea
                  id="quiz-description"
                  name="description"
                  value={currentQuiz.description}
                  onChange={handleQuizChange}
                  placeholder="Describe what this quiz tests"
                  rows="3"
                ></textarea>
                {errors.description && <div className={styles.error}>{errors.description}</div>}
              </div>
              
              <h3>Questions</h3>
              {currentQuiz.questions.map((question, qIndex) => (
                <div key={qIndex} className={styles.questionContainer}>
                  <h4>Question {qIndex + 1}</h4>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`question-type-${qIndex}`}>Question Type:</label>
                    <select
                      id={`question-type-${qIndex}`}
                      value={question.type}
                      onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="fill-blank">Fill in the Blank</option>
                      <option value="matching">Matching</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`question-text-${qIndex}`}>Question Text:</label>
                    <textarea
                      id={`question-text-${qIndex}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      placeholder="Enter your question here"
                      rows="2"
                    ></textarea>
                    {errors.questions && errors.questions[qIndex] && errors.questions[qIndex].question && 
                      <div className={styles.error}>{errors.questions[qIndex].question}</div>
                    }
                  </div>
                  
                  {question.type === 'multiple-choice' && (
                    <div className={styles.optionsContainer}>
                      <label>Options:</label>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className={styles.optionGroup}>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                          />
                          <label>
                            <input
                              type="radio"
                              name={`correct-answer-${qIndex}`}
                              checked={question.correctAnswer === option}
                              onChange={() => handleQuestionChange(qIndex, 'correctAnswer', option)}
                              disabled={!option.trim()}
                            />
                            Correct
                          </label>
                        </div>
                      ))}
                      {errors.questions && errors.questions[qIndex] && errors.questions[qIndex].options && 
                        <div className={styles.error}>{errors.questions[qIndex].options}</div>
                      }
                      {errors.questions && errors.questions[qIndex] && errors.questions[qIndex].correctAnswer && 
                        <div className={styles.error}>{errors.questions[qIndex].correctAnswer}</div>
                      }
                    </div>
                  )}
                  
                  {question.type === 'fill-blank' && (
                    <div className={styles.formGroup}>
                      <label htmlFor={`correct-answer-${qIndex}`}>Correct Answer:</label>
                      <input
                        type="text"
                        id={`correct-answer-${qIndex}`}
                        value={question.correctAnswer || ''}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                        placeholder="Enter the correct answer"
                      />
                      {errors.questions && errors.questions[qIndex] && errors.questions[qIndex].correctAnswer && 
                        <div className={styles.error}>{errors.questions[qIndex].correctAnswer}</div>
                      }
                    </div>
                  )}
                  
                  {question.type === 'matching' && (
                    <div className={styles.matchingContainer}>
                      <label>Matching Pairs:</label>
                      {question.pairs && question.pairs.map((pair, pIndex) => (
                        <div key={pIndex} className={styles.pairGroup}>
                          <input
                            type="text"
                            value={pair.item}
                            onChange={(e) => handlePairChange(qIndex, pIndex, 'item', e.target.value)}
                            placeholder="Item (left side)"
                          />
                          <span className={styles.pairArrow}>→</span>
                          <input
                            type="text"
                            value={pair.match}
                            onChange={(e) => handlePairChange(qIndex, pIndex, 'match', e.target.value)}
                            placeholder="Match (right side)"
                          />
                          {question.pairs.length > 2 && (
                            <button
                              type="button"
                              className={styles.removeSmallButton}
                              onClick={() => removePair(qIndex, pIndex)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.addSmallButton}
                        onClick={() => addPair(qIndex)}
                      >
                        Add Pair
                      </button>
                    </div>
                  )}
                  
                  {currentQuiz.questions.length > 1 && (
                    <button 
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeQuestion(qIndex)}
                    >
                      Remove Question
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button"
                className={styles.addButton}
                onClick={addQuestion}
              >
                Add Question
              </button>
              
              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.saveButton}
                  onClick={saveQuiz}
                >
                  Save Quiz
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className={styles.topicList}>
        <h2>Your Polish Learning Topics</h2>
        {topics.length === 0 ? (
          <p className={styles.noTopics}>No topics yet. Create your first Polish learning topic!</p>
        ) : (
          <div className={styles.topicsGrid}>
            {topics.map(topic => (
              <div key={topic.id} className={styles.topicCard}>
                <div className={styles.cardIcon}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <div className={styles.cardLevel}>{topic.level}</div>
                <p>{topic.description}</p>
                <div className={styles.cardStats}>
                  <span>{topic.sections.length} sections</span>
                  <span>{topic.quiz ? `${topic.quiz.questions.length} quiz questions` : 'No quiz'}</span>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => editTopic(topic.id)}>Edit Topic</button>
                  <button onClick={() => editQuiz(topic.id)}>{topic.quiz ? 'Edit Quiz' : 'Add Quiz'}</button>
                  <button onClick={() => deleteTopic(topic.id)} className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.navigation}>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default ContentManager;
