import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { sphericalSurfacePoint } from "../../../game/spherical";
import type { VisualQuality } from "../../../types/worldContracts";

export function SpiritWisps({ quality }: { quality: VisualQuality }) {
  const groupRef = useRef<Group>(null);
  const count = quality === "high" ? 54 : quality === "medium" ? 32 : 16;
  const positions = useMemo(() => createWispPositions(count), [count]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.018;
    groupRef.current.rotation.z = Math.sin(performance.now() * 0.00018) * 0.025;
  });

  return (
    <group ref={groupRef} userData={{ atmosphereLayer: "wisps", wispCount: count }}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#fff0a8"
          size={quality === "low" ? 0.035 : 0.05}
          sizeAttenuation
          transparent
          opacity={0.78}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function createWispPositions(count: number) {
  const values = new Float32Array(count * 3);
  let seed = 1977;

  for (let index = 0; index < count; index += 1) {
    seed = (seed * 48271) % 2147483647;
    const latitude = (seed / 2147483647) * 130 - 65;
    seed = (seed * 48271) % 2147483647;
    const longitude = (seed / 2147483647) * 360 - 180;
    seed = (seed * 48271) % 2147483647;
    const radius = 3.05 + (seed / 2147483647) * 0.65;
    const position = sphericalSurfacePoint(radius, latitude, longitude);
    values.set(position.toArray(), index * 3);
  }

  return values;
}
