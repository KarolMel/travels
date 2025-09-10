import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TravelProvider } from './context/TravelContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <TravelProvider userId={null}>
        <App />
      </TravelProvider>
    </AuthProvider>
  </React.StrictMode>,
);