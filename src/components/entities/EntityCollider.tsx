import { useEffect, useRef } from "react";
import type { Mesh } from "three";
import type { ColliderRegistry } from "../../types/worldContracts";

type EntityColliderProps = {
  id: string;
  size: readonly [number, number, number];
  visible: boolean;
  register: ColliderRegistry["register"];
  landmarkId?: string;
};

export function EntityCollider({
  id,
  size,
  visible,
  register,
  landmarkId,
}: EntityColliderProps) {
  const colliderRef = useRef<Mesh>(null);

  useEffect(() => {
    register(id, colliderRef.current);
    return () => register(id, null);
  }, [id, register]);

  return (
    <mesh
      ref={colliderRef}
      visible={visible}
      userData={{ colliderId: id, landmarkId }}
    >
      <boxGeometry args={[size[0], size[1], size[2]]} />
      <meshBasicMaterial color="#ff4040" wireframe transparent opacity={0.9} />
    </mesh>
  );
}
