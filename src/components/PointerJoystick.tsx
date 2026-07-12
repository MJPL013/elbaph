import { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore";
import { usePointerInputStore } from "../store/usePointerInputStore";

const DEAD_ZONE = 8;
const MAX_RADIUS = 64;

function isIgnoredTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-ignore-game-drag]"));
}

export function PointerJoystick() {
  const active = usePointerInputStore((state) => state.active);
  const origin = usePointerInputStore((state) => state.origin);
  const knob = usePointerInputStore((state) => state.knob);
  const dragRef = useRef({ pointerId: -1, originX: 0, originY: 0 });

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!event.isPrimary || isIgnoredTarget(event.target)) return;
      if (useGameStore.getState().isInteracting) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      dragRef.current = {
        pointerId: event.pointerId,
        originX: event.clientX,
        originY: event.clientY,
      };
    }

    function onPointerMove(event: PointerEvent) {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.originX;
      const dy = event.clientY - drag.originY;
      const distance = Math.hypot(dx, dy);
      if (distance < DEAD_ZONE) return;

      event.preventDefault();
      const scale = Math.min(distance, MAX_RADIUS) / distance;
      const knobX = drag.originX + dx * scale;
      const knobY = drag.originY + dy * scale;

      usePointerInputStore.getState().setDrag(
        [dx * scale / MAX_RADIUS, dy * scale / MAX_RADIUS],
        [drag.originX, drag.originY],
        [knobX, knobY],
      );
    }

    function endPointer(event: PointerEvent) {
      if (dragRef.current.pointerId !== event.pointerId) return;
      dragRef.current.pointerId = -1;
      usePointerInputStore.getState().endDrag();
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endPointer);
      window.removeEventListener("pointercancel", endPointer);
    };
  }, []);

  if (!active) return null;

  return (
    <div data-testid="virtual-joystick" className="virtual-joystick">
      <div
        className="virtual-joystick-base"
        style={{ left: origin[0], top: origin[1] }}
      />
      <div
        className="virtual-joystick-knob"
        style={{ left: knob[0], top: knob[1] }}
      />
    </div>
  );
}
