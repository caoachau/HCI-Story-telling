import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './screens.css';
import './motion.css';
import { installDetailBridge } from './utils/detailBridge';

createRoot(document.getElementById('root')!).render(<App />);
installDetailBridge();

