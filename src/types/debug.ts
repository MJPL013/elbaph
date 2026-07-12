import type { PortfolioQuarter } from "../game/landmarkData";

export type SelfWorldDebugState = {
  characterWorldPosition: [number, number, number];
  planetQuaternion: [number, number, number, number];
  inputDirection: [number, number];
  controlDirection: [number, number];
  rotationApplied: boolean;
  collisionBlocked: boolean;
  collisionTarget: string | null;
  isInteracting: boolean;
  activeLandmarkId: string | null;
  activeTarget: [number, number, number] | null;
  currentQuarter: PortfolioQuarter | null;
  landmarkScreens: Record<string, [number, number]>;
  cameraPosition: [number, number, number];
  characterFacingYaw: number;
  characterRunning: boolean;
  characterModelHeight: number;
  characterModelScale: number;
  characterSurfaceLift: number;
  characterPitch: number;
  characterRoll: number;
  avatarLoaded: boolean;
  avatarPlaceholderVisible: boolean;
  outlineTargetCount: number;
  debugVisible: boolean;
  sceneryMeshCount: number;
  portfolioBuildingCount: number;
  billboardLabelCount: number;
  decalSlotCount: number;
  quarterBandCount: number;
  buildingArchetypes: string[];
};

declare global {
  interface Window {
    __SELF_WORLD_DEBUG__?: SelfWorldDebugState;
  }
}

export {};
