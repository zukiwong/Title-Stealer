import React from 'react';
import ReactDOM from 'react-dom/client';
import { StolenTitles } from './pages/StolenTitles';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StolenTitles />
  </React.StrictMode>
);