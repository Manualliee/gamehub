"use client";
import { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import BackgroundImage from "@/components/ui/BackgroundImage";
import { getPopularGames } from "@/actions/game";
import { RawgGame } from "@/types/game";
import { useSearchParams } from "next/navigation";

export default function SigninPage() {
  const [game, setGame] = useState<RawgGame[]>([]);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    getPopularGames()
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
        <LoginForm message={message} />
      </div>
    </div>
  );
}
