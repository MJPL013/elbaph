import { useProgress } from "@react-three/drei";

export function LoadingOverlay() {
  const { active, progress } = useProgress();

  if (!active && progress >= 100) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center px-4 font-sans">
      <div className="w-[min(320px,calc(100vw-32px))] rounded-lg border border-[#241006]/15 bg-[#fff8ef]/90 px-4 py-3 text-[#241006] shadow-[0_14px_42px_rgba(36,16,6,0.18)] backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.14em]">
          <span>Loading World</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[#241006]/15">
          <div className="h-full rounded bg-[#246a73]" style={{ width: `${Math.round(progress)}%` }} />
        </div>
      </div>
    </div>
  );
}
