# NexoraTikTok Changelog

## v1.4.0 — 2026-08-20

- Added a private `admin.html` control center for Nexora operations.
- Added Supabase-backed admin authentication using the Nexora backend project.
- Added protected admin read/update policies for enrollment and contact requests.
- Added request status workflows and private admin notes.
- Added search, filters, request metrics, refresh controls and CSV export.
- Added responsive admin UI for desktop and mobile.
- Kept the admin page out of the public sitemap and marked it `noindex`.
- Added database indexes and automatic `updated_at` handling for request management.

## v1.3.0 — 2026-08-20

- Added secure cross-device Student Portal cloud sync.
- Added server-side session validation through the `portal-sync` Edge Function.
- Added database storage for lesson completion, notes, time and streak state.
- Kept local browser storage as an offline/fallback copy.
- Added visible cloud-sync status in the Student Portal.
- Added automatic Prompt Book image slots at `images/prompts/prompt-01.jpg` through `prompt-06.jpg`.
- Added prompt popup image previews when an uploaded image is available.
- Expanded GitHub Pages deployment validation for all v1.3 files.
- Documented image slots and production architecture in README.

## v1.2.0

- Added Free Starter Lessons.
- Added Prompt Book search, category filtering, result count and empty state.
- Added sitemap entry for Free Lessons.
- Improved forms, auth recovery, responsive design and production polish.
