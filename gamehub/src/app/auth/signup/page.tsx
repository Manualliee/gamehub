"use client";
import { useEffect, useState } from "react";
import SignupForm from "@/components/auth/SignupForm";
import BackgroundImage from "@/components/ui/BackgroundImage";
import { getTrendingGames } from "@/actions/game";
import { RawgGame } from "@/types/game";

export default function SignupPage() {
  const [game, setGame] = useState<RawgGame[]>([]);

  useEffect(() => {
    getTrendingGames()
      .then((res) => {
        if (res.success) {
          setGame(res.data);
        }
      })
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  return (
    <div className="h-screen relative flex justify-center items-center">
      {/* Pass all game background images to the BackgroundImage component */}
      {game.length > 0 && (
        <BackgroundImage imageUrls={game.map((g) => g.background_image)} />
      )}

      <div className="absolute inset-0 flex flex-col justify-center items-center z-50">
        <SignupForm />
      </div>
    </div>
  );
}
