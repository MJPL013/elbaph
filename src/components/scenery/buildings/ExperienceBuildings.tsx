import { PANTONE_INSPIRED } from "../../../game/palette";
import { Antenna, DecalPanel, ToonBlock, ToonCone, ToonCylinder } from "./BuildingKit";
import type { BuildingProps } from "./BuildingKit";

export function KazamBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "ev-charger" }}>
      <ToonBlock position={[0, -0.04, 0]} scale={[0.5, 0.56, 0.46]} color={color} />
      <ToonBlock position={[0, 0.27, 0]} scale={[0.6, 0.1, 0.54]} color={PANTONE_INSPIRED.graphite} />
      <ToonBlock position={[-0.18, 0.03, -0.28]} scale={[0.13, 0.34, 0.08]} color={PANTONE_INSPIRED.graphite} />
      <ToonBlock position={[-0.18, 0.11, -0.335]} scale={[0.08, 0.08, 0.035]} color={PANTONE_INSPIRED.teal} />
      <mesh position={[0.1, 0.08, -0.32]} rotation={[0, 0, -0.2]} castShadow>
        <torusGeometry args={[0.12, 0.014, 6, 28]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.ink} roughness={0.6} />
      </mesh>
      <ToonCone position={[0.18, 0.12, -0.34]} radius={0.08} height={0.2} color={PANTONE_INSPIRED.gold} sides={3} />
      <DecalPanel theme={decalTheme} y={-0.05} />
    </group>
  );
}

export function SatelliteLabBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "satellite-lab" }}>
      <ToonCylinder position={[0, -0.08, 0]} radius={0.24} height={0.58} color={color} sides={8} />
      <ToonBlock position={[0, 0.24, 0]} scale={[0.42, 0.08, 0.42]} color={PANTONE_INSPIRED.cloudWarm} />
      <ToonBlock position={[0, 0.37, -0.06]} scale={[0.04, 0.28, 0.04]} color={PANTONE_INSPIRED.ink} />
      <mesh position={[0, 0.54, -0.12]} rotation={[Math.PI / 2.6, 0, 0]} castShadow>
        <coneGeometry args={[0.18, 0.12, 16, 1, true]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.cloudWarm} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.32, 0.012, 6, 36]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.gold} roughness={0.52} />
      </mesh>
      <DecalPanel theme={decalTheme} y={-0.08} />
    </group>
  );
}

export function NaxxatraBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "learning-clubhouse" }}>
      <ToonBlock position={[0, -0.07, 0]} scale={[0.58, 0.46, 0.48]} color={color} />
      <ToonBlock position={[0, 0.2, -0.01]} scale={[0.68, 0.1, 0.58]} color={PANTONE_INSPIRED.peach} rotation={[0, 0, 0.08]} />
      <ToonBlock position={[-0.18, 0.04, -0.28]} scale={[0.12, 0.12, 0.04]} color={PANTONE_INSPIRED.cloudWarm} />
      <ToonBlock position={[0.18, 0.04, -0.28]} scale={[0.12, 0.12, 0.04]} color={PANTONE_INSPIRED.mint} />
      <ToonCylinder position={[0, 0.3, -0.05]} radius={0.06} height={0.08} color={PANTONE_INSPIRED.gold} sides={5} />
      <Antenna x={0.24} y={0.28} color={PANTONE_INSPIRED.violet} />
      <DecalPanel theme={decalTheme} y={-0.11} />
    </group>
  );
}
