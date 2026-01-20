"use client";

import { useEffect } from "react";
import AppBackground from "@/components/ui/AppBackground";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="relative w-full min-h-[60vh] flex flex-col items-center justify-center p-4">
      {/* Background layer */}
      <div className="absolute inset-0 z-0 opacity-50">
        <AppBackground />
      </div>

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-md bg-card/80 backdrop-blur-md border border-border/30 rounded-2xl p-8 shadow-2xl text-center">
        {/* Icon / Header */}
        <div className="mb-6 flex justify-center">
          <div className="sad-face-container">
            <div className="eye left-eye"></div>
            <div className="eye right-eye"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">System Malfunction</h2>

        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          We encountered a critical error while processing your request. Please try again.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl text-black bg-foreground text-primary-foreground cursor-pointer font-medium hover:bg-foreground/50 transition-all"
          >
            Retry Connection
          </button>
        </div>

        {/* Technical Error Code (Optional debug info) */}
        {error.digest && (
          <p className="mt-8 text-xs font-mono text-muted-foreground/50">
            Error Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
