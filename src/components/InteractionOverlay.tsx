import type { ReactNode } from "react";
import { DISTRICT_LABELS, getPortfolioContent } from "../content/portfolioContent";
import { useGameStore } from "../store/useGameStore";

export function InteractionOverlay() {
  const isInteracting = useGameStore((state) => state.isInteracting);
  const activeLandmarkId = useGameStore((state) => state.activeLandmarkId);
  const closeInteraction = useGameStore((state) => state.closeInteraction);
  const content = getPortfolioContent(activeLandmarkId);

  if (!isInteracting) return null;

  return (
    <div
      data-testid="interaction-panel"
      data-ignore-game-drag
      className="interaction-panel fixed right-4 top-4 z-10 flex max-h-[calc(100vh-32px)] w-[min(430px,calc(100vw-32px))] flex-col overflow-hidden rounded-lg border border-[#241006]/25 bg-[#fff8ef]/95 font-sans text-[#241006] shadow-[0_22px_70px_rgba(36,16,6,0.24)] backdrop-blur-md sm:right-6 sm:top-6 sm:max-h-[calc(100vh-48px)]"
    >
      <div className="border-b border-[#241006]/15 bg-[#241006] px-4 py-3 text-[#fff8ef]">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f0c66e]">
          {content ? DISTRICT_LABELS[content.district] : "Unknown District"}
        </div>
        <div className="mt-1 text-xl font-black leading-tight">{content?.title ?? activeLandmarkId}</div>
        {content ? (
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#fff8ef]/80">
            <span>{content.status}</span>
            {content.dateRange ? <span>{content.dateRange}</span> : null}
            {content.location ? <span>{content.location}</span> : null}
          </div>
        ) : null}
      </div>
      <div className="overflow-auto px-4 py-4">
        {content ? (
          <>
            <Section title="Overview">
              <p className="text-sm leading-relaxed">{content.summary}</p>
            </Section>
            <Section title="Signals">
              <div className="flex flex-wrap gap-1.5">
                {content.metrics.map((metric) => (
                  <span key={metric} className="rounded bg-[#f0c66e] px-2 py-1 text-xs font-bold text-[#241006]">
                    {metric}
                  </span>
                ))}
              </div>
            </Section>
            <Section title="Highlights">
              <ul className="space-y-2 text-sm leading-relaxed">
                {content.highlights.map((highlight) => (
                  <li key={highlight} className="pl-3 before:mr-2 before:content-['•']">
                    {highlight}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Tech">
              <div className="flex flex-wrap gap-1.5">
                {content.techStack.map((tech) => (
                  <span key={tech} className="rounded border border-[#241006]/20 px-2 py-1 text-xs font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </Section>
            {content.links?.length ? (
              <Section title="Links">
                <div className="flex flex-wrap gap-2">
                  {content.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="rounded bg-[#246a73] px-3 py-2 text-xs font-bold text-[#fff8ef]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </Section>
            ) : null}
          </>
        ) : (
          <p className="text-sm leading-relaxed">Missing landmark content.</p>
        )}
      </div>
      <div className="border-t border-[#241006]/15 px-4 py-3">
        <button
          type="button"
          className="w-full rounded bg-[#241006] px-3 py-2 text-sm font-bold text-[#fff8ef]"
          onClick={closeInteraction}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4 last:mb-0">
      <h2 className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#b45f24]">
        {title}
      </h2>
      {children}
    </section>
  );
}


