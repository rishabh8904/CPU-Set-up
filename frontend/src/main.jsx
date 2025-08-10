import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home.jsx';
import App from './App.jsx';
import SavedBuilds from './SavedBuilds.jsx';

const router = createBrowserRouter([
  {
    path: "/", 
    element: <Home />,
  },
  {
    path: "/builder", 
    element: <App />,
  },
  {
    path: "/builds",
    element: <SavedBuilds />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);