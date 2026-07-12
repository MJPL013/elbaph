import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { Vector2, Vector3 } from "three";
import { LANDMARKS } from "../game/landmarkData";
import type { PortfolioQuarter } from "../game/landmarkData";
import { useGameStore } from "../store/useGameStore";

const LANDMARK_QUARTERS = new Map(LANDMARKS.map((landmark) => [landmark.id, landmark.quarter]));

type DebugProbeProps = {
  characterRef: React.RefObject<Group | null>;
  planetRef: React.RefObject<Group | null>;
  inputDirectionRef: React.RefObject<Vector2>;
  controlDirectionRef: React.RefObject<Vector2>;
  outlineTargetCount: number;
  debugVisible: boolean;
  rotationAppliedRef: React.RefObject<boolean>;
  collisionBlockedRef: React.RefObject<boolean>;
  collisionTargetRef: React.RefObject<string | null>;
};

export function DebugProbe({
  characterRef,
  planetRef,
  inputDirectionRef,
  controlDirectionRef,
  outlineTargetCount,
  debugVisible,
  rotationAppliedRef,
  collisionBlockedRef,
  collisionTargetRef,
}: DebugProbeProps) {
  const characterPosition = useRef(new Vector3());
  const projectedPosition = useRef(new Vector3());
  const lastQuarter = useRef<PortfolioQuarter | null>(null);
  const { camera, size } = useThree();
  const isInteracting = useGameStore((state) => state.isInteracting);
  const activeLandmarkId = useGameStore((state) => state.activeLandmarkId);
  const activeTarget = useGameStore((state) => state.activeTarget);
  const setCurrentQuarter = useGameStore((state) => state.setCurrentQuarter);

  useFrame(() => {
    const character = characterRef.current;
    const planet = planetRef.current;
    if (!character || !planet) return;

    character.getWorldPosition(characterPosition.current);

    const landmarkScreens: Record<string, [number, number]> = {};
    const buildingArchetypes = new Set<string>();
    let sceneryMeshCount = 0;
    let portfolioBuildingCount = 0;
    let billboardLabelCount = 0;
    let decalSlotCount = 0;
    let quarterBandCount = 0;
    let avatarPlaceholderVisible = false;
    let nearestId: string | null = null;
    let nearestDistance = Infinity;

    character.traverse((object) => {
      if (object.userData.avatarPlaceholder) avatarPlaceholderVisible = true;
    });

    planet.traverse((object) => {
      if (object.userData.sceneryMesh) sceneryMeshCount += 1;
      if (object.userData.portfolioBuilding) portfolioBuildingCount += 1;
      if (object.userData.billboardLabel) billboardLabelCount += 1;
      if (object.userData.decalSlot) decalSlotCount += 1;
      if (object.userData.quarterBand) quarterBandCount += 1;
      if (typeof object.userData.buildingArchetype === "string") {
        buildingArchetypes.add(object.userData.buildingArchetype);
      }
      const landmarkId = object.userData.landmarkId;
      if (typeof landmarkId !== "string") return;

      object.getWorldPosition(projectedPosition.current);
      projectedPosition.current.project(camera);
      const screen: [number, number] = [
        ((projectedPosition.current.x + 1) / 2) * size.width,
        ((1 - projectedPosition.current.y) / 2) * size.height,
      ];
      landmarkScreens[landmarkId] = screen;

      const distance = Math.hypot(screen[0] - size.width / 2, screen[1] - size.height / 2);
      if (distance < nearestDistance) {
        nearestId = landmarkId;
        nearestDistance = distance;
      }
    });

    const quarter = getQuarter(activeLandmarkId) ?? getQuarter(nearestId);
    if (quarter !== lastQuarter.current) {
      lastQuarter.current = quarter;
      setCurrentQuarter(quarter);
    }

    window.__SELF_WORLD_DEBUG__ = {
      characterWorldPosition: characterPosition.current.toArray(),
      characterFacingYaw: character.rotation.y,
      characterRunning: Boolean(character.userData.running),
      characterModelHeight: Number(character.userData.modelHeight ?? 0),
      characterModelScale: Number(character.userData.modelScale ?? 1),
      characterSurfaceLift: Number(character.userData.surfaceLift ?? 0),
      characterPitch: Number(character.userData.pitch ?? 0),
      characterRoll: Number(character.userData.roll ?? 0),
      avatarLoaded: Boolean(character.userData.avatarLoaded),
      avatarPlaceholderVisible,
      planetQuaternion: planet.quaternion.toArray(),
      inputDirection: inputDirectionRef.current.toArray(),
      controlDirection: controlDirectionRef.current.toArray(),
      rotationApplied: rotationAppliedRef.current,
      collisionBlocked: collisionBlockedRef.current,
      collisionTarget: collisionTargetRef.current,
      isInteracting,
      activeLandmarkId,
      activeTarget,
      currentQuarter: quarter,
      landmarkScreens,
      cameraPosition: camera.position.toArray(),
      outlineTargetCount,
      debugVisible,
      sceneryMeshCount,
      portfolioBuildingCount,
      billboardLabelCount,
      decalSlotCount,
      quarterBandCount,
      buildingArchetypes: Array.from(buildingArchetypes),
    };
  });

  return null;
}

function getQuarter(id: string | null): PortfolioQuarter | null {
  if (!id) return null;
  return LANDMARK_QUARTERS.get(id) ?? null;
}
