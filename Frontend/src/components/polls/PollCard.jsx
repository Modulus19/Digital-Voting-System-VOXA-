
import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";


export const CATEGORY_ICONS = {
  Education: "twemoji:books",
  Technology: "twemoji:laptop",
  Sports: "twemoji:soccer-ball",
  Lifestyle: "twemoji:party-popper",
  Food: "twemoji:fork-and-knife",
  Others: "mdi:shape-outline",
};

export default function PollCard({ poll }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-white p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <Icon
          icon={CATEGORY_ICONS[poll.category] || CATEGORY_ICONS.Others}
          width={28}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-text-heading">
            {poll.title}
          </h3>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {poll.endsInLabel}
            </span>

            <div className="relative">
              <button
                type="button"
                aria-label={`More options for ${poll.title}`}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen(!menuOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setMenuOpen(false);
                }}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <Icon icon="mdi:dots-vertical" width={20} />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />

                  <div
                    role="menu"
                    className="absolute right-0 top-full z-20 mt-1 min-w-36 rounded-xl border border-border bg-white p-1 shadow-lg"
                  >
                    <Link
                      role="menuitem"
                      to={`/polls/${poll.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                    >
                      <Icon icon="mdi:open-in-new" width={18} />
                      See more
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mt-1 text-xs text-slate-500 sm:hidden">
          {poll.endsInLabel}
        </p>

        <div className="mt-3 flex max-w-72 flex-col gap-2">
          {poll.options.map((option) => (
            <div
              key={option.id}
              className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-text-heading"
            >
              {option.label}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {poll.votesCount.toLocaleString()} votes
        </p>
      </div>
    </article>
  );
}
