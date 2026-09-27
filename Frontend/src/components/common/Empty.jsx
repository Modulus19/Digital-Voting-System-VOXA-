export default function Empty({
  message = "Nothing to show here.",
}) {
  return (
    <div className="flex items-center justify-center py-10 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}