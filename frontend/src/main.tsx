import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position={`top-right`}
      toastOptions={{
        duration: 3000,
        style: { background: '#333', color: '#fff' },
        success: {
          iconTheme: {
            primary: '#4ade80',
            secondary: '#1e3a8a',
          },
        },
      }}
    />
  </StrictMode>
);
