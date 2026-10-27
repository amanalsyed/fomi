"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import EmptyState from "@/components/feed/EmptyState";
import GenerationItem from "@/components/feed/GenerationItem";
import PendingItem from "@/components/feed/PendingItem";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The scrolling column of creations (oldest at the top, newest at the bottom).
 * It is a size container, so grid columns respond to the space it actually has.
 */
export default function Feed({
  generations,
  pending,
  highlightId,
  scrollSignal,
  onVisible,
  onReuse,
  onOpen,
  onCancel,
  onRetry,
  onDismiss,
  onPickSuggestion,
}) {
  const scrollerRef = useRef(null);
  const lastIndex = generations.length - 1;

  // Start at the newest work.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Honour scroll requests from the workspace (new generation, history click, Home).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !scrollSignal) return;
    const behavior = prefersReducedMotion() ? "auto" : "smooth";

    if (scrollSignal.kind === "bottom") {
      el.scrollTo({ top: el.scrollHeight, behavior });
      return;
    }
    const scrollToItem = () => {
      const node = el.querySelector(`#gen-${CSS.escape(scrollSignal.id)}`);
      node?.scrollIntoView({ block: "center", behavior });
      return Boolean(node);
    };

    // The item may have been inserted in this same render pass; retry once next frame.
    if (!scrollToItem()) requestAnimationFrame(scrollToItem);
  }, [scrollSignal]);

  // Tell the workspace which generation is crossing the middle of the viewport.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !onVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onVisible(entry.target.dataset.generationId);
        }
      },
      { root, rootMargin: "-45% 0px -45% 0px" },
    );
    root.querySelectorAll("[data-generation-id]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [generations.length, onVisible]);

  const isEmpty = generations.length === 0 && pending.length === 0;

  return (
    <section
      ref={scrollerRef}
      aria-label="Creations"
      className="@container thin-scroll order-1 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-3xl md:order-2 md:pr-1 [mask-image:linear-gradient(to_bottom,transparent,#000_14px)]"
    >
      {isEmpty ? (
        <EmptyState onPick={onPickSuggestion} />
      ) : (
        <div className="flex flex-col gap-6 pb-2 pt-3 @[52rem]:gap-8 @[80rem]:gap-10">
          {generations.map((generation, index) => (
            <GenerationItem
              key={generation.id}
              generation={generation}
              priority={index === lastIndex}
              highlighted={generation.id === highlightId}
              onReuse={onReuse}
              onOpen={onOpen}
            />
          ))}
          {pending.map((item) => (
            <PendingItem
              key={item.tempId}
              item={item}
              onCancel={onCancel}
              onRetry={onRetry}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      )}
    </section>
  );
}
