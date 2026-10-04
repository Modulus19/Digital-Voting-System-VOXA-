import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import Error from "../../components/common/Error";
import Loading from "../../components/common/Loading";
import VotingSection from "../../components/voting/VotingSection";

import api from "../../services/api";

import {
  CATEGORY_ICONS,
} from "../../utils/pollConstants";

import {
  getTimeRemaining,
} from "../../utils/pollHelpers";

export default function PollDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Load the poll from the backend.
   */
  const loadPoll = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/polls/${id}`
      );

      setPoll(response.data.data);
    } catch (error) {
      console.error(
        "Load poll details error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load this poll."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoll();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadPoll}
      />
    );
  }

  if (!poll) {
    return (
      <Error message="Poll not found." />
    );
  }

  const timeRemaining = getTimeRemaining(
    poll.closesAt,
    poll.status
  );

  const creatorName =
    poll?.creator?.name ||
    poll?.creator?.username ||
    "Poll creator";

  const creatorInitials =
    poll?.creator?.initials ||
    creatorName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-text-heading"
      >
        <Icon
          icon="mdi:arrow-left"
          width={20}
        />

        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main poll */}
        <main className="min-w-0">
          <article className="rounded-2xl border border-border bg-white p-5 sm:p-6">
            {/* Question */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon
                  icon={
                    CATEGORY_ICONS[
                      poll.category
                    ] ||
                    CATEGORY_ICONS.others
                  }
                  width={28}
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold leading-snug text-text-heading sm:text-2xl">
                  {poll.question}
                </h1>

                {/* Metadata */}
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
                  <span className="capitalize">
                    {poll.category}
                  </span>

                  <span aria-hidden="true">
                    •
                  </span>

                  <span className="flex items-center gap-1">
                    <Icon
                      icon="mdi:clock-outline"
                      width={15}
                    />

                    {timeRemaining}
                  </span>
                </div>
              </div>
            </div>

            {/* Voting */}
            <VotingSection
              pollId={poll.id}
              options={poll.options}
              status={poll.status}
              resultsVisibility={
                poll.resultsVisibility
              }
              onVoteSubmitted={loadPoll}
            />

            {/* About */}
            <div className="mt-7 border-t border-border pt-6">
              <h2 className="text-sm font-semibold text-text-heading">
                About this poll
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                {poll.description ||
                  "No description was provided for this poll."}
              </p>
            </div>
          </article>
        </main>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Creator */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Created by
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-semibold text-text-heading">
                {creatorInitials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-heading">
                  {creatorName}
                </p>

                <p className="text-xs text-text-muted">
                  Poll creator
                </p>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-sm font-semibold text-text-heading">
              Share this poll
            </h2>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Invite others to participate in
              this poll.
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  window.location.href
                );
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-heading transition hover:bg-surface"
            >
              <Icon
                icon="mdi:link-variant"
                width={18}
              />

              Copy link
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}