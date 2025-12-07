import React from 'react';
   import { createRoot } from 'react-dom/client';
   import { Provider } from 'react-redux';
   import { BrowserRouter } from 'react-router-dom'; // ודא שהוא מיובא
   import store from './features/common/store.js';
   import './index.css';
   import App from './features/common/App.jsx';

   const root = createRoot(document.getElementById('root')); // משתמשים ב-createRoot
   root.render(
       <Provider store={store}>
           <BrowserRouter>
               <App />
           </BrowserRouter>
       </Provider>
   );
