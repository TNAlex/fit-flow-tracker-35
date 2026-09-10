import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Flame, Plus, TrendingUp, Users } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { fetchProfiles, fetchWorkouts } from "@/lib/fittrack";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitTrack Pro — Workout Tracking Dashboard" },
      {
        name: "description",
        content:
          "Log daily workouts, track calories and duration, and review every member's training history in one dashboard.",
      },
      { property: "og:title", content: "FitTrack Pro — Workout Tracking Dashboard" },
      {
        property: "og:description",
        content:
          "Log daily workouts, track calories and duration, and review every member's training history in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  label,
  value,
  sub,
  icon,
  loading,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.15em] text-mute">{label}</span>
        {icon}
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-steel" />
      ) : (
        <div className="mt-3 font-mono text-3xl font-bold text-white">{value}</div>
      )}
      <div className="mt-1 font-mono text-[11px] text-mute">{sub}</div>
    </div>
  );
}

function Dashboard() {
  const { session, loading: authLoading } = useAuth();
  const signedIn = !!session;

  const profilesQuery = useQuery({ queryKey: ["profiles"], queryFn: fetchProfiles, enabled: signedIn });
  const workoutsQuery = useQuery({ queryKey: ["workouts"], queryFn: fetchWorkouts, enabled: signedIn });

  const workouts = workoutsQuery.data ?? [];
  const loading = authLoading || profilesQuery.isLoading || workoutsQuery.isLoading;

  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0);
  const avgDuration = workouts.length ? Math.round(totalMinutes / workouts.length) : 0;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        <section className="mb-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-2">
                <span className="inline-block size-1.5 rounded-full bg-brand" /> Training overview
              </div>
              <h1 className="mt-2 max-w-[20ch] font-display text-4xl font-semibold uppercase leading-none tracking-tight text-white sm:text-5xl">
                Rack it. Log it. Repeat.
              </h1>
            </div>
            <div className="flex gap-3">
              {signedIn ? (
                <>
                  <Link
                    to="/members"
                    className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-fog ring-1 ring-line transition-colors hover:bg-panel"
                  >
                    View members
                  </Link>
                  <Link
                    to="/log-workout"
                    className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-2"
                  >
                    <Plus className="size-4 shrink-0" strokeWidth={2.4} />
                    Log a workout
                  </Link>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-2"
                >
                  <Plus className="size-4 shrink-0" strokeWidth={2.4} />
                  Get started
                </Link>
              )}
            </div>
          </div>

          {signedIn ? (
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="Total members"
                value={String(profilesQuery.data?.length ?? 0)}
                sub="registered"
                loading={loading}
                icon={<Users className="size-4 shrink-0 text-brand-2" />}
              />
              <StatCard
                label="Workouts logged"
                value={workouts.length.toLocaleString()}
                sub="all time"
                loading={loading}
                icon={<TrendingUp className="size-4 shrink-0 text-brand-2" />}
              />
              <StatCard
                label="Calories burned"
                value={totalCalories.toLocaleString()}
                sub="kcal total"
                loading={loading}
                icon={<Flame className="size-4 shrink-0 text-accent" />}
              />
              <StatCard
                label="Avg duration"
                value={`${avgDuration} min`}
                sub="per session"
                loading={loading}
                icon={<Clock className="size-4 shrink-0 text-brand-2" />}
              />
            </div>
          ) : (
            <div className="panel mt-5 p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-2">Members only</div>
              <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-mute">
                Sign in to log training sessions, track calories and duration, and browse the full workout
                history of every member on the roster.
              </p>
            </div>
          )}
        </section>

        {signedIn && (
          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-2">Load check</div>
                <div className="font-display text-2xl font-semibold uppercase text-white">
                  {totalMinutes.toLocaleString()} minutes trained
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="plate-snap grid size-9 place-items-center rounded-md bg-steel ring-2 ring-brand">
                  <span className="font-mono text-[10px] text-fog">45</span>
                </div>
                <div
                  className="plate-snap grid size-7 place-items-center rounded-md bg-steel ring-2 ring-line"
                  style={{ animationDelay: "0.08s" }}
                >
                  <span className="font-mono text-[10px] text-mute">25</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-pretty text-[13px] leading-relaxed text-mute">
              The satisfying click of a plate seating on the sleeve. Every log lands with a little snap.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
