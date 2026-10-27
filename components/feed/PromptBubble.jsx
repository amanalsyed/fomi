"use client";

import { useState } from "react";
import IconButton from "@/components/ui/IconButton";

/** The prompt that produced a result set, with its model tag and quick actions. */
export default function PromptBubble({ prompt, modelName, onReuse, children }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = prompt.length > 180;

  return (
    <div className="rounded-2xl rounded-bl-md bg-panel p-3.5 text-[12px] leading-[1.6]">
      <p className={!expanded && isLong ? "line-clamp-4 @[52rem]:line-clamp-none" : ""}>{prompt}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-1 text-[11px] font-medium underline underline-offset-2 @[52rem]:hidden"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="truncate rounded-md bg-surface px-2 py-1 text-[11px] font-medium shadow-sm">
          {modelName}
        </span>
        <div className="flex items-center gap-0.5">
          {children}
          {onReuse && <IconButton icon="reuse" label="Reuse this prompt" onClick={onReuse} />}
        </div>
      </div>
    </div>
  );
}
