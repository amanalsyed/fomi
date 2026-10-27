"use client";

import { useId, useState } from "react";
import Icon from "@/components/ui/Icon";

/** Animated accordion row (used for “Advance” and “Styles”). */
export default function Disclosure({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="rounded-2xl bg-surface shadow-sm">
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
          className="relative flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-[13px] font-medium transition active:scale-[0.99]"
        >
          {label}
          <Icon
            name="chevron"
            className={`absolute right-4 size-3.5 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
