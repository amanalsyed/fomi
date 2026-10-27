import Workspace from "@/components/workspace/Workspace";
import { listGenerations, listHistory } from "@/lib/mock/data";

/**
 * The first screen is rendered on the server from the same mock data layer the
 * API routes use, so the workspace paints with content (no spinner flash).
 * Visit /?empty=1 to preview the empty state.
 */
export default async function Page({ searchParams }) {
  const { empty } = await searchParams;
  const showEmpty = empty === "1";

  return (
    <Workspace
      initialGenerations={showEmpty ? [] : listGenerations({ limit: 6 })}
      initialHistory={showEmpty ? [] : listHistory()}
    />
  );
}
