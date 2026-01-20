"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  gameId: number;
  price: string;
  gameName: string;
  image: string | null;
  addedToCartMessage?: () => void;
  onAlreadyInCart?: () => void;
}

export default function AddToCartButton({
  gameId,
  price,
  gameName,
  image,
  addedToCartMessage,
  onAlreadyInCart,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, items } = useCart();

  async function handleAddToCart() {
    setIsLoading(true);

    const isInCart = items.some((item) => item.id === gameId);

    if (addedToCartMessage && !isInCart) {
      addedToCartMessage();
    } else if (isInCart) {
      if (onAlreadyInCart) {
        onAlreadyInCart();
      }
      setIsLoading(false);
      return;
    }

    // Parse price string "$19.99" -> 19.99
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));

    addToCart({
      id: gameId,
      name: gameName,
      price: numericPrice,
      image: image,
    });

    // Simulate a small delay for better UX feedback
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }
  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="bg-linear-to-r from-accent to-accent/30 hover:bg-linear-to-r hover:from-accent/30 hover:to-accent hover:cursor-pointer transition-colors duration-300 px-3 py-1.5 rounded-xl items-center"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
