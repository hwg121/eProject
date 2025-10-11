import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App-simple.tsx';
import './index.css';
try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('❌ Error starting app:', error);
  
  // Fallback: show error message
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        padding: 20px; 
        text-align: center; 
        background: #fee2e2; 
        color: #dc2626; 
        border: 2px solid #fca5a5; 
        border-radius: 8px;
        margin: 20px;
        font-family: Arial, sans-serif;
      ">
        <h2>❌ Error Loading App</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Please check the console for more details.</p>
        <button onclick="location.reload()" style="
          background: #dc2626; 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          border-radius: 5px; 
          cursor: pointer;
          margin-top: 10px;
        ">Reload Page</button>
      </div>
    `;
  }
}
