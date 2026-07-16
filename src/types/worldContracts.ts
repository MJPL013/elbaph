import type { Mesh } from "three";

export type AvatarLoadStatus = "loading" | "retrying" | "ready" | "error";
export type VisualQuality = "low" | "medium" | "high";

export type WorldMotionState = {
  rotationApplied: boolean;
  collisionBlocked: boolean;
  collisionTarget: string | null;
};

export type ColliderRegistry = {
  register: (id: string, collider: Mesh | null) => void;
};

export type AmbientPropKind =
  | "tree"
  | "crystal"
  | "mushroom"
  | "rock"
  | "lantern"
  | "grass"
  | "island";

export type AmbientPlacement = {
  id: string;
  kind: AmbientPropKind;
  latitude: number;
  longitude: number;
  scale: number;
  rotation?: number;
  quarter: "experience" | "ai-projects" | "creative" | "contact";
};

export type QuarterPathDefinition = {
  id: string;
  quarter: AmbientPlacement["quarter"];
  points: ReadonlyArray<readonly [latitude: number, longitude: number]>;
};
