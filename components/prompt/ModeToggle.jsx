import { MODES } from "@/lib/mock/constants";

/** Segmented Image / Video switch built on native radios (arrow keys work for free). */
export default function ModeToggle({ value, onChange, className = "" }) {
  return (
    <div
      role="radiogroup"
      aria-label="Output type"
      className={`relative grid grid-cols-2 rounded-full bg-surface p-1 text-[11px] font-medium shadow-sm ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-panel-strong transition-transform duration-300 ease-out ${
          value === "video" ? "translate-x-full" : ""
        }`}
      />
      {MODES.map((mode) => (
        <label
          key={mode.value}
          className="relative z-10 cursor-pointer rounded-full py-1.5 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-ring"
        >
          <input
            type="radio"
            name="mode"
            value={mode.value}
            checked={value === mode.value}
            onChange={() => onChange(mode.value)}
            className="sr-only"
          />
          {mode.label}
        </label>
      ))}
    </div>
  );
}
