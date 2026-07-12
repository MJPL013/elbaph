import { PANTONE_INSPIRED } from "../../../game/palette";
import { Antenna, DecalPanel, ToonBlock, ToonCone, ToonCylinder } from "./BuildingKit";
import type { BuildingProps } from "./BuildingKit";

export function SpawnPavilionBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "spawn-pavilion" }}>
      <ToonCylinder position={[0, -0.16, 0]} radius={0.28} height={0.28} color={color} sides={8} />
      <ToonBlock position={[0, 0.03, 0]} scale={[0.7, 0.08, 0.58]} color={PANTONE_INSPIRED.cloudWarm} />
      <ToonCone position={[0, 0.22, 0]} radius={0.4} height={0.25} color={PANTONE_INSPIRED.tealDeep} sides={8} />
      <ToonBlock position={[-0.2, -0.02, -0.26]} scale={[0.06, 0.28, 0.05]} color={PANTONE_INSPIRED.mochaDeep} />
      <ToonBlock position={[0.2, -0.02, -0.26]} scale={[0.06, 0.28, 0.05]} color={PANTONE_INSPIRED.mochaDeep} />
      <DecalPanel theme={decalTheme} y={-0.16} />
    </group>
  );
}

export function SkillsTowerBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "skills-tower" }}>
      <ToonCylinder position={[0, -0.12, 0]} radius={0.22} height={0.62} color={color} sides={6} />
      <ToonBlock position={[0, 0.24, 0]} scale={[0.48, 0.08, 0.48]} color={PANTONE_INSPIRED.cloudWarm} />
      <ToonBlock position={[-0.12, 0.08, -0.26]} scale={[0.09, 0.09, 0.04]} color={PANTONE_INSPIRED.gold} />
      <ToonBlock position={[0.03, -0.04, -0.27]} scale={[0.09, 0.09, 0.04]} color={PANTONE_INSPIRED.mint} />
      <ToonBlock position={[0.15, 0.09, -0.26]} scale={[0.09, 0.09, 0.04]} color={PANTONE_INSPIRED.rose} />
      <Antenna x={0} y={0.38} color={PANTONE_INSPIRED.tealDeep} />
      <DecalPanel theme={decalTheme} y={-0.2} />
    </group>
  );
}

export function ContactBeaconBuilding({ color, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "contact-beacon" }}>
      <ToonCylinder position={[0, -0.18, 0]} radius={0.22} height={0.32} color={color} sides={8} />
      <ToonCylinder position={[0, 0.08, 0]} radius={0.14} height={0.34} color={PANTONE_INSPIRED.cloudWarm} sides={10} />
      <ToonCone position={[0, 0.34, 0]} radius={0.18} height={0.22} color={PANTONE_INSPIRED.gold} sides={10} />
      <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.28, 0.012, 6, 36]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.teal} roughness={0.5} />
      </mesh>
      <ToonBlock position={[-0.08, 0.03, -0.2]} scale={[0.18, 0.1, 0.035]} color={PANTONE_INSPIRED.ink} />
      <ToonBlock position={[0.08, 0.03, -0.2]} scale={[0.18, 0.1, 0.035]} color={PANTONE_INSPIRED.cloudWarm} />
      <DecalPanel theme={decalTheme} y={-0.22} />
    </group>
  );
}
