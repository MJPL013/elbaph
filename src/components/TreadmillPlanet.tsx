import { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { Raycaster, Vector2 } from "three";
import { CHARACTER_COLLISION_POSITION, CHARACTER_FIXED_POSITION } from "../game/constants";
import { useKeyboardDirection } from "../hooks/useKeyboardDirection";
import { getViewportRelativeDirection } from "../game/facing";
import {
  getTreadmillDeltaQuaternion,
  getTreadmillRayDirection,
} from "../game/treadmillMath";
import type { QualityTier } from "../hooks/useQualityTier";
import { Landmarks } from "./Landmarks";
import { Planet } from "./Planet";
import { useGameStore } from "../store/useGameStore";
import { usePointerInputStore } from "../store/usePointerInputStore";

const ROTATION_SPEED = 0.5;
const COLLISION_DISTANCE = 0.5;

type TreadmillPlanetProps = {
  debugVisible: boolean;
  qualityTier: QualityTier;
  onDebugInput: (
    direction: Vector2,
    controlDirection: Vector2,
    rotationApplied: boolean,
    collisionBlocked: boolean,
    collisionTarget: string | null,
  ) => void;
};

export const TreadmillPlanet = forwardRef<Group, TreadmillPlanetProps>(
  function TreadmillPlanet({ debugVisible, qualityTier, onDebugInput }, forwardedRef) {
    const localRef = useRef<Group>(null);
    const collidersRef = useRef(new Map<string, Mesh>());
    const raycasterRef = useRef(new Raycaster());
    const getDirection = useKeyboardDirection();
    const isInteracting = useGameStore((state) => state.isInteracting);

    function registerCollider(id: string, collider: Mesh | null) {
      if (collider) {
        collidersRef.current.set(id, collider);
      } else {
        collidersRef.current.delete(id);
      }
    }

    function findCollision(direction: Vector2) {
      if (direction.lengthSq() === 0) return null;

      const raycaster = raycasterRef.current;
      const rayDirection = getTreadmillRayDirection(direction);
      const colliders = Array.from(collidersRef.current.values());

      localRef.current?.updateMatrixWorld();
      raycaster.set(CHARACTER_COLLISION_POSITION, rayDirection);
      raycaster.far = COLLISION_DISTANCE;

      const hit = raycaster.intersectObjects(colliders, false)[0];

      return hit?.object.userData.colliderId ?? null;
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
      if (isInteracting) rawDirection.set(0, 0);
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
        const deltaQuaternion = getTreadmillDeltaQuaternion(
          direction,
          ROTATION_SPEED * delta,
        );
        group.quaternion.premultiply(deltaQuaternion);
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

      if (typeof forwardedRef === "function") {
        forwardedRef(group);
      } else if (forwardedRef) {
        forwardedRef.current = group;
      }
    }

    return (
      <group ref={setRef}>
        <Planet debugVisible={debugVisible} />
        <Landmarks
          debugVisible={debugVisible}
          qualityTier={qualityTier}
          registerCollider={registerCollider}
        />
      </group>
    );
  },
);

// goku credits:"Son Goku and Kintoun Nimbus" (https://skfb.ly/6UAFN) by Antouss is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
