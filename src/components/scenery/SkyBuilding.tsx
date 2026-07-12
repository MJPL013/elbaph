import { PANTONE_INSPIRED } from "../../game/palette";
import { InkOutline } from "../InkOutline";

export type BuildingVariant = "spire" | "stack" | "shrine" | "tower";

type SkyBuildingProps = {
  color: string;
  height: number;
  variant: BuildingVariant;
};

export function SkyBuilding({ color, height, variant }: SkyBuildingProps) {
  const width = variant === "tower" ? 0.18 : 0.24;
  const roofColor = variant === "shrine" ? PANTONE_INSPIRED.peachDeep : color;

  return (
    <group userData={{ sceneryMesh: true }}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial color={color} roughness={0.74} />
        <InkOutline thickness={0.022} />
      </mesh>
      {variant === "stack" ? <StackTrim height={height} /> : null}
      {variant === "spire" ? <SpireRoof height={height} color={roofColor} /> : null}
      {variant === "shrine" ? <ShrineRoof height={height} color={roofColor} /> : null}
      {variant === "tower" ? <TowerTop height={height} color={roofColor} /> : null}
    </group>
  );
}

function StackTrim({ height }: { height: number }) {
  return (
    <>
      {[0.22, 0.5, 0.78].map((ratio) => (
        <mesh key={ratio} position={[0, height * ratio - height / 2, -0.126]}>
          <boxGeometry args={[0.22, 0.035, 0.018]} />
          <meshStandardMaterial color={PANTONE_INSPIRED.ink} roughness={0.7} />
        </mesh>
      ))}
    </>
  );
}

function SpireRoof({ height, color }: { height: number; color: string }) {
  return (
    <mesh position={[0, height / 2 + 0.1, 0]} castShadow>
      <coneGeometry args={[0.18, 0.24, 4]} />
      <meshStandardMaterial color={color} roughness={0.68} />
      <InkOutline thickness={0.018} />
    </mesh>
  );
}

function ShrineRoof({ height, color }: { height: number; color: string }) {
  return (
    <mesh position={[0, height / 2 + 0.06, 0]} castShadow>
      <boxGeometry args={[0.38, 0.08, 0.3]} />
      <meshStandardMaterial color={color} roughness={0.72} />
      <InkOutline thickness={0.018} />
    </mesh>
  );
}

function TowerTop({ height, color }: { height: number; color: string }) {
  return (
    <mesh position={[0, height / 2 + 0.06, 0]} castShadow>
      <cylinderGeometry args={[0.13, 0.16, 0.12, 6]} />
      <meshStandardMaterial color={color} roughness={0.72} />
      <InkOutline thickness={0.016} />
    </mesh>
  );
}
