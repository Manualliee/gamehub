"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { supabase } from "@/lib/supabase";

export default function LoginForm( { message }: { message?: string | null } ) {
  const [error, setError] = useState<string | null>(null);
  const [uiMessage, setUiMessage] = useState<string | null>(message || null);

  const handleError = () => {
    if (error) {
      setError(null);
    }
  };

  const credentialsAction = async (formData: FormData) => {
    setError(null);
    setUiMessage(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirect
    });

    if (result?.error) {
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();
      if (!user) {
        setError("No account found with this email.");
      } else {
        setError("Invalid email or password");
      }
    } else if (result?.ok) {
      // Redirect to dashboard on successful login
      // Also refresh the page to update auth state
      // This ensures the UI reflects the authenticated state
      // router.push("/dashboard"); made auth state stale
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="w-100 border border-foreground/20 rounded-xl flex flex-row overflow-hidden backdrop-blur-xl bg-card/70 shadow-2xl relative">
      {/* Form Content */}
      <div className="w-full flex flex-col justify-center p-8 relative z-10">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground text-shadow-lg">
              Game<span className="text-accent text-shadow-lg">Hub</span>
            </h2>
            <p className="text-sm text-foreground/70">
              Please signin to access your account.
            </p>
          </div>
          {uiMessage && (
            <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg text-sm mb-4">
              {uiMessage}
            </div>
          )}
          <form action={credentialsAction} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                onClick={handleError}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                onClick={handleError}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-accent to-accent/30 rounded-xl hover:bg-linear-to-r hover:from-accent/30 hover:to-accent hover:cursor-pointer transition-colors duration-300 px-4 py-2 font-bold"
            >
              Sign In
            </button>
          </form>
          <div className="flex justify-center mt-4">
            <Link
              href="/auth/signup"
              className="text-sm underline hover:text-accent transition-colors duration-200"
            >
              Create an account here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
