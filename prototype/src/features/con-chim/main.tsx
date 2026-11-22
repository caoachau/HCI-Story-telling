import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { installDetailBridge } from './utils/detailBridge';
import { installExperienceBridge } from '../../experience/state';
import { ExperienceTools } from '../../experience/ExperienceTools';
import { RecoveryBoundary } from '../../experience/RecoveryBoundary';
import { AudioExperience } from '../../audio/AudioExperience';
installExperienceBridge();

createRoot(document.getElementById('root')!).render(<RecoveryBoundary><AudioExperience siteId="con-chim"><App /><ExperienceTools siteId="con-chim" /></AudioExperience></RecoveryBoundary>);
installDetailBridge();

