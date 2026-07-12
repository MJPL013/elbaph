import { PANTONE_INSPIRED } from "../../game/palette";
import { InkOutline } from "../InkOutline";

type DistrictPadProps = {
  radius?: number;
  y?: number;
};

export function DistrictPad({ radius = 0.52, y = -0.38 }: DistrictPadProps) {
  return (
    <group userData={{ sceneryMesh: true }}>
      <mesh position={[0, y, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.86, 0.08, 8]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.cloudWarm} roughness={0.8} />
        <InkOutline thickness={0.015} />
      </mesh>
      <mesh position={[radius * 0.58, y + 0.01, radius * 0.1]}>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.cloud} roughness={0.92} />
        <InkOutline thickness={0.012} />
      </mesh>
      <mesh position={[-radius * 0.48, y + 0.01, -radius * 0.16]}>
        <sphereGeometry args={[0.11, 8, 6]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.cloud} roughness={0.92} />
        <InkOutline thickness={0.012} />
      </mesh>
    </group>
  );
}
