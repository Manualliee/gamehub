"use client";
import { usePathname } from "next/navigation";

export default function NavbarVisibility({
  children,
  navbar,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    // On auth pages: Just render the content, no navbar, no padding
    return <>{children}</>;
  }

  // On app pages: Render Navbar AND content with responsive padding
  return (
    <>
      {navbar}
      <main style={{ paddingTop: "var(--navbar-height)" }}>{children}</main>
    </>
  );
}
