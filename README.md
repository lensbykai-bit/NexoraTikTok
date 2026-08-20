# NexoraTikTok — Nexora Digital Creator Academy

Production-oriented static website for Nexora Digital, deployed with GitHub Pages and connected to Supabase services.

## Public pages

- `index.html` — Home
- `courses.html` — Course tracks
- `support-program.html` — Flagship support program
- `curriculum.html` — Learning modules
- `services.html` — Creator services
- `prompt-book.html` — Prompt library
- `results.html` — Verified-results placeholder/case-study layout
- `faq.html` — FAQ
- `learn.html` — Student login and portal
- `enroll.html` — Enrollment form
- `contact.html` — Contact form
- `legal.html` — Privacy, terms and service policies
- `404.html` — Not found page

## Shared assets

- `styles.css` — Base design system
- `extras.css` — Forms, portal and production polish
- `app.js` — Shared navigation, prompt library, auth and portal behavior
- `forms.js` — Supabase-backed enrollment/contact submissions
- `portal-extra.js` — Password recovery and portal enhancements
- `assets/logo.svg` — Nexora Digital logo
- `site.webmanifest` — Web app metadata
- `robots.txt` / `sitemap.xml` — Search-engine discovery

## Deployment

`.github/workflows/pages.yml` validates required files and local HTML links before deploying the repository to GitHub Pages.

Expected production URL:

`https://lensbykai-bit.github.io/NexoraTikTok/`

GitHub repository Pages settings must use **GitHub Actions** as the build/deployment source.

## Authentication

The student portal uses Supabase Auth. The authorized redirect allow-list for the auth project must include:

`https://lensbykai-bit.github.io/NexoraTikTok/learn.html`

Never place Supabase secret/service-role keys or OAuth client secrets in this repository. Browser code should only contain publishable keys and must rely on Row Level Security.

## Public forms

Enrollment and contact requests are stored in Supabase tables with insert-only browser permissions and Row Level Security. Public users do not have read/update/delete access to these tables.

## Content policy for this project

The design and user-flow may be inspired by public reference sites, but Nexora uses original branding, copy, assets and implementation. Do not copy third-party proprietary source code, logos, photographs, or long-form text without permission.
