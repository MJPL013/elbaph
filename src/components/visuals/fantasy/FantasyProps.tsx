import { useMemo } from "react";
import type {
  AmbientPlacement,
  AmbientPropKind,
  VisualQuality,
} from "../../../types/worldContracts";
import { AMBIENT_PLACEMENTS } from "./ambientData";
import { InstancedPart } from "./InstancedPart";

export function FantasyProps({ quality }: { quality: VisualQuality }) {
  const placements = useMemo(
    () => filterPlacements(AMBIENT_PLACEMENTS, quality),
    [quality],
  );
  const byKind = (kind: AmbientPropKind) =>
    placements.filter((placement) => placement.kind === kind);

  const trees = byKind("tree");
  const crystals = byKind("crystal");
  const mushrooms = byKind("mushroom");
  const rocks = byKind("rock");
  const lanterns = byKind("lantern");
  const grass = byKind("grass");
  const islands = byKind("island");

  return (
    <group
      userData={{
        fantasyProps: true,
        ambientPlacementCount: placements.length,
      }}
    >
      <InstancedPart placements={trees} shape="trunk" material="wood.cedar" offset={[0, 0.17, 0]} scale={[1, 1, 1]} />
      <InstancedPart placements={trees} shape="canopy" material="vegetation.leaf" offset={[0, 0.42, 0]} scale={[1.15, 1, 1.15]} />
      <InstancedPart placements={crystals} shape="crystal" material="glass.sky" offset={[0, 0.18, 0]} scale={[1, 1, 1]} />
      <InstancedPart placements={mushrooms} shape="stem" material="road.marking" offset={[0, 0.08, 0]} scale={[1, 1, 1]} />
      <InstancedPart placements={mushrooms} shape="cap" material="concrete.coral" offset={[0, 0.16, 0]} scale={[1, 0.72, 1]} />
      <InstancedPart placements={rocks} shape="rock" material="stone.warm" offset={[0, 0.09, 0]} scale={[1.25, 0.8, 1]} />
      <InstancedPart placements={lanterns} shape="pole" material="metal.graphite" offset={[0, 0.14, 0]} scale={[1, 1, 1]} />
      <InstancedPart placements={lanterns} shape="glow" material="metal.energy" offset={[0, 0.31, 0]} scale={[1, 1, 1]} />
      <InstancedPart placements={grass} shape="grass" material="vegetation.deep" offset={[0, 0.1, 0]} scale={[1, 1, 0.55]} />
      <InstancedPart placements={islands} shape="island-top" material="vegetation.leaf" offset={[0, 0.52, 0]} scale={[1.35, 1, 1.35]} />
      <InstancedPart placements={islands} shape="island-base" material="stone.warm" offset={[0, 0.28, 0]} scale={[1, 1, 1]} rotation={[0, 0, Math.PI]} />
    </group>
  );
}

function filterPlacements(
  placements: AmbientPlacement[],
  quality: VisualQuality,
) {
  if (quality === "high") return placements;
  if (quality === "medium") {
    return placements.filter((placement, index) =>
      placement.kind === "island" || placement.kind === "lantern" || index % 2 === 0,
    );
  }
  return placements.filter((placement, index) =>
    placement.kind === "island" ||
    placement.kind === "tree" ||
    placement.kind === "crystal" ||
    (placement.kind === "rock" && index % 2 === 0),
  );
}
