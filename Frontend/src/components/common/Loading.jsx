export default function Loading({ size = "medium", fullScreen = false }) {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const loader = (
    <div
      className={`${sizes[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {loader}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      {loader}
    </div>
  );
}