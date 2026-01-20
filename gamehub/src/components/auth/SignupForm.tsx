import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  // Clear field error when user starts typing
  const clearFieldError = (field: keyof typeof fieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate individual fields
  const hasValidationErrors = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email format is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    setFieldErrors(errors);
    return Object.values(errors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate all fields
    if (hasValidationErrors()) {
      setLoading(false);
      return;
    }

    try {
      // Call register API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful - redirect to signin
        router.push(
          "/auth/signin?message=Registration successful! Please sign in."
        );
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 border border-foreground/20 rounded-xl flex flex-row overflow-hidden backdrop-blur-xl bg-card/70 shadow-2xl relative">
      {/* Form Content */}
      <div className="w-full flex flex-col justify-center p-8 relative z-10">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Create Your Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                  clearFieldError("name");
                }}
                required
                disabled={loading}
                className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border focus:ring-primary"
                }`}
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-sm">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                required
                disabled={loading}
                className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border focus:ring-primary"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm">{fieldErrors.email}</p>
              )}
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
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                required
                disabled={loading}
                className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border focus:ring-primary"
                }`}
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm">{fieldErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                required
                disabled={loading}
                className={`w-full px-3 py-2 bg-card border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border focus:ring-primary"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-accent to-accent/30 rounded-xl hover:bg-linear-to-r hover:from-accent/30 hover:to-accent hover:cursor-pointer transition-colors duration-300 px-4 py-2 font-bold"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <div className="flex justify-center mt-4">
            <Link
              href="/auth/signin"
              className="text-sm underline hover:text-accent transition-colors duration-200"
            >
              Login to your account.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
