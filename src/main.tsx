"use client";

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { Toaster } from "sonner";
import { DialogProvider } from './contexts/DialogContext';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <DialogProvider>
        <Toaster position="top-right" />
        <App />
      </DialogProvider>
    </HelmetProvider>
  </React.StrictMode>
);
