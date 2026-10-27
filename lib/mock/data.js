/**
 * Mock "database" for the assessment.
 *
 * Everything here is static / deterministic so the UI is easy to reason about.
 * The API route handlers in app/api/* are the only consumers (plus the server
 * component in app/page.js, which reads it directly for first paint).
 */

import { toHistoryEntry } from "@/lib/history";
import { shorten } from "@/lib/text";

const IMAGE_POOL_SIZE = 56;
const VIDEO_POOL_SIZE = 4;

const pad = (n) => String(n).padStart(2, "0");

const SEED_PROMPTS = [
  "A foggy pine forest at dawn, shafts of golden light cutting through the trees, cinematic wide shot, muted greens",
  "Neon-lit alleyway in a rainy futuristic city, reflections on wet asphalt, a lone figure under a translucent umbrella",
  "Minimal product shot of a glass perfume bottle on a pastel pink pedestal, soft studio lighting, subtle shadow",
  "Macro photograph of dew drops on a spider web at sunrise, shallow depth of field, bokeh in warm amber tones",
  "Slow aerial glide over a turquoise coastline at golden hour, waves breaking on white sand",
  "Surreal desert with floating stone arches, two moons in a violet sky, ultra detailed matte painting",
  "Portrait of an elderly fisherman with deep wrinkles, natural window light, 85mm lens, film grain",
  "Isometric cutaway of a cozy bookshop café, tiny people, warm lamps, pastel palette, 3D render",
  "Abstract flowing ink in water, deep indigo and gold, high-speed photography on a black background",
  "A paper-cut diorama of a mountain village at night, layered shadows, lanterns glowing orange",
  "Time-lapse of storm clouds rolling over a wheat field, dramatic light, cinematic color grade",
  "Futuristic electric motorcycle on a salt flat at dusk, long exposure light trails, editorial automotive photography",
  "Watercolor illustration of a fox sleeping in autumn leaves, soft edges, visible paper texture",
  "A professional portrait photograph of a smiling 31-year-old redheaded woman with warm brown eyes and softly tousled auburn hair framing her face. She is turned slightly towards the viewer, offering a genuine and approachable expression. She is wearing a cream-colored cashmere sweater and delicate gold earrings. The background is a softly blurred expanse of muted gray and beige tones, suggesting a modern art gallery. There is subtle directional lighting.",
];

const SEED_MODELS = ["fomi-pro", "fomi-core", "fomi-turbo", "fomi-pro", "fomi-turbo", "fomi-pro", "fomi-core", "fomi-turbo", "fomi-pro", "fomi-core", "fomi-pro", "fomi-turbo", "fomi-core", "fomi-pro"];

// Seed indexes (0 = oldest) that are video generations.
const VIDEO_SEEDS = new Set([4, 10]);

function imageResult(poolIndex, k, total, prompt) {
  const n = pad((poolIndex % IMAGE_POOL_SIZE) + 1);
  return {
    id: `img-${n}-${k}`,
    type: "image",
    src: `/generated/gen-${n}.webp`,
    thumb: `/thumbs/thumb-${n}.webp`,
    width: 720,
    height: 960,
    alt: `Generated image ${k + 1} of ${total} for prompt: ${shorten(prompt)}`,
  };
}

function videoResult(poolIndex, k, total, prompt) {
  const n = pad((poolIndex % VIDEO_POOL_SIZE) + 1);
  return {
    id: `vid-${n}-${k}`,
    type: "video",
    src: `/videos/clip-${n}.mp4`,
    poster: `/videos/poster-${n}.webp`,
    thumb: `/thumbs/thumb-v${n}.webp`,
    width: 480,
    height: 640,
    alt: `Generated video ${k + 1} of ${total} for prompt: ${shorten(prompt)}`,
  };
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildSeedGenerations() {
  const now = Date.now();
  let imageGen = 0;
  let videoGen = 0;

  return SEED_PROMPTS.map((prompt, i) => {
    const isVideo = VIDEO_SEEDS.has(i);
    const count = isVideo ? 2 : 4;
    const results = Array.from({ length: count }, (_, k) =>
      isVideo
        ? videoResult(videoGen * 2 + k, k, count, prompt)
        : imageResult(imageGen * 4 + k, k, count, prompt),
    );
    if (isVideo) videoGen += 1;
    else imageGen += 1;

    return {
      id: `gen-seed-${pad(i + 1)}`,
      type: isVideo ? "video" : "image",
      prompt,
      model: SEED_MODELS[i],
      ratio: "3:4",
      style: "none",
      createdAt: new Date(now - (SEED_PROMPTS.length - i) * 47 * 60 * 1000).toISOString(),
      results,
    };
  });
}

const SEED_GENERATIONS = buildSeedGenerations();

/** Oldest → newest, mirroring how the feed is displayed. */
export function listGenerations({ limit = 6 } = {}) {
  const all = SEED_GENERATIONS;
  return all.slice(Math.max(all.length - limit, 0));
}

export function getGeneration(id) {
  return SEED_GENERATIONS.find((g) => g.id === id) ?? null;
}

/** Newest → oldest, as shown in the history strip. */
export function listHistory() {
  return [...SEED_GENERATIONS].reverse().map(toHistoryEntry);
}

/** Builds a fresh generation from request params (nothing is persisted). */
export function createMockGeneration({ prompt, mode, count, ratio, model, style }) {
  const seed = hash(`${prompt}|${mode}|${model}`);
  const results = Array.from({ length: count }, (_, k) =>
    mode === "video"
      ? videoResult(seed + k, k, count, prompt)
      : imageResult(seed + k * 7, k, count, prompt),
  );

  return {
    id: `gen-${Date.now().toString(36)}-${(seed % 1296).toString(36)}`,
    type: mode,
    prompt,
    model,
    ratio,
    style,
    createdAt: new Date().toISOString(),
    results,
  };
}
