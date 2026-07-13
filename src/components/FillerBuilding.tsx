import { useEffect, useRef } from "react";
import type { Mesh } from "three";
import { PLANET_RADIUS } from "../game/constants";
import type { FillerBuildingDefinition } from "../game/landmarkData";
import { sphericalSurfacePoint, surfaceQuaternion } from "../game/spherical";
import { DistrictPad } from "./scenery/DistrictPad";
import { SceneryProps } from "./scenery/SceneryProps";
import { SkyBuilding } from "./scenery/SkyBuilding";

const WIDTH = 0.24;
const MIN_COLLIDER_HEIGHT = 0.9;

type FillerBuildingProps = {
  debugVisible: boolean;
  building: FillerBuildingDefinition;
  registerCollider: (id: string, collider: Mesh | null) => void;
};

export function FillerBuilding({
  debugVisible,
  building,
  registerCollider,
}: FillerBuildingProps) {
  const colliderRef = useRef<Mesh>(null);
  const normal = sphericalSurfacePoint(1, building.latitude, building.longitude);
  const surfacePoint = normal.clone().multiplyScalar(PLANET_RADIUS);
  const position = surfacePoint.add(normal.clone().multiplyScalar(building.height / 2));
  const quaternion = surfaceQuaternion(normal);

  useEffect(() => {
    if (!building.collidable) return;
    registerCollider(building.id, colliderRef.current);
    return () => registerCollider(building.id, null);
  }, [building.collidable, building.id, registerCollider]);

  return (
    <group position={position} quaternion={quaternion}>
      <DistrictPad radius={0.36} y={-building.height / 2 - 0.03} />
      <SkyBuilding
        material={building.materialTheme}
        height={building.height}
        variant={building.variant}
      />
      <SceneryProps cluster={building.propCluster} />
      {building.collidable ? (
        <mesh
          ref={colliderRef}
          visible={debugVisible}
          userData={{ colliderId: building.id }}
        >
          <boxGeometry args={[WIDTH * 1.35, Math.max(building.height * 1.2, MIN_COLLIDER_HEIGHT), WIDTH * 1.35]} />
          <meshBasicMaterial color="#ff4040" wireframe transparent opacity={0.9} />
        </mesh>
      ) : null}
    </group>
  );
}
