import { NextResponse } from "next/server";
import { listHistory } from "@/lib/mock/data";

/** GET /api/history → lightweight history entries, newest first. */
export async function GET() {
  return NextResponse.json({ history: listHistory() });
}
