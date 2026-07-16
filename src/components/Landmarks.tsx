import { FILLER_BUILDINGS, LANDMARKS } from "../world/landmarkData";
import type { ColliderRegistry, VisualQuality } from "../types/worldContracts";
import { FillerBuilding } from "./FillerBuilding";
import { LandmarkBox } from "./LandmarkBox";

type LandmarksProps = {
  debugVisible: boolean;
  qualityTier: VisualQuality;
  registerCollider: ColliderRegistry["register"];
};

export function Landmarks({
  debugVisible,
  qualityTier,
  registerCollider,
}: LandmarksProps) {
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
