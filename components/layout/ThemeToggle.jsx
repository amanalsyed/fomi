"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

/** Light/dark toggle. Both icons are rendered and swapped by CSS to avoid hydration flicker. */
export default function ThemeToggle() {
  const [pressed, setPressed] = useState(undefined);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    setPressed(next === "dark");
    try {
      localStorage.setItem("fomi-theme", next);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={pressed}
      title="Toggle dark mode"
      className="inline-flex size-8 items-center justify-center rounded-full text-muted transition duration-150 hover:bg-surface hover:text-ink active:scale-90"
    >
      <Icon name="moon" className="size-4 dark:hidden" />
      <Icon name="sun" className="hidden size-4 dark:block" />
    </button>
  );
}
