import type { VisualQuality } from "../../types/worldContracts";
import { PANTONE_INSPIRED } from "../../game/palette";

export function WorldLighting({ quality }: { quality: VisualQuality }) {
  const shadowMapSize = quality === "high" ? 2048 : 1024;

  return (
    <>
      <ambientLight intensity={0.56} />
      <hemisphereLight
        args={[PANTONE_INSPIRED.cloudWarm, "#604f73", 1.18]}
      />
      <directionalLight
        position={[4.5, 7.5, 3.5]}
        intensity={2.65}
        color="#fff0cf"
        castShadow
        shadow-bias={-0.00045}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <directionalLight
        position={[-5, 3.5, -4]}
        intensity={quality === "low" ? 0.32 : 0.48}
        color="#8297e8"
      />
    </>
  );
}
