import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WordsPage from './components/WordsPage';
import ExpressionsPage from './components/ExpressionsPage';
import NotesPage from './components/NotesPage';
import QuizPage from './components/QuizPage';
import ContentManager from './components/ContentManager';
import NotFound from './components/NotFound';
import './App.css';

// For debugging
console.log('App component is loading');

function App() {
  console.log('App component is rendering');
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="words" element={<WordsPage />} />
          <Route path="expressions" element={<ExpressionsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="/content-manager" element={<ContentManager />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
