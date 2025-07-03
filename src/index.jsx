import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './index.css';
import './i18n';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);