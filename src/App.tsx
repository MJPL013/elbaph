import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { DebugControls } from "./components/DebugControls";
import { InteractionOverlay } from "./components/InteractionOverlay";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { PointerJoystick } from "./components/PointerJoystick";
import { WebGLFallback } from "./components/WebGLFallback";
import { WorldHud } from "./components/WorldHud";
import { WorldScene } from "./components/WorldScene";
import { preloadAvatarModel } from "./game/avatarAsset";
import { useQualityTier } from "./hooks/useQualityTier";

export default function App() {
  const qualityTier = useQualityTier();

  useEffect(() => {
    preloadAvatarModel();
  }, []);

  if (!supportsWebGL()) return <WebGLFallback />;

  return (
    <>
      <Canvas
        shadows
        dpr={qualityTier === "low" ? [1, 1.25] : [1, 2]}
        camera={{ position: [0, 3.2, 3.6], fov: 42 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <WorldScene qualityTier={qualityTier} />
      </Canvas>
      <DebugControls />
      <WorldHud qualityTier={qualityTier} />
      <PointerJoystick />
      <InteractionOverlay />
      <LoadingOverlay />
    </>
  );
}

function supportsWebGL() {
  if (typeof document === "undefined") return true;

  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
}