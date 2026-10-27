"use client";

import { memo } from "react";
import PromptBubble from "@/components/feed/PromptBubble";
import ResultTile from "@/components/feed/ResultTile";
import { modelLabel, ratioToCss } from "@/lib/mock/constants";

export const ITEM_LAYOUT =
  "grid gap-3 @[52rem]:grid-cols-[15rem_minmax(0,1fr)] @[52rem]:items-end @[80rem]:grid-cols-[17rem_minmax(0,1fr)]";
export const GRID_LAYOUT =
  "grid grid-cols-2 gap-3 @md:grid-cols-3 @[52rem]:grid-cols-4";

/** A prompt bubble plus its grid of results. */
function GenerationItem({ generation, priority, highlighted, onReuse, onOpen }) {
  const aspectRatio = ratioToCss(generation.ratio);

  return (
    <article
      id={`gen-${generation.id}`}
      data-generation-id={generation.id}
      aria-label={`${generation.type === "video" ? "Videos" : "Images"} for: ${generation.prompt.slice(0, 60)}`}
      className={`${ITEM_LAYOUT} animate-fade-up scroll-mt-4 rounded-2xl`}
    >
      <PromptBubble
        prompt={generation.prompt}
        modelName={modelLabel(generation.model)}
        onReuse={() => onReuse(generation)}
      />
      <ul
        className={`${GRID_LAYOUT} rounded-xl ${highlighted ? "animate-flash" : ""}`}
        aria-label="Results"
      >
        {generation.results.map((result, index) => (
          <ResultTile
            key={result.id}
            result={result}
            index={index}
            total={generation.results.length}
            aspectRatio={aspectRatio}
            priority={priority}
            onOpen={(i) => onOpen(generation.id, i)}
          />
        ))}
      </ul>
    </article>
  );
}

export default memo(GenerationItem);
