import Img from "next/image";
import { getGameDetails, getGameAchievements } from "@/actions/game";
import Link from "next/link";
import { Achievement } from "@/types/game";

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  // Fetch game details and achievements in parallel
  const [gameRes, achievementsRes] = await Promise.all([
    getGameDetails(id),
    getGameAchievements(id),
  ]);

  if (!gameRes.success || !gameRes.data) {
    return <div>Failed to load achievements.</div>;
  }
  const game = gameRes.data;
  const fetchedAchievements = achievementsRes.success
    ? achievementsRes.data
    : [];

  const achievements: Achievement[] =
    fetchedAchievements?.sort(
      (a: Achievement, b: Achievement) =>
        parseFloat(b.percent) - parseFloat(a.percent)
    ) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/games/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          Back to {game.name} page
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          {game.name} In-Game Achievements
        </h1>
        <p className="text-muted-foreground">Total: {achievements.length}</p>
      </div>

      <div className="flex flex-col gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className=" border border-border rounded-xl p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
          >
            <div className="relative border border-border w-24 h-24 shrink-0 rounded-lg overflow-hidden">
              {achievement.image ? (
                <Img
                  src={achievement.image}
                  alt={achievement.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No Icon
                </div>
              )}
            </div>
            <div className="flex-1 w-full relative overflow-hidden p-2">
              {/* Progress Bar Background */}
              <div
                className="absolute left-0 top-0 bottom-0 rounded-r-xl bg-accent/50 transition-all duration-500 ease-out"
                style={{ width: `${achievement.percent}%` }}
              />

              {/* Content */}
              <div className="relative z-10">
                <h3
                  className="font-semibold truncate pr-2"
                  title={achievement.name}
                >
                  {achievement.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-accent px-2 py-0.5 rounded-full border border-border/50 inset-shadow-sm inset-shadow-black/50">
                    {achievement.percent}% of players
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No achievements found for this game.
        </div>
      )}
    </div>
  );
}
