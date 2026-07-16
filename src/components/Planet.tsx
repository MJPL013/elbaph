import { PLANET_RADIUS } from "../game/constants";
import { PANTONE_INSPIRED } from "../game/palette";
import { QuarterBands } from "./QuarterBands";
import { SharedToonMaterial } from "./scenery/buildings/BuildingKit";

type PlanetProps = {
  debugVisible: boolean;
};

export function Planet({ debugVisible }: PlanetProps) {
  return (
    <group>
      <mesh receiveShadow>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <SharedToonMaterial material="concrete.sage" />
      </mesh>
      <QuarterBands />
      {debugVisible ? (
        <gridHelper args={[5, 20, PANTONE_INSPIRED.ink, PANTONE_INSPIRED.mochaDeep]} />
      ) : null}
    </group>
  );
}
