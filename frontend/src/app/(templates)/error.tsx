"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center grow">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()} className="p-2 bg-blue-500 rounded-md">
        Try again
      </button>
    </div>
  );
}
