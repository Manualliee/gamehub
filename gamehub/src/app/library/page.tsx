import { getOrders } from "@/actions/order";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function LibraryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const orders = await getOrders();
  const purchasedGames = orders.flatMap((order) => order.items);

  if (purchasedGames.length === 0) {
    return (
      <div className="p-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your library is empty</h2>
        <p className="mb-6">You haven&apos;t purchased any games yet.</p>
        <div className="sad-face-container">
          <div className="eye left-eye"></div>
          <div className="eye right-eye"></div>
        </div>
        <Link
          href="/"
          className="text-primary underline hover:cursor-pointer hover:text-secondary transition-colors duration-200 mt-4 inline-block"
        >
          Browse Games
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-480 mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-2">My Library</h1>
      <div className="w-full h-0.5 bg-linear-to-r from-accent to-background mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {purchasedGames
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.game_id}`}
              className="group block rounded-xl shadow-lg/60 mb-2 hover:border-border/50 hover:shadow-xl/80 transition duration-300 border border-border/20"
            >
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="relative aspect-video w-full">
                  {game.image ? (
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate" title={game.name}>
                    {game.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
