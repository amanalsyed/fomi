"use client";

import { useId, useState } from "react";
import AdvancedSettings from "@/components/prompt/AdvancedSettings";
import ModeToggle from "@/components/prompt/ModeToggle";
import StylePicker from "@/components/prompt/StylePicker";
import Disclosure from "@/components/ui/Disclosure";
import Icon from "@/components/ui/Icon";
import SelectPill from "@/components/ui/SelectPill";
import {
  IMAGE_COUNTS,
  MAX_PROMPT_LENGTH,
  MODELS,
  RATIOS,
  VIDEO_COUNTS,
  modelLabel,
} from "@/lib/mock/constants";

/**
 * The creation panel. On md+ it is a left column; on mobile it docks to the
 * bottom as a compact composer with a “Tune” toggle for the extra controls.
 */
export default function PromptPanel({ composer, promptRef, onSubmit }) {
  const { mode, setMode, prompt, setPrompt, settings, update } = composer;
  const [tuneOpen, setTuneOpen] = useState(false);
  const id = useId();

  const isEmpty = prompt.trim().length === 0;
  const noun = mode === "video" ? "Video" : "Image";
  const counts = mode === "video" ? VIDEO_COUNTS : IMAGE_COUNTS;
  const countOptions = counts.map((n) => ({
    value: String(n),
    label: `${n} ${noun}${n === 1 ? "" : "s"}`,
  }));

  function handleSubmit(event) {
    event.preventDefault();
    if (isEmpty) {
      promptRef.current?.focus();
      return;
    }
    onSubmit();
  }

  function handleKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Create"
      className="order-2 flex max-h-[62dvh] shrink-0 flex-col gap-3 overflow-y-auto rounded-3xl bg-panel p-3 md:order-1 md:max-h-none md:w-[19rem] md:p-4 lg:w-80 3xl:w-96 thin-scroll"
    >
      <div className="flex items-center gap-2">
        <ModeToggle value={mode} onChange={setMode} className="flex-1" />
        <button
          type="button"
          onClick={() => setTuneOpen((open) => !open)}
          aria-expanded={tuneOpen}
          aria-controls={`${id}-options`}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-[11px] font-medium shadow-sm transition active:scale-95 md:hidden"
        >
          <Icon name="sliders" className="size-3.5" />
          Tune
        </button>
      </div>

      <div className="rounded-2xl border-[1.5px] border-ink bg-surface transition focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-panel">
        <label htmlFor={`${id}-prompt`} className="sr-only">
          Prompt
        </label>
        <textarea
          ref={promptRef}
          suppressHydrationWarning
          id={`${id}-prompt`}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_PROMPT_LENGTH}
          rows={3}
          aria-describedby={`${id}-hint`}
          aria-keyshortcuts="Control+Enter Meta+Enter"
          placeholder="Describe your imagination to be converted into a piece of art…"
          className="block w-full resize-none bg-transparent p-3.5 text-[13px] leading-relaxed outline-none placeholder:text-muted md:min-h-36 lg:min-h-44"
        />
        <p id={`${id}-hint`} className="sr-only">
          Press Control or Command plus Enter to generate.
        </p>
        <div className="flex items-center justify-between gap-2 px-3 pb-3">
          <span aria-hidden="true" className="text-[10px] tabular-nums text-muted">
            {prompt.length}/{MAX_PROMPT_LENGTH}
          </span>
          <button
            type="submit"
            aria-disabled={isEmpty}
            title={isEmpty ? "Describe your idea to enable Generate" : "Generate (Ctrl/⌘ + Enter)"}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-accent-ink shadow-sm transition duration-150 hover:bg-accent-hover hover:shadow-md active:scale-95 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 aria-disabled:shadow-none aria-disabled:hover:bg-accent aria-disabled:active:scale-100"
          >
            <Icon
              name="sparkle"
              className="size-4 transition-transform duration-300 group-hover:rotate-12 group-aria-disabled:rotate-0"
            />
            Generate
          </button>
        </div>
      </div>

      <div
        id={`${id}-options`}
        className={`${tuneOpen ? "flex" : "hidden"} flex-col gap-3 md:flex`}
      >
        <div className="flex flex-wrap gap-2">
          <SelectPill
            label="Number of outputs"
            display={`${settings.count} ${noun}${settings.count === 1 ? "" : "s"}`}
            value={String(settings.count)}
            onChange={(value) => update({ count: Number(value) })}
            options={countOptions}
          />
          <SelectPill
            label="Aspect ratio"
            display={settings.ratio}
            value={settings.ratio}
            onChange={(value) => update({ ratio: value })}
            options={RATIOS.map((ratio) => ({ value: ratio.value, label: ratio.value }))}
          />
          <SelectPill
            label="Model"
            display={`Model: ${modelLabel(settings.model)}`}
            value={settings.model}
            onChange={(value) => update({ model: value })}
            options={MODELS}
          />
        </div>

        <Disclosure label="Advance">
          <AdvancedSettings settings={settings} onChange={update} />
        </Disclosure>
        <Disclosure label="Styles">
          <StylePicker value={settings.style} onChange={(style) => update({ style })} />
        </Disclosure>
      </div>
    </form>
  );
}
