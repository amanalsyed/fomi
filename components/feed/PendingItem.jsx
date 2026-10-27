"use client";

import { GRID_LAYOUT, ITEM_LAYOUT } from "@/components/feed/GenerationItem";
import Icon from "@/components/ui/Icon";
import { modelLabel, ratioToCss } from "@/lib/mock/constants";

/** An in-flight (or failed) generation: skeleton tiles, status, cancel / retry. */
export default function PendingItem({ item, onCancel, onRetry, onDismiss }) {
  const { request, status, error } = item;
  const failed = status === "error";
  const aspectRatio = ratioToCss(request.ratio);
  const noun = request.mode === "video" ? "video" : "image";

  return (
    <article
      aria-label={failed ? "Generation failed" : "Generating"}
      aria-busy={!failed}
      className={`${ITEM_LAYOUT} animate-fade-up rounded-2xl`}
    >
      <div className="rounded-2xl rounded-bl-md bg-panel p-3.5 text-[12px] leading-[1.6]">
        <p className="line-clamp-6">{request.prompt}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate rounded-md bg-surface px-2 py-1 text-[11px] font-medium shadow-sm">
            {modelLabel(request.model)}
          </span>
          {!failed && (
            <button
              type="button"
              onClick={() => onCancel(item.tempId)}
              className="rounded-md px-2 py-1 text-[11px] font-medium underline underline-offset-2 transition hover:bg-surface active:scale-95"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {failed ? (
        <div
          role="alert"
          className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink/30 bg-panel/60 p-6 text-center"
        >
          <p className="max-w-xs text-sm font-medium">{error}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRetry(item.tempId)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-accent-ink shadow-sm transition hover:bg-accent-hover active:scale-95"
            >
              <Icon name="retry" className="size-3.5" />
              Retry
            </button>
            <button
              type="button"
              onClick={() => onDismiss(item.tempId)}
              className="inline-flex h-9 items-center rounded-full bg-surface px-4 text-xs font-medium shadow-sm transition hover:shadow-md active:scale-95"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <ul className={GRID_LAYOUT} aria-hidden="true">
          {Array.from({ length: request.count }, (_, index) => (
            <li
              key={index}
              className="skeleton animate-shimmer relative overflow-hidden rounded-xl"
              style={{ aspectRatio, animationDelay: `${index * 120}ms` }}
            >
              <span className="absolute inset-x-0 bottom-3 text-center text-[10px] font-medium text-muted">
                Creating {noun} {index + 1}…
              </span>
            </li>
          ))}
        </ul>
      )}

      {!failed && (
        <p role="status" className="sr-only">
          Generating {request.count} {noun}
          {request.count === 1 ? "" : "s"}…
        </p>
      )}
    </article>
  );
}
