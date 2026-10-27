/**
 * Thin meter above the main navigation. Shows credits used; while a generation
 * is running it turns into an indeterminate sweep so progress is always visible.
 */
export default function CreditsMeter({ used, busy }) {
  const value = Math.round(used);

  return (
    <div
      role="progressbar"
      aria-label="Credits used"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`${value}% of credits used`}
      aria-busy={busy}
      className="relative h-1 w-full max-w-72 overflow-hidden rounded-full bg-line"
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
      {busy && (
        <span
          aria-hidden="true"
          className="animate-sweep absolute inset-y-0 left-0 w-1/4 rounded-full bg-ink/70"
        />
      )}
    </div>
  );
}
