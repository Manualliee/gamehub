// @vitest-environment jsdom
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import GamePurchaseSection from "../../components/cart/GamePurchaseSection";

// Mock the child component to avoid Context provider dependency issues.
// We only want to test if GamePurchaseSection *decides* to render it, not if the button works.
vi.mock("../../components/cart/AddToCartButton", () => ({
  default: () => <button data-testid="add-to-cart-btn">Add to Cart</button>,
}));

describe("GamePurchaseSection", () => {
    
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    gameId: 101,
    gameName: "Test Game",
    price: "19.99",
    image: "/test.jpg",
    platforms: [],
    currentlyAvailable: true,
  };

  it("renders price and button when game is available and not owned", () => {
    render(<GamePurchaseSection {...defaultProps} isOwned={false} />);

    // Should show price
    expect(screen.getByText("$19.99")).toBeDefined();
    // Should show button
    expect(screen.getByTestId("add-to-cart-btn")).toBeDefined();
    // Should NOT show "In Library"
    expect(screen.queryByText("In Library")).toBeNull();
  });

  it("renders 'In Library' when isOwned is true", () => {
    render(<GamePurchaseSection {...defaultProps} isOwned={true} />);
    
    // Should show ownership badge
    expect(screen.getByText("In Library")).toBeDefined();

    // Should NOT show price or button (logic priority)
    expect(screen.queryByText("$19.99")).toBeNull();
    expect(screen.queryByTestId("add-to-cart-btn")).toBeNull();
  });

  it("renders 'Coming Soon' when not available yet", () => {
    render(
      <GamePurchaseSection
        {...defaultProps}
        isOwned={false}
        currentlyAvailable={false}
        tba={false}
      />
    );

    expect(screen.getByText("Coming Soon")).toBeDefined();
    expect(screen.queryByTestId("add-to-cart-btn")).toBeNull();
  });
});
