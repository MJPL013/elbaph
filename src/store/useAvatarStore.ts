import { create } from "zustand";
import type { AvatarLoadStatus } from "../types/worldContracts";

type AvatarState = {
  status: AvatarLoadStatus;
  retryToken: number;
  markReady: () => void;
  markError: () => void;
  beginRetry: () => void;
};

export const useAvatarStore = create<AvatarState>((set) => ({
  status: "loading",
  retryToken: 0,
  markReady: () => set({ status: "ready" }),
  markError: () => set({ status: "error" }),
  beginRetry: () =>
    set((state) => ({ status: "retrying", retryToken: state.retryToken + 1 })),
}));
