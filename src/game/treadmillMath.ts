import { Quaternion, Vector2, Vector3 } from "three";

const UP = new Vector3(0, 1, 0);

export function getTreadmillDeltaQuaternion(
  direction: Vector2,
  radians: number,
) {
  if (direction.lengthSq() === 0 || radians === 0) {
    return new Quaternion();
  }

  const tangent = new Vector3(direction.x, 0, direction.y).normalize();
  const axis = new Vector3().crossVectors(tangent, UP).normalize();

  return new Quaternion().setFromAxisAngle(axis, radians);
}

export function getTreadmillRayDirection(direction: Vector2) {
  if (direction.lengthSq() === 0) {
    return new Vector3(0, 0, -1);
  }

  return new Vector3(direction.x, 0, direction.y).normalize();
}
