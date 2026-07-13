import { Antenna, DecalPanel, SharedToonMaterial, ToonBlock, ToonCone, ToonCylinder } from "./BuildingKit";
import type { BuildingProps } from "./BuildingKit";

export function SpawnPavilionBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "spawn-pavilion" }}>
      <ToonCylinder position={[0, -0.16, 0]} radius={0.28} height={0.28} material={primaryMaterial} sides={8} />
      <ToonBlock position={[0, 0.03, 0]} scale={[0.7, 0.08, 0.58]} material="concrete.warm" />
      <ToonCone position={[0, 0.22, 0]} radius={0.4} height={0.25} material="roof.teal" sides={8} />
      <ToonBlock position={[-0.2, -0.02, -0.26]} scale={[0.06, 0.28, 0.05]} material="wood.cedar" />
      <ToonBlock position={[0.2, -0.02, -0.26]} scale={[0.06, 0.28, 0.05]} material="wood.cedar" />
      <DecalPanel theme={decalTheme} y={-0.16} />
    </group>
  );
}

export function SkillsTowerBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "skills-tower" }}>
      <ToonCylinder position={[0, -0.12, 0]} radius={0.22} height={0.62} material={primaryMaterial} sides={6} />
      <ToonBlock position={[0, 0.24, 0]} scale={[0.48, 0.08, 0.48]} material="concrete.warm" />
      <ToonBlock position={[-0.12, 0.08, -0.26]} scale={[0.09, 0.09, 0.04]} material="metal.energy" />
      <ToonBlock position={[0.03, -0.04, -0.27]} scale={[0.09, 0.09, 0.04]} material="concrete.sage" />
      <ToonBlock position={[0.15, 0.09, -0.26]} scale={[0.09, 0.09, 0.04]} material="concrete.coral" />
      <Antenna x={0} y={0.38} material="roof.teal" />
      <DecalPanel theme={decalTheme} y={-0.2} />
    </group>
  );
}

export function ContactBeaconBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "contact-beacon" }}>
      <ToonCylinder position={[0, -0.18, 0]} radius={0.22} height={0.32} material={primaryMaterial} sides={8} />
      <ToonCylinder position={[0, 0.08, 0]} radius={0.14} height={0.34} material="concrete.warm" sides={10} />
      <ToonCone position={[0, 0.34, 0]} radius={0.18} height={0.22} material="metal.energy" sides={10} />
      <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.28, 0.012, 6, 36]} />
        <SharedToonMaterial material="roof.teal" />
      </mesh>
      <ToonBlock position={[-0.08, 0.03, -0.2]} scale={[0.18, 0.1, 0.035]} material="metal.graphite" />
      <ToonBlock position={[0.08, 0.03, -0.2]} scale={[0.18, 0.1, 0.035]} material="concrete.warm" />
      <DecalPanel theme={decalTheme} y={-0.22} />
    </group>
  );
}
