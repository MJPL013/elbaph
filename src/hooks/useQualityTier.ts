export type QualityTier = "high" | "medium" | "low";

export function useQualityTier(): QualityTier {
  if (typeof window === "undefined") return "high";

  const requested = new URLSearchParams(window.location.search).get("quality");
  if (requested === "high" || requested === "medium" || requested === "low") {
    return requested;
  }

  const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
  const memory = getDeviceMemory();

  if (isSmallScreen || memory <= 4) return "low";
  if (memory <= 6) return "medium";
  return "high";
}

function getDeviceMemory() {
  const deviceNavigator = navigator as Navigator & { deviceMemory?: number };
  return Number(deviceNavigator.deviceMemory) || 8;
}
