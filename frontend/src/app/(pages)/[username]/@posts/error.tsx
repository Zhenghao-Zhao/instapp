"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] gap-2">
      <h2>An unexpected error occured</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()} className="p-2 bg-blue-500 rounded-md">
        Try again
      </button>
    </div>
  );
}
