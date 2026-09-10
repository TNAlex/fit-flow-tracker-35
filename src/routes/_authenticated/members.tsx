import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import {
  CATEGORY_SHORT,
  fetchProfiles,
  fetchWorkouts,
  initials,
  type Profile,
  type Workout,
} from "@/lib/fittrack";

export const Route = createFileRoute("/_authenticated/members")({
  head: () => ({
    meta: [
      { title: "Members & Workouts — FitTrack Pro" },
      {
        name: "description",
        content: "Browse every FitTrack Pro member and open their full logged workout history.",
      },
      { property: "og:title", content: "Members & Workouts — FitTrack Pro" },
      {
        property: "og:description",
        content: "Browse every FitTrack Pro member and open their full logged workout history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const profilesQuery = useQuery({ queryKey: ["profiles"], queryFn: fetchProfiles });
  const workoutsQuery = useQuery({ queryKey: ["workouts"], queryFn: fetchWorkouts });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const profiles = profilesQuery.data ?? [];
  const workouts = workoutsQuery.data ?? [];
  const loading = profilesQuery.isLoading || workoutsQuery.isLoading;

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of workouts) map.set(w.user_id, (map.get(w.user_id) ?? 0) + 1);
    return map;
  }, [workouts]);

  const selected: Profile | null =
    profiles.find((p) => p.id === selectedId) ?? profiles[0] ?? null;
  const memberWorkouts = selected ? workouts.filter((w) => w.user_id === selected.id) : [];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="mb-5">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-2">
            <span className="inline-block size-1.5 rounded-full bg-brand" /> Roster
          </div>
          <h1 className="mt-2 font-display text-4xl font-semibold uppercase leading-none tracking-tight text-white">
            Members &amp; Workouts
          </h1>
        </div>

        <div className="panel flex flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-white">
              Members &amp; History
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">Select a member</span>
          </div>

          {loading ? (
            <div className="grid gap-3 p-5 sm:grid-cols-5">
              <div className="space-y-3 sm:col-span-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-md bg-steel" />
                ))}
              </div>
              <div className="space-y-3 sm:col-span-3">
                <div className="h-8 w-1/2 animate-pulse rounded-md bg-steel" />
                <div className="h-40 animate-pulse rounded-md bg-steel" />
              </div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-display text-2xl uppercase text-white">No members yet</p>
              <p className="mt-2 text-[13px] text-mute">
                As people sign up they will appear here with their workout history.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-5">
              <ul className="divide-y divide-line border-b border-line sm:col-span-2 sm:border-b-0 sm:border-r">
                {profiles.map((p) => {
                  const active = selected?.id === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => setSelectedId(p.id)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                          active ? "bg-ink/40 ring-1 ring-inset ring-brand/40" : "hover:bg-ink/30"
                        }`}
                      >
                        <div
                          className={`grid size-8 shrink-0 place-items-center rounded-full font-display text-xs font-bold ${
                            active ? "bg-brand text-ink" : "bg-steel text-fog ring-1 ring-line"
                          }`}
                        >
                          {initials(p.full_name ?? p.email)}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`truncate text-[13px] font-semibold ${active ? "text-white" : "text-fog"}`}
                          >
                            {p.full_name ?? p.email ?? "Member"}
                          </div>
                          <div className="font-mono text-[10px] text-mute">
                            {counts.get(p.id) ?? 0} workouts
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="p-5 sm:col-span-3">
                {selected && (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                          {selected.full_name ?? selected.email ?? "Member"}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
                          {memberWorkouts.length} sessions logged
                        </div>
                      </div>
                      <span className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-2 ring-1 ring-brand/30">
                        Active
                      </span>
                    </div>

                    {memberWorkouts.length === 0 ? (
                      <div className="rounded-md p-8 text-center ring-1 ring-line">
                        <p className="text-[13px] text-mute">No workouts logged by this member yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-md ring-1 ring-line">
                        <table className="w-full text-[13px]">
                          <thead className="bg-steel text-mute">
                            <tr className="text-left font-mono text-[10px] uppercase tracking-[0.12em]">
                              <th className="px-3 py-2 font-medium">Exercise</th>
                              <th className="px-3 py-2 font-medium">Cat.</th>
                              <th className="px-3 py-2 font-medium">Date</th>
                              <th className="px-3 py-2 text-right font-medium">Min</th>
                              <th className="px-3 py-2 text-right font-medium">kcal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line">
                            {memberWorkouts.map((w: Workout) => (
                              <tr key={w.id} className="transition-colors hover:bg-ink/30">
                                <td className="px-3 py-2.5 font-medium text-white">
                                  {w.title}
                                  {w.notes && <div className="text-[11px] font-normal text-mute">{w.notes}</div>}
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className="font-mono text-[10px] uppercase text-brand-2">
                                    {CATEGORY_SHORT[w.category] ?? w.category}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 font-mono text-mute">{w.workout_date}</td>
                                <td className="px-3 py-2.5 text-right font-mono text-fog">{w.duration_minutes}</td>
                                <td className="px-3 py-2.5 text-right font-mono text-fog">{w.calories}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
