import { PLANET_RADIUS } from "../game/constants";
import { PANTONE_INSPIRED } from "../game/palette";
import { InkOutline } from "./InkOutline";
import { QuarterBands } from "./QuarterBands";

type PlanetProps = {
  debugVisible: boolean;
};

export function Planet({ debugVisible }: PlanetProps) {
  return (
    <group>
      <mesh receiveShadow>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color={PANTONE_INSPIRED.cloudWarm}
          roughness={0.88}
          metalness={0}
        />
        <InkOutline thickness={0.018} />
      </mesh>
      <QuarterBands />
      {debugVisible ? (
        <gridHelper
          args={[5, 20, PANTONE_INSPIRED.ink, PANTONE_INSPIRED.mochaDeep]}
        />
      ) : null}
    </group>
  );
}