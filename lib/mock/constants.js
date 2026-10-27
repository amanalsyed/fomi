/** Shared option lists used by both the mocked API and the UI. */

export const MODES = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

export const IMAGE_COUNTS = [1, 2, 4, 8];
export const VIDEO_COUNTS = [1, 2, 4];

export const RATIOS = [
  { value: "1:1", css: "1 / 1" },
  { value: "3:4", css: "3 / 4" },
  { value: "4:3", css: "4 / 3" },
  { value: "9:16", css: "9 / 16" },
  { value: "16:9", css: "16 / 9" },
];

export const MODELS = [
  { value: "fomi-core", label: "Fomi Core" },
  { value: "fomi-pro", label: "Fomi Pro" },
  { value: "fomi-turbo", label: "Fomi Turbo" },
];

export const STYLES = [
  { value: "none", label: "None" },
  { value: "photoreal", label: "Photoreal" },
  { value: "cinematic", label: "Cinematic" },
  { value: "anime", label: "Anime" },
  { value: "watercolor", label: "Watercolor" },
  { value: "3d", label: "3D render" },
  { value: "minimal", label: "Minimal" },
];

export const MAX_PROMPT_LENGTH = 1000;

export const DEFAULT_SETTINGS = {
  count: 4,
  ratio: "3:4",
  model: "fomi-pro",
  style: "none",
  negativePrompt: "",
  seed: "",
  guidance: 7,
  steps: 30,
};

export function ratioToCss(value) {
  return RATIOS.find((r) => r.value === value)?.css ?? "3 / 4";
}

export function modelLabel(value) {
  return MODELS.find((m) => m.value === value)?.label ?? value;
}
