import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { Quaternion } from "three";
import { PANTONE_INSPIRED } from "../../game/palette";
import { InkOutline } from "../InkOutline";

const CAMERA_QUATERNION = new Quaternion();
const PARENT_QUATERNION = new Quaternion();

export function WorldBillboardLabel({
  label,
  position = [0, 0.74, -0.08],
}: {
  label: string;
  position?: [number, number, number];
}) {
  const ref = useRef<Group>(null);
  const { camera } = useThree();
  const width = Math.max(0.56, Math.min(0.98, label.length * 0.035));
  const fontSize = label.length > 22 ? 0.035 : label.length > 13 ? 0.044 : 0.054;

  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    camera.getWorldQuaternion(CAMERA_QUATERNION);
    group.parent?.getWorldQuaternion(PARENT_QUATERNION);
    group.quaternion.copy(PARENT_QUATERNION.invert().multiply(CAMERA_QUATERNION));
  });

  return (
    <group ref={ref} position={position} userData={{ billboardLabel: true, sceneryMesh: true }}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.17, 0.035]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.cloudWarm} roughness={0.68} />
        <InkOutline thickness={0.012} />
      </mesh>
      <Text
        position={[0, 0.006, 0.024]}
        fontSize={fontSize}
        maxWidth={width * 0.84}
        color={PANTONE_INSPIRED.ink}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}
