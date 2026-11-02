import React from 'react';
import { KioskDiscovery } from './components/KioskDiscovery';
import { usePreferences } from '../../experience/preferences';
import { EnglishExperience } from '../../experience/EnglishExperience';

export default function App() {
  const prefs = usePreferences();
  return prefs.lang === 'en' ? <EnglishExperience siteId="con-chim" /> : <KioskDiscovery/>;
}
