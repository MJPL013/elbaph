import { Antenna, DecalPanel, ToonBlock, ToonCylinder } from "./BuildingKit";
import type { BuildingProps } from "./BuildingKit";

export function RajneetiBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "civic-terminal" }}>
      <ToonBlock position={[0, -0.08, 0]} scale={[0.54, 0.5, 0.44]} material={primaryMaterial} />
      <ToonBlock position={[0, 0.2, 0]} scale={[0.62, 0.08, 0.52]} material="concrete.warm" />
      <ToonBlock position={[-0.14, 0.08, -0.27]} scale={[0.12, 0.2, 0.04]} material="concrete.warm" />
      <ToonBlock position={[0.02, 0.03, -0.29]} scale={[0.18, 0.04, 0.04]} material="metal.graphite" />
      <ToonBlock position={[0.08, -0.06, -0.29]} scale={[0.22, 0.035, 0.04]} material="metal.graphite" />
      <Antenna x={0.22} y={0.28} />
      <DecalPanel theme={decalTheme} y={-0.13} />
    </group>
  );
}

export function VakyaSaarBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "archive-library" }}>
      <ToonBlock position={[0, -0.1, 0]} scale={[0.58, 0.44, 0.5]} material={primaryMaterial} />
      <ToonBlock position={[0, 0.15, 0]} scale={[0.66, 0.09, 0.56]} material="wood.cedar" />
      {[-0.18, 0, 0.18].map((x, index) => (
        <ToonBlock key={x} position={[x, 0.02 - index * 0.025, -0.29]} scale={[0.13, 0.28, 0.035]} material="concrete.warm" />
      ))}
      <ToonBlock position={[0.16, 0.28, -0.06]} scale={[0.22, 0.04, 0.14]} material="concrete.warm" rotation={[0.18, 0, -0.3]} />
      <ToonBlock position={[0.03, 0.36, -0.04]} scale={[0.18, 0.035, 0.12]} material="concrete.warm" rotation={[0.1, 0, 0.22]} />
      <DecalPanel theme={decalTheme} y={-0.15} />
    </group>
  );
}

export function PersonaBuilding({ primaryMaterial, decalTheme }: BuildingProps) {
  return (
    <group userData={{ portfolioBuilding: true, buildingArchetype: "agent-lab" }}>
      <ToonCylinder position={[0, -0.08, 0]} radius={0.26} height={0.48} material={primaryMaterial} sides={7} />
      <ToonBlock position={[0, 0.2, 0]} scale={[0.46, 0.08, 0.46]} material="metal.graphite" />
      <ToonCylinder position={[0, 0.36, 0]} radius={0.13} height={0.14} material="concrete.warm" sides={12} />
      <ToonCylinder position={[-0.2, 0.1, -0.26]} radius={0.05} height={0.08} material="roof.teal" sides={10} />
      <ToonCylinder position={[0.2, 0.08, -0.26]} radius={0.05} height={0.08} material="metal.energy" sides={10} />
      <ToonCylinder position={[0, -0.08, -0.27]} radius={0.05} height={0.08} material="concrete.sage" sides={10} />
      <ToonBlock position={[0, 0.03, -0.29]} scale={[0.28, 0.025, 0.035]} material="metal.graphite" rotation={[0, 0, 0.18]} />
      <ToonBlock position={[0, 0, -0.29]} scale={[0.26, 0.025, 0.035]} material="metal.graphite" rotation={[0, 0, -0.28]} />
      <DecalPanel theme={decalTheme} y={-0.18} />
    </group>
  );
}
