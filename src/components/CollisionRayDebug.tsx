import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ArrowHelper, Color, Vector2 } from "three";
import { CHARACTER_COLLISION_POSITION } from "../game/constants";
import { getTreadmillRayDirection } from "../game/treadmillMath";

type CollisionRayDebugProps = {
  inputDirectionRef: React.RefObject<Vector2>;
  collisionBlockedRef: React.RefObject<boolean>;
  visible: boolean;
};

export function CollisionRayDebug({
  inputDirectionRef,
  collisionBlockedRef,
  visible,
}: CollisionRayDebugProps) {
  const arrow = useMemo(
    () =>
      new ArrowHelper(
        getTreadmillRayDirection(inputDirectionRef.current),
        CHARACTER_COLLISION_POSITION,
        0.9,
        "#ffe66d",
      ),
    [inputDirectionRef],
  );

  useFrame(() => {
    const direction = getTreadmillRayDirection(inputDirectionRef.current);
    arrow.position.copy(CHARACTER_COLLISION_POSITION);
    arrow.setDirection(direction);
    arrow.setColor(new Color(collisionBlockedRef.current ? "#ff3b30" : "#ffe66d"));
  });

  return visible ? <primitive object={arrow} /> : null;
}
