"use client";

import { useId } from "react";
import Icon from "@/components/ui/Icon";

const fieldClass =
  "h-9 w-full rounded-xl border border-line bg-bg px-3 text-xs outline-none transition placeholder:text-muted focus:border-ink/50 focus-visible:ring-2 focus-visible:ring-ring";

function Field({ label, htmlFor, children, trailing }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-[11px] font-medium">
          {label}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}

export default function AdvancedSettings({ settings, onChange }) {
  const id = useId();

  return (
    <div className="flex flex-col gap-3.5">
      <Field label="Negative prompt" htmlFor={`${id}-negative`}>
        <input
          id={`${id}-negative`}
          type="text"
          value={settings.negativePrompt}
          onChange={(event) => onChange({ negativePrompt: event.target.value })}
          placeholder="What to avoid…"
          maxLength={200}
          className={fieldClass}
        />
      </Field>

      <Field label="Seed" htmlFor={`${id}-seed`}>
        <div className="flex gap-2">
          <input
            id={`${id}-seed`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={settings.seed}
            onChange={(event) => onChange({ seed: event.target.value.replace(/\D/g, "").slice(0, 9) })}
            placeholder="Random"
            className={fieldClass}
          />
          <button
            type="button"
            aria-label="Randomize seed"
            title="Randomize seed"
            onClick={() => onChange({ seed: String(Math.floor(Math.random() * 999_999_999)) })}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-bg transition duration-150 hover:border-ink/40 active:scale-90"
          >
            <Icon name="dice" className="size-4" />
          </button>
        </div>
      </Field>

      <Field
        label="Guidance"
        htmlFor={`${id}-guidance`}
        trailing={<output htmlFor={`${id}-guidance`} className="text-[11px] tabular-nums text-muted">{settings.guidance}</output>}
      >
        <input
          id={`${id}-guidance`}
          type="range"
          min={1}
          max={20}
          step={0.5}
          value={settings.guidance}
          onChange={(event) => onChange({ guidance: Number(event.target.value) })}
          className="w-full accent-[var(--ring)]"
        />
      </Field>

      <Field
        label="Steps"
        htmlFor={`${id}-steps`}
        trailing={<output htmlFor={`${id}-steps`} className="text-[11px] tabular-nums text-muted">{settings.steps}</output>}
      >
        <input
          id={`${id}-steps`}
          type="range"
          min={10}
          max={60}
          step={1}
          value={settings.steps}
          onChange={(event) => onChange({ steps: Number(event.target.value) })}
          className="w-full accent-[var(--ring)]"
        />
      </Field>
    </div>
  );
}
