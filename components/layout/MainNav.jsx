"use client";

import Icon from "@/components/ui/Icon";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Primary navigation. “Home” is the current page; “Image” and “Video” reflect
 * (and change) the creation mode. `variant` switches between the header row
 * (desktop/tablet) and the bottom tab bar (mobile).
 */
export default function MainNav({ variant = "top", mode, onSelect }) {
  const isTop = variant === "top";

  return (
    <nav
      aria-label="Primary"
      className={
        isTop
          ? "flex items-center gap-1"
          : "grid grid-cols-5 border-t border-line bg-bg px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1"
      }
    >
      {NAV_ITEMS.map((item) => {
        const isMode = item.id === "image" || item.id === "video";
        const isCurrent = item.id === "home";
        const selected = isCurrent || (isMode && item.id === mode);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={isCurrent ? "page" : undefined}
            aria-pressed={isMode ? item.id === mode : undefined}
            title={item.label}
            className={`group relative flex items-center justify-center rounded-xl transition duration-150 active:scale-90 ${
              isTop ? "size-9 hover:bg-panel" : "flex-col gap-0.5 py-1.5 hover:bg-panel"
            } ${selected ? "text-ink" : "text-muted hover:text-ink"} ${selected && isTop ? "bg-panel" : ""}`}
          >
            <Icon name={item.icon} className="size-[18px]" strokeWidth={selected ? 2.3 : 1.8} />
            <span className={isTop ? "sr-only" : "text-[10px] font-medium"}>{item.label}</span>
            {selected && !isTop && (
              <span
                aria-hidden="true"
                className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-accent"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
