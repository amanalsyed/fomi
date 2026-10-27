import Icon from "@/components/ui/Icon";

/** Square icon-only button. `label` is required for accessibility. */
export default function IconButton({ icon, label, className = "", iconClassName = "size-4", ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-8 items-center justify-center rounded-lg text-ink transition duration-150 hover:bg-surface active:scale-90 ${className}`}
      {...props}
    >
      <Icon name={icon} className={iconClassName} />
    </button>
  );
}
