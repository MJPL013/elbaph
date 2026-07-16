import { Suspense, useEffect, useRef, useState } from "react";
import type { Group, Object3D } from "three";
import { Vector2 } from "three";
import { ElbaphMaterialProvider } from "../art/materials/ElbaphMaterialProvider";
import { PANTONE_INSPIRED } from "../game/palette";
import type { QualityTier } from "../hooks/useQualityTier";
import { useAvatarStore } from "../store/useAvatarStore";
import { useDebugStore } from "../store/useDebugStore";
import { CameraRig } from "./CameraRig";
import { Character } from "./Character";
import { CollisionRayDebug } from "./CollisionRayDebug";
import { DebugProbe } from "./DebugProbe";
import { Landmarks } from "./Landmarks";
import { StylizedEffects } from "./StylizedEffects";
import { TreadmillPlanet } from "./TreadmillPlanet";
import { PlanetVisuals } from "./visuals/PlanetVisuals";
import { WorldAtmosphere } from "./visuals/WorldAtmosphere";
import { WorldLighting } from "./visuals/WorldLighting";

type WorldSceneProps = {
  qualityTier: QualityTier;
};

export function WorldScene({ qualityTier }: WorldSceneProps) {
  const characterRef = useRef<Group>(null);
  const planetRef = useRef<Group>(null);
  const inputDirectionRef = useRef(new Vector2());
  const controlDirectionRef = useRef(new Vector2());
  const rotationAppliedRef = useRef(false);
  const collisionBlockedRef = useRef(false);
  const collisionTargetRef = useRef<string | null>(null);
  const facingYawRef = useRef(0);
  const [outlineTargets, setOutlineTargets] = useState<Object3D[]>([]);
  const debugVisible = useDebugStore((state) => state.debugVisible);
  const avatarReady = useAvatarStore((state) => state.status === "ready");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const targets: Object3D[] = [];
      const collectMeshes = (root: Object3D | null) => {
        root?.traverse((object) => {
          if (!("isMesh" in object) || object.userData.colliderId) return;
          targets.push(object);
        });
      };
      collectMeshes(planetRef.current);
      collectMeshes(characterRef.current);
      setOutlineTargets(targets);
    });
    return () => cancelAnimationFrame(frame);
  }, [avatarReady, qualityTier]);

  return (
    <ElbaphMaterialProvider>
      <color attach="background" args={[PANTONE_INSPIRED.violet]} />
      <WorldAtmosphere quality={qualityTier} />
      <WorldLighting quality={qualityTier} />
      <TreadmillPlanet
        ref={planetRef}
        controlsEnabled={avatarReady}
        onDebugInput={(
          direction,
          controlDirection,
          rotationApplied,
          collisionBlocked,
          collisionTarget,
        ) => {
          inputDirectionRef.current.copy(direction);
          controlDirectionRef.current.copy(controlDirection);
          rotationAppliedRef.current = rotationApplied;
          collisionBlockedRef.current = collisionBlocked;
          collisionTargetRef.current = collisionTarget;
        }}
      >
        {(registerCollider) => (
          <>
            <PlanetVisuals debugVisible={debugVisible} quality={qualityTier} />
            <Landmarks
              debugVisible={debugVisible}
              qualityTier={qualityTier}
              registerCollider={registerCollider}
            />
          </>
        )}
      </TreadmillPlanet>
      <Suspense fallback={null}>
        <Character
          ref={characterRef}
          inputDirectionRef={inputDirectionRef}
          controlDirectionRef={controlDirectionRef}
          facingYawRef={facingYawRef}
        />
      </Suspense>
      <CameraRig inputDirectionRef={inputDirectionRef} facingYawRef={facingYawRef} />
      <CollisionRayDebug
        inputDirectionRef={inputDirectionRef}
        collisionBlockedRef={collisionBlockedRef}
        visible={debugVisible}
      />
      <DebugProbe
        characterRef={characterRef}
        planetRef={planetRef}
        inputDirectionRef={inputDirectionRef}
        controlDirectionRef={controlDirectionRef}
        outlineTargetCount={outlineTargets.length}
        debugVisible={debugVisible}
        rotationAppliedRef={rotationAppliedRef}
        collisionBlockedRef={collisionBlockedRef}
        collisionTargetRef={collisionTargetRef}
      />
      <StylizedEffects selection={outlineTargets} qualityTier={qualityTier} />
    </ElbaphMaterialProvider>
  );
}
