import { useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";
import { Vector3 } from "three";
import { getPortfolioContent } from "../content/portfolioContent";
import { PLANET_RADIUS } from "../game/constants";
import type { LandmarkDefinition } from "../world/landmarkData";
import { sphericalSurfacePoint, surfaceQuaternion } from "../game/spherical";
import { useGameStore } from "../store/useGameStore";
import type { ColliderRegistry, VisualQuality } from "../types/worldContracts";
import { EntityCollider } from "./entities/EntityCollider";
import { LandmarkVisual } from "./entities/LandmarkVisual";

const DEFAULT_BUILDING_HEIGHT = 0.78;
const DEFAULT_FOOTPRINT: [number, number] = [0.58, 0.58];
const CLICK_TARGET_HEIGHT = 1.5;

type LandmarkBoxProps = {
  debugVisible: boolean;
  landmark: LandmarkDefinition;
  qualityTier: VisualQuality;
  registerCollider: ColliderRegistry["register"];
};

export function LandmarkBox({
  debugVisible,
  landmark,
  qualityTier,
  registerCollider,
}: LandmarkBoxProps) {
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
  const colliderSize: [number, number, number] = [
    footprint[0] * 1.22,
    height * 1.12,
    footprint[1] * 1.22,
  ];

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    const target = new Vector3();
    targetRef.current?.getWorldPosition(target);
    openInteraction(landmark.id, target.toArray());
  }

  return (
    <group position={position} quaternion={quaternion} onClick={handleClick}>
      <group ref={targetRef}>
        <LandmarkVisual
          landmark={landmark}
          label={label}
          height={height}
          quality={qualityTier}
        />
      </group>
      <EntityCollider
        id={landmark.id}
        size={colliderSize}
        visible={debugVisible}
        register={registerCollider}
        landmarkId={landmark.id}
      />
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
