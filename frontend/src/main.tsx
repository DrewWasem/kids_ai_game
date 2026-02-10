import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { loadDemoCache } from './services/cache';
import demoCache from './data/demo-cache.json';

// Load pre-generated Golden Response Cache on startup
loadDemoCache(demoCache as Parameters<typeof loadDemoCache>[0]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
