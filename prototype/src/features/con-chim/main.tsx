import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { installDetailBridge } from './utils/detailBridge';
import { installExperienceBridge } from '../../experience/state';
import { ExperienceTools } from '../../experience/ExperienceTools';
import { RecoveryBoundary } from '../../experience/RecoveryBoundary';
installExperienceBridge();

createRoot(document.getElementById('root')!).render(<RecoveryBoundary><App /><ExperienceTools siteId="con-chim" /></RecoveryBoundary>);
installDetailBridge();

