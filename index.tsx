import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const router = createHashRouter(
  [
    // Use a wildcard so paths like '/error=...' and OAuth callback fragments land inside App
    { path: '/*', element: <App /> }
  ],
  { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
);

root.render(
  <RouterProvider router={router} />
);