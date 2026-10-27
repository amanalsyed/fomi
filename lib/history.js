import { shorten } from "@/lib/text";

/** Lightweight history-strip entry derived from a generation. */
export function toHistoryEntry(generation) {
  return {
    id: `hist-${generation.id}`,
    generationId: generation.id,
    type: generation.type,
    title: shorten(generation.prompt, 60),
    thumb: generation.results[0].thumb,
    createdAt: generation.createdAt,
  };
}
