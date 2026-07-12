import { Quaternion, Vector3 } from "three";

const UP = new Vector3(0, 1, 0);

export function sphericalSurfacePoint(
  radius: number,
  latitudeDegrees: number,
  longitudeDegrees: number,
) {
  const latitude = (latitudeDegrees * Math.PI) / 180;
  const longitude = (longitudeDegrees * Math.PI) / 180;
  const ringRadius = radius * Math.cos(latitude);

  return new Vector3(
    ringRadius * Math.sin(longitude),
    radius * Math.sin(latitude),
    ringRadius * Math.cos(longitude),
  );
}

export function surfaceQuaternion(normal: Vector3) {
  return new Quaternion().setFromUnitVectors(UP, normal.clone().normalize());
}
