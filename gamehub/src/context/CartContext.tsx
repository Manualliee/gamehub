"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getCartItems,
  addToCartAction,
  removeFromCartAction,
  clearCartAction,
} from "@/actions/cart";

// Define what a "Cart Item" looks like
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

// Define what functions and data the Cart will provide to the app
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

// Create the Context (The "Signal Tower")
const CartContext = createContext<CartContextType | undefined>(undefined);

// The Provider (The "Battery" that powers the signal)
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from database when the app starts
  useEffect(() => {
    async function loadCart() {
      try {
        const savedItems = await getCartItems();
        setItems(savedItems);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
    loadCart();
  }, []);

  // Function to add an item
  const addToCart = async (newItem: CartItem) => {
    const result = await addToCartAction(newItem);
    if (result?.success) {
      setItems((prevItems) => {
        const exists = prevItems.find((item) => item.id === newItem.id);
        if (exists) return prevItems;
        return [...prevItems, newItem];
      });
    } else {
      // Optionally show an error to the user
      console.error("Failed to add to cart:", result?.error);
    }
  };

  // Function to remove an item
  const removeFromCart = async (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    // Remove from Database
    await removeFromCartAction(id);
  };

  // Function to clear everything
  const clearCart = async () => {
    setItems([]);

    // Clear Database
    await clearCartAction();
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// The Hook (The "Receiver" for the components)
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
