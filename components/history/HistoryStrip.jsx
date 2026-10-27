"use client";

import { useEffect, useRef } from "react";
import FadeImage from "@/components/ui/FadeImage";
import Icon from "@/components/ui/Icon";

/** Horizontally scrolling strip of recent creations. Selecting one jumps the feed to it. */
export default function HistoryStrip({
  items,
  activeGenerationId,
  loadingGenerationId,
  onSelect,
  onViewAll,
}) {
  const listRef = useRef(null);

  // Keep the thumbnail for whatever is in view visible in the strip.
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeGenerationId]);

  return (
    <section
      aria-label="History"
      className="relative z-10 mx-3 mt-3 flex items-stretch gap-2 rounded-2xl bg-surface p-2 shadow-float md:mx-5 md:gap-3"
    >
      <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-bg px-3 text-center md:px-4">
        <h2 className="text-xs font-semibold leading-tight">History</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="rounded text-[10px] text-muted underline-offset-2 transition hover:text-ink hover:underline"
        >
          View All
        </button>
      </div>

      {items.length === 0 ? (
        <p className="flex flex-1 items-center px-2 text-xs text-muted">
          Your creations will show up here.
        </p>
      ) : (
        <ul
          ref={listRef}
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scroll-smooth px-1 py-1 [mask-image:linear-gradient(to_right,transparent,#000_10px,#000_calc(100%-10px),transparent)]"
        >
          {items.map((item) => {
            const active = item.generationId === activeGenerationId;
            const loading = item.generationId === loadingGenerationId;

            return (
              <li key={item.id} className={`shrink-0 ${item.fresh ? "animate-pop" : ""}`}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  aria-current={active ? "true" : undefined}
                  aria-busy={loading}
                  aria-label={`${item.type === "video" ? "Video" : "Image"}: ${item.title}`}
                  title={item.title}
                  className={`group relative block size-12 overflow-hidden rounded-lg bg-panel ring-2 transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 md:size-14 ${
                    active ? "ring-accent" : "ring-transparent"
                  }`}
                >
                  <FadeImage
                    src={item.thumb}
                    alt=""
                    sizes="56px"
                    className="object-cover transition duration-300 group-hover:scale-110"
                  />
                  {item.type === "video" && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 right-0.5 rounded-full bg-scrim p-0.5 text-white"
                    >
                      <Icon name="play" className="size-2.5" filled strokeWidth={0} />
                    </span>
                  )}
                  {loading && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-scrim"
                    >
                      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
