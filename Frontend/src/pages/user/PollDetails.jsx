import { useCallback, useEffect, useState } from "react";
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
  const [totalVotes, setTotalVotes] = useState(null);

  const handleResultsLoaded = useCallback((resultsData) => {
    setTotalVotes(resultsData?.totalVotes ?? null);
  }, []);

  const loadPoll = useCallback(async () => {
    try {
      const response = await api.get(`/polls/${id}`);

      setPoll(response.data.data);
      setError("");
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
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const fetchPoll = async () => {
      try {
        const response = await api.get(`/polls/${id}`);

        if (!cancelled) {
          setPoll(response.data.data);
          setError("");
        }
      } catch (error) {
        console.error(
          "Load poll details error:",
          error
        );

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Unable to load this poll."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPoll();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  const handleRetry = () => {
    setLoading(true);
    loadPoll();
  };

  if (error) {
    return (
      <Error
        message={error}
        onRetry={handleRetry}
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

  const createdDate = poll.createdAt
    ? new Date(
        poll.createdAt
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="
          mb-4 flex items-center gap-2
          rounded-md text-sm font-medium
          text-text-muted
          transition-all duration-200
          hover:-translate-x-0.5
          hover:text-text-heading
          sm:mb-5
        "
      >
        <Icon
          icon="mdi:arrow-left"
          width={20}
        />

        Back
      </button>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
        {/* Main poll */}
        <main className="min-w-0">
          <article className="rounded-2xl border border-border bg-white p-4 transition-shadow duration-300 sm:p-6">
            {/* Question area */}
            <div className="flex items-start gap-3 sm:justify-between sm:gap-4">
              {/* Category icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
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

              {/* Question + metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="min-w-0 break-words text-lg font-bold leading-snug text-text-heading sm:text-xl lg:text-2xl">
                    {poll.question}
                  </h1>

                  {/* Desktop/tablet time */}
                  <span className="hidden shrink-0 items-center gap-1 whitespace-nowrap text-xs text-text-muted sm:flex">
                    <Icon
                      icon="mdi:clock-outline"
                      width={15}
                    />

                    {timeRemaining}
                  </span>
                </div>

                {/* Metadata */}
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
                  <span className="flex items-center gap-1 capitalize">
                    <Icon
                      icon={
                        CATEGORY_ICONS[
                          poll.category
                        ] ||
                        CATEGORY_ICONS.others
                      }
                      width={15}
                    />

                    {poll.category}
                  </span>

                  {totalVotes !== null && (
                    <>
                      <span aria-hidden="true">
                        •
                      </span>

                      <span className="flex items-center gap-1">
                        <Icon
                          icon="mdi:account-multiple-outline"
                          width={15}
                        />

                        {totalVotes.toLocaleString()}{" "}
                        {totalVotes === 1
                          ? "vote"
                          : "votes"}
                      </span>
                    </>
                  )}
                </div>

                {/* Mobile time */}
                <span className="mt-2 flex items-center gap-1 text-xs text-text-muted sm:hidden">
                  <Icon
                    icon="mdi:clock-outline"
                    width={14}
                  />

                  {timeRemaining}
                </span>
              </div>
            </div>

            {/* Voting */}
            <div className="mt-4 w-full sm:ml-[52px] sm:mt-2 sm:max-w-md">
              <VotingSection
                pollId={poll.id}
                options={poll.options}
                status={poll.status}
                resultsVisibility={
                  poll.resultsVisibility
                }
                onVoteSubmitted={loadPoll}
                onResultsLoaded={
                  handleResultsLoaded
                }
              />
            </div>
          </article>
        </main>

        {/* Poll information */}
        <aside className="min-w-0">
          <div className="rounded-2xl border border-border bg-white p-4 transition-shadow duration-300 sm:p-5">
            <h2 className="text-sm font-semibold text-text-heading">
              Poll Information
            </h2>

            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:mt-5 lg:grid-cols-1 lg:gap-5">
              {/* Total votes */}
              {totalVotes !== null && (
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-heading" />

                  <p className="break-words font-medium text-text-heading">
                    {totalVotes.toLocaleString()}{" "}
                    {totalVotes === 1
                      ? "Total vote"
                      : "Total votes"}
                  </p>
                </div>
              )}

              {/* Time */}
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-heading" />

                <p className="break-words font-medium text-text-heading">
                  {timeRemaining}
                </p>
              </div>

              {/* Creator */}
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-heading" />

                <p className="break-words font-medium text-text-heading">
                  Created by {creatorName}
                </p>
              </div>

              {/* Creation date */}
              {createdDate && (
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-heading" />

                  <p className="break-words font-medium text-text-heading">
                    Created on {createdDate}
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-border sm:my-6" />

            {/* Share */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  window.location.href
                );
              }}
              className="
                group flex min-h-11 w-full
                items-center justify-between
                rounded-lg bg-primary
                px-4 py-3 text-xs
                font-medium text-white
                transition-all duration-200
                hover:opacity-90
                active:scale-[0.98]
              "
            >
              <span>Share Poll</span>

              <Icon
                icon="mdi:chevron-right"
                width={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}