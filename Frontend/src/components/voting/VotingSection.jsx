import { useEffect, useState } from "react";
import api from "../../services/api";

import VoteOption from "./VoteOption";

/**
 * Find the current user's vote for a specific poll.
 * Handles both populated poll objects and plain poll IDs.
 */
function findVoteForPoll(votes, pollId) {
  return (
    votes.find((vote) => {
      const votePollId =
        typeof vote.poll === "object"
          ? vote.poll?.id || vote.poll?._id
          : vote.poll;

      return String(votePollId) === String(pollId);
    }) || null
  );
}

export default function VotingSection({
  pollId,
  options = [],
  status,
  resultsVisibility,
  onVoteSubmitted,
}) {
  const [myVote, setMyVote] = useState(null);
  const [results, setResults] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const alreadyVoted = Boolean(myVote);
  const pollIsOpen = status === "published";
  const showResults = Boolean(results);

  /**
   * ID of the option selected by the current user.
   */
  const selectedVoteId =
    myVote?.selectedOption?.id ||
    myVote?.selectedOption?._id ||
    myVote?.selectedOption ||
    null;

  /**
   * Get the result belonging to an option.
   */
  const getResultForOption = (optionId) => {
    if (!results?.results) return null;

    return (
      results.results.find(
        (result) =>
          String(result.optionId) === String(optionId)
      ) || null
    );
  };

  /**
   * Check whether the current user has already
   * voted on this poll.
   */
  useEffect(() => {
    if (!pollId) return;

    let cancelled = false;

    const fetchMyVote = async () => {
      try {
        const response = await api.get(
          "/votes/history"
        );

        const votes =
          response.data.data.votes || [];

        const existingVote = findVoteForPoll(
          votes,
          pollId
        );

        if (!cancelled) {
          setMyVote(existingVote);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Load vote history error:",
            error
          );
        }
      }
    };

    fetchMyVote();

    return () => {
      cancelled = true;
    };
  }, [pollId]);

  /**
   * Load results only when the visibility rules
   * allow the current user to see them.
   */
  useEffect(() => {
    if (!pollId) return;

    if (resultsVisibility === "admin_only") {
      return;
    }

    if (
      resultsVisibility === "after_close" &&
      status !== "closed"
    ) {
      return;
    }

    if (
      resultsVisibility === "after_vote" &&
      !myVote
    ) {
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      try {
        setResultsLoading(true);
        setErrorMessage("");

        const response = await api.get(
          `/polls/${pollId}/results`
        );

        if (!cancelled) {
          setResults(response.data.data);
        }
      } catch (error) {
        if (cancelled) return;

        const statusCode = error.response?.status;
        const message =
          error.response?.data?.message;

        if (statusCode === 403) {
          setResults(null);
        } else if (statusCode === 401) {
          setErrorMessage(
            "Please log in to view poll results."
          );
        } else {
          setErrorMessage(
            message ||
              "Unable to load poll results."
          );
        }
      } finally {
        if (!cancelled) {
          setResultsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [
    pollId,
    resultsVisibility,
    status,
    myVote,
  ]);

  /**
   * Immediately submit the vote when an option
   * is clicked.
   */
  const submitVote = async (optionId) => {
    if (
      !optionId ||
      submitting ||
      alreadyVoted ||
      !pollIsOpen
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const response = await api.post(
        `/polls/${pollId}/vote`,
        {
          selectedOption: optionId,
        }
      );

      setMyVote(response.data.data.vote);

      onVoteSubmitted?.();
    } catch (error) {
      console.error("Submit vote error:", error);

      const statusCode = error.response?.status;
      const message =
        error.response?.data?.message;

      /**
       * The server already has a vote from this
       * user. Synchronize the UI with that vote.
       */
      if (statusCode === 409) {
        try {
          const response = await api.get(
            "/votes/history"
          );

          const votes =
            response.data.data.votes || [];

          const existingVote = findVoteForPoll(
            votes,
            pollId
          );

          setMyVote(existingVote);
        } catch (historyError) {
          console.error(
            "Load vote history error:",
            historyError
          );

          setErrorMessage(
            "Unable to load your existing vote."
          );
        }
      } else if (statusCode === 400) {
        setErrorMessage(
          message ||
            "Your vote could not be submitted."
        );
      } else if (statusCode === 401) {
        setErrorMessage(
          "Please log in to vote."
        );
      } else {
        setErrorMessage(
          message ||
            "Something went wrong while submitting your vote."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 w-full">
      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Voting options / results */}
      <div className="space-y-3">
        {options.map((option) => {
          const result =
            getResultForOption(option.id);

          const isMyVote =
            alreadyVoted &&
            String(selectedVoteId) ===
              String(option.id);

          return (
            <VoteOption
              key={option.id}
              option={option}
              selected={isMyVote}
              disabled={
                !pollIsOpen ||
                alreadyVoted ||
                submitting
              }
              onSelect={submitVote}
              result={result}
              showResults={showResults}
            />
          );
        })}
      </div>

      {/* Vote submission state */}
      {submitting && (
        <p className="mt-3 text-xs text-text-muted">
          Submitting vote...
        </p>
      )}

      {/* Results loading state */}
      {!submitting && resultsLoading && (
        <p className="mt-3 text-xs text-text-muted">
          Loading results...
        </p>
      )}

      {/* Closed poll */}
      {!pollIsOpen && !showResults && (
        <p className="mt-4 text-sm text-text-muted">
          Voting is closed for this poll.
        </p>
      )}
    </div>
  );
}