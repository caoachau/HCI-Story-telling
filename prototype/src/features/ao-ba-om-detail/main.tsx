import React from 'react';
import ReactDOM from 'react-dom/client';
import { AoBaOmMuseumKiosk } from './AoBaOmMuseumKiosk';
import '../../index.css';
import { installExperienceBridge } from '../../experience/state';
import { ExperienceTools } from '../../experience/ExperienceTools';
import { RecoveryBoundary } from '../../experience/RecoveryBoundary';
import { AudioExperience } from '../../audio/AudioExperience';
installExperienceBridge();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoveryBoundary><AudioExperience siteId="ao-ba-om"><AoBaOmMuseumKiosk isStandalone={true} /><ExperienceTools siteId="ao-ba-om" /></AudioExperience></RecoveryBoundary>
  </React.StrictMode>
);
