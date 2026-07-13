import { SharedToonMaterial } from "./buildings/BuildingKit";

type DistrictPadProps = {
  radius?: number;
  y?: number;
};

export function DistrictPad({ radius = 0.52, y = -0.38 }: DistrictPadProps) {
  return (
    <group userData={{ sceneryMesh: true }}>
      <mesh position={[0, y, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.86, 0.08, 8]} />
        <SharedToonMaterial material="concrete.warm" />
      </mesh>
      <mesh position={[radius * 0.58, y + 0.01, radius * 0.1]}>
        <sphereGeometry args={[0.13, 8, 6]} />
        <SharedToonMaterial material="stone.warm" />
      </mesh>
      <mesh position={[-radius * 0.48, y + 0.01, -radius * 0.16]}>
        <sphereGeometry args={[0.11, 8, 6]} />
        <SharedToonMaterial material="stone.warm" />
      </mesh>
    </group>
  );
}
