import { Vector2, Vector3 } from "three";

export function directionToFacingYaw(direction: Vector2) {
  return Math.atan2(-direction.x, -direction.y);
}

export function getViewportRelativeDirection(
  inputDirection: Vector2,
  cameraPosition: Vector3,
  targetPosition: Vector3,
) {
  if (inputDirection.lengthSq() === 0) return inputDirection.clone();

  const forward = new Vector2(
    targetPosition.x - cameraPosition.x,
    targetPosition.z - cameraPosition.z,
  ).normalize();
  const right = new Vector2(-forward.y, forward.x);

  return right
    .multiplyScalar(inputDirection.x)
    .add(forward.multiplyScalar(-inputDirection.y))
    .normalize();
}

export function normalizeYawDelta(delta: number) {
  return Math.atan2(Math.sin(delta), Math.cos(delta));
}
