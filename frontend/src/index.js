import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Entry point — mounts the React app into index.html's #root div
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
