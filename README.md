# NexoraTikTok — Nexora Digital Creator Academy

Current version: **v2.4.0**

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
- `verify-certificate.html` — Public certificate verification by certificate code
- `learn.html` — Student login and live learning portal
- `enroll.html` — Enrollment form
- `contact.html` — Contact form
- `legal.html` — Policies
- `offline.html` — Offline fallback
- `404.html` — Not found page

`certificate.html` is a private `noindex` Student Portal companion page.

## v2.4 PWA and offline foundation

Nexora now includes an installable Progressive Web App foundation.

- `site.webmanifest` contains the Nexora app identity, standalone display mode and shortcuts to Student Portal, Prompt Book and Free Lessons.
- `sw.js` caches safe public pages and static same-origin assets using versioned caches.
- public navigations use network-first behavior so fresh content is preferred whenever the connection is available.
- static assets use cache-first/stale-while-revalidate behavior for faster repeat visits.
- `offline.html` provides a branded recovery screen when a requested network page cannot be reached.
- the shared `app.js` runtime registers the service worker and surfaces online/offline connection feedback.

Private/account-specific routes are deliberately excluded from service-worker caching: Admin pages, `learn.html`, `certificate.html` and `enroll.html`. Protected account data and Supabase API responses are not part of the public offline cache.

The GitHub Pages workflow includes PWA cache-safety checks so deployment fails if private routes are accidentally removed from the service-worker exclusion list or added to the precache.

## v2.3 production polish

v2.3 focuses on privacy, Prompt Book scale, mobile usability and deployment safeguards.

### Admin privacy isolation

The main Admin student list now requests an explicit safe field set from `nexora_portal_state` instead of `select('*')`. The Student Portal private notebook field is not selected, searched, displayed or exported by the Admin dashboard.

Private admin notes remain available to authorized admins and are separate from student-authored notebook content.

The GitHub Pages workflow now fails before deployment if:

- `Student note preview` is reintroduced into `admin.js`
- a wildcard Student Portal state read returns to `admin.js`
- public/student `app.js` is loaded by `admin.html`
- obvious service-role or client-secret references appear in browser `.js` / `.html` assets

### Prompt Book image-ready workflow

Prompt Book remains Supabase-backed through `public.nexora_prompts`, but the frontend is now prepared for images to be added later:

- prompts without images show clean numbered image slots
- image previews lazy-load when an image URL/path exists
- broken images automatically fall back to the numbered placeholder
- modal previews use the same fallback behavior
- search includes a one-click Clear action
- category filters expose accessible pressed-state information
- large libraries use an 8-at-a-time **Show more** flow
- failed library requests expose a visible Retry action

The database structure is unchanged: each prompt already has `image_url`, so later image uploads only require updating that field/path.

### Mobile and accessibility polish

Shared UI now includes stronger `focus-visible` treatment, reduced-motion support, improved touch interaction, mobile toast sizing and a defensive `.no-floating-support` rule for private/admin pages.

## Student Portal

The Student Portal Overview combines the signed-in student's main account state:

- Starter / Full course access
- server-verified active lesson count and completed lesson count
- latest linked enrollment status
- submitted and approved dates
- non-secret payment-status summary
- unread notification count
- next-step guidance
- one-click account/status refresh
- automatic certificate progress and Certificate Ready state

`student-dashboard.js` and `student-dashboard.css` power the Overview experience. The portal also loads `student-notifications.js` automatically.

### Student status endpoint

The `student-status` Edge Function validates the existing Student Portal Supabase Auth session against the student-auth project. It returns only the signed-in student's access, lesson totals, completion count, enrollment summary, unread notification count and active certificate summary from the backend project.

Students do not receive direct browser read access to private operations or certificate tables.

## Course completion certificates

`public.nexora_certificates` stores completion certificates. A certificate is automatically issued when a student has `full` course access and has completed every currently active lesson.

`certificate.html` validates the signed-in Student Portal session through `student-status`, displays only that student's active certificate, supports browser Print / Save PDF, and links to public verification.

### Public certificate verification

`verify-certificate.html` calls the `certificate-verify` Edge Function. Given a well-formed certificate code, it returns only the minimal public verification fields required to confirm a certificate.

### Certificate Manager

`admin-certificates.html` lets authorized admins search certificates, filter active/revoked status, copy a public verification link, revoke a certificate, or reactivate it. Certificate identity fields are not browser-editable by the authenticated admin role.

## Live courses and lessons

Course content is stored in `public.nexora_courses` and `public.nexora_lessons`. Public visitors can read active course metadata and preview lessons. Signed-in students load account-specific protected lesson content through the `course-content` Edge Function.

Student accounts support:

- `starter` — preview lessons only
- `full` — all active lessons

Approved enrollment requests are automatically matched to a Student Portal account by normalized email and can grant Full access.

## Enrollment operations

`admin-operations.html` provides enrollment/student matching visibility, approval workflow controls, manual payment tracking, payment provider/amount/currency fields, Full-access automation, custom Student Portal notifications and operational activity history.

The payment structure is provider-ready but does **not** process money. A real provider integration and secret server-side credentials are still required before automated charging or verification can be enabled.

## Student notifications

`public.nexora_student_notifications` stores account updates. Students read and mark them through the `student-notifications` Edge Function after their Student Portal session is validated.

## Administration

- `admin.html` — students, prompts, enrollments and contacts
- `admin-courses.html` — courses and lessons
- `admin-analytics.html` — live operational analytics
- `admin-operations.html` — enrollment/payment/matching/notifications/audit history
- `admin-certificates.html` — certificate status and verification-link management

All admin pages are marked `noindex`. Supabase Row Level Security and admin authorization are the real protection layer.

## Deployment

GitHub Pages deploys from `.github/workflows/pages.yml`, which validates required files, JavaScript syntax, local HTML links, privacy regressions, PWA cache safety and obvious browser-secret mistakes before deployment.

Expected production URL:

`https://lensbykai-bit.github.io/NexoraTikTok/`

GitHub Pages must use **GitHub Actions** as its deployment source.

## Authentication

The Student Portal uses the existing student Supabase Auth project. Its redirect allow-list must include:

`https://lensbykai-bit.github.io/NexoraTikTok/learn.html`

Private admin pages use the backend Supabase Auth project and require membership in `admin_users`.

## Secrets and security

Never commit OAuth client secrets, Supabase service-role keys or payment-provider secrets. Browser files contain publishable keys only. Elevated database access and protected content delivery stay server-side.

## Content policy for this project

Nexora uses original branding, copy, assets and implementation. Public reference sites may inspire layout and user-flow ideas, but third-party proprietary source code, logos, photographs and long-form text should not be copied without permission.
