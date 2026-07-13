import type { Mesh } from "three";
import { FILLER_BUILDINGS, LANDMARKS } from "../game/landmarkData";
import type { QualityTier } from "../hooks/useQualityTier";
import { FillerBuilding } from "./FillerBuilding";
import { LandmarkBox } from "./LandmarkBox";

type LandmarksProps = {
  debugVisible: boolean;
  qualityTier: QualityTier;
  registerCollider: (id: string, collider: Mesh | null) => void;
};

export function Landmarks({ debugVisible, qualityTier, registerCollider }: LandmarksProps) {
  const fillerBuildings = FILLER_BUILDINGS.filter((building, index) => {
    if (qualityTier !== "low") return true;
    return building.collidable || index % 2 === 0;
  });

  return (
    <>
      {LANDMARKS.map((landmark) => (
        <LandmarkBox
          key={landmark.id}
          debugVisible={debugVisible}
          landmark={landmark}
          qualityTier={qualityTier}
          registerCollider={registerCollider}
        />
      ))}
      {fillerBuildings.map((building) => (
        <FillerBuilding
          key={building.id}
          debugVisible={debugVisible}
          building={building}
          registerCollider={registerCollider}
        />
      ))}
    </>
  );
}
