import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import AppBackground from "@/components/ui/AppBackground";
import MainContent from "@/components/layout/MainContent";
import Carousel from "@/components/layout/Carousel";

export default async function DashboardPage() {
  const session = await auth();

  // If no session, redirect to signin page
  if (!session) {
    redirect("/auth/signin");
  }
  
  return (
    <div className="w-full min-h-screen p-8 flex flex-col items-center gap-8">
      <AppBackground />
      <Carousel />
      <MainContent />
    </div>
  );
}
