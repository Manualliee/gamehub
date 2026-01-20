"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaChevronDown } from "react-icons/fa";

interface DropdownFilterProps {
  onFilterChange: (value: string) => void;
  currentFilter: string;
}

export default function DropdownFilter({
  onFilterChange,
  currentFilter,
}: DropdownFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Popular", value: "popular" },
    { label: "Trending", value: "trending" },
    { label: "Top Rated", value: "rating" },
    { label: "New Releases", value: "recent" },
    { label: "Upcoming", value: "upcoming" },
    { label: "PC", value: "pc" },
    { label: "Linux", value: "linux" },
    { label: "PlayStation", value: "playstation" },
    { label: "Xbox", value: "xbox" },
    { label: "Nintendo", value: "nintendo" },
    { label: "Mobile", value: "mobile" },
  ];

  const currentLabel =
    options.find((o) => o.value === currentFilter)?.label || "Popular";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-48 mb-4" ref={filterRef}>
      <span className="sr-only">Filter by</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-linear-to-r from-accent to-accent/30 rounded-xl h-10 px-4 flex flex-row justify-center items-center gap-3 flex-shrink-0 hover:bg-linear-to-r hover:from-accent/30 hover:to-accent hover:cursor-pointer transition-colors duration-300"
      >
        <span className="font-medium">{currentLabel}</span>
        <FaChevronDown
          className={`text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-xl z-50 flex flex-col"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onFilterChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 transition-colors cursor-pointer ${
                  currentFilter === option.value
                    ? "bg-accent/20 text-accent font-bold"
                    : "hover:bg-accent hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
