import { create } from "zustand";
import type { PortfolioQuarter } from "../world/landmarkData";

type GameState = {
  isInteracting: boolean;
  activeLandmarkId: string | null;
  activeTarget: [number, number, number] | null;
  currentQuarter: PortfolioQuarter | null;
  openInteraction: (id: string, target: [number, number, number]) => void;
  closeInteraction: () => void;
  setCurrentQuarter: (quarter: PortfolioQuarter | null) => void;
};

export const useGameStore = create<GameState>((set) => ({
  isInteracting: false,
  activeLandmarkId: null,
  activeTarget: null,
  currentQuarter: null,
  openInteraction: (id, target) =>
    set({ isInteracting: true, activeLandmarkId: id, activeTarget: target }),
  closeInteraction: () =>
    set({ isInteracting: false, activeLandmarkId: null, activeTarget: null }),
  setCurrentQuarter: (quarter) => set({ currentQuarter: quarter }),
}));