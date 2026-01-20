"use client";

import Link from "next/link";
import Img from "next/image";
import { useCart } from "@/context/CartContext";
import cartSVG from "../../../public/cart-shopping-svgrepo-com.svg";

export default function UserMenuCart() {
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <Link
      href="/cart"
      className="w-full relative flex flex-row gap-2 items-center hover:cursor-pointer hover:underline px-3 py-2 text-lg"
      title="Go to Cart"
    >
      Cart
      <div className="relative">
        <Img src={cartSVG} alt="Cart Logo" width={25} height={25} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
}
