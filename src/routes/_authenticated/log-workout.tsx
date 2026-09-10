import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { CATEGORIES, type Category } from "@/lib/fittrack";

export const Route = createFileRoute("/_authenticated/log-workout")({
  head: () => ({
    meta: [
      { title: "Log a Workout — FitTrack Pro" },
      {
        name: "description",
        content: "Record exercise name, category, duration, calories, date and notes for your training session.",
      },
      { property: "og:title", content: "Log a Workout — FitTrack Pro" },
      {
        property: "og:description",
        content: "Record exercise name, category, duration, calories, date and notes for your training session.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogWorkoutPage,
});

function today() {
  return new Date().toISOString().slice(0, 10);
}

function LogWorkoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Strength");
  const [date, setDate] = useState(today());
  const [duration, setDuration] = useState("45");
  const [calories, setCalories] = useState("400");
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("You need to be signed in.");
      const { error } = await supabase.from("workouts").insert({
        user_id: auth.user.id,
        title,
        category,
        duration_minutes: Number(duration) || 0,
        calories: Number(calories) || 0,
        workout_date: date,
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Workout saved.");
      queryClient.invalidateQueries();
      navigate({ to: "/members" });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Could not save the workout");
    },
  });

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="mb-5">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-2">
            <span className="inline-block size-1.5 rounded-full bg-brand" /> New entry
          </div>
          <h1 className="mt-2 font-display text-4xl font-semibold uppercase leading-none tracking-tight text-white">
            Log a workout
          </h1>
        </div>

        <div className="panel">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-white">New Workout</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">Entry form</span>
          </div>
          <form
            className="space-y-4 p-5 text-sm"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <div>
              <label className="label-caps mb-1.5" htmlFor="title">
                Exercise name
              </label>
              <input
                id="title"
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Back Squat — Working Set"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps mb-1.5" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  className="field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-caps mb-1.5" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="field"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps mb-1.5" htmlFor="duration">
                  Duration (min)
                </label>
                <input
                  id="duration"
                  type="number"
                  min={0}
                  className="field font-mono"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-caps mb-1.5" htmlFor="calories">
                  Calories
                </label>
                <input
                  id="calories"
                  type="number"
                  min={0}
                  className="field font-mono"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-caps mb-1.5" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                className="field resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="PR at 405 — grip fading on set 5"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-ink ring-1 ring-brand transition-colors hover:bg-brand-2 hover:ring-brand-2 disabled:opacity-60"
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Save workout
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
