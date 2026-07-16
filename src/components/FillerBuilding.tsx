import { PLANET_RADIUS } from "../game/constants";
import type { FillerBuildingDefinition } from "../world/landmarkData";
import { sphericalSurfacePoint, surfaceQuaternion } from "../game/spherical";
import type { ColliderRegistry } from "../types/worldContracts";
import { EntityCollider } from "./entities/EntityCollider";
import { FillerVisual } from "./entities/FillerVisual";

const WIDTH = 0.24;
const MIN_COLLIDER_HEIGHT = 0.9;

type FillerBuildingProps = {
  debugVisible: boolean;
  building: FillerBuildingDefinition;
  registerCollider: ColliderRegistry["register"];
};

export function FillerBuilding({
  debugVisible,
  building,
  registerCollider,
}: FillerBuildingProps) {
  const normal = sphericalSurfacePoint(1, building.latitude, building.longitude);
  const surfacePoint = normal.clone().multiplyScalar(PLANET_RADIUS);
  const position = surfacePoint.add(normal.clone().multiplyScalar(building.height / 2));
  const quaternion = surfaceQuaternion(normal);
  const colliderSize: [number, number, number] = [
    WIDTH * 1.35,
    Math.max(building.height * 1.2, MIN_COLLIDER_HEIGHT),
    WIDTH * 1.35,
  ];

  return (
    <group position={position} quaternion={quaternion}>
      <FillerVisual building={building} />
      {building.collidable ? (
        <EntityCollider
          id={building.id}
          size={colliderSize}
          visible={debugVisible}
          register={registerCollider}
        />
      ) : null}
    </group>
  );
}
