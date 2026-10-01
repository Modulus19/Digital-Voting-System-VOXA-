
import PollCard from "./PollCard";
import Loading from "../common/Loading";
import Error from "../common/Error";
import Empty from "../common/Empty";

export default function PollList({
  polls,
  isLoading,
  error,
  onRetry,
  hasFilters,
}) {
  if (isLoading) {
    return (
      <div className="py-12">
        <Loading />
        <p className="mt-3 text-center text-sm text-slate-500">
          Loading polls...
        </p>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (polls.length === 0) {
    return (
      <Empty
        message={
          hasFilters
            ? "No matching polls found. Try changing your filters."
            : "No polls available yet."
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
