import { useEffect, useRef } from "react";
import { Vector2 } from "three";

const TRACKED_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

export function useKeyboardDirection() {
  const pressedKeys = useRef(new Set<string>());
  const direction = useRef(new Vector2());

  useEffect(() => {
    function setKey(event: KeyboardEvent, isPressed: boolean) {
      if (!TRACKED_KEYS.has(event.code)) return;
      event.preventDefault();

      if (isPressed) {
        pressedKeys.current.add(event.code);
      } else {
        pressedKeys.current.delete(event.code);
      }
    }

    const onKeyDown = (event: KeyboardEvent) => setKey(event, true);
    const onKeyUp = (event: KeyboardEvent) => setKey(event, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function getDirection() {
    const keys = pressedKeys.current;
    direction.current.set(0, 0);

    if (keys.has("KeyA") || keys.has("ArrowLeft")) direction.current.x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) direction.current.x += 1;
    if (keys.has("KeyW") || keys.has("ArrowUp")) direction.current.y -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) direction.current.y += 1;

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
    }

    return direction.current;
  }

  return getDirection;
}
