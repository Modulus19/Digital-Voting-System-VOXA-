export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          404
        </h1>

        <p className="text-lg text-slate-600 mt-3">
          Page not found.
        </p>

        <p className="text-sm text-slate-400 mt-2">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}