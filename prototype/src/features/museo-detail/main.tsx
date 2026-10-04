import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MuseumDetailPage } from "./MuseumDetailPage";

document.documentElement.classList.add("museo-document");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MuseumDetailPage onClose={() => window.location.assign("/")} />
  </StrictMode>,
);
