import { getOrders } from "@/actions/order";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  game_id: number;
};

type RawOrder = {
  id: string;
  total: number;
  created_at: string | Date;
  items: OrderItem[];
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  let orders: RawOrder[] = [];
  let errorMsg: string | null = null;

  try {
    const rawOrders: RawOrder[] = await getOrders();
    orders = rawOrders.map((order: RawOrder) => ({
      ...order,
      items: order.items ?? [],
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    errorMsg = "Failed to load your orders. Please try again later.";
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 p-8">
        <span className="text-red-600 font-semibold">{errorMsg}</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 p-8">
        <span className="text-foreground/80">You have no orders yet.</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-3xl font-bold mb-2">Order History</h1>
      <div className="w-full h-0.5 bg-linear-to-r from-accent to-background mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card p-6 rounded-xl shadow-lg border border-border flex flex-col gap-3"
          >
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h2 className="font-bold text-lg">Order #{order.id.slice(-6)}</h2>
              <span className="text-sm text-muted-foreground">
                {typeof order.created_at === "string"
                  ? order.created_at.slice(0, 10) // "YYYY-MM-DD"
                  : new Date(order.created_at).toISOString().slice(0, 10)}
              </span>
            </div>

            <ul className="flex flex-col gap-2 my-2">
              {order.items.map((item: OrderItem) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <Link
                    href={`/games/${item.game_id}`}
                    className="hover:text-accent transition-colors duration-200"
                  >
                    <span>{item.name}</span>
                  </Link>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-3 border-t border-border flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
