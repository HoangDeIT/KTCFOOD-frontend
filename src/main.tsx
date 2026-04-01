import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import AppProvider from './context/AppProvider';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>

  </StrictMode>,
)
