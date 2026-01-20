import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import NavbarVisibility from "@/components/layout/NavbarVisibility";
import { CartProvider } from "@/context/CartContext";
import { auth } from "../../auth";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameHub | Discover Your Next Adventure",
  description: "Explore thousands of games, track your collection, and find the best deals across all platforms.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased custom-scrollbar`}>
        <Providers>
          <CartProvider>
            <NavbarVisibility navbar={<Navbar user={session?.user?.name} />}>
              {children}
            </NavbarVisibility>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
