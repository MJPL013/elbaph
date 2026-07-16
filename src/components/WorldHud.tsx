import { QUARTER_COLORS, QUARTER_LABELS } from "../world/landmarkData";
import type { QualityTier } from "../hooks/useQualityTier";
import { useGameStore } from "../store/useGameStore";

type WorldHudProps = {
  qualityTier: QualityTier;
};

export function WorldHud({ qualityTier }: WorldHudProps) {
  const currentQuarter = useGameStore((state) => state.currentQuarter);
  const quarterLabel = currentQuarter ? QUARTER_LABELS[currentQuarter] : "Explore";
  const quarterColor = currentQuarter ? QUARTER_COLORS[currentQuarter] : "#246a73";

  return (
    <div
      data-testid="world-hud"
      data-quality-tier={qualityTier}
      data-current-quarter={currentQuarter ?? "none"}
      className="pointer-events-none fixed left-4 top-4 z-10 max-w-[min(330px,calc(100vw-32px))] rounded-lg border border-[#241006]/15 bg-[#fff8ef]/80 px-4 py-3 font-sans text-[#241006] shadow-[0_14px_42px_rgba(36,16,6,0.16)] backdrop-blur-sm sm:left-6 sm:top-6"
    >
      <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: quarterColor }}>
        {quarterLabel} Quarter
      </div>
      <div className="mt-1 text-xl font-black leading-none">Manoj Pal</div>
      <div className="mt-1 text-xs font-semibold text-[#241006]/70">
        AI Application Developer, Bengaluru
      </div>
    </div>
  );
}