import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css'

/*
 * Application Entry Point (main.jsx)
 * Mounts the top-level React component tree to the target root DOM container in index.html.
 * Applies global styles and enables React.StrictMode to detect potential side-effects during development.
 * 
 * Reference: Standard React 18/Vite application bootstrapping (React, 2026).
 */

// Initialize the React root at the DOM node with id 'root' and render the primary App component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)