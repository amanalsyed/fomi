import { NextResponse } from "next/server";
import {
  IMAGE_COUNTS,
  MAX_PROMPT_LENGTH,
  MODELS,
  RATIOS,
  VIDEO_COUNTS,
} from "@/lib/mock/constants";
import { createMockGeneration, listGenerations } from "@/lib/mock/data";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** GET /api/generations?limit=6 → latest generations, oldest first. */
export async function GET(request) {
  const limit = Number(new URL(request.url).searchParams.get("limit")) || 6;
  return NextResponse.json({ generations: listGenerations({ limit }) });
}

/**
 * POST /api/generations
 * Body: { prompt, mode, count, ratio, model, style }
 * Simulates model latency, then returns a deterministic mock result set.
 * Include "[fail]" in the prompt to exercise the error state.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const mode = body.mode === "video" ? "video" : "image";
  const counts = mode === "video" ? VIDEO_COUNTS : IMAGE_COUNTS;
  const count = counts.includes(Number(body.count)) ? Number(body.count) : counts[0];
  const ratio = RATIOS.some((r) => r.value === body.ratio) ? body.ratio : "3:4";
  const model = MODELS.some((m) => m.value === body.model) ? body.model : MODELS[0].value;
  const style = typeof body.style === "string" ? body.style : "none";

  if (!prompt) {
    return NextResponse.json({ error: "Please describe what you want to create." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Prompts are limited to ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 },
    );
  }

  // Simulated inference time: videos take a little longer than images.
  await sleep(mode === "video" ? 3200 : 1800 + (prompt.length % 700));

  if (prompt.toLowerCase().includes("[fail]")) {
    return NextResponse.json(
      { error: "The model is busy right now. Please try again." },
      { status: 503 },
    );
  }

  const generation = createMockGeneration({ prompt, mode, count, ratio, model, style });
  return NextResponse.json({ generation }, { status: 201 });
}
