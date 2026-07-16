import { forwardRef, useCallback, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { Raycaster, Vector2 } from "three";
import { CHARACTER_COLLISION_POSITION, CHARACTER_FIXED_POSITION } from "../game/constants";
import { getViewportRelativeDirection } from "../game/facing";
import {
  getTreadmillDeltaQuaternion,
  getTreadmillRayDirection,
} from "../game/treadmillMath";
import { useKeyboardDirection } from "../hooks/useKeyboardDirection";
import { useGameStore } from "../store/useGameStore";
import { usePointerInputStore } from "../store/usePointerInputStore";
import type { ColliderRegistry } from "../types/worldContracts";

const ROTATION_SPEED = 0.5;
const COLLISION_DISTANCE = 0.5;

type TreadmillPlanetProps = {
  controlsEnabled: boolean;
  children: (registerCollider: ColliderRegistry["register"]) => ReactNode;
  onDebugInput: (
    direction: Vector2,
    controlDirection: Vector2,
    rotationApplied: boolean,
    collisionBlocked: boolean,
    collisionTarget: string | null,
  ) => void;
};

export const TreadmillPlanet = forwardRef<Group, TreadmillPlanetProps>(
  function TreadmillPlanet(
    { controlsEnabled, children, onDebugInput },
    forwardedRef,
  ) {
    const localRef = useRef<Group>(null);
    const collidersRef = useRef(new Map<string, Mesh>());
    const raycasterRef = useRef(new Raycaster());
    const getDirection = useKeyboardDirection();
    const isInteracting = useGameStore((state) => state.isInteracting);

    const registerCollider: ColliderRegistry["register"] = useCallback((id, collider) => {
      if (collider) collidersRef.current.set(id, collider);
      else collidersRef.current.delete(id);
    }, []);

    function findCollision(direction: Vector2) {
      if (direction.lengthSq() === 0) return null;
      const raycaster = raycasterRef.current;
      const colliders = Array.from(collidersRef.current.values());

      localRef.current?.updateMatrixWorld();
      raycaster.set(
        CHARACTER_COLLISION_POSITION,
        getTreadmillRayDirection(direction),
      );
      raycaster.far = COLLISION_DISTANCE;

      return raycaster.intersectObjects(colliders, false)[0]?.object.userData
        .colliderId ?? null;
    }

    useFrame(({ camera }, delta) => {
      const group = localRef.current;
      if (!group) return;

      const pointer = usePointerInputStore.getState();
      const keyboardDirection = getDirection();
      const pointerDirection = new Vector2(...pointer.direction);
      const rawDirection =
        pointer.active && pointerDirection.lengthSq() > 0
          ? pointerDirection
          : keyboardDirection;

      if (isInteracting || !controlsEnabled) rawDirection.set(0, 0);
      const controlDirection = rawDirection.clone();
      const direction = getViewportRelativeDirection(
        rawDirection,
        camera.position,
        CHARACTER_FIXED_POSITION,
      );
      const collisionTarget = findCollision(direction);
      const collisionBlocked = Boolean(collisionTarget);
      const rotationApplied = direction.lengthSq() > 0 && !collisionBlocked;

      if (rotationApplied) {
        group.quaternion.premultiply(
          getTreadmillDeltaQuaternion(direction, ROTATION_SPEED * delta),
        );
      }

      onDebugInput(
        direction,
        controlDirection,
        rotationApplied,
        collisionBlocked,
        collisionTarget,
      );
    });

    function setRef(group: Group | null) {
      localRef.current = group;
      if (typeof forwardedRef === "function") forwardedRef(group);
      else if (forwardedRef) forwardedRef.current = group;
    }

    return <group ref={setRef}>{children(registerCollider)}</group>;
  },
);
