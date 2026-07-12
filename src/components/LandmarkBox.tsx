import { useEffect, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { Vector3 } from "three";
import { getPortfolioContent } from "../content/portfolioContent";
import { PLANET_RADIUS } from "../game/constants";
import type { LandmarkDefinition } from "../game/landmarkData";
import { sphericalSurfacePoint, surfaceQuaternion } from "../game/spherical";
import { useGameStore } from "../store/useGameStore";
import { DistrictPad } from "./scenery/DistrictPad";
import { HeroLandmark } from "./scenery/HeroLandmark";
import { SceneryProps } from "./scenery/SceneryProps";

const DEFAULT_BUILDING_HEIGHT = 0.78;
const DEFAULT_FOOTPRINT: [number, number] = [0.58, 0.58];
const CLICK_TARGET_HEIGHT = 1.5;

type LandmarkBoxProps = {
  debugVisible: boolean;
  landmark: LandmarkDefinition;
  registerCollider: (id: string, collider: Mesh | null) => void;
};

export function LandmarkBox({
  debugVisible,
  landmark,
  registerCollider,
}: LandmarkBoxProps) {
  const colliderRef = useRef<Mesh>(null);
  const targetRef = useRef<Group>(null);
  const openInteraction = useGameStore((state) => state.openInteraction);
  const content = getPortfolioContent(landmark.id);
  const label = content?.title ?? landmark.id;
  const height = landmark.height ?? DEFAULT_BUILDING_HEIGHT;
  const footprint = landmark.footprint ?? DEFAULT_FOOTPRINT;
  const normal = sphericalSurfacePoint(1, landmark.latitude, landmark.longitude);
  const surfacePoint = normal.clone().multiplyScalar(PLANET_RADIUS);
  const position = surfacePoint.add(normal.clone().multiplyScalar(height / 2));
  const quaternion = surfaceQuaternion(normal);
  const colliderSize = new Vector3(footprint[0] * 1.22, height * 1.12, footprint[1] * 1.22);

  useEffect(() => {
    registerCollider(landmark.id, colliderRef.current);
    return () => registerCollider(landmark.id, null);
  }, [landmark.id, registerCollider]);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    const target = new Vector3();
    targetRef.current?.getWorldPosition(target);
    openInteraction(landmark.id, target.toArray());
  }

  return (
    <group position={position} quaternion={quaternion} onClick={handleClick}>
      <group ref={targetRef}>
        <DistrictPad radius={landmark.padRadius} y={-height / 2 - 0.03} />
        <HeroLandmark landmark={landmark} label={label} />
        <SceneryProps cluster={landmark.propCluster} />
      </group>
      <mesh
        ref={colliderRef}
        visible={debugVisible}
        userData={{ colliderId: landmark.id, landmarkId: landmark.id }}
      >
        <boxGeometry args={[colliderSize.x, colliderSize.y, colliderSize.z]} />
        <meshBasicMaterial color="#ff4040" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh
        position={[0, Math.max(height * 0.2, 0.18), 0]}
        userData={{ landmarkId: landmark.id, interactionTarget: true }}
      >
        <boxGeometry args={[footprint[0] * 1.8, CLICK_TARGET_HEIGHT, footprint[1] * 1.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
