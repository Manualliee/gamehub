"use server";

import { auth } from "../../auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function getOrders() {
  const session = await auth();
  if (!session?.user?.email) return [];

  // Get user id
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) return [];

  // Get orders for user
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, total, created_at, order_items(id, name, price, image, game_id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !orders) return [];

  return orders.map((order) => ({
    ...order, // copies all properties from order
    items: order.order_items ?? [], // add/override items property with order.order_items or empty array
  }));
}

export async function createOrderAction() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated." };
    }

    // Get user and cart items
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return { success: false, error: userError?.message || "User not found." };
    }

    const { data: cartItems, error: cartError } = await supabaseAdmin
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (cartError) {
      return { success: false, error: cartError.message };
    }
    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

    // Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: user.id,
          total: totalPrice,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      return {
        success: false,
        error: orderError?.message || "Failed to create order.",
      };
    }

    // Insert order_items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      game_id: item.game_id,
      name: item.name,
      price: item.price,
      image: item.image,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return {
        success: false,
        error: itemsError.message || "Failed to add order items.",
      };
    }

    // Clear cart
    const { error: clearCartError } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (clearCartError) {
      return {
        success: false,
        error: clearCartError.message || "Failed to clear cart.",
      };
    }

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error occurred.",
    };
  }
}
