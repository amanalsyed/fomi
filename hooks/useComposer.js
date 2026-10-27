"use client";

import { useCallback, useState } from "react";
import { DEFAULT_SETTINGS, IMAGE_COUNTS, VIDEO_COUNTS } from "@/lib/mock/constants";

/** State for the prompt panel (prompt text, mode and generation settings). */
export function useComposer() {
  const [mode, setModeState] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const update = useCallback((patch) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const setMode = useCallback((next) => {
    setModeState(next);
    setSettings((current) => {
      const allowed = next === "video" ? VIDEO_COUNTS : IMAGE_COUNTS;
      if (allowed.includes(current.count)) return current;
      return { ...current, count: next === "video" ? 2 : 4 };
    });
  }, []);

  return { mode, setMode, prompt, setPrompt, settings, update };
}
