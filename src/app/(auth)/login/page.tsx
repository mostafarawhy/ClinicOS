"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Stethoscope,
  Eye,
  EyeOff,
  Lock,
  Mail,
  FlaskConical,
} from "lucide-react";
import LoadingOverlay from "./loading-overlay";

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    email: "admin@clinic.com",
    password: "admin123",
    description: "Full access + user management",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  {
    role: "Dentist",
    email: "dentist1@clinic.com",
    password: "dentist123",
    description: "Schedule + patients + calendar",
    badge: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  },
  {
    role: "Receptionist",
    email: "reception1@clinic.com",
    password: "reception123",
    description: "Booking + patient lookup",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [activeRole, setActiveRole] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  }

  async function handleUseAccount(account: (typeof DEMO_ACCOUNTS)[0]) {
    setForm({ email: account.email, password: account.password });
    setActiveRole(account.role);
    if (error) setError(null);

    setLoading(true);
    const result = await signIn("credentials", {
      email: account.email,
      password: account.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/schedule");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: form.email.trim(),
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/schedule");
  }

  return (
    <>
      {loading && <LoadingOverlay />}

      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-5">
          {/* Demo banner */}
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <FlaskConical className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Interactive Demo
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  DentaFlow is a real clinic management system built for an
                  Upwork client. Select a role below to explore the full app —
                  no sign-up needed.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => {
                const isActive = activeRole === account.role;
                return (
                  <button
                    key={account.role}
                    type="button"
                    disabled={loading}
                    onClick={() => handleUseAccount(account)}
                    className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all disabled:opacity-50 ${
                      isActive
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${account.badge}`}
                    >
                      {account.role}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {account.email}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {account.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isActive ? "Signing in..." : "Login as →"}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground text-center">
              Clicking a role signs you in instantly
            </p>
          </div>

          {/* Branding */}
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary mb-3">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">DentaFlow</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Staff portal — sign in to continue
            </p>
          </div>

          {/* Login form */}
          <div className="rounded-xl border border-border bg-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="user@clinic.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-input pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-input pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Staff-only access &middot; Contact your admin for credentials
          </p>
        </div>
      </div>
    </>
  );
}
