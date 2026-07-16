import { useMemo } from "react";
import type { ElbaphMaterialId } from "../../../art/materials/materialTypes";
import type { VisualQuality } from "../../../types/worldContracts";
import { SharedToonMaterial } from "../../scenery/buildings/BuildingKit";
import { QUARTER_PATHS } from "./pathData";
import { createSurfaceCurve } from "./surfaceArc";

const PATH_MATERIALS: Record<string, ElbaphMaterialId> = {
  experience: "roof.teal",
  "ai-projects": "vegetation.deep",
  creative: "concrete.coral",
  contact: "metal.energy",
};

export function QuarterPaths({ quality }: { quality: VisualQuality }) {
  return (
    <group userData={{ fantasyPaths: true }}>
      {QUARTER_PATHS.map((path) => (
        <FantasyPath key={path.id} definition={path} quality={quality} />
      ))}
    </group>
  );
}

function FantasyPath({
  definition,
  quality,
}: {
  definition: (typeof QUARTER_PATHS)[number];
  quality: VisualQuality;
}) {
  const samples = quality === "low" ? 5 : 9;
  const curve = useMemo(
    () => createSurfaceCurve(definition, samples),
    [definition, samples],
  );
  const segments = Math.max(16, (definition.points.length - 1) * samples * 3);

  return (
    <mesh
      receiveShadow
      userData={{ fantasyPath: definition.id, sceneryMesh: true }}
    >
      <tubeGeometry args={[curve, segments, quality === "low" ? 0.03 : 0.04, 4, false]} />
      <SharedToonMaterial material={PATH_MATERIALS[definition.quarter]} />
    </mesh>
  );
}
