import { Euler, Quaternion } from "three";
import type { ElbaphMaterialId } from "../../../art/materials/materialTypes";
import { PLANET_RADIUS } from "../../../game/constants";
import { sphericalSurfacePoint, surfaceQuaternion } from "../../../game/spherical";
import { SharedToonMaterial } from "../../scenery/buildings/BuildingKit";

type Patch = {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
  material: ElbaphMaterialId;
};

const PATCHES: Patch[] = [
  { id: "experience-grove", latitude: 56, longitude: -122, radius: 0.78, material: "roof.teal" },
  { id: "ai-crystal-garden", latitude: 36, longitude: -24, radius: 0.72, material: "vegetation.deep" },
  { id: "creative-meadow", latitude: -24, longitude: 68, radius: 0.78, material: "concrete.coral" },
  { id: "contact-spawn-garden", latitude: 72, longitude: 128, radius: 0.86, material: "wood.honey" },
];

export function BiomePatches() {
  return (
    <group userData={{ biomePatches: true }}>
      {PATCHES.map((patch) => {
        const normal = sphericalSurfacePoint(1, patch.latitude, patch.longitude);
        const position = normal.clone().multiplyScalar(PLANET_RADIUS + 0.012);
        const quaternion = surfaceQuaternion(normal).multiply(
          new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)),
        );
        return (
          <mesh
            key={patch.id}
            position={position}
            quaternion={quaternion}
            receiveShadow
            userData={{ biomePatch: patch.id, sceneryMesh: true }}
          >
            <circleGeometry args={[patch.radius, 14]} />
            <SharedToonMaterial material={patch.material} />
          </mesh>
        );
      })}
    </group>
  );
}
