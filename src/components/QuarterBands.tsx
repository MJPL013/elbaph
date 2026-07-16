import { PLANET_RADIUS } from "../game/constants";
import { QUARTER_COLORS, QUARTER_LABELS } from "../world/landmarkData";
import type { PortfolioQuarter } from "../world/landmarkData";

const QUARTERS = Object.keys(QUARTER_LABELS) as PortfolioQuarter[];

export function QuarterBands() {
  return (
    <group userData={{ sceneryMesh: true, quarterBands: true }}>
      {QUARTERS.map((quarter, index) => (
        <mesh
          key={quarter}
          rotation={[Math.PI / 2, 0, (index * Math.PI) / 4]}
          userData={{ quarterBand: quarter }}
        >
          <torusGeometry args={[PLANET_RADIUS * 1.012, 0.008, 6, 96]} />
          <meshBasicMaterial color={QUARTER_COLORS[quarter]} transparent opacity={0.34} />
        </mesh>
      ))}
    </group>
  );
}