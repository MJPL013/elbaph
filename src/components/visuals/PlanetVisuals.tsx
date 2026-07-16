import type { VisualQuality } from "../../types/worldContracts";
import { Planet } from "../Planet";
import { BiomePatches } from "./fantasy/BiomePatches";
import { FantasyProps } from "./fantasy/FantasyProps";
import { QuarterPaths } from "./fantasy/QuarterPaths";
import { OrbitalClouds } from "./atmosphere/OrbitalClouds";

type PlanetVisualsProps = {
  debugVisible: boolean;
  quality: VisualQuality;
};

export function PlanetVisuals({ debugVisible, quality }: PlanetVisualsProps) {
  return (
    <group userData={{ visualPackage: "fantasy-sky-world" }}>
      <Planet debugVisible={debugVisible} />
      <BiomePatches />
      <QuarterPaths quality={quality} />
      <FantasyProps quality={quality} />
      <OrbitalClouds quality={quality} />
    </group>
  );
}
