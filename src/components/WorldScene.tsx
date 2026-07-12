import { Suspense, useEffect, useRef, useState } from "react";
import type { Group, Object3D } from "three";
import { Vector2 } from "three";
import { CameraRig } from "./CameraRig";
import { Character } from "./Character";
import { CollisionRayDebug } from "./CollisionRayDebug";
import { DebugProbe } from "./DebugProbe";
import { StylizedEffects } from "./StylizedEffects";
import { TreadmillPlanet } from "./TreadmillPlanet";
import { PANTONE_INSPIRED } from "../game/palette";
import type { QualityTier } from "../hooks/useQualityTier";
import { useDebugStore } from "../store/useDebugStore";

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
  const shadowMapSize = qualityTier === "high" ? 2048 : 1024;

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
  }, []);

  return (
    <>
      <color attach="background" args={[PANTONE_INSPIRED.cloud]} />
      <ambientLight intensity={0.72} />
      <hemisphereLight
        args={[PANTONE_INSPIRED.cloudWarm, PANTONE_INSPIRED.mochaSoft, 1.08]}
      />
      <directionalLight
        position={[3.5, 7, 4.5]}
        intensity={2.45}
        castShadow
        shadow-bias={-0.0005}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <TreadmillPlanet
        ref={planetRef}
        debugVisible={debugVisible}
        qualityTier={qualityTier}
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
      />
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
    </>
  );
}
