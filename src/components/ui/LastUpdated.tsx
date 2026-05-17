import { useEffect, useState } from "react";

interface LastUpdatedProps {
  timestamp: Date | null;
  onRefresh?: () => void;
  className?: string;
}

/**
 * LastUpdated — shows how long ago data was fetched.
 * Addresses the stale data UX gap on market and portfolio pages.
 * Updates every 10 seconds automatically.
 */
export function LastUpdated({
  timestamp,
  onRefresh,
  className = "",
}: LastUpdatedProps) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!timestamp) return;

    const update = () => {
      const seconds = Math.floor(
        (Date.now() - timestamp.getTime()) / 1000
      );
      if (seconds < 60) {
        setLabel(`Updated ${seconds}s ago`);
      } else if (seconds < 3600) {
        setLabel(`Updated ${Math.floor(seconds / 60)}m ago`);
      } else {
        setLabel(`Updated ${Math.floor(seconds / 3600)}h ago`);
      }
    };

    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp) return null;

  return (
    <span
      className={`text-xs text-gray-400 flex items-center gap-2 ${className}`}
      aria-live="polite"
      aria-label={`Data ${label}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"
        aria-hidden="true"
      />
      {label}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="underline hover:text-gray-200 transition-colors text-xs"
          aria-label="Refresh data"
          type="button"
        >
          Refresh
        </button>
      )}
    </span>
  );
}
