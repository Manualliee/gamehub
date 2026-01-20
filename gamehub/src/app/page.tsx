import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // If no session, redirect to signin
  redirect("/auth/signin");
}
