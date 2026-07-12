import { PANTONE_INSPIRED } from "../../game/palette";
import { InkOutline } from "../InkOutline";

type SceneryPropsProps = {
  cluster?: "flags" | "clouds" | "lamps";
};

export function SceneryProps({ cluster }: SceneryPropsProps) {
  if (cluster === "flags") return <Flags />;
  if (cluster === "lamps") return <Lamps />;
  return <Clouds />;
}

function Clouds() {
  return (
    <group position={[0.26, -0.14, 0.22]} userData={{ sceneryMesh: true }}>
      {[0, 0.1, -0.1].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.075, 8, 6]} />
          <meshStandardMaterial color={PANTONE_INSPIRED.cloud} roughness={0.95} />
          <InkOutline thickness={0.01} />
        </mesh>
      ))}
    </group>
  );
}

function Flags() {
  return (
    <group position={[-0.26, 0.02, 0.18]} userData={{ sceneryMesh: true }}>
      <mesh>
        <boxGeometry args={[0.025, 0.34, 0.025]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.mochaDeep} />
      </mesh>
      <mesh position={[0.08, 0.11, 0]}>
        <boxGeometry args={[0.16, 0.08, 0.012]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.peach} />
        <InkOutline thickness={0.008} />
      </mesh>
    </group>
  );
}

function Lamps() {
  return (
    <group position={[0.25, 0.03, -0.18]} userData={{ sceneryMesh: true }}>
      <mesh>
        <boxGeometry args={[0.025, 0.28, 0.025]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.mochaDeep} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color={PANTONE_INSPIRED.peachSoft} emissive="#402010" />
        <InkOutline thickness={0.008} />
      </mesh>
    </group>
  );
}
