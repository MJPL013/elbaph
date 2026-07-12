import { create } from "zustand";

type PointerInputState = {
  active: boolean;
  direction: [number, number];
  origin: [number, number];
  knob: [number, number];
  setDrag: (
    direction: [number, number],
    origin: [number, number],
    knob: [number, number],
  ) => void;
  endDrag: () => void;
};

export const usePointerInputStore = create<PointerInputState>((set) => ({
  active: false,
  direction: [0, 0],
  origin: [0, 0],
  knob: [0, 0],
  setDrag: (direction, origin, knob) =>
    set({ active: true, direction, origin, knob }),
  endDrag: () => set({ active: false, direction: [0, 0] }),
}));
