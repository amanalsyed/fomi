"use client";

import Icon from "@/components/ui/Icon";

const SUGGESTIONS = [
  "A glass greenhouse floating above the clouds at sunrise, soft pastel light",
  "Studio product photo of a ceramic coffee cup on a linen cloth, window light",
  "Cinematic wide shot of a lone cyclist crossing a misty mountain pass",
];

/** Shown when there are no creations yet. Suggestions fill the prompt box. */
export default function EmptyState({ onPick }) {
  return (
    <div className="mx-auto flex min-h-[50%] max-w-md flex-col items-center justify-center gap-4 px-4 py-12 text-center animate-fade-up">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-panel text-accent-ink">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent">
          <Icon name="sparkle" className="size-5" />
        </span>
      </span>
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold">Your canvas is empty</h2>
        <p className="text-[13px] leading-relaxed text-muted">
          Describe an idea in the panel and press Generate. Everything you make lands here, newest at the bottom.
        </p>
      </div>
      <ul className="flex w-full flex-col gap-2">
        {SUGGESTIONS.map((text) => (
          <li key={text}>
            <button
              type="button"
              onClick={() => onPick(text)}
              className="w-full rounded-xl bg-panel px-3.5 py-2.5 text-left text-xs leading-relaxed transition duration-150 hover:bg-panel-strong active:scale-[0.99]"
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
