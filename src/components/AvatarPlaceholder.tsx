import { PANTONE_INSPIRED } from "../game/palette";
import { InkOutline } from "./InkOutline";

export function AvatarPlaceholder() {
  return (
    <group userData={{ avatarPlaceholder: true }}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.teal} roughness={0.62} />
        <InkOutline thickness={0.018} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <sphereGeometry args={[0.11, 14, 10]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.cloudWarm} roughness={0.58} />
        <InkOutline thickness={0.014} />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.34, 0.13, 0.13]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.gold} roughness={0.72} />
        <InkOutline thickness={0.014} />
      </mesh>
      <mesh position={[0.08, 0.25, -0.08]} castShadow>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.ink} roughness={0.5} />
      </mesh>
      <mesh position={[-0.08, 0.25, -0.08]} castShadow>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.ink} roughness={0.5} />
      </mesh>
    </group>
  );
}