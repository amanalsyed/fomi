import { NextResponse } from "next/server";
import { getGeneration } from "@/lib/mock/data";

/** GET /api/generations/:id → a single generation (used by the history strip). */
export async function GET(_request, { params }) {
  const { id } = await params;
  const generation = getGeneration(id);

  if (!generation) {
    return NextResponse.json({ error: "Generation not found." }, { status: 404 });
  }
  return NextResponse.json({ generation });
}
