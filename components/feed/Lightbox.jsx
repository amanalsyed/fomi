"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import FadeImage from "@/components/ui/FadeImage";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { modelLabel } from "@/lib/mock/constants";

/**
 * Full-size viewer built on the native <dialog>: focus trapping, Esc to close
 * and focus restoration come from the platform. Arrow keys move between results.
 * Loaded lazily (next/dynamic) because it is only needed after a click.
 */
export default function Lightbox({ generation, index, onIndexChange, onClose, onReuse }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const total = generation.results.length;
  const result = generation.results[index];
  const isVideo = result.type === "video";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const go = useCallback(
    (delta) => onIndexChange((index + delta + total) % total),
    [index, total, onIndexChange],
  );

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="animate-pop m-auto w-[min(96vw,70rem)] max-w-none overflow-hidden rounded-3xl bg-surface p-0 text-ink shadow-float backdrop:bg-scrim backdrop:backdrop-blur-sm"
    >
      <div className="grid max-h-[94dvh] overflow-y-auto md:grid-cols-[minmax(0,1fr)_20rem] md:overflow-hidden">
        <div className="relative bg-ink/95">
          <div className="relative h-[58dvh] w-full md:h-[min(86dvh,56rem)]">
            {isVideo ? (
              <video
                key={result.id}
                src={result.src}
                poster={result.poster}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-contain"
              />
            ) : (
              <FadeImage
                key={result.id}
                src={result.src}
                alt={result.alt}
                sizes="(min-width: 768px) 60vw, 96vw"
                priority
                className="object-contain"
              />
            )}
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous result"
                className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-scrim text-white backdrop-blur transition hover:scale-110 active:scale-90"
              >
                <Icon name="left" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next result"
                className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-scrim text-white backdrop-blur transition hover:scale-110 active:scale-90"
              >
                <Icon name="right" />
              </button>
            </>
          )}
        </div>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id={titleId} className="text-sm font-semibold">
                {isVideo ? "Video" : "Image"} details
              </h2>
              <p aria-live="polite" className="mt-0.5 text-[11px] tabular-nums text-muted">
                {index + 1} of {total} · {modelLabel(generation.model)}
              </p>
            </div>
            <IconButton
              icon="close"
              label="Close viewer"
              onClick={() => dialogRef.current?.close()}
              className="bg-panel"
            />
          </div>

          <p className="thin-scroll min-h-0 overflow-y-auto rounded-2xl bg-panel p-3.5 text-[12px] leading-[1.6]">
            {generation.prompt}
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={result.src}
              download={`fomi-${result.id}${isVideo ? ".mp4" : ".webp"}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-accent-ink shadow-sm transition hover:bg-accent-hover active:scale-95"
            >
              <Icon name="download" className="size-4" />
              Download
            </a>
            <button
              type="button"
              onClick={() => {
                onReuse(generation);
                dialogRef.current?.close();
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-panel px-4 text-xs font-medium transition hover:bg-panel-strong active:scale-95"
            >
              <Icon name="reuse" className="size-4" />
              Reuse prompt
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
