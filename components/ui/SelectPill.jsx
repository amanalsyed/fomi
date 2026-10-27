import Icon from "@/components/ui/Icon";

/**
 * A pill-shaped control backed by a real <select>, so keyboard, screen-reader
 * and mobile pickers all behave natively. The visible text is `display`.
 */
export default function SelectPill({ label, display, value, onChange, options }) {
  return (
    <label className="relative inline-flex h-8 min-w-0 cursor-pointer items-center rounded-full bg-surface pl-3 pr-7 text-[11px] font-medium shadow-sm transition hover:shadow-md has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="truncate">
        {display}
      </span>
      <Icon name="chevron" className="pointer-events-none absolute right-2 size-3 text-muted" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
