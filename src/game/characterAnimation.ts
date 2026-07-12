import type { Vector2 } from "three";
import {
  CHARACTER_BACKWARD_TILT,
  CHARACTER_FORWARD_TILT,
  CHARACTER_SIDE_BANK,
} from "./constants";

export type CharacterTilt = {
  pitch: number;
  roll: number;
};

export function getCharacterTilt(direction: Vector2): CharacterTilt {
  if (direction.lengthSq() === 0) return { pitch: 0, roll: 0 };

  return {
    pitch:
      direction.y < 0
        ? -direction.y * CHARACTER_FORWARD_TILT
        : direction.y * CHARACTER_BACKWARD_TILT,
    roll: -direction.x * CHARACTER_SIDE_BANK,
  };
}

export function getFrameSmoothing(smoothing: number, delta: number) {
  return 1 - Math.exp(-smoothing * delta);
}
