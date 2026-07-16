import { Suspense, forwardRef, useCallback, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Vector2 } from "three";
import { clearAvatarModelCache } from "../components/visuals/avatar/avatarAsset";
import { getCharacterTilt, getFrameSmoothing } from "../game/characterAnimation";
import {
  CHARACTER_FIXED_POSITION,
  CHARACTER_HEIGHT,
  CHARACTER_SURFACE_LIFT,
  CHARACTER_TILT_SMOOTHING,
} from "../game/constants";
import { directionToFacingYaw, normalizeYawDelta } from "../game/facing";
import { useAvatarStore } from "../store/useAvatarStore";
import Avatar from "./Avatar";
import { AvatarErrorBoundary } from "./AvatarErrorBoundary";
import { AvatarPlaceholder } from "./AvatarPlaceholder";

type CharacterProps = {
  inputDirectionRef: React.RefObject<Vector2>;
  controlDirectionRef: React.RefObject<Vector2>;
  facingYawRef: React.RefObject<number>;
};

export const Character = forwardRef<Group, CharacterProps>(function Character(
  { inputDirectionRef, controlDirectionRef, facingYawRef },
  ref,
) {
  const rootRef = useRef<Group>(null);
  const visualRef = useRef<Group>(null);
  const facingYaw = useRef(0);
  const modelScale = useRef(1);
  const automaticRetryUsed = useRef(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const retryToken = useAvatarStore((state) => state.retryToken);
  const markReady = useAvatarStore((state) => state.markReady);
  const markError = useAvatarStore((state) => state.markError);
  const beginRetry = useAvatarStore((state) => state.beginRetry);

  const handleAvatarReady = useCallback((scale: number) => {
    modelScale.current = scale;
    setAvatarLoaded(true);
    markReady();
  }, [markReady]);

  const handleAvatarError = useCallback(() => {
    markError();
    if (automaticRetryUsed.current) return;
    automaticRetryUsed.current = true;
    window.setTimeout(() => {
      clearAvatarModelCache();
      beginRetry();
    }, 450);
  }, [beginRetry, markError]);

  useFrame((_, delta) => {
    const direction = inputDirectionRef.current;
    const controlDirection = controlDirectionRef.current;
    const turn = 1 - Math.exp(-8 * delta);
    const tilt = getCharacterTilt(controlDirection);
    const tiltTurn = getFrameSmoothing(CHARACTER_TILT_SMOOTHING, delta);
    const running = direction.lengthSq() > 0;

    if (running) facingYawRef.current = directionToFacingYaw(direction);
    const yawDelta = normalizeYawDelta(facingYawRef.current - facingYaw.current);
    facingYaw.current += yawDelta * turn;

    if (visualRef.current) {
      visualRef.current.rotation.x +=
        (tilt.pitch - visualRef.current.rotation.x) * tiltTurn;
      visualRef.current.rotation.z +=
        (tilt.roll - visualRef.current.rotation.z) * tiltTurn;
    }

    if (rootRef.current) {
      rootRef.current.rotation.y = facingYaw.current;
      rootRef.current.userData.running = running;
      rootRef.current.userData.modelHeight = CHARACTER_HEIGHT;
      rootRef.current.userData.modelScale = modelScale.current;
      rootRef.current.userData.surfaceLift = CHARACTER_SURFACE_LIFT;
      rootRef.current.userData.pitch = visualRef.current?.rotation.x ?? 0;
      rootRef.current.userData.roll = visualRef.current?.rotation.z ?? 0;
      rootRef.current.userData.avatarLoaded = avatarLoaded;
    }
  });

  function setRef(group: Group | null) {
    rootRef.current = group;
    if (typeof ref === "function") ref(group);
    else if (ref) ref.current = group;
  }

  return (
    <group ref={setRef} position={CHARACTER_FIXED_POSITION}>
      <group ref={visualRef}>
        <AvatarErrorBoundary
          key={retryToken}
          resetKey={retryToken}
          fallback={<AvatarPlaceholder />}
          onError={handleAvatarError}
        >
          <Suspense fallback={<AvatarPlaceholder />}>
            <Avatar onReady={handleAvatarReady} />
          </Suspense>
        </AvatarErrorBoundary>
      </group>
    </group>
  );
});
