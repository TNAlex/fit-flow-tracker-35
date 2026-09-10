# FitTrack Pro

Act as an expert full-stack developer. Create a clean, modern, and fully functional MVP React web application named "FitTrack Pro", designed to help users track their daily workout sessions and fitness progress.

1. Application Details & Target Audience

App Name: FitTrack Pro

Target Users: Fitness enthusiasts, casual gym-goers, and personal trainers looking for a simple way to record workouts and view member logs.

Core Purpose: Allow authenticated users to log workout details, view a list of all active members, and inspect detailed workout history for any selected user.

2. Pages & Navigation Architecture

Include a clear navigation bar (header) visible across all pages:

Home / Dashboard (/): An overview page with summary cards (Total Users, Total Workouts Logged) and quick call-to-action buttons.

Log Workout (/log-workout): A dedicated form page to add new workout records.

Members & Workouts (/members): A page displaying a list of registered users/members. Clicking on a specific user displays their full history of logged workouts (master-detail view).

Authentication Page (/auth): For user login and sign-up.

3. Key Features & Functionality

Authentication: Full Supabase Auth implementation with User Sign Up, User Sign In, and Sign Out capabilities. Protect /log-workout and /members so only logged-in users can access them.

Workout Entry Form: A form requiring the following inputs:

Workout Title / Exercise Name (text)

Exercise Category (dropdown: Cardio, Strength, Flexibility, HIIT)

Duration in Minutes (number)

Calories Burned (number)

Date Performed (date picker)

Notes / Comments (textarea)

Master-Detail Data View:

On the Members page, list all registered users.

When clicking a member's name/card, open a detail view showing a structured table of all workouts logged by that specific user.

4. Supabase Database Schema Requirements

Set up the connection to Supabase and ensure the database handles two main tables:

profiles table: Linked to auth.users containing id, full_name, email, and created_at.

workouts table: Containing id, user_id (foreign key to profiles), title, category, duration_minutes, calories, workout_date, notes, and created_at.

5. UI/UX Design & Styling

Clean, responsive, dark/light modern UI using Tailwind CSS and Lucide icons.

Clear visual status feedback (toast notifications for successful workout submission or authentication errors).

Empty states and loading skeletons when fetching data from Supabase.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6959550c-096a-4823-8cd4-861e4b39129c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
