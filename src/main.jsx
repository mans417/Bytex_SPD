import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/tailwind.css';
import './styles/index.css';

console.log('Main.jsx is running');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('React render called');
} catch (error) {
  console.error('React render failed:', error);
  document.getElementById('root').innerHTML = '<div style="color:red">Failed to start app: ' + error.message + '</div>';
}