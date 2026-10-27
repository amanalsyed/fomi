import { STYLES } from "@/lib/mock/constants";

/** Single-choice style chips (native radios, so keyboard + screen readers just work). */
export default function StylePicker({ value, onChange }) {
  return (
    <fieldset>
      <legend className="sr-only">Style</legend>
      <div className="flex flex-wrap gap-1.5">
        {STYLES.map((style) => (
          <label
            key={style.value}
            className="cursor-pointer rounded-full border border-line bg-bg px-3 py-1.5 text-[11px] font-medium transition duration-150 hover:border-ink/40 active:scale-95 has-[:checked]:border-transparent has-[:checked]:bg-accent has-[:checked]:text-accent-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
          >
            <input
              type="radio"
              name="style"
              value={style.value}
              checked={value === style.value}
              onChange={() => onChange(style.value)}
              className="sr-only"
            />
            {style.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
