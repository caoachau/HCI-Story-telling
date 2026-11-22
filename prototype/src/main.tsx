import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import App from './App.tsx';
import './index.css';
import './map-interface.css';
import { installExperienceBridge } from './experience/state';
import { RecoveryBoundary } from './experience/RecoveryBoundary';
import { AudioExperience } from './audio/AudioExperience';
installExperienceBridge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoveryBoundary><AudioExperience><App /></AudioExperience></RecoveryBoundary>
  </StrictMode>,
);
