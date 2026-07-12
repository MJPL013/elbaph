import { EffectComposer, Outline } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Object3D } from "three";
import type { QualityTier } from "../hooks/useQualityTier";

type StylizedEffectsProps = {
  selection: Object3D[];
  qualityTier: QualityTier;
};

export function StylizedEffects({ selection, qualityTier }: StylizedEffectsProps) {
  if (qualityTier === "low") return null;

  return (
    <EffectComposer multisampling={qualityTier === "high" ? 4 : 0} depthBuffer>
      <Outline
        selection={selection}
        blendFunction={BlendFunction.ALPHA}
        edgeStrength={qualityTier === "high" ? 7 : 4}
        visibleEdgeColor={0x241006}
        hiddenEdgeColor={0x241006}
        width={900}
        xRay={false}
      />
    </EffectComposer>
  );
}
