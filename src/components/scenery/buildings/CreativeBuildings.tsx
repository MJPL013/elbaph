import { PANTONE_INSPIRED } from "../../../game/palette";
import { DecalPanel, SolarPanel, ToonBlock, ToonCone, ToonCylinder } from "./BuildingKit";
import type { BuildingProps } from "./BuildingKit";

export function SolarHouseBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "solar-house" }}>
      <ToonBlock position={[0, -0.1, 0]} scale={[0.58, 0.4, 0.46]} color={PANTONE_INSPIRED.cloudWarm} />
      <ToonBlock position={[0, 0.14, 0]} scale={[0.7, 0.09, 0.56]} color={color} rotation={[0, 0, 0.08]} />
      <SolarPanel position={[-0.18, 0.23, -0.08]} rotation={[0.16, 0, 0.08]} />
      <SolarPanel position={[0.15, 0.24, -0.08]} rotation={[0.16, 0, 0.08]} />
      <ToonCylinder position={[0.28, 0.22, -0.16]} radius={0.08} height={0.08} color={PANTONE_INSPIRED.gold} sides={12} />
      <ToonBlock position={[0.28, 0.12, -0.16]} scale={[0.04, 0.16, 0.04]} color={PANTONE_INSPIRED.mochaDeep} />
      <DecalPanel theme={decalTheme} y={-0.16} />
    </group>
  );
}

export function ChallengePodiumBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "challenge-podium" }}>
      <ToonBlock position={[0, -0.22, 0]} scale={[0.54, 0.18, 0.44]} color={PANTONE_INSPIRED.mochaDeep} />
      <ToonBlock position={[-0.18, -0.04, 0]} scale={[0.16, 0.34, 0.32]} color={color} />
      <ToonBlock position={[0, 0.02, 0]} scale={[0.18, 0.46, 0.34]} color={PANTONE_INSPIRED.gold} />
      <ToonBlock position={[0.18, -0.08, 0]} scale={[0.16, 0.26, 0.32]} color={PANTONE_INSPIRED.peach} />
      <ToonCylinder position={[0, 0.32, -0.05]} radius={0.07} height={0.1} color={PANTONE_INSPIRED.cloudWarm} sides={5} />
      <ToonBlock position={[0, 0.16, -0.28]} scale={[0.24, 0.04, 0.035]} color={PANTONE_INSPIRED.ink} />
      <DecalPanel theme={decalTheme} y={-0.24} />
    </group>
  );
}

export function ResearchObservatoryBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "research-observatory" }}>
      <ToonCylinder position={[0, -0.12, 0]} radius={0.24} height={0.42} color={color} sides={10} />
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.cloudWarm} roughness={0.66} />
      </mesh>
      <ToonBlock position={[0.2, 0.24, -0.17]} scale={[0.27, 0.06, 0.08]} color={PANTONE_INSPIRED.graphite} rotation={[0.2, -0.5, -0.25]} />
      <ToonCone position={[0.34, 0.28, -0.26]} radius={0.08} height={0.16} color={PANTONE_INSPIRED.blue} sides={12} />
      <DecalPanel theme={decalTheme} y={-0.17} />
    </group>
  );
}

export function PersonalStudioBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "personal-studio" }}>
      <ToonBlock position={[0, -0.1, 0]} scale={[0.54, 0.42, 0.46]} color={color} />
      <ToonBlock position={[0, 0.15, 0]} scale={[0.62, 0.08, 0.52]} color={PANTONE_INSPIRED.graphite} />
      <ToonBlock position={[-0.16, 0.02, -0.28]} scale={[0.13, 0.16, 0.04]} color={PANTONE_INSPIRED.teal} />
      <ToonCylinder position={[0.14, 0.02, -0.29]} radius={0.07} height={0.04} color={PANTONE_INSPIRED.gold} sides={10} />
      <ToonBlock position={[0.14, -0.07, -0.29]} scale={[0.22, 0.04, 0.04]} color={PANTONE_INSPIRED.ink} />
      <DecalPanel theme={decalTheme} y={-0.16} />
    </group>
  );
}
