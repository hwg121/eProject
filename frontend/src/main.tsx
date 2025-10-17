import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/performance.css';
import './styles/responsive.css';
import './styles/mobile-optimizations.css';
import './styles/slow-animations.css';
import { registerServiceWorker } from './utils/registerSW';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker in production
if (import.meta.env.PROD) {
  registerServiceWorker();
}
