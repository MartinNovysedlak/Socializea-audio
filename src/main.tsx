"use client";

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from "sonner";
import { DialogProvider } from './contexts/DialogContext';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DialogProvider>
      <Toaster position="top-right" />
      <App />
    </DialogProvider>
  </React.StrictMode>
);