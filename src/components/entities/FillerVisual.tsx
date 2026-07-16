import type { FillerBuildingDefinition } from "../../world/landmarkData";
import { DistrictPad } from "../scenery/DistrictPad";
import { SceneryProps } from "../scenery/SceneryProps";
import { SkyBuilding } from "../scenery/SkyBuilding";

export function FillerVisual({ building }: { building: FillerBuildingDefinition }) {
  return (
    <group userData={{ entityVisual: "filler" }}>
      <DistrictPad radius={0.36} y={-building.height / 2 - 0.03} />
      <SkyBuilding
        material={building.materialTheme}
        height={building.height}
        variant={building.variant}
      />
      <SceneryProps cluster={building.propCluster} />
    </group>
  );
}
