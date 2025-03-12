import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuizPage from './components/QuizPage';
import TopicPage from './components/TopicPage';
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
          <Route path="topics/:topicId" element={<TopicPage />} />
          <Route path="quiz/:topicId" element={<QuizPage />} />
          <Route path="content-manager" element={<ContentManager />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
