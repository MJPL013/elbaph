import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector2, Vector3 } from "three";
import { CHARACTER_FIXED_POSITION } from "../game/constants";
import { normalizeYawDelta } from "../game/facing";
import { useGameStore } from "../store/useGameStore";

const DEFAULT_BACK = new Vector3(0, 1, 3.1);
const FOLLOW_DISTANCE = 3.1;
const LATERAL_ARC = 1.15;
const BACKWARD_ARC = 0.8;
const RECENTER_DELAY = 0.8;
const FOLLOW_OFFSET = new Vector3();
const CAMERA_TARGET = new Vector3();
const LOOK_TARGET = new Vector3();
const BEHIND_OFFSET = new Vector3();

type CameraRigProps = {
  inputDirectionRef: React.RefObject<Vector2>;
  facingYawRef: React.RefObject<number>;
};

export function CameraRig({ inputDirectionRef, facingYawRef }: CameraRigProps) {
  const { camera } = useThree();
  const lastLoggedTarget = useRef<string | null>(null);
  const lateralArc = useRef(0);
  const cameraYaw = useRef(0);
  const idleTime = useRef(0);
  const isInteracting = useGameStore((state) => state.isInteracting);
  const activeTarget = useGameStore((state) => state.activeTarget);

  useFrame((_, delta) => {
    const smoothing = 1 - Math.exp(-4 * delta);

    if (isInteracting && activeTarget) {
      LOOK_TARGET.fromArray(activeTarget);
      CAMERA_TARGET.set(activeTarget[0] + 3.2, activeTarget[1] + 1.2, activeTarget[2] + 4);

      const logKey = activeTarget.join(",");
      if (lastLoggedTarget.current !== logKey) {
        console.log("[CAMERA-TARGET]", activeTarget);
        lastLoggedTarget.current = logKey;
      }
    } else {
      const direction = inputDirectionRef.current;
      const hasInput = direction.lengthSq() > 0;
      const arcSmoothing = 1 - Math.exp(-2.2 * delta);
      const backwardArc = direction.y > 0.2 ? BACKWARD_ARC : 0;
      const desiredArc = -direction.x * LATERAL_ARC + backwardArc;

      lateralArc.current += (desiredArc - lateralArc.current) * arcSmoothing;

      if (hasInput) {
        idleTime.current = 0;
      } else {
        idleTime.current += delta;
      }

      if (idleTime.current > RECENTER_DELAY) {
        const yawDelta = normalizeYawDelta(facingYawRef.current - cameraYaw.current);
        cameraYaw.current += yawDelta * arcSmoothing;
      }

      BEHIND_OFFSET.set(lateralArc.current, DEFAULT_BACK.y, FOLLOW_DISTANCE);
      BEHIND_OFFSET.applyAxisAngle(new Vector3(0, 1, 0), cameraYaw.current);
      FOLLOW_OFFSET.copy(BEHIND_OFFSET);
      CAMERA_TARGET.copy(CHARACTER_FIXED_POSITION).add(FOLLOW_OFFSET);
      LOOK_TARGET.copy(CHARACTER_FIXED_POSITION);
      lastLoggedTarget.current = null;
    }

    camera.position.lerp(CAMERA_TARGET, smoothing);
    camera.lookAt(LOOK_TARGET);
  });

  return null;
}
