import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function VoteOption({
  option,
  selected = false,
  disabled = false,
  onSelect,
  result = null,
  showResults = false,
}) {
  const targetPercentage = Math.min(
    Math.max(
      Number(result?.percentage) || 0,
      0
    ),
    100
  );

  const [animatedPercentage, setAnimatedPercentage] =
    useState(0);

  /**
   * Animate from 0% to the actual result.
   */
  useEffect(() => {
    if (!showResults) return;

    let animationFrame;

    const duration = 700;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed =
        currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      /**
       * Ease-out animation:
       * fast at the beginning, smooth at the end.
       */
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setAnimatedPercentage(
        targetPercentage * easedProgress
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [showResults, targetPercentage]);

  /**
   * Results mode
   */
  if (showResults) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-full border bg-surface ${
          selected
            ? "border-primary"
            : "border-border"
        }`}
      >
        {/* Animated brand-blue fill */}
        <div
          className="absolute inset-y-0 left-0 bg-primary"
          style={{
            width: `${animatedPercentage}%`,
          }}
        />

        {/* Option content */}
        <div className="relative z-10 flex min-h-10 items-center justify-between gap-3 px-4 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* User's selected option */}
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border bg-white ${
                selected
                  ? "border-primary"
                  : "border-slate-400"
              }`}
            >
              {selected && (
                <Icon
                  icon="mdi:check-bold"
                  width={12}
                  className="text-primary"
                />
              )}
            </span>

            {/* Option text */}
            <span
              className={`text-xs text-text-heading ${
                selected
                  ? "font-semibold"
                  : "font-medium"
              }`}
            >
              {option.text}
            </span>
          </div>

          {/* Animated percentage */}
          <span className="shrink-0 text-xs font-semibold text-text-heading">
            {Math.round(
              animatedPercentage
            )}
            %
          </span>
        </div>
      </div>
    );
  }

  /**
   * Before voting
   *
   * Uses the same surface styling as PollCard.
   */
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      className={`flex w-full items-center gap-2.5 rounded-full border px-4 py-2 text-left text-xs text-text-heading transition ${
        selected
          ? "border-primary bg-slate-100"
          : "border-border bg-surface"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-primary hover:bg-slate-100"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border bg-white ${
          selected
            ? "border-primary"
            : "border-slate-400"
        }`}
      >
        {selected && (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
      </span>

      <span
        className={
          selected
            ? "font-semibold"
            : "font-medium"
        }
      >
        {option.text}
      </span>
    </button>
  );
}