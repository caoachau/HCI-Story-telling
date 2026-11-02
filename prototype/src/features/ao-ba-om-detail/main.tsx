import React from 'react';
import ReactDOM from 'react-dom/client';
import { AoBaOmMuseumKiosk } from './AoBaOmMuseumKiosk';
import '../../index.css';
import { installExperienceBridge } from '../../experience/state';
import { ExperienceTools } from '../../experience/ExperienceTools';
import { RecoveryBoundary } from '../../experience/RecoveryBoundary';
installExperienceBridge();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoveryBoundary><AoBaOmMuseumKiosk isStandalone={true} /><ExperienceTools siteId="ao-ba-om" /></RecoveryBoundary>
  </React.StrictMode>
);
