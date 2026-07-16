import { CatmullRomCurve3, Vector3 } from "three";
import { PLANET_RADIUS } from "../../../game/constants";
import { sphericalSurfacePoint } from "../../../game/spherical";
import type { QuarterPathDefinition } from "../../../types/worldContracts";

export function createSurfaceCurve(
  definition: QuarterPathDefinition,
  samplesPerLeg: number,
) {
  const points: Vector3[] = [];

  definition.points.forEach(([latitude, longitude], index) => {
    if (index === definition.points.length - 1) return;
    const [nextLatitude, nextLongitude] = definition.points[index + 1];
    const start = sphericalSurfacePoint(1, latitude, longitude);
    const end = sphericalSurfacePoint(1, nextLatitude, nextLongitude);

    for (let sample = 0; sample < samplesPerLeg; sample += 1) {
      const t = sample / samplesPerLeg;
      points.push(start.clone().lerp(end, t).normalize().multiplyScalar(PLANET_RADIUS + 0.025));
    }
  });

  const [lastLatitude, lastLongitude] = definition.points.at(-1)!;
  points.push(
    sphericalSurfacePoint(PLANET_RADIUS + 0.025, lastLatitude, lastLongitude),
  );

  return new CatmullRomCurve3(points, false, "centripetal");
}
