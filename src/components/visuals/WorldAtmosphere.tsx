import type { VisualQuality } from "../../types/worldContracts";
import { SkyGradient } from "./atmosphere/SkyGradient";
import { SpiritWisps } from "./atmosphere/SpiritWisps";

export function WorldAtmosphere({ quality }: { quality: VisualQuality }) {
  return (
    <>
      <fog attach="fog" args={["#d7b8c7", 7.5, 15]} />
      <SkyGradient />
      <SpiritWisps quality={quality} />
    </>
  );
}
