"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Feed from "@/components/feed/Feed";
import HistoryStrip from "@/components/history/HistoryStrip";
import Header from "@/components/layout/Header";
import MainNav from "@/components/layout/MainNav";
import PromptPanel from "@/components/prompt/PromptPanel";
import { useToast } from "@/components/ui/Toast";
import { useComposer } from "@/hooks/useComposer";
import { useWorkspace } from "@/hooks/useWorkspace";
import { NAV_ITEMS } from "@/lib/nav";

// Only needed after a click, so keep it out of the initial bundle.
const Lightbox = dynamic(() => import("@/components/feed/Lightbox"), { ssr: false });

const CREDIT_COST = { image: 0.6, video: 2.5 };

export default function Workspace({ initialGenerations, initialHistory }) {
  const { notify } = useToast();
  const { mode, setMode, prompt, setPrompt, settings, update } = useComposer();
  const composer = { mode, setMode, prompt, setPrompt, settings, update };

  const promptRef = useRef(null);
  const highlightTimer = useRef(null);

  const [activeId, setActiveId] = useState(initialGenerations.at(-1)?.id ?? null);
  const [highlightId, setHighlightId] = useState(null);
  const [scrollSignal, setScrollSignal] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [creditsUsed, setCreditsUsed] = useState(24);

  const requestScroll = useCallback((kind, id) => {
    setScrollSignal({ kind, id, nonce: Date.now() });
  }, []);

  const handleComplete = useCallback((generation) => {
    const noun = generation.type === "video" ? "video" : "image";
    const count = generation.results.length;
    setAnnouncement(`Finished: ${count} ${noun}${count === 1 ? "" : "s"} ready.`);
    setActiveId(generation.id);
  }, []);

  const { generations, history, pending, loadingHistoryId, isGenerating, generate, retry, cancel, dismiss, ensureGeneration } =
    useWorkspace({
      initialGenerations,
      initialHistory,
      onComplete: handleComplete,
      onError: (error) => notify(error.message),
    });

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const handleSubmit = useCallback(() => {
    const text = prompt.trim();
    if (!text) return;
    generate({ prompt: text, mode, ...settings });
    setCreditsUsed((used) => Math.min(100, used + settings.count * CREDIT_COST[mode]));
    requestScroll("bottom");
  }, [prompt, mode, settings, generate, requestScroll]);

  const handleSelectHistory = useCallback(
    async (entry) => {
      const ready = await ensureGeneration(entry.generationId);
      if (!ready) return;
      setActiveId(entry.generationId);
      setHighlightId(entry.generationId);
      requestScroll("item", entry.generationId);
      clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightId(null), 1800);
    },
    [ensureGeneration, requestScroll],
  );

  const handleReuse = useCallback(
    (generation) => {
      setMode(generation.type);
      setPrompt(generation.prompt);
      update({ model: generation.model, ratio: generation.ratio, style: generation.style });
      promptRef.current?.focus();
      notify("Prompt loaded. Tweak it and generate again.");
    },
    [setMode, setPrompt, update, notify],
  );

  const handleNav = useCallback(
    (id) => {
      if (id === "home") {
        promptRef.current?.focus();
        requestScroll("bottom");
      } else if (id === "image" || id === "video") {
        setMode(id);
      } else {
        const label = NAV_ITEMS.find((item) => item.id === id)?.label ?? "This area";
        notify(`${label} isn't part of this build yet.`);
      }
    },
    [setMode, requestScroll, notify],
  );

  const comingSoon = useCallback((label) => () => notify(`${label} isn't part of this build yet.`), [notify]);

  const viewerGeneration = viewer && generations.find((g) => g.id === viewer.generationId);

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[1920px] flex-col overflow-hidden">
      <Header
        mode={mode}
        onNavSelect={handleNav}
        creditsUsed={creditsUsed}
        busy={isGenerating}
        onGallery={comingSoon("Gallery")}
        onSupport={comingSoon("Support")}
      />

      <HistoryStrip
        items={history}
        activeGenerationId={activeId}
        loadingGenerationId={loadingHistoryId}
        onSelect={handleSelectHistory}
        onViewAll={comingSoon("The full history view")}
      />

      <main className="flex min-h-0 flex-1 flex-col gap-3 px-3 pb-3 pt-3 md:flex-row md:gap-5 md:px-5 md:pb-5 3xl:gap-8">
        <PromptPanel composer={composer} promptRef={promptRef} onSubmit={handleSubmit} />
        <Feed
          generations={generations}
          pending={pending}
          highlightId={highlightId}
          scrollSignal={scrollSignal}
          onVisible={setActiveId}
          onReuse={handleReuse}
          onOpen={(generationId, index) => setViewer({ generationId, index })}
          onCancel={cancel}
          onRetry={retry}
          onDismiss={dismiss}
          onPickSuggestion={(text) => {
            setPrompt(text);
            promptRef.current?.focus();
          }}
        />
      </main>

      <div className="md:hidden">
        <MainNav variant="bottom" mode={mode} onSelect={handleNav} />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {viewerGeneration && (
        <Lightbox
          generation={viewerGeneration}
          index={viewer.index}
          onIndexChange={(index) => setViewer((current) => ({ ...current, index }))}
          onClose={() => setViewer(null)}
          onReuse={handleReuse}
        />
      )}
    </div>
  );
}
