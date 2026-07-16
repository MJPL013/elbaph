import { RoundedBox } from "@react-three/drei";
import type { DecalTheme } from "../../../world/landmarkData";
import { useElbaphMaterial } from "../../../art/materials/ElbaphMaterialProvider";
import type { ElbaphMaterialId } from "../../../art/materials/materialTypes";
import { InkOutline } from "../../InkOutline";

export type BuildingProps = {
  primaryMaterial: ElbaphMaterialId;
  decalTheme: DecalTheme;
  lowQuality?: boolean;
};

type BlockProps = {
  position?: [number, number, number];
  scale: [number, number, number];
  material: ElbaphMaterialId;
  rotation?: [number, number, number];
  uvScale?: [number, number];
  lowOutline?: boolean;
};

export function ToonBlock({
  position = [0, 0, 0],
  scale,
  material,
  rotation,
  uvScale = [1, 1],
  lowOutline = false,
}: BlockProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      userData={{ elbaphMaterial: material, uvScale }}
    >
      <boxGeometry args={scale} />
      <SharedToonMaterial material={material} />
      {lowOutline ? <InkOutline thickness={0.014} /> : null}
    </mesh>
  );
}

export function ToonRoundedBlock({
  position = [0, 0, 0],
  scale,
  material,
  rotation,
  uvScale = [1, 1],
  lowOutline = false,
  radius = 0.025,
}: BlockProps & { radius?: number }) {
  return (
    <RoundedBox
      args={scale}
      position={position}
      rotation={rotation}
      radius={radius}
      smoothness={1}
      bevelSegments={1}
      castShadow
      receiveShadow
      userData={{ elbaphMaterial: material, uvScale }}
    >
      <SharedToonMaterial material={material} />
      {lowOutline ? <InkOutline thickness={0.014} /> : null}
    </RoundedBox>
  );
}
export function ToonCylinder({
  position = [0, 0, 0],
  radius = 0.12,
  height = 0.28,
  material,
  sides = 10,
  lowOutline = false,
}: {
  position?: [number, number, number];
  radius?: number;
  height?: number;
  material: ElbaphMaterialId;
  sides?: number;
  lowOutline?: boolean;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, sides]} />
      <SharedToonMaterial material={material} />
      {lowOutline ? <InkOutline thickness={0.013} /> : null}
    </mesh>
  );
}

export function ToonCone({
  position,
  radius,
  height,
  material,
  sides = 4,
  lowOutline = false,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  material: ElbaphMaterialId;
  sides?: number;
  lowOutline?: boolean;
}) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[radius, height, sides]} />
      <SharedToonMaterial material={material} />
      {lowOutline ? <InkOutline thickness={0.014} /> : null}
    </mesh>
  );
}

export function DecalPanel({ theme, y = 0.08 }: { theme: DecalTheme; y?: number }) {
  const material = DECAL_MATERIALS[theme];

  return (
    <group position={[0, y, -0.285]} userData={{ decalSlot: theme }}>
      <ToonBlock scale={[0.32, 0.22, 0.022]} material="concrete.warm" />
      <ToonBlock position={[0, 0, -0.016]} scale={[0.24, 0.055, 0.018]} material={material} />
      <ToonBlock position={[-0.07, 0.065, -0.018]} scale={[0.08, 0.04, 0.018]} material="metal.graphite" />
      <ToonBlock position={[0.08, -0.065, -0.018]} scale={[0.11, 0.035, 0.018]} material={material} />
    </group>
  );
}

export function Antenna({
  x = 0,
  y = 0.5,
  material = "metal.graphite",
}: {
  x?: number;
  y?: number;
  material?: ElbaphMaterialId;
}) {
  return (
    <group position={[x, y, 0]}>
      <ToonBlock scale={[0.025, 0.28, 0.025]} material={material} />
      <mesh position={[0, 0.16, -0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.01, 6, 20]} />
        <SharedToonMaterial material="metal.energy" />
      </mesh>
    </group>
  );
}

export function SolarPanel({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <ToonBlock scale={[0.28, 0.05, 0.2]} material="roof.teal" />
      <ToonBlock position={[-0.07, 0.032, 0]} scale={[0.018, 0.012, 0.18]} material="road.marking" />
      <ToonBlock position={[0.07, 0.032, 0]} scale={[0.018, 0.012, 0.18]} material="road.marking" />
    </group>
  );
}

export function SharedToonMaterial({ material }: { material: ElbaphMaterialId }) {
  return <primitive object={useElbaphMaterial(material)} attach="material" />;
}

const DECAL_MATERIALS: Record<DecalTheme, ElbaphMaterialId> = {
  energy: "metal.energy",
  thermal: "roof.terracotta",
  learning: "concrete.coral",
  civic: "wood.cedar",
  archive: "concrete.sage",
  agents: "concrete.coral",
  solar: "metal.energy",
  challenge: "roof.terracotta",
  research: "roof.teal",
  personal: "concrete.coral",
  identity: "concrete.sage",
  skills: "roof.teal",
  contact: "metal.graphite",
};
