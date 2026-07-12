import { create } from "zustand";

function initialDebugVisible() {
  if (typeof window === "undefined") return false;
  const debug = new URLSearchParams(window.location.search).get("debug");
  return debug === "1" || debug === "true";
}

type DebugState = {
  debugVisible: boolean;
  toggleDebug: () => void;
};

export const useDebugStore = create<DebugState>((set) => ({
  debugVisible: initialDebugVisible(),
  toggleDebug: () => set((state) => ({ debugVisible: !state.debugVisible })),
}));
