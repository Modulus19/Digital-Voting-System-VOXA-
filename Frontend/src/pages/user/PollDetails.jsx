import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function PollDetails() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [myVote, setMyVote] = useState(null);
  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadPoll();
    loadMyVote();
  }, [id]);

  const loadPoll = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get(`/polls/${id}`);

      setPoll(response.data.data);
    } catch (error) {
      console.error("Load poll error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load this poll."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMyVote = async () => {
    try {
      const response = await api.get(`/polls/${id}/my-vote`);

      setMyVote(response.data.data);
    } catch (error) {
      // A missing vote should not stop the poll from loading.
      if (error.response?.status !== 404) {
        console.error("Load my vote error:", error);
      }
    }
  };

  const submitVote = async () => {
    if (!selectedOption) {
      setErrorMessage("Please select an option.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await api.post(`/polls/${id}/vote`, {
        selectedOption,
      });

      // Only mark the vote as successful after the backend responds.
      setMyVote(response.data.data.vote);
      setSuccessMessage("Your vote was submitted successfully.");
      setSelectedOption("");
    } catch (error) {
      console.error("Submit vote error:", error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        setErrorMessage("You have already voted on this poll.");
        await loadMyVote();
      } else if (status === 400) {
        setErrorMessage(
          message || "Your vote could not be submitted."
        );
      } else if (status === 401) {
        setErrorMessage("Please log in to vote.");
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

 const loadResults = async () => {
  try {
    setResultsLoading(true);
    setErrorMessage("");

    const response = await api.get(`/polls/${id}/results`);

    setResults(response.data.data);
  } catch (error) {
    console.error("Load results error:", error);

    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403) {
      // Results are restricted by the poll's visibility settings.
      setResults(null);
    } else if (status === 401) {
      setErrorMessage("Please log in to view poll results.");
    } else {
      setErrorMessage(
        message || "Unable to load poll results."
      );
    }
  } finally {
    setResultsLoading(false);
  }
};

  useEffect(() => {
    if (!poll) return;

    if (poll.resultsVisibility === "admin_only") {
      return;
    }

    if (
      poll.resultsVisibility === "after_close" &&
      poll.status !== "closed"
    ) {
      return;
    }

    if (
      poll.resultsVisibility === "after_vote" &&
      !myVote
    ) {
      return;
    }

    loadResults();
  }, [poll, myVote]);

  if (loading) {
    return <p>Loading poll...</p>;
  }

  if (!poll) {
    return <p>{errorMessage || "Poll not found."}</p>;
  }

  const alreadyVoted = Boolean(myVote);
  const pollIsOpen = poll.status === "published";

  return (
    <div>
      <h1>{poll.question}</h1>

      {successMessage && (
        <p style={{ color: "green" }}>
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}

      <div>
        {poll.options?.map((option) => {
          const optionId = option.id;
          const optionText = option.text;

          return (
            <label
              key={optionId}
              style={{
                display: "block",
                marginBottom: "10px",
                cursor: alreadyVoted
                  ? "default"
                  : "pointer",
              }}
            >
              <input
                type="radio"
                name="poll-option"
                value={optionId}
                checked={selectedOption === optionId}
                onChange={() =>
                  setSelectedOption(optionId)
                }
                disabled={
                  !pollIsOpen ||
                  alreadyVoted ||
                  submitting
                }
              />

              {" "}

              {optionText}
            </label>
          );
        })}
      </div>

      {!alreadyVoted && pollIsOpen && (
        <button
          type="button"
          onClick={submitVote}
          disabled={!selectedOption || submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit Vote"}
        </button>
      )}

      {alreadyVoted && (
        <p>
          You have already voted on this poll.
        </p>
      )}

      {!pollIsOpen && (
        <p>
          Voting is currently closed or unavailable
          for this poll.
        </p>
      )}

      {resultsLoading && (
        <p>Loading results...</p>
      )}

      {results && (
        <div>
          <h2>Results</h2>

          <p>
            Total votes: {results.totalVotes ?? 0}
          </p>

          {results.results?.map((result) => (
            <div key={result.optionId}>
              <p>
                {result.option} — {result.votes} votes (
                {result.percentage}%)
              </p>

              <div
                style={{
                  width: "100%",
                  background: "#ddd",
                  height: "10px",
                }}
              >
                <div
                  style={{
                    width: `${result.percentage}%`,
                    height: "10px",
                    background: "#333",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PollDetails;