import {
  Antenna,
  DecalPanel,
  SharedToonMaterial,
  ToonBlock,
  ToonCylinder,
} from "./BuildingKit";
import type { BuildingProps } from "./BuildingKit";
import { KazamHeroBuilding } from "./KazamHeroBuilding";

export function KazamBuilding({ lowQuality }: BuildingProps) {
  return <KazamHeroBuilding lowQuality={lowQuality} />;
}

export function SatelliteLabBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "satellite-lab" }}>
      <ToonCylinder position={[0, -0.08, 0]} radius={0.24} height={0.58} material={primaryMaterial} sides={8} />
      <ToonBlock position={[0, 0.24, 0]} scale={[0.42, 0.08, 0.42]} material="concrete.warm" />
      <ToonBlock position={[0, 0.37, -0.06]} scale={[0.04, 0.28, 0.04]} material="metal.graphite" />
      <mesh position={[0, 0.54, -0.12]} rotation={[Math.PI / 2.6, 0, 0]} castShadow>
        <coneGeometry args={[0.18, 0.12, 16, 1, true]} />
        <SharedToonMaterial material="concrete.warm" />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.32, 0.012, 6, 36]} />
        <SharedToonMaterial material="metal.energy" />
      </mesh>
      <DecalPanel theme={decalTheme} y={-0.08} />
    </group>
  );
}

export function NaxxatraBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "learning-clubhouse" }}>
      <ToonBlock position={[0, -0.07, 0]} scale={[0.58, 0.46, 0.48]} material={primaryMaterial} />
      <ToonBlock position={[0, 0.2, -0.01]} scale={[0.68, 0.1, 0.58]} material="concrete.coral" rotation={[0, 0, 0.08]} />
      <ToonBlock position={[-0.18, 0.04, -0.28]} scale={[0.12, 0.12, 0.04]} material="concrete.warm" />
      <ToonBlock position={[0.18, 0.04, -0.28]} scale={[0.12, 0.12, 0.04]} material="concrete.sage" />
      <ToonCylinder position={[0, 0.3, -0.05]} radius={0.06} height={0.08} material="metal.energy" sides={5} />
      <Antenna x={0.24} y={0.28} material="concrete.coral" />
      <DecalPanel theme={decalTheme} y={-0.11} />
    </group>
  );
}
