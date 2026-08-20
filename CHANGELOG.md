# NexoraTikTok Changelog

## v1.9.0 — 2026-08-20

- Added `admin-operations.html` as a private enrollment operations center.
- Added enrollment-to-student matching fields so approved requests can be tied to a specific portal account.
- Added manual payment workflow fields: `payment_status` and `payment_reference`. These track payment state only and do not process money.
- Strengthened approval automation so approved enrollments match by normalized email, grant Full course access, and record match timestamps.
- Added automatic matching for students who create or sync their portal account after an earlier enrollment approval.
- Added `nexora_student_notifications` with protected admin controls and a server-side student notification endpoint.
- Added an in-portal Notifications tab with unread counts, mark-read controls, course-access updates and support updates.
- Added custom student notification sending from the private Operations center.
- Added `nexora_admin_activity` and protected database audit triggers for enrollments, contacts, prompts, courses, lessons, admin student-access changes and notification creation.
- Added Operations metrics for pending enrollments, unmatched approvals, Full-access students, unread notifications and 24-hour activity.
- Hardened notification/audit sequence and function permissions and kept elevated access server-side.
- Expanded GitHub Pages validation and JavaScript syntax checks for all v1.9 assets.

## v1.8.0 — 2026-08-20

- Added automatic Full Course Access when an enrollment is marked `approved`.
- Added approval-time tracking on enrollment records and course-access grant timestamps on student portal records.
- Added database triggers so approved enrollments grant access immediately to matching existing student accounts.
- Added a second trigger so students who create/login to their portal after an earlier approval automatically receive Full access by matching the approved enrollment email.
- Added a backfill step so any already-approved enrollment is synchronized with an existing portal student.
- Added `admin-analytics.html`, `admin-analytics.js` and `admin-analytics.css` as a private live operations dashboard.
- Added analytics for student totals, Full access, 7-day activity, study time, approved enrollments, open requests, prompts and lessons.
- Added enrollment funnel, student access, preferred-language and creator-level breakdowns.
- Added recent student activity and published-content health summaries.
- Linked Analytics from the main Admin dashboard and Course Manager.
- Expanded deployment validation to cover v1.8 analytics files and JavaScript syntax.

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
