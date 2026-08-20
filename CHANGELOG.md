# NexoraTikTok Changelog

## v1.7.0 — 2026-08-20

- Added live database-managed course tracks and lesson content with `nexora_courses` and `nexora_lessons`.
- Seeded 3 learning tracks and 14 original starter/full lessons.
- Added public course and curriculum previews that load from Supabase instead of hard-coded course cards.
- Added account-specific lesson access with `starter` and `full` course-access levels.
- Deployed the `course-content` Edge Function to validate the existing student-auth session before returning protected lesson content.
- Rebuilt the Student Portal Course tab as a live lesson viewer with lesson text, actions, duration, preview badges and progress buttons.
- Connected dynamic lesson completion to existing progress tracking and cloud sync.
- Added a private `admin-courses.html` manager for creating, editing, hiding, sorting and deleting courses and lessons.
- Added public-preview, video URL, duration, lesson text and student-action controls to the lesson editor.
- Added course-access control to the main Admin Students modal so admins can switch a student between starter and full access.
- Added `course-library.js`, `course-library.css`, `portal-courses.js`, `admin-courses.js` and `admin-courses.css`.

## v1.6.0 — 2026-08-20

- Rebuilt Prompt Book as a live Supabase-backed content library instead of hard-coded HTML cards.
- Added the `nexora_prompts` database table with public active-prompt reads and protected admin CRUD policies.
- Seeded 12 original starter prompts across emotional story, AI short film, 3D animation, cute animals, cinematic, miniature, product reveal, food, fantasy, restoration, luxury interior and nature-growth categories.
- Added automatic Prompt Book categories, search, live result count, image paths and database-driven modal content.
- Added a private Prompt Manager to Nexora Admin with create, edit, visibility, sort order, image path and delete controls.
- Upgraded Student Portal with a Creator Profile tab for niche, creator goal, level, preferred language and bio.
- Upgraded the `portal-sync` Edge Function to v2 so creator-profile fields sync securely with the signed-in student account.
- Added creator profile information to the Admin Students view while keeping admin-only status and notes separate from student writes.
- Corrected Admin student workflow to use the protected `admin_status` field.
- Added `portal-v2.css`, `prompt-library.css` and `admin-v2.css` design layers.

## v1.5.0 — 2026-08-20

- Rebuilt the Home page with a premium creator-academy presentation.
- Added a new responsive `home-v2.css` design layer with richer hero, learning-path, portal-preview and prompt-preview sections.
- Added a visual Student Portal preview to explain progress, tasks and cloud sync before login.
- Expanded the private Admin Control Center with a dedicated Students tab.
- Added student search, status filtering, progress/time summaries, private admin notes and CSV export.
- Added protected admin read/update access for cloud student records through Row Level Security.
- Added internal student workflow status and private admin-note fields to portal-state records without exposing those controls to students.
- Added database indexes for student status and email lookup.
- Added explicit admin policies for `nexora_portal_state`.

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
