import { useProgress } from "@react-three/drei";
import { clearAvatarModelCache } from "../components/visuals/avatar/avatarAsset";
import { useAvatarStore } from "../store/useAvatarStore";

export function LoadingOverlay() {
  const { active, progress } = useProgress();
  const status = useAvatarStore((state) => state.status);
  const beginRetry = useAvatarStore((state) => state.beginRetry);

  if (status === "ready") return null;

  const failed = status === "error";
  const displayProgress = active ? Math.round(progress) : status === "retrying" ? 18 : 8;

  function retry() {
    clearAvatarModelCache();
    beginRetry();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(255,210,186,0.84),rgba(107,145,201,0.78)_48%,rgba(36,16,6,0.88))] px-4 font-sans backdrop-blur-sm"
      data-testid="avatar-loading-gate"
    >
      <div className="w-[min(380px,calc(100vw-32px))] rounded-3xl border border-[#fff8ef]/45 bg-[#fff8ef]/92 px-6 py-6 text-[#241006] shadow-[0_24px_80px_rgba(36,16,6,0.35)]">
        <div className="text-center text-[11px] font-black uppercase tracking-[0.32em] text-[#246a73]">
          Entering Elbaph
        </div>
        <div className="mt-2 text-center text-2xl font-black">Calling the Nimbus</div>
        <p className="mt-2 text-center text-sm font-semibold text-[#775848]">
          {failed
            ? "The signal flickered. Try calling Goku again."
            : "Preparing your guide and the floating world."}
        </p>
        <div className="mt-5 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em]">
          <span>
            {failed ? "Avatar unavailable" : status === "retrying" ? "Trying again" : "Loading world"}
          </span>
          <span>{failed ? "!" : `${displayProgress}%`}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[#241006]/15">
          <div
            className="h-full rounded bg-gradient-to-r from-[#246a73] via-[#8e7cc3] to-[#f0c66e] transition-[width] duration-300"
            style={{ width: `${failed ? 100 : displayProgress}%` }}
          />
        </div>
        {failed ? (
          <button
            type="button"
            onClick={retry}
            className="mt-5 w-full rounded-xl bg-[#246a73] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg transition hover:bg-[#194f57]"
          >
            Retry Goku
          </button>
        ) : null}
      </div>
    </div>
  );
}
