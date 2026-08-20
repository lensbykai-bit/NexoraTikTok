# NexoraTikTok — Nexora Digital Creator Academy

Current version: **v1.6.0**

Production-oriented static website for Nexora Digital, deployed with GitHub Pages and connected to Supabase services.

## Public pages

- `index.html` — Premium Home experience
- `free-lessons.html` — Free starter lessons
- `courses.html` — Course tracks
- `support-program.html` — Flagship support program
- `curriculum.html` — Learning modules
- `services.html` — Creator services
- `prompt-book.html` — Live searchable prompt library
- `results.html` — Verified-results placeholder/case-study layout
- `faq.html` — FAQ
- `learn.html` — Student login and cloud-synced portal
- `enroll.html` — Enrollment form
- `contact.html` — Contact form
- `legal.html` — Privacy, terms and service policies
- `404.html` — Not found page

## Home design

`home-v2.css` provides the premium Home presentation with creator-academy hero, learning-path sections, student-dashboard preview, prompt preview and responsive calls to action.

## Live Prompt Book

Prompt Book is now database-driven through `public.nexora_prompts`.

Public visitors can read only active prompts. Authorized admins can create, edit, hide, reorder and delete prompt records from `admin.html`.

Prompt fields include:

- title
- slug
- category
- full prompt text
- image path / URL
- active/hidden status
- sort order

`prompt-library.js` builds category filters and prompt cards from the live database. `prompt-library.css` provides the visual layer.

## Student Portal

The portal provides:

- course progress and task completion
- private notebook
- total/today study time and streak
- cross-device cloud synchronization
- creator profile: niche, goal, level, language and bio
- support links

`portal-sync` validates the existing student Supabase Auth session server-side before reading or writing cloud state. A local browser copy remains as an offline fallback.

The v2 sync endpoint writes student-owned learning/profile fields only. Internal admin fields such as `admin_status` and `admin_note` remain controlled through the backend admin project.

## Private Admin Control Center

- `admin.html` — management dashboard
- `admin.js` — protected admin logic
- `admin.css` / `admin-v2.css` — responsive admin interface

Authorized admins can:

- review cloud-synced students
- see creator niche, goal, level, language, lesson progress, study time, streak and last visit
- set internal student status and private admin notes
- create/edit/hide/reorder/delete Prompt Book entries
- review enrollment requests and contact messages
- search and filter current data
- export records as CSV

The admin page is excluded from the public sitemap and marked `noindex`. Row Level Security protects operational data even if someone guesses the URL.

## Shared assets

- `styles.css` — base design system
- `extras.css` — forms and production polish
- `home-v2.css` — premium Home design layer
- `portal-v2.css` — creator-profile portal design
- `portal-cloud.css` — cloud-sync status design
- `prompt-library.css` — live Prompt Book design
- `admin.css` / `admin-v2.css` — Admin design
- `app.js` — shared navigation, student auth and portal base behavior
- `forms.js` — Supabase-backed enrollment/contact submissions
- `portal-extra.js` — password recovery and portal enhancements
- `portal-cloud.js` — cross-device learning/profile synchronization
- `prompt-library.js` — database prompt loading, search, categories, modal and copy
- `admin.js` — protected operational management
- `assets/logo.svg` — Nexora Digital logo
- `site.webmanifest` — web app metadata
- `robots.txt` / `sitemap.xml` — search-engine discovery

## Prompt images

Prompt records may use relative repository paths such as:

`images/prompts/prompt-01.jpg`

or a permitted public HTTPS image URL. Missing images fall back to the designed gradient preview.

## Deployment

`.github/workflows/pages.yml` validates required files and local HTML links before deploying the repository to GitHub Pages.

Expected production URL:

`https://lensbykai-bit.github.io/NexoraTikTok/`

GitHub repository Pages settings must use **GitHub Actions** as the build/deployment source.

## Authentication

The student portal uses the existing student Supabase Auth project. Its authorized redirect allow-list must include:

`https://lensbykai-bit.github.io/NexoraTikTok/learn.html`

The private admin page uses the Nexora backend Supabase Auth project and only users listed in `admin_users` can access protected operational data.

Never place Supabase secret/service-role keys or OAuth client secrets in this repository. Browser code contains publishable keys only; elevated database access stays server-side.

## Public forms

Enrollment and contact requests are stored in Supabase tables with insert-only public permissions and Row Level Security. Public users cannot read/update/delete submissions. Authorized admins have protected management access.

## Content policy for this project

The design and user-flow may be inspired by public reference sites, but Nexora uses original branding, copy, assets and implementation. Do not copy third-party proprietary source code, logos, photographs, or long-form text without permission.
