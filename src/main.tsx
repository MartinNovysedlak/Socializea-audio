"use client";

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from "sonner";
import { DialogProvider } from './contexts/DialogContext';
import { CartProvider } from './contexts/CartContext';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DialogProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <App />
      </CartProvider>
    </DialogProvider>
  </React.StrictMode>
);