import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import App from './App.tsx';
import './index.css';
import './map-interface.css';
import { installExperienceBridge } from './experience/state';
import { RecoveryBoundary } from './experience/RecoveryBoundary';
installExperienceBridge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoveryBoundary><App /></RecoveryBoundary>
  </StrictMode>,
);
