import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import './index.css';
import App from './App.jsx';
import AppRoutes from './config/Routes.jsx';
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from './Context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <Toaster position="top-center"/>
      <ChatProvider>
      <AppRoutes/>
      </ChatProvider>
    </BrowserRouter>

);
