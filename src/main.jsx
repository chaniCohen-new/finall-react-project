import React from 'react';
   import { createRoot } from 'react-dom/client';
   import { Provider } from 'react-redux';
   import store from './features/common/store.js';
   import './index.css';
   import App from './features/common/App.jsx';

   const root = createRoot(document.getElementById('root')); // משתמשים ב-createRoot
   root.render(
     <Provider store={store}>
         <App />
     </Provider>
   );