
export default function ResultBar({ label, percentage = 0 }) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="relative h-10 w-full overflow-hidden rounded-full bg-surface">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-300"
        style={{ width: `${safePercentage}%` }}
      />

      <div className="relative z-10 flex h-full items-center justify-between px-4 text-xs">
        <span className="font-medium text-text-heading">
          {label}
        </span>

        <span className="font-medium text-text-heading">
          {safePercentage}%
        </span>
      </div>
    </div>
  );
}