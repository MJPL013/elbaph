import { useEffect } from "react";
import { useDebugStore } from "../store/useDebugStore";

export function DebugControls() {
  const toggleDebug = useDebugStore((state) => state.toggleDebug);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== "KeyH") return;
      event.preventDefault();
      toggleDebug();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleDebug]);

  return null;
}
