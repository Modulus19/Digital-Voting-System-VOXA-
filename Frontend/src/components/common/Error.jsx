export default function Error({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm text-red-500 mb-3">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-semibold text-[#ff4d6d] hover:underline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}