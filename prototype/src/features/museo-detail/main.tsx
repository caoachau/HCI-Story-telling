import { StrictMode, useEffect } from "react";
import { KHMER_MUSEUM_NAME } from "../../data/museumIdentity";
import { createRoot } from "react-dom/client";
import { MuseumDetailPage } from "./MuseumDetailPage";
import { installExperienceBridge } from '../../experience/state';
import { ExperienceTools } from '../../experience/ExperienceTools';
import { usePreferences } from '../../experience/preferences';
import { RecoveryBoundary } from '../../experience/RecoveryBoundary';
import { AudioExperience } from '../../audio/AudioExperience';
installExperienceBridge();
function MuseumEntry() {
  const prefs = usePreferences();
  useEffect(() => { document.title = KHMER_MUSEUM_NAME[prefs.lang]; }, [prefs.lang]);
  return <RecoveryBoundary><MuseumDetailPage lang={prefs.lang} onClose={() => window.location.assign(new URL('index.html', location.href).href)} /><ExperienceTools siteId="bao-tang-khmer" /></RecoveryBoundary>;
}

document.documentElement.classList.add("museo-document");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AudioExperience siteId="bao-tang-khmer"><MuseumEntry /></AudioExperience>
  </StrictMode>,
);
