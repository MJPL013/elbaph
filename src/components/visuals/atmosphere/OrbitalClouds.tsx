import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, InstancedMesh } from "three";
import { Matrix4, Quaternion, Vector3 } from "three";
import { sphericalSurfacePoint } from "../../../game/spherical";
import type { VisualQuality } from "../../../types/worldContracts";
import { SharedToonMaterial } from "../../scenery/buildings/BuildingKit";

const CLOUDS = [
  [46, -160], [18, -105], [42, -38], [8, 18],
  [-20, 62], [-48, 116], [12, 162], [62, 94],
] as const;

export function OrbitalClouds({ quality }: { quality: VisualQuality }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const cloudCount = quality === "low" ? 4 : quality === "medium" ? 6 : 8;
  const lobeCount = cloudCount * 3;

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const scale = new Vector3();

    CLOUDS.slice(0, cloudCount).forEach(([latitude, longitude], cloudIndex) => {
      const center = sphericalSurfacePoint(3.32, latitude, longitude);
      for (let lobe = 0; lobe < 3; lobe += 1) {
        const position = center.clone().add(
          new Vector3((lobe - 1) * 0.13, (lobe % 2) * 0.045, 0),
        );
        scale.set(1 + (lobe === 1 ? 0.2 : 0), 0.72, 0.86);
        matrix.compose(position, rotation, scale);
        mesh.setMatrixAt(cloudIndex * 3 + lobe, matrix);
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [cloudCount]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y -= delta * 0.008;
  });

  return (
    <group ref={groupRef} userData={{ atmosphereLayer: "clouds", cloudCount }}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, lobeCount]}
        userData={{ sceneryMesh: true, orbitalClouds: true }}
      >
        <sphereGeometry args={[0.16, 8, 6]} />
        <SharedToonMaterial material="road.marking" />
      </instancedMesh>
    </group>
  );
}
