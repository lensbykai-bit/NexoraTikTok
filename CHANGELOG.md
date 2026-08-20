# NexoraTikTok Changelog

## v2.4.0 — 2026-08-20

- Added an installable Progressive Web App foundation with an upgraded `site.webmanifest`, app identity, shortcuts and standalone display settings.
- Added `sw.js` with versioned public-page/static-asset caching and automatic cleanup of older Nexora caches.
- Added a branded `offline.html` fallback with connection recovery, Home and Free Lessons actions.
- Added network-first navigation behavior for public pages and stale-while-revalidate behavior for safe same-origin static assets.
- Explicitly excluded Admin, Student Portal, private certificate and enrollment routes from offline caching so sensitive/account-specific pages are not stored by the service worker.
- Added service-worker registration and online/offline feedback to the shared public/student runtime.
- Added deployment guards that fail if private routes are removed from service-worker exclusions or accidentally appear in the PWA precache.
- Expanded JavaScript syntax validation and required-file validation to cover the service worker and offline page.

## v2.3.0 — 2026-08-20

- Hardened the main Admin student view so it no longer selects or displays the private Student Portal notebook field.
- Replaced wildcard student-state reads in `admin.js` with an explicit admin-safe field list.
- Kept private admin notes separate from student-authored notebook content and retained student CSV export without notebook text.
- Added GitHub Pages privacy guards that fail deployment if the student notebook preview returns, if wildcard student-state reads are reintroduced, or if the public `app.js` runtime is added back to `admin.html`.
- Added a browser-asset secret guard for obvious service-role/client-secret references before deployment.
- Rebuilt Prompt Book media handling for image-later workflows with numbered image slots, lazy-loaded previews, broken-image fallback states and a matching modal placeholder.
- Added Prompt Book `Show more`, clear-search and retry controls so larger prompt libraries remain fast and clean.
- Added better prompt category accessibility with `aria-pressed`, keyboard-open behavior and live loading/error states.
- Added reduced-motion support, stronger focus-visible states, better mobile touch targets and a defensive floating-support hide rule for private pages.
- Kept the Prompt Book database/image URL architecture unchanged so user-supplied images can be attached later without restructuring content.

## v2.2.0 — 2026-08-20

- Added public certificate verification by secure certificate code at `verify-certificate.html`.
- Deployed the public `certificate-verify` Edge Function, which only accepts well-formed certificate codes and returns a minimal public verification record.
- Added `certificate-verify.js` and `certificate-verify.css` for verified, revoked and not-found states.
- Added direct Public Verify links from the authenticated student certificate viewer.
- Added `admin-certificates.html`, `admin-certificates.js` and `admin-certificates.css` as a private certificate operations dashboard.
- Added admin search, active/revoked filters, verification-link copy, certificate revocation and reactivation controls.
- Hardened certificate updates so authenticated admins can update certificate status fields but cannot edit certificate identity/name/code fields through the browser role.
- Added automatic revoked/active timestamp handling and a status constraint for certificate records.
- Removed the public-site `app.js` runtime from `admin.html` so the private Admin dashboard no longer initializes student/public-site behavior unnecessarily.
- Added the public verification page to the sitemap and expanded GitHub Pages validation for all v2.2 assets.

## v2.1.0 — 2026-08-20

- Added automatic course-completion certificates for Full-access students who complete every active lesson.
- Added the protected `nexora_certificates` table with unique certificate codes, issued date, lesson count and admin-only database visibility.
- Added a secure database trigger that issues or refreshes a certificate after portal progress updates meet the completion requirement.
- Upgraded `student-status` to v2 so the signed-in student receives authoritative lesson totals, completed-lesson count and their own active certificate summary.
- Added `certificate.html`, `certificate.js` and `certificate.css` as a private authenticated certificate viewer with Print / Save PDF support.
- Upgraded Student Dashboard progress to use server-verified lesson counts when online, with local progress as a fallback.
- Added Certificate Progress and Certificate Ready states directly inside the Student Portal Overview.
- Added responsive premium polish to Student Dashboard status, receipt and certificate cards.
- Expanded GitHub Pages required-file and JavaScript syntax checks for v2.1 certificate assets.

## v2.0.0 — 2026-08-20

- Added a new Student Portal **Overview** dashboard with access, lesson progress, enrollment status and unread-notification summaries.
- Added an authenticated `student-status` Edge Function that validates the existing Student Portal session before returning the signed-in student's enrollment/access summary.
- Added an in-portal enrollment receipt/status view showing the latest linked request, track, level, submitted/approved dates and non-secret payment status information.
- Fixed the v1.9 Notifications feature so the Student Portal now loads its notification UI automatically in production.
- Added `student-dashboard.js` and `student-dashboard.css` for the new overview experience.
- Added payment-provider-ready backend fields for provider, amount, currency and verification time without implementing or claiming real payment processing.
- Added the private `nexora_payment_events` table for a future server-side payment/webhook integration; public browser roles have no direct access.
- Upgraded the Operations Center to manage provider, amount and currency alongside the existing manual payment status/reference workflow.
- Added database indexes for student status/enrollment lookup and notification reads.
- Expanded GitHub Pages validation and JavaScript syntax checks for all v2 student-dashboard assets.

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
- Added a private Prompt Manager to Nexora Admin with create, edit, hide, reorder and delete prompt entries.
- Upgraded Student Portal with a Creator Profile tab for niche, creator goal, level, preferred language and bio.
- Upgraded the `portal-sync` Edge Function to v2 so creator-profile fields sync securely with the signed-in student account.
- Added creator profile information to the Admin Students view while keeping admin-only status and notes separate from student writes.
- Corrected Admin student workflow to use the protected `admin_status` field.
- Added `portal-v2.css`, `prompt-library.css` and `admin-v2.css` design layers.

## v1.5.0 — 2026-08-20

- Rebuilt the Home page with a premium creator-academy presentation.
- Added a new responsive `home-v2.css` design layer with richer hero, learning-path, student-dashboard preview and prompt-preview sections.
- Expanded the private Admin Control Center with a dedicated Students tab.

## v1.4.0 — 2026-08-20

- Added a private `admin.html` control center for Nexora operations.
- Added protected enrollment/contact management, search, filters, status workflow and CSV export.

## v1.3.0 — 2026-08-20

- Added secure cross-device Student Portal cloud sync, offline fallback and visible sync status.
- Added Prompt Book image slots and deployment validation improvements.

## v1.2.0

- Added Free Starter Lessons.
- Added Prompt Book search, category filtering, result count and empty state.
- Added sitemap entry for Free Lessons.
- Improved forms, auth recovery, responsive design and production polish.
