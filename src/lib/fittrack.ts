import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = ["Cardio", "Strength", "Flexibility", "HIIT"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  title: string;
  category: Category;
  duration_minutes: number;
  calories: number;
  workout_date: string;
  notes: string | null;
  created_at: string;
};

export const CATEGORY_SHORT: Record<Category, string> = {
  Cardio: "Car",
  Strength: "Str",
  Flexibility: "Flx",
  HIIT: "HIIT",
};

export function initials(name: string | null | undefined, fallback = "?") {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || fallback;
}

export async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function fetchWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("workout_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Workout[];
}

export async function fetchWorkoutsForUser(userId: string): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .order("workout_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Workout[];
}
