import React from "react";

interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

interface GameRatingBarProps {
  ratings?: Rating[];
}

const getRatingColor = (title: string) => {
  switch (title.toLowerCase()) {
    case "exceptional":
      return "bg-green-500";
    case "recommended":
      return "bg-blue-500";
    case "meh":
      return "bg-orange-500";
    case "skip":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function GameRatingBar({ ratings }: GameRatingBarProps) {
  if (!ratings || ratings.length === 0) return null;

  return (
    <div className="w-full mb-2">
      <div className="flex h-4 w-full rounded-full overflow-hidden">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className={`${getRatingColor(rating.title)}`}
            style={{ width: `${rating.percent}%` }}
            title={`${rating.title}: ${rating.count} votes (${rating.percent}%)`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs">
        {ratings.map((rating) => (
          <div key={rating.id} className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${getRatingColor(rating.title)}`}
            />
            <span className="capitalize font-medium text-foreground/80">
              {rating.title}:
            </span>
            <span className="text-muted-foreground">
              {rating.count} votes ({rating.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
