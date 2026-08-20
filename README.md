# NexoraTikTok — Nexora Digital Creator Academy

Current version: **v2.2.0**

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
- `404.html` — Not found page

`certificate.html` is a private `noindex` Student Portal companion page and is not a public discovery page.

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

`public.nexora_certificates` stores completion certificates.

A certificate is automatically issued when a student:

1. has `full` course access, and
2. has completed every currently active lesson in the Nexora course database.

The certificate record includes a unique Nexora certificate code, student display name, number of lessons completed and issue date.

`certificate.html` validates the signed-in Student Portal session through `student-status` and displays only that student's active certificate. The page supports browser **Print / Save PDF** and links directly to public verification.

### Public certificate verification

`verify-certificate.html` lets anyone verify a certificate when they already have its high-entropy certificate code. It calls the `certificate-verify` Edge Function, which validates the code format and returns only minimal public fields for an active certificate:

- certificate code
- display name
- completed lesson count
- issue date
- active verification status

The public browser never gets direct read access to `nexora_certificates`.

### Certificate Manager

`admin-certificates.html` is the private certificate operations page. Authorized admins can search issued certificates, filter active/revoked status, copy a public verification link, revoke a certificate, or reactivate it.

Certificate identity fields such as learner name and certificate code are not browser-editable by the authenticated admin role; only certificate status/timestamp fields are granted for update.

## Live courses and lessons

Course content is stored in `public.nexora_courses` and `public.nexora_lessons`.

Public visitors can read active course metadata and lessons marked as previews. Signed-in students load account-specific protected lesson content through the `course-content` Edge Function.

Student accounts support:

- `starter` — preview lessons only
- `full` — all active lessons

Approved enrollment requests are automatically matched to a Student Portal account by normalized email and can grant Full access. If approval happens first, the later portal record is matched when the student account syncs.

## Enrollment operations

`admin-operations.html` is the private Enrollment Operations center. It provides:

- enrollment/student matching visibility
- approval workflow controls
- manual payment status/reference tracking
- payment provider, amount and currency fields
- Full-access automation
- custom Student Portal notifications
- protected operational activity history

### Payment-provider-ready structure

The backend includes fields for payment provider, amount, currency and verification timestamp plus the private `nexora_payment_events` table for a future server-side provider/webhook integration.

This structure does **not** charge, verify or refund money by itself. A real payment provider and secret server-side credentials are still required before automated payment processing can be enabled. No payment secret belongs in GitHub or client-side JavaScript.

## Student notifications

`public.nexora_student_notifications` stores account updates. Students read and mark them through the `student-notifications` Edge Function after their Student Portal session is validated.

The portal provides unread counts, mark-read, mark-all-read, enrollment/course/support updates and custom admin messages.

## Course Manager

`admin-courses.html` lets authorized admins create, edit, hide, reorder and delete courses and lessons, including preview state, duration, lesson text, student tasks and optional video URLs.

## Analytics and administration

- `admin.html` — students, prompts, enrollments and contacts
- `admin-courses.html` — courses and lessons
- `admin-analytics.html` — live operational analytics
- `admin-operations.html` — enrollment, payment tracking, matching, notifications and audit history
- `admin-certificates.html` — certificate verification links and active/revoked management

All admin pages are marked `noindex`. Supabase Row Level Security and admin authorization are the actual protection layer.

The main `admin.html` page intentionally loads only its admin runtime and no longer loads the public/student `app.js` runtime.

## Prompt Book

The Prompt Book uses `public.nexora_prompts`. Authorized admins can create, edit, hide, reorder and delete prompts while public users only load active content.

Prompt images can be added later without changing the database architecture; each prompt already supports an image path/URL.

## Main frontend assets

- `styles.css`, `extras.css`, `home-v2.css`
- `portal-v2.css`, `portal-cloud.css`, `course-library.css`
- `student-notifications.css`, `student-dashboard.css`
- `certificate.css`, `certificate-verify.css`
- `prompt-library.css`
- `admin.css`, `admin-v2.css`, `admin-courses.css`, `admin-analytics.css`, `admin-operations.css`, `admin-certificates.css`
- `app.js`, `portal-extra.js`, `portal-cloud.js`, `portal-courses.js`
- `student-notifications.js`, `student-dashboard.js`, `certificate.js`, `certificate-verify.js`
- `course-library.js`, `prompt-library.js`
- `admin.js`, `admin-courses.js`, `admin-analytics.js`, `admin-operations.js`, `admin-certificates.js`
- `forms.js`

## Deployment

GitHub Pages deploys from `.github/workflows/pages.yml`, which checks required files, JavaScript syntax and local HTML links before deployment.

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
