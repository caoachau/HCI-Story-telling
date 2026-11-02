import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MuseumDetailPage } from "./MuseumDetailPage";
import { installExperienceBridge } from '../../experience/state';
import { ExperienceTools } from '../../experience/ExperienceTools';
import { usePreferences } from '../../experience/preferences';
import { RecoveryBoundary } from '../../experience/RecoveryBoundary';
installExperienceBridge();
function MuseumEntry() {
  const prefs = usePreferences();
  return <RecoveryBoundary><MuseumDetailPage lang={prefs.lang} onClose={() => window.location.assign(new URL('index.html', location.href).href)} /><ExperienceTools siteId="bao-tang-khmer" /></RecoveryBoundary>;
}

document.documentElement.classList.add("museo-document");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MuseumEntry />
  </StrictMode>,
);
