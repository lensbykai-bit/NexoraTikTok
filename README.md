# NexoraTikTok — Nexora Digital Creator Academy

Current version: **v2.6.11**

NexoraTikTok is a production-oriented creator-learning website deployed with GitHub Pages and connected to Supabase for authentication, content, student state, administration and protected server functions.

## Current architecture

### Student authentication

Student accounts use the **Nexora DIGI** Supabase Auth project (`lzzujiyiltwfrvcwnrlh`).

The current student flow is intentionally **email + password only**:

1. New student enters name, email and password.
2. Nexora sends an **8-digit email verification code**.
3. The student verifies the code and the selected password is saved.
4. Returning students sign in with email + password.
5. Password recovery also uses an 8-digit email code before a new password is set.

Google login was intentionally removed from the current Student Portal flow.

The production root currently enters through the student login screen. `index.html` redirects to `learn.html?login=1`, and the installed PWA uses the same login-first start URL.

### Backend data

Operational Nexora data is stored in the **Nexora SMM** Supabase project (`bcvtkdehflmqiyvloyiy`). It contains the Nexora tables for prompts, courses, lessons, student portal state, enrollments, contacts, notifications, payment-event readiness, certificates and admin activity.

Student-facing Edge Functions validate the Nexora DIGI Auth session themselves before reading or writing protected backend data. This cross-project validation is why these functions use custom authorization rather than relying on the backend project's default JWT validation.

## Main public pages

- `index.html` — premium creator-academy Home page (currently behind login-first entry)
- `free-lessons.html` — free starter lessons
- `courses.html` — database-backed course catalog
- `curriculum.html` — public curriculum previews
- `support-program.html` — support program
- `services.html` — creator services
- `prompt-book.html` — searchable Supabase-backed Prompt Book
- `results.html` — results/case-study layout
- `faq.html` — FAQ
- `verify-certificate.html` — public certificate verification
- `contact.html` — contact form
- `legal.html` — policies
- `offline.html` — PWA offline fallback
- `404.html` — not-found page

## Student Portal

`learn.html` provides:

- email/password sign-in and account creation
- 8-digit email verification for signup
- 8-digit email verification for password recovery
- live database-managed lessons
- Starter / Full access levels
- lesson progress and practical tasks
- private notebook with local fallback and cloud sync
- creator profile
- learning-time and streak tracking
- notifications
- enrollment/account status
- completion certificate access

Protected lesson content, student status, notifications and cloud state are delivered through backend Edge Functions after the student session is validated.

## Prompt Book

Prompt data is stored in `public.nexora_prompts`.

The frontend supports:

- search
- numbered placeholders when no image exists
- lazy-loaded images
- image-error fallback
- modal preview
- Copy Prompt
- Show more pagination
- retry after a failed request

Private admin prompt tools support batch intake and direct image upload to Supabase Storage. Real prompt images can therefore be added later without changing the public layout.

## Courses and certificates

Course metadata and lessons are stored in `public.nexora_courses` and `public.nexora_lessons`.

- `starter` students receive preview access.
- `full` students receive all active lessons.
- Approved enrollment records can be matched to student accounts and grant Full access.
- A completion certificate can be issued after a Full-access student completes every active lesson.
- Public certificate verification is available by certificate code.

## Administration

Private noindex administration pages include:

- `admin.html` — students, prompts, enrollments and contacts
- `admin-courses.html` — courses and lessons
- `admin-analytics.html` — operational analytics
- `admin-operations.html` — enrollment, access, payment-status readiness, notifications and audit history
- `admin-certificates.html` — certificate management
- `admin-prompt-intake.html` — batch prompt intake and image upload

Supabase RLS and admin authorization are the protection layer. Browser code must never contain service-role keys, OAuth client secrets or payment-provider secrets.

## PWA and caching

`site.webmanifest` and `sw.js` provide an installable PWA foundation.

Public pages and safe static assets can be cached. Private/account-specific routes such as Admin, Student Portal, enrollment and private certificate pages are excluded from service-worker page caching.

## Deployment

GitHub Pages deploys through `.github/workflows/pages.yml`.

The workflow checks:

- required files
- JavaScript syntax
- local HTML links
- privacy regressions
- browser-secret mistakes
- Prompt Intake safety
- PWA private-route cache safety

Expected production URL:

`https://lensbykai-bit.github.io/NexoraTikTok/`

GitHub Pages must use **GitHub Actions** as the deployment source.

## Security settings still outside repository code

Supabase currently reports **Leaked Password Protection Disabled** on the connected Auth projects. This must be enabled from Supabase Auth settings; it cannot be fixed only by changing the static repository files.

## Payment status

The backend contains payment-provider-ready fields and private payment-event storage, but **real payment processing is not active**. A real provider integration plus secret server-side merchant credentials is required before automated charging or verification can be enabled.

## Content and reference policy

Nexora uses original branding, copy, assets and implementation. Public reference sites may inspire layout and user-flow ideas, but third-party proprietary source code, logos, photographs and long-form text should not be copied without permission.
