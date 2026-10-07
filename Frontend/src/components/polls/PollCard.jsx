import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import { CATEGORY_ICONS } from "../../utils/pollConstants";
import { getTimeRemaining } from "../../utils/pollHelpers";
import VotingSection from "../voting/VotingSection";

export default function PollCard({ poll }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const timeRemaining = getTimeRemaining(
    poll.closesAt,
    poll.status
  );

  return (
    <article className="flex gap-3 rounded-2xl border border-border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:gap-4 sm:p-5">
      {/* Category icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
        <Icon
          icon={
            CATEGORY_ICONS[poll.category] ||
            CATEGORY_ICONS.others
          }
          width={28}
        />
      </div>

      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h3 className="min-w-0 break-words pr-1 text-sm font-semibold leading-5 text-text-heading">
            {poll.question}
          </h3>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Desktop/tablet time */}
            <span className="hidden items-center gap-1 whitespace-nowrap text-xs text-slate-500 sm:inline-flex">
              <Icon
                icon="mdi:clock-outline"
                width={15}
              />

              {timeRemaining}
            </span>

            {/* Menu */}
            <div className="relative">
              <button
                type="button"
                aria-label={`More options for ${poll.question}`}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() =>
                  setMenuOpen((open) => !open)
                }
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setMenuOpen(false);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-text-heading"
              >
                <Icon
                  icon="mdi:dots-vertical"
                  width={20}
                />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Close menu"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="fixed inset-0 z-10 cursor-default"
                  />

                  <div
                    role="menu"
                    className="absolute right-0 top-full z-20 mt-1 min-w-36 origin-top-right animate-[fadeIn_150ms_ease-out] rounded-xl border border-border bg-white p-1 shadow-lg"
                  >
                    <Link
                      role="menuitem"
                      to={`/polls/${poll.id}`}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-heading transition-colors duration-150 hover:bg-slate-100"
                    >
                      <Icon
                        icon="mdi:open-in-new"
                        width={18}
                      />

                      See more
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile time */}
        <span className="mt-1 flex items-center gap-1 text-xs text-slate-500 sm:hidden">
          <Icon
            icon="mdi:clock-outline"
            width={14}
          />

          {timeRemaining}
        </span>

        {/* Voting */}
        <div className="w-full max-w-72 sm:max-w-80">
          <VotingSection
            pollId={poll.id}
            options={poll.options}
            status={poll.status}
            resultsVisibility={poll.resultsVisibility}
          />
        </div>

        {/* Vote count */}
        {poll.votesCount !== null &&
          poll.votesCount !== undefined && (
            <span className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Icon
                icon="mdi:account-multiple-outline"
                width={15}
              />

              {poll.votesCount.toLocaleString()}{" "}
              {poll.votesCount === 1
                ? "vote"
                : "votes"}
            </span>
          )}
      </div>
    </article>
  );
}