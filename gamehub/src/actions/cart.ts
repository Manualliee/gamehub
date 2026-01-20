"use server";

import { auth } from "../../auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCartItems() {
  const session = await auth();
  if (!session?.user?.email) return [];

  // Get user id
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (error || !user) return [];

  // Fetch cart items for this user
  const { data: cartItems, error: cartError } = await supabaseAdmin
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id);

  if (cartError || !cartItems) return [];

  // Map DB items to the format expected by the frontend
  return cartItems.map(
    (item: {
      game_id: number;
      name: string;
      price: number;
      image?: string | null;
    }) => ({
      id: item.game_id,
      name: item.name,
      price: item.price,
      image: item.image ?? null,
    }),
  );
}

export async function addToCartAction(item: {
  id: number;
  name: string;
  price: number;
  image: string | null;
}) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Not authenticated" };

  // Get user id
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (error || !user) return { error: "User not found" };

  // Insert cart item
  const { error: insertError } = await supabaseAdmin.from("cart_items").insert([
    {
      user_id: user.id,
      game_id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    },
  ]);

  if (insertError) {
    console.error("Insert error:", insertError);
    return { success: false, error: insertError.message };
  }

  return { success: true };
}

export async function removeFromCartAction(gameId: number) {
  const session = await auth();
  if (!session?.user?.email) return;

  // Get user id from Supabase
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (error || !user) return;

  // Delete cart items for this user and game
  await supabaseAdmin
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("game_id", gameId);
}

export async function clearCartAction() {
  const session = await auth();
  if (!session?.user?.email) return;

  // Get user id from Supabase
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (error || !user) return;

  // Delete all cart items for this user
  await supabaseAdmin.from("cart_items").delete().eq("user_id", user.id);
}
