# NexoraTikTok — Nexora Digital Creator Academy

Current version: **v1.8.0**

Production-oriented creator-learning website deployed with GitHub Pages and connected to Supabase services.

## Public pages

- `index.html` — Premium Home experience
- `free-lessons.html` — Free starter lessons
- `courses.html` — Live database-backed course catalog
- `curriculum.html` — Live public curriculum previews
- `support-program.html` — Flagship support program
- `services.html` — Creator services
- `prompt-book.html` — Live searchable prompt library
- `results.html` — Results/case-study layout
- `faq.html` — FAQ
- `learn.html` — Student login and live learning portal
- `enroll.html` — Enrollment form
- `contact.html` — Contact form
- `legal.html` — Policies
- `404.html` — Not found page

## Live courses and lessons

Course content is stored in `public.nexora_courses` and `public.nexora_lessons`.

Public visitors can read active course metadata and lessons marked as public previews. Full lesson text is returned to signed-in students through the `course-content` Edge Function after validating the existing student-auth session.

Student accounts support two access levels:

- `starter` — public-preview lessons only
- `full` — all active lessons

### Automatic enrollment approval → Full access

When an enrollment request is changed to `approved`, database automation finds a matching portal student by normalized email and grants `full` course access. If approval happens before the student creates or syncs a portal record, the later portal identity update checks existing approved enrollments and grants Full access automatically.

Approval time and access-grant time are recorded for operations/auditing. Existing approved enrollments are backfilled to matching portal students during the v1.8 migration.

Authorized admins can still manually change a student's course access from the main Admin Students modal.

### Course Manager

`admin-courses.html` is the private Course & Lesson Manager. It supports creating/editing/hiding/reordering/deleting course tracks and lessons, public previews, duration, full lesson text, student tasks and optional lesson video URLs.

`course-library.js` powers the public Courses/Curriculum pages. `portal-courses.js` powers the signed-in lesson viewer.

## Live Prompt Book

Prompt Book is database-driven through `public.nexora_prompts`. Authorized admins can create, edit, hide, reorder and delete prompt entries from `admin.html`.

## Student Portal

The portal provides live account-specific lessons, lesson completion, creator tasks, a private notebook, study time/streak, creator profile fields and cloud synchronization.

`portal-sync` validates the student Supabase Auth session before reading or writing learning/profile state. `course-content` separately validates the same session before returning protected lesson content. A local browser copy remains as an offline fallback for progress/profile state.

## Private Admin Control Center

- `admin.html` — students, prompts, enrollments and contacts
- `admin-courses.html` — course and lesson management
- `admin-analytics.html` — live operational analytics
- `admin.js` / `admin-courses.js` / `admin-analytics.js` — protected admin logic

The Analytics dashboard shows student totals, Full-access count, 7-day activity, total study time, enrollment approval funnel, open requests, content health, access distribution, language/level breakdowns and recent student activity.

Admin pages are excluded from the public sitemap and marked `noindex`. Database Row Level Security is the real access control.

## Key shared assets

- `styles.css`, `extras.css`, `home-v2.css`
- `portal-v2.css`, `portal-cloud.css`, `course-library.css`
- `prompt-library.css`, `admin.css`, `admin-v2.css`, `admin-courses.css`, `admin-analytics.css`
- `app.js`, `portal-extra.js`, `portal-cloud.js`, `portal-courses.js`
- `course-library.js`, `prompt-library.js`, `admin.js`, `admin-courses.js`, `admin-analytics.js`
- `forms.js`
- `assets/logo.svg`
- `site.webmanifest`, `robots.txt`, `sitemap.xml`

## Deployment

GitHub Pages is deployed from `.github/workflows/pages.yml`.

Expected URL:

`https://lensbykai-bit.github.io/NexoraTikTok/`

GitHub Pages should use **GitHub Actions** as the deployment source.

## Authentication and secrets

The student portal uses the existing student Supabase Auth project. Its redirect allow-list must include:

`https://lensbykai-bit.github.io/NexoraTikTok/learn.html`

The private admin pages use the Nexora backend Supabase Auth project and require membership in `admin_users`.

Never commit OAuth client secrets, service-role keys or payment secrets. Browser files contain publishable keys only; elevated access remains server-side.

## Content policy for this project

Nexora uses original branding, copy, assets and implementation. Public reference sites may inspire layout or user-flow ideas, but third-party proprietary source code, logos, photographs and long-form text should not be copied without permission.
