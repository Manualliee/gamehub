import React from "react";
import { Metadata } from "next";
import { calculatePrice } from "@/utilities/priceUtils";
import GamePurchaseSection from "@/components/cart/GamePurchaseSection";
import GameGallery from "@/components/game/GameGallery";
import GameHeaderInfo from "@/components/game/GameHeaderInfo";
import GameDescription from "@/components/game/GameDescription";
import GameGridSection from "@/components/game/GameGridSection";
import GameSidebar from "@/components/game/GameSidebar";
import { getOrders } from "@/actions/order";
import { getFullGameDetails, getGameTrailer } from "@/actions/game";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  game_id: number;
};


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: number }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await getFullGameDetails(id);
    if (!response.success || !response.data) return { title: "GameHub" };

    const game = response.data;

    return {
      title: `${game.name} | GameHub`,
      description:
        game.description_raw?.slice(0, 160) ||
        `Check out ${game.name} on GameHub. Released: ${game.released}`,
      openGraph: {
        title: game.name,
        description:
          game.description_raw?.slice(0, 160) || `Check out ${game.name}`,
        images: game.background_image ? [game.background_image] : [],
      },
    };
  } catch {
    return { title: "GameHub" };
  }
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const gameRes = await getFullGameDetails(id);
  if (!gameRes.success || !gameRes.data) {
    throw new Error("Failed to load game details");
  }
  const game = gameRes.data;

  const trailerRes = await getGameTrailer(game.id);
  const trailer = trailerRes.success ? trailerRes.data : null;

  const orders = await getOrders();
  const didOrder = orders.some((order) =>
    order.items.some((item: OrderItem) => item.game_id === game.id)
  );

  const price = calculatePrice(game.released);

  return (
    
      <div className="min-h-screen max-w-7xl mx-auto p-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
          <GameGallery
            screenshots={game.screenshots || []}
            gameName={game.name}
          trailerFile={trailer?.file}
          trailerPreview={trailer?.preview}
        />
        <GameHeaderInfo game={game} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start mt-6">
        <div className="flex flex-col lg:mt-0">
          <GamePurchaseSection
            gameId={game.id}
            gameName={game.name}
            price={price}
            image={game.background_image}
            platforms={game.platforms}
            tba={game.tba}
            isOwned={didOrder}
            released={game.released}
          />

          <GameDescription
            description={game.description_raw || game.description}
          />

          <div className="mt-6">
            {game.parent_games && game.parent_games.length > 0 ? (
              <GameGridSection title="PARENT GAMES" games={game.parent_games} />
            ) : (
              <GameGridSection
                title="DLCs & ADDITIONS"
                games={game.dlcs}
                fallbackMessage="No DLCs or additions available."
              />
            )}
          </div>

          <div className="mt-6">
            <GameGridSection
              title="GAME SERIES"
              games={game.series_games}
              fallbackMessage="No Game Series Available."
            />
          </div>

          <div className="mt-6">
            <GameGridSection
              title="SUGGESTED GAMES"
              games={game.suggested_games}
            />
          </div>
        </div>

        <GameSidebar game={game} />
      </div>
    </div>
    
  );
}
