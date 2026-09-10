import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Dumbbell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FitTrack Pro" },
      {
        name: "description",
        content: "Sign in or create your FitTrack Pro account to log workouts and track member progress.",
      },
      { property: "og:title", content: "Sign in — FitTrack Pro" },
      {
        property: "og:description",
        content: "Sign in or create your FitTrack Pro account to log workouts and track member progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/", replace: true });
  }, [loading, session, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account.");
        } else {
          toast.success("Welcome to FitTrack Pro.");
          navigate({ to: "/", replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-[min(1vw,12px)] bg-brand">
            <Dumbbell className="size-4 text-ink" strokeWidth={2.2} />
          </div>
          <span className="font-display text-2xl font-semibold uppercase tracking-[0.18em] text-white">
            FitTrack<span className="text-brand">Pro</span>
          </span>
        </div>

        <div className="panel">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h1 className="font-display text-xl font-semibold uppercase tracking-wide text-white">
              {mode === "signin" ? "Sign in" : "Create account"}
            </h1>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">Members only</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 text-sm">
            {mode === "signup" && (
              <div>
                <label className="label-caps mb-1.5" htmlFor="full-name">
                  Full name
                </label>
                <input
                  id="full-name"
                  className="field"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ava Larsen"
                  required
                />
              </div>
            )}
            <div>
              <label className="label-caps mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gym.com"
                required
              />
            </div>
            <div>
              <label className="label-caps mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-ink ring-1 ring-brand transition-colors hover:bg-brand-2 hover:ring-brand-2 disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">or</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full rounded-md py-2.5 text-sm font-medium text-fog ring-1 ring-line transition-colors hover:bg-steel"
            >
              Continue with Google
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[13px] text-mute">
          {mode === "signin" ? "No account yet?" : "Already a member?"}{" "}
          <button
            className="font-semibold text-brand-2 hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
