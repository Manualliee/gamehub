"use client";
import { useCart } from "@/context/CartContext";
import { createOrderAction } from "@/actions/order";
import trashSVG from "../../../public/trash-svgrepo-com.svg";
import Img from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, clearCart } = useCart();
  const [notification, setNotification] = useState<string | null>(null);

  function handleCartError(message: string) {
    setNotification(message);

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  const handleCheckout = async () => {
    try {
      const result = await createOrderAction();
      if (result?.success) {
        clearCart();
        router.push("/orders");
      } else {
        handleCartError(
          result?.error ||
            "Your order could not be processed. Please try again.",
        );
      }
    } catch (error) {
      handleCartError(
        error instanceof Error ? error.message : "Unexpected error occurred.",
      );
    }
  };

  return (
    <div className="w-[90%] p-4 mx-auto my-8">
      {items.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <p>Your cart is empty.</p>
          <div className="sad-face-container">
            <div className="eye left-eye"></div>
            <div className="eye right-eye"></div>
          </div>
          <Link
            href="/"
            className="underline hover:text-accent transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <div className="w-full h-0.5 bg-linear-to-r from-accent to-background mb-4"></div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="group bg-card cursor-pointer overflow-hidden block rounded-xl shadow-lg/60 mb-5 hover:border-border/50 hover:shadow-xl/80 transition duration-300 border border-border/20"
              >
                {item.image && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Img
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                    />
                  </div>
                )}
                <div className="w-full flex flex-col gap-4 p-4">
                  <Link
                    className="cursor-pointer hover:underline"
                    href={`/games/${item.id}`}
                  >
                    {item.name}
                  </Link>
                  <div className="w-full flex flex-row justify-between">
                    <span className="">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      title="Remove from cart"
                      className="bg-red-500 px-2 py-1 rounded hover:cursor-pointer hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Img src={trashSVG} alt="Remove" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="w-full flex flex-row justify-between items-center">
            <h2 className="text-xl font-bold mt-4">
              Total: $
              {items.reduce((total, item) => total + item.price, 0).toFixed(2)}
            </h2>
            <button
              onClick={handleCheckout}
              className="bg-linear-to-r from-accent to-accent/30 rounded-xl hover:bg-linear-to-r hover:from-accent/30 hover:to-accent hover:cursor-pointer transition-colors duration-300 px-4 py-2 font-bold"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
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
