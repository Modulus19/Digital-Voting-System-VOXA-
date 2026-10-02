import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import Error from "../../components/common/Error";
import { MOCK_POLLS } from "../../data/mockPolls";
import { CATEGORY_ICONS } from "../../utils/pollConstants";
import { getTimeRemaining } from "../../utils/pollHelpers";


export default function PollDetails() {
  const { id } = useParams();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/polls/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("POLL RESPONSE:", data);
      } catch (error) {
        console.error("FAILED TO FETCH POLL:", error);
      }
    };

    fetchPoll();
  }, [id]);
  
  // TEMP:
  // Later replace MOCK_POLL with GET /api/polls/:id
  const poll = MOCK_POLLS.find((poll) => poll.id === id);
  
  const timeRemaining = poll
    ? getTimeRemaining(poll.closesAt, poll.status)
    : "";
    
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: poll.question,
        text: poll.description,
        url: window.location.href,
      });
      return;
    }

    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Back To Poll Link*/}
      <Link
        to="/polls"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <Icon icon="mdi:arrow-left" width={15} />
        Back to Polls
      </Link>

      {!poll ? (
        <Error message="Poll not found." />
      ):(
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          {/* LEFT */}
          <main className="flex min-w-0 flex-col gap-7">
            {/* Poll card */}
            <section className="rounded-2xl border border-border bg-white p-6">
              <div className="flex gap-4">
                {/* Category icon */}
                <div className="flex h-10 w-10 shrink-0 items-start justify-center">
                  <Icon
                    icon={CATEGORY_ICONS[poll.category] || CATEGORY_ICONS.others}
                    width={28}
                    height={28}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {/* Heading */}
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <h1 className="text-base font-bold text-text-heading">
                        {poll.question}
                      </h1>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Icon
                            icon={CATEGORY_ICONS[poll.category] || CATEGORY_ICONS.others}
                            width={14}
                          />
                          <span className="capitalize">{poll.category}</span>
                        </span>

                        <span>•</span>

                        <span className="inline-flex items-center gap-1">
                          <Icon icon="mdi:account-group" width={14} />
                          {poll.votesCount.toLocaleString()} votes
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-text-muted">
                      <Icon icon="mdi:clock-outline" width={15} />
                      {timeRemaining}
                    </span>
                  </div>

                  {/* Voting & Results UI — Member 6 integration point */}
                  <div className="mt-5">
                    <div className="rounded-xl border border-dashed border-border bg-surface p-5 text-center">
                      <p className="text-sm text-text-muted">
                        Voting interface will appear here.
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-text-muted">
                    Created on {
                        new Date(poll.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* About */}
            <section className="rounded-2xl border border-border bg-white p-6">
              <div className="px-2 sm:px-8">
                <h2 className="text-sm font-bold text-text-heading">
                  About this poll
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-normal leading-relaxed text-text-heading">
                  {poll.description}
                </p>
              </div>

              <div className="my-5 border-t border-border" />

              <div className="flex items-center gap-3 px-2 sm:px-8">
                <span className="text-sm font-medium text-text-heading">
                  Created by
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">
                  {poll.creator.initials}
                </div>

                <span className="text-sm text-text-muted">
                  {poll.creator.name}
                </span>
              </div>
            </section>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-bold text-text-heading">
              Poll Information
            </h2>

            <div className="mt-5 flex flex-col gap-6 text-sm">
              <div className="flex gap-3">
                <span>•</span>
                <div>
                  <p className="font-semibold text-text-heading">
                    {poll.votesCount.toLocaleString()} Total Votes
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span>•</span>
                <p className="font-semibold text-text-heading">
                  {timeRemaining}
                </p>
              </div>

              <div className="flex gap-3">
                <span>•</span>
                <p className="font-semibold text-text-heading">
                  Created by {poll.creator.name}
                </p>
              </div>

              <div className="flex gap-3">
                <span>•</span>
                <p className="font-semibold text-text-heading">
                  Created on {
                    new Date(poll.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                </p>
              </div>
            </div>

            <div className="my-6 border-t border-border" />

            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-3 text-xs font-medium text-white transition hover:opacity-90"
            >
              Share Poll

              <Icon icon="mdi:chevron-right" width={18} />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}