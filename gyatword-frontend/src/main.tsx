import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress specific warnings temporarily
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Support for defaultProps will be removed from function components')
  ) {
    return; // Suppress this specific warning
  }
  originalConsoleError(...args); // Let other warnings pass through
};

createRoot(document.getElementById('root')!).render(
    <App />
)
