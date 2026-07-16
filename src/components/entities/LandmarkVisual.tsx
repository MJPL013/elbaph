import type { LandmarkDefinition } from "../../world/landmarkData";
import type { VisualQuality } from "../../types/worldContracts";
import { DistrictPad } from "../scenery/DistrictPad";
import { HeroLandmark } from "../scenery/HeroLandmark";
import { SceneryProps } from "../scenery/SceneryProps";

type LandmarkVisualProps = {
  landmark: LandmarkDefinition;
  label: string;
  height: number;
  quality: VisualQuality;
};

export function LandmarkVisual({
  landmark,
  label,
  height,
  quality,
}: LandmarkVisualProps) {
  return (
    <group userData={{ entityVisual: "landmark" }}>
      <DistrictPad radius={landmark.padRadius} y={-height / 2 - 0.03} />
      <HeroLandmark landmark={landmark} label={label} qualityTier={quality} />
      <SceneryProps cluster={landmark.propCluster} />
    </group>
  );
}
