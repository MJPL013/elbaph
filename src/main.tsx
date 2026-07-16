import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { preloadAvatarModel } from "./components/visuals/avatar/avatarAsset";
import "./styles.css";

preloadAvatarModel();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
