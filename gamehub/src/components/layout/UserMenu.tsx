"use client";

import { useState, useRef, useEffect } from "react";
import UserMenuCart from "../cart/UserMenuCart";
import UserMenuOrder from "../orders/UserMenuOrder";
import UserMenuLibrary from "../library/UserMenuLibrary";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import { FaChevronDown } from "react-icons/fa";

interface UserMenuProps {
  user: string;
  signOutAction: () => Promise<void>;
}

export default function UserMenu({ user, signOutAction }: UserMenuProps) {
  const { items } = useCart();
  const itemCount = items.length;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar / Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-linear-to-r from-accent to-accent/30 rounded-xl h-10 px-4 flex flex-row justify-center items-center gap-3 shrink-0 hover:bg-linear-to-r hover:from-accent/30 hover:to-accent hover:cursor-pointer transition-colors duration-300"
      >
        <span className="text-foreground text-lg font-semibold">
          {user.split(" ")[0]}
        </span>
        <FaChevronDown
          className={`text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"></span>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="p-2">
              <UserMenuCart />
              <UserMenuOrder />
              <UserMenuLibrary />
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2 text-lg text-destructive hover:cursor-pointer hover:underline rounded-lg font-medium"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
