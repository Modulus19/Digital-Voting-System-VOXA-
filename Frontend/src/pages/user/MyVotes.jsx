import { useEffect, useState } from "react";
import api from "../../services/api";

const MyVotes = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVoteHistory = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get("/votes/history");

        const voteHistory = response.data?.data;

        if (Array.isArray(voteHistory)) {
          setVotes(voteHistory);
        } else if (Array.isArray(voteHistory?.votes)) {
          setVotes(voteHistory.votes);
        } else {
          setVotes([]);
        }
      } catch (error) {
        console.error("Failed to fetch vote history:", error);

        if (error.response?.status === 401) {
          setErrorMessage("Your session has expired. Please log in again.");
        } else if (error.response?.status === 403) {
          setErrorMessage(
            "You are not authorized to view your voting history."
          );
        } else if (error.response) {
          setErrorMessage(
            error.response.data?.message ||
              "Unable to load your voting history."
          );
        } else {
          setErrorMessage(
            "Network error. Please check your connection and try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVoteHistory();
  }, []);

  if (loading) {
    return (
      <div className="my-votes-page">
        <h1>My Votes</h1>
        <p>Loading your voting history...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="my-votes-page">
        <h1>My Votes</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="my-votes-page">
      <h1>My Votes</h1>

      {votes.length === 0 ? (
        <p>You haven't voted in any polls yet.</p>
      ) : (
        <div className="vote-history">
          {votes.map((vote, index) => {
            const poll = vote.poll || {};
            const selectedOption =
              vote.selectedOption ||
              vote.option ||
              vote.selectedOptionText ||
              "Selected option";

            return (
              <div className="vote-history-card" key={vote._id || vote.id || index}>
                <h2>
                  {poll.question ||
                    vote.question ||
                    "Poll"}
                </h2>

                <p>
                  <strong>Your vote:</strong>{" "}
                  {typeof selectedOption === "object"
                    ? selectedOption.text
                    : selectedOption}
                </p>

                {vote.createdAt && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(vote.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyVotes;