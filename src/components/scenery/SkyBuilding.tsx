import type { ElbaphMaterialId } from "../../art/materials/materialTypes";
import { SharedToonMaterial } from "./buildings/BuildingKit";

export type BuildingVariant = "spire" | "stack" | "shrine" | "tower";

type SkyBuildingProps = {
  material: ElbaphMaterialId;
  height: number;
  variant: BuildingVariant;
};

export function SkyBuilding({ material, height, variant }: SkyBuildingProps) {
  const width = variant === "tower" ? 0.18 : 0.24;
  const roofMaterial = variant === "shrine" ? "roof.terracotta" : material;

  return (
    <group userData={{ sceneryMesh: true }}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, width]} />
        <SharedToonMaterial material={material} />
      </mesh>
      {variant === "stack" ? <StackTrim height={height} /> : null}
      {variant === "spire" ? <SpireRoof height={height} material={roofMaterial} /> : null}
      {variant === "shrine" ? <ShrineRoof height={height} material={roofMaterial} /> : null}
      {variant === "tower" ? <TowerTop height={height} material={roofMaterial} /> : null}
    </group>
  );
}

function StackTrim({ height }: { height: number }) {
  return (
    <>
      {[0.22, 0.5, 0.78].map((ratio) => (
        <mesh key={ratio} position={[0, height * ratio - height / 2, -0.126]}>
          <boxGeometry args={[0.22, 0.035, 0.018]} />
          <SharedToonMaterial material="metal.graphite" />
        </mesh>
      ))}
    </>
  );
}

function SpireRoof({ height, material }: RoofProps) {
  return (
    <mesh position={[0, height / 2 + 0.1, 0]} castShadow>
      <coneGeometry args={[0.18, 0.24, 4]} />
      <SharedToonMaterial material={material} />
    </mesh>
  );
}

function ShrineRoof({ height, material }: RoofProps) {
  return (
    <mesh position={[0, height / 2 + 0.06, 0]} castShadow>
      <boxGeometry args={[0.38, 0.08, 0.3]} />
      <SharedToonMaterial material={material} />
    </mesh>
  );
}

function TowerTop({ height, material }: RoofProps) {
  return (
    <mesh position={[0, height / 2 + 0.06, 0]} castShadow>
      <cylinderGeometry args={[0.13, 0.16, 0.12, 6]} />
      <SharedToonMaterial material={material} />
    </mesh>
  );
}

type RoofProps = {
  height: number;
  material: ElbaphMaterialId;
};
