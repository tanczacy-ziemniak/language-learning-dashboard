import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ProgressProvider } from './contexts/ProgressContext';
import { DataProvider } from './contexts/DataContext';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <DataProvider>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
