import { useLayoutEffect, useRef } from "react";
import type { InstancedMesh } from "three";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import type { ElbaphMaterialId } from "../../../art/materials/materialTypes";
import { PLANET_RADIUS } from "../../../game/constants";
import { sphericalSurfacePoint, surfaceQuaternion } from "../../../game/spherical";
import type { AmbientPlacement } from "../../../types/worldContracts";
import { SharedToonMaterial } from "../../scenery/buildings/BuildingKit";

export type FantasyShape =
  | "trunk"
  | "canopy"
  | "crystal"
  | "stem"
  | "cap"
  | "rock"
  | "pole"
  | "glow"
  | "grass"
  | "island-top"
  | "island-base";

type InstancedPartProps = {
  placements: AmbientPlacement[];
  shape: FantasyShape;
  material: ElbaphMaterialId;
  offset: readonly [number, number, number];
  scale: readonly [number, number, number];
  rotation?: readonly [number, number, number];
};

const UNIT_SCALE = new Vector3(1, 1, 1);

export function InstancedPart({
  placements,
  shape,
  material,
  offset,
  scale,
  rotation = [0, 0, 0],
}: InstancedPartProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const baseMatrix = new Matrix4();
    const localMatrix = new Matrix4();
    const finalMatrix = new Matrix4();
    const localQuaternion = new Quaternion().setFromEuler(new Euler(...rotation));
    const localPosition = new Vector3(...offset);
    const localScale = new Vector3(...scale);

    placements.forEach((placement, index) => {
      const normal = sphericalSurfacePoint(1, placement.latitude, placement.longitude);
      const position = normal.clone().multiplyScalar(PLANET_RADIUS);
      const quaternion = surfaceQuaternion(normal);
      quaternion.multiply(
        new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), placement.rotation ?? 0),
      );
      const placementScale = UNIT_SCALE.clone().multiplyScalar(placement.scale);
      baseMatrix.compose(position, quaternion, placementScale);
      localMatrix.compose(localPosition, localQuaternion, localScale);
      finalMatrix.multiplyMatrices(baseMatrix, localMatrix);
      mesh.setMatrixAt(index, finalMatrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [offset, placements, rotation, scale]);

  if (placements.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, placements.length]}
      castShadow
      receiveShadow
      frustumCulled
      userData={{
        ambientKind: placements[0].kind,
        ambientInstanceCount: placements.length,
        sceneryMesh: true,
      }}
    >
      <PartGeometry shape={shape} />
      <SharedToonMaterial material={material} />
    </instancedMesh>
  );
}

function PartGeometry({ shape }: { shape: FantasyShape }) {
  if (shape === "trunk") return <cylinderGeometry args={[0.055, 0.075, 0.34, 6]} />;
  if (shape === "canopy") return <dodecahedronGeometry args={[0.2, 0]} />;
  if (shape === "crystal") return <coneGeometry args={[0.11, 0.38, 5]} />;
  if (shape === "stem") return <cylinderGeometry args={[0.035, 0.045, 0.16, 6]} />;
  if (shape === "cap") return <sphereGeometry args={[0.11, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />;
  if (shape === "rock") return <dodecahedronGeometry args={[0.14, 0]} />;
  if (shape === "pole") return <cylinderGeometry args={[0.022, 0.03, 0.28, 6]} />;
  if (shape === "glow") return <octahedronGeometry args={[0.065, 0]} />;
  if (shape === "grass") return <coneGeometry args={[0.075, 0.2, 5]} />;
  if (shape === "island-top") return <cylinderGeometry args={[0.24, 0.3, 0.12, 7]} />;
  return <coneGeometry args={[0.25, 0.46, 7]} />;
}
