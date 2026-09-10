import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Dumbbell, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/fittrack";

const navLinkClass = "px-3 py-2 rounded-md transition-colors hover:text-fog";
const navActive = { className: "bg-panel text-white ring-1 ring-line" };

export function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const name = (user?.user_metadata?.["full_name"] as string | undefined) ?? user?.email ?? null;

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="border-b border-line bg-steel/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-[min(1vw,12px)] bg-brand">
              <Dumbbell className="size-4 text-ink" strokeWidth={2.2} />
            </div>
            <span className="font-display text-2xl font-semibold uppercase tracking-[0.18em] text-white">
              FitTrack<span className="text-brand">Pro</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium text-mute md:flex">
            <Link to="/" className={navLinkClass} activeProps={navActive} activeOptions={{ exact: true }}>
              Dashboard
            </Link>
            <Link to="/log-workout" className={navLinkClass} activeProps={navActive}>
              Log Workout
            </Link>
            <Link to="/members" className={navLinkClass} activeProps={navActive}>
              Members
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden items-center gap-2 pl-1 sm:flex">
                  <div className="grid size-8 place-items-center rounded-full bg-accent font-display text-sm font-bold text-ink">
                    {initials(name)}
                  </div>
                  <div className="leading-tight">
                    <div className="max-w-[10rem] truncate text-[13px] font-semibold text-white">{name}</div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-mute">Member</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-md py-2 pl-2 pr-3 text-[13px] font-medium text-mute ring-1 ring-line transition-colors hover:bg-panel hover:text-fog"
                >
                  <LogOut className="size-4 shrink-0" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-2"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
