"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { platformIcons } from "@/constants/platformIcons";
import { getUniquePlatformKeys } from "@/utilities/platformUtils";
import { AnimatePresence, motion } from "motion/react";

interface GamePurchaseSectionProps {
  gameId: number;
  price: string;
  gameName: string;
  image: string | null;
  platforms?: { platform: { id: number; name: string; slug?: string } }[];
  isOwned?: boolean;
  currentlyAvailable?: boolean;
  tba?: boolean;
  released?: string;
}

export default function GamePurchaseSection({
  gameId,
  price,
  gameName,
  image,
  platforms,
  tba,
  isOwned = false,
  released,
}: GamePurchaseSectionProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const currentlyAvailable =
    released && new Date().toISOString().split("T")[0] >= released;

  function handleAddedToCart() {
    setNotification(`${gameName} has been added to your cart.`);
    
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  function handleAlreadyInCart() {
    setNotification(`${gameName} is already in your cart!`);

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  const gamePlatforms = getUniquePlatformKeys(platforms);

  return (
    <div className="relative bg-card flex flex-row justify-between items-center w-full p-5 rounded-lg">
      <div className="w-full flex flex-row justify-between pb-6">
        <h3 className="text-lg font-bold">Purchase {gameName}</h3>
        <div className="flex flex-wrap items-center gap-3 text-lg">
          {gamePlatforms?.map((platform) => (
            <span key={platform}>{platformIcons[platform] || platform}</span>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-6.25 right-5 border flex flex-row items-center gap-4 z-20 bg-card px-2 py-2 rounded-lg shadow-lg border-border">
        {isOwned ? (
          <div className="px-4 py-2 bg-green-600/20 text-green-500 rounded-lg font-bold border border-green-600/30">
            In Library
          </div>
        ) : tba ? (
          <div className="px-4 py-2 bg-yellow-600/20 text-yellow-500 rounded-lg font-bold border border-yellow-600/30">
            TBA
          </div>
        ) : currentlyAvailable ? (
          <>
            <p className="text-xl font-semibold">${price}</p>
            <AddToCartButton
              gameId={gameId}
              price={price}
              gameName={gameName}
              image={image}
              addedToCartMessage={handleAddedToCart}
              onAlreadyInCart={handleAlreadyInCart}
            />
          </>
        ) : (
          <div className="px-4 py-2 bg-gray-600/20 text-gray-500 rounded-lg font-bold border border-gray-600/30">
            Coming Soon
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {notification && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card border border-border p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
              <p className="text-lg font-semibold text-foreground">
                {notification}
              </p>
              <button
                onClick={() => setNotification(null)}
                className="bg-linear-to-r from-accent to-accent/30 hover:bg-linear-to-r hover:from-accent/30 hover:to-accent hover:cursor-pointer transition-colors duration-300 text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90"
              >
                Okay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
