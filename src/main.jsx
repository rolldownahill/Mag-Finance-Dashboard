import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { StockProvider } from './stockContext';  // Import StockProvider

// Wrap your App with StockProvider to provide the context
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StockProvider>  {/* Wrap App with StockProvider */}
      <App />
    </StockProvider>
  </StrictMode>
);
