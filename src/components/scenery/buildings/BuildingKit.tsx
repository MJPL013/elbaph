import { PANTONE_INSPIRED } from "../../../game/palette";
import type { DecalTheme } from "../../../game/landmarkData";
import { InkOutline } from "../../InkOutline";

export type BuildingProps = {
  color: string;
  decalTheme: DecalTheme;
};

type BlockProps = {
  position?: [number, number, number];
  scale: [number, number, number];
  color: string;
  rotation?: [number, number, number];
};

export function ToonBlock({ position = [0, 0, 0], scale, color, rotation }: BlockProps) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color={color} roughness={0.72} />
      <InkOutline thickness={0.014} />
    </mesh>
  );
}

export function ToonCylinder({
  position = [0, 0, 0],
  radius = 0.12,
  height = 0.28,
  color,
  sides = 10,
}: {
  position?: [number, number, number];
  radius?: number;
  height?: number;
  color: string;
  sides?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, sides]} />
      <meshStandardMaterial color={color} roughness={0.7} />
      <InkOutline thickness={0.013} />
    </mesh>
  );
}

export function ToonCone({
  position,
  radius,
  height,
  color,
  sides = 4,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  color: string;
  sides?: number;
}) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[radius, height, sides]} />
      <meshStandardMaterial color={color} roughness={0.68} />
      <InkOutline thickness={0.014} />
    </mesh>
  );
}

export function DecalPanel({ theme, y = 0.08 }: { theme: DecalTheme; y?: number }) {
  const color = DECAL_COLORS[theme];

  return (
    <group position={[0, y, -0.285]} userData={{ decalSlot: theme }}>
      <ToonBlock scale={[0.32, 0.22, 0.022]} color={PANTONE_INSPIRED.cloudWarm} />
      <ToonBlock position={[0, 0, -0.016]} scale={[0.24, 0.055, 0.018]} color={color} />
      <ToonBlock position={[-0.07, 0.065, -0.018]} scale={[0.08, 0.04, 0.018]} color={PANTONE_INSPIRED.ink} />
      <ToonBlock position={[0.08, -0.065, -0.018]} scale={[0.11, 0.035, 0.018]} color={color} />
    </group>
  );
}

export function Antenna({ x = 0, y = 0.5, color = PANTONE_INSPIRED.ink }) {
  return (
    <group position={[x, y, 0]}>
      <ToonBlock scale={[0.025, 0.28, 0.025]} color={color} />
      <mesh position={[0, 0.16, -0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.01, 6, 20]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.gold} roughness={0.52} />
      </mesh>
    </group>
  );
}

export function SolarPanel({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <ToonBlock scale={[0.28, 0.05, 0.2]} color={PANTONE_INSPIRED.blueDeep} />
      <ToonBlock position={[-0.07, 0.032, 0]} scale={[0.018, 0.012, 0.18]} color={PANTONE_INSPIRED.cloud} />
      <ToonBlock position={[0.07, 0.032, 0]} scale={[0.018, 0.012, 0.18]} color={PANTONE_INSPIRED.cloud} />
    </group>
  );
}

const DECAL_COLORS: Record<DecalTheme, string> = {
  energy: PANTONE_INSPIRED.gold,
  thermal: PANTONE_INSPIRED.peachDeep,
  learning: PANTONE_INSPIRED.violet,
  civic: PANTONE_INSPIRED.mocha,
  archive: PANTONE_INSPIRED.mint,
  agents: PANTONE_INSPIRED.rose,
  solar: PANTONE_INSPIRED.gold,
  challenge: PANTONE_INSPIRED.peachDeep,
  research: PANTONE_INSPIRED.blue,
  personal: PANTONE_INSPIRED.violet,
  identity: PANTONE_INSPIRED.teal,
  skills: PANTONE_INSPIRED.tealDeep,
  contact: PANTONE_INSPIRED.graphite,
};
