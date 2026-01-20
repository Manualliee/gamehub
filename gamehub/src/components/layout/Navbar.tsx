"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { handleSignOut } from "@/actions/authActions";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

export default function Navbar(props: { user?: string | null }) {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // To avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      // Scrolling down
      setHidden(true);
    } else {
      // Scrolling up
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full flex justify-center z-50 px-4 py-4"
    >
      <div className="w-full max-w-7xl bg-background/80 backdrop-blur-md shadow-lg rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" title="GameHub Home">
          <h1 className="group text-2xl font-bold tracking-tight cursor-pointer text-shadow-lg/60 mb-2 hover:text-shadow-xl/80 transition duration-300">
            <span className="transition-colors group-hover:text-accent">
              Game
            </span>
            <span className="text-accent transition-colors group-hover:text-foreground">
              Hub
            </span>
          </h1>
        </Link>

        {/* Search Bar - Flex Grow to take available space */}
        <div className="w-full md:max-w-md lg:max-w-xl">
          <SearchBar />
        </div>

        {/* User Menu / Sign In */}
        <div className="shrink-0 flex items-center gap-4">
          {!mounted ? null : props.user ? (
            <UserMenu user={props.user} signOutAction={handleSignOut} />
          ) : (
            <Link
              href="/auth/signin"
              className="px-5 py-2 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
