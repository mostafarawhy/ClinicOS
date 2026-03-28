# DentaFlow

**A full-stack clinic management system built for a real dental practice.**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma_5-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

**[→ Live Demo](https://clinic-os-alpha.vercel.app/)**

---

## Overview

DentaFlow is an internal staff portal built to replace a dental clinic's Excel-based scheduling workflow. It gives dentists, receptionists, and admins a single place to manage appointments, track patients, and monitor clinic performance — all in real time.

Three roles with different access levels. One codebase. No Excel.

---

## Features

### 🔐 Authentication & Access Control
- Credentials-based sign-in with JWT sessions via NextAuth.js v5
- Role-based access: `ADMIN`, `DENTIST`, `RECEPTIONIST`
- Edge middleware blocks receptionists from analytics, calendar, and admin pages
- Deactivate/reactivate staff accounts without deleting historical data (admin only, requires password confirmation)

### 📅 Schedule
- Day-by-day view of all appointments grouped by dentist column
- Inline status updates (UPCOMING → COMPLETED / NO_SHOW / CANCELLED) with server-side validation
- Live availability badge per dentist (Available, Busy, Sick Leave, Vacation, Remote, Day Off)
- Date navigation with URL-based state (`?date=YYYY-MM-DD`)

### 🗓️ Appointment Booking
- Find-or-create patient logic: looks up by phone number, creates a new record if it's a first visit
- 11 treatment types: Checkup, Cleaning, Filling, Extraction, Root Canal, Crown, Whitening, Orthodontics, Implant, Consultation, Other
- Server Action form with inline error surfacing via `useActionState`

### 👥 Patients
- Searchable patient list with last-visit filter and date picker
- Patient profile page (`/patients/[id]`) with full visit history, contact info, and clinical notes
- All appointment history ordered by date descending

### 📆 Calendar
- Weekly time-grid view from 10:00 to 20:00, split into 30-minute slots
- Color-coded appointments by dentist using a static color map (Tailwind purge-safe)
- Week navigation with `?date=` param; work week anchored to Saturday
- Single DB query per week, filtered client-side by day with `isSameDay`

### 📊 Analytics
- Stat cards: total patients, appointments this month, completion rate %, no-show rate %
- Bar chart: appointment volume by day of the current work week
- Donut chart: treatment type distribution across all time
- Line chart: monthly appointment volume over the last 8 months
- All chart data from 5 parallel DB queries via `Promise.all`

### ⚙️ Settings
- Change password with bcrypt verification of the current password before hashing the new one
- Update availability status (persisted to DB, reflected on schedule instantly via `revalidatePath`)
- Admin: add new staff accounts — atomically creates User + Dentist profile in a single transaction
- Admin: deactivate/reactivate accounts with password confirmation

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components, Server Actions, file-based routing |
| Language | TypeScript | End-to-end type safety |
| Styling | Tailwind CSS v3 | Utility-first dark theme with HSL CSS variable tokens |
| UI Utilities | clsx, tailwind-merge, CVA | Conditional and conflict-free class merging |
| Icons | Lucide React | Consistent icon set throughout |
| Database | PostgreSQL (Neon) | Serverless Postgres |
| ORM | Prisma 5 | Type-safe DB client, migrations, seeding |
| Auth | NextAuth.js v5 | JWT sessions, credentials provider, edge middleware |
| Charts | Recharts 3 | Bar, donut, and line charts |
| Date Handling | date-fns v4 | Date arithmetic and week boundary calculations |
| Validation | Zod v4 | Schema validation on form inputs |
| Password Hashing | bcryptjs | Secure credential storage (12 rounds) |
| Analytics | Vercel Analytics | Page view tracking for portfolio visitors |
| Deployment | Vercel | Edge middleware, automatic CI/CD from GitHub |

---

## Architecture

### Server vs. Client Components

Every `page.tsx` is an `async` Server Component. Data is fetched directly in the component — no `useEffect`, no loading spinners for initial data, no client-side API calls. Client components (`"use client"`) appear only where interactivity is required: the login form, the calendar time-grid, the patients search UI, and inline status toggle buttons.

The result: the database query runs on the server, HTML is streamed to the client with data already embedded, and the browser receives a fully-rendered page on first load.

### Queries and Actions Pattern

```
src/lib/
├── queries/            # All read operations — called from Server Components
│   ├── schedule.ts     # getScheduleForDate (dentists + appointments for a day)
│   ├── calendar.ts     # getWeekAppointments (appointments for a date range)
│   ├── patients.ts     # getAllPatients, getPatientById
│   ├── appointments.ts # getDentistsForForm
│   └── analytics.ts    # getAnalyticsData (5 parallel queries via Promise.all)
│
└── actions/            # All write operations — "use server", wired to forms
    ├── appointments.ts  # createAppointment (find-or-create patient, UTC-safe date)
    ├── schedule.ts      # updateAppointmentStatus (inline status change)
    └── settings.ts      # changePassword, createUser, updateAvailabilityStatus,
                         # deactivateUser, reactivateUser
```

Reads live in `queries/`, writes live in `actions/`. No API routes are used for data mutations.

### RBAC Middleware

Route protection runs at the edge before any page renders:

```ts
// src/middleware.ts
const PUBLIC_ROUTES = ["/login"];
const ADMIN_ROUTES  = ["/dashboard", "/calendar", "/analytics"];

// No session       → redirect to /login
// Session + public → redirect to /schedule (already signed in)
// RECEPTIONIST hitting ADMIN_ROUTES → redirect to /schedule
```

The middleware wraps NextAuth's `auth()` handler, reads `session.user.role` from the JWT, and short-circuits before the Server Component tree ever runs. Route guards happen in one place — not scattered across page files.

### Folder Structure

```
clinic-os/
├── prisma/
│   ├── schema.prisma            # 4 models, 4 enums
│   └── seed.ts                  # 5 users, 15 patients, 61 appointments
│
├── src/
│   ├── middleware.ts             # Edge RBAC
│   ├── types/index.ts            # Shared TypeScript types and Prisma extensions
│   │
│   ├── lib/
│   │   ├── auth.ts               # NextAuth config
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── utils.ts              # cn() helper (clsx + tailwind-merge)
│   │   ├── queries/              # DB reads (one file per domain)
│   │   └── actions/              # Server Actions (one file per domain)
│   │
│   ├── app/
│   │   ├── (auth)/login/         # Login page with demo credentials banner
│   │   ├── (dashboard)/
│   │   │   ├── schedule/         # Daily schedule + date navigation
│   │   │   ├── appointments/     # Booking form + [id] detail page
│   │   │   ├── patients/         # Patient list + [id] profile page
│   │   │   ├── calendar/         # Weekly time-grid calendar
│   │   │   ├── analytics/        # Charts and stat cards
│   │   │   └── settings/         # Password, availability, user management
│   │   └── layout.tsx            # Root layout + Vercel Analytics
│   │
│   └── components/
│       ├── layout/               # Sidebar, topbar
│       ├── schedule/             # ScheduleColumn, StatusBadge
│       ├── calendar/             # CalendarClient, CalendarControls
│       ├── appointments/         # AppointmentForm
│       ├── patients/             # PatientsClient
│       ├── analytics/            # Chart wrapper components
│       └── settings/             # PasswordForm, StatusForm, AddUserForm, ManageUsers
```

---

## Database Schema

### Models

**User**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | |
| email | String | Unique |
| passwordHash | String | bcrypt, 12 rounds |
| role | UserRole | ADMIN \| RECEPTIONIST \| DENTIST |
| availabilityStatus | AvailabilityStatus | Default: AVAILABLE |
| isActive | Boolean | Soft-disable pattern — blocks login without deleting records |
| createdAt | DateTime | |

**Dentist**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | |
| color | String | Hex color for calendar display (`#2DD4BF`, `#818CF8`, `#FB923C`) |
| userId | String | FK → User (cascade delete) |

**Patient**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| fullName | String | |
| phone | String | Used as the patient identifier at booking time |
| email | String? | Optional |
| notes | String? | Clinical notes: allergies, preferences, medical flags |
| createdAt | DateTime | |

**Appointment**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| date | DateTime (`@db.Date`) | PostgreSQL `DATE` — no time component stored |
| time | String | `"HH:MM"` format, e.g. `"10:30"` |
| status | AppointmentStatus | Default: UPCOMING |
| treatmentType | TreatmentType | |
| notes | String? | Optional per-visit notes |
| patientId | String | FK → Patient |
| dentistId | String | FK → Dentist |
| createdById | String | FK → User (the staff member who booked) |

Indexes: `@@index([date])`, `@@index([dentistId, date])`

### Enums

```prisma
enum UserRole {
  ADMIN | RECEPTIONIST | DENTIST
}

enum AvailabilityStatus {
  AVAILABLE | BUSY | SICK_LEAVE | VACATION | REMOTE | DAY_OFF
}

enum AppointmentStatus {
  UPCOMING | COMPLETED | NO_SHOW | CANCELLED
}

enum TreatmentType {
  CHECKUP | CLEANING | FILLING | EXTRACTION | ROOT_CANAL |
  CROWN | WHITENING | ORTHODONTICS | IMPLANT | CONSULTATION | OTHER
}
```

---

## Key Engineering Decisions

### Server Actions over API Routes

All mutations use Next.js Server Actions — `"use server"` functions called directly from forms via React 19's `useActionState`. This eliminates a separate API layer, keeps mutation logic co-located with the schema it touches, and makes progressive form enhancement straightforward. Every action returns a typed `{ success?: boolean; error?: string }` state that the client renders inline — no custom fetch wrappers needed.

### Find-or-Create Patient at Booking

The booking form takes a phone number as the patient identifier. In `createAppointment`:

```ts
let patient = await db.patient.findFirst({ where: { phone } });
if (!patient) {
  patient = await db.patient.create({ data: { fullName, phone, email } });
}
```

This mirrors how a receptionist actually works: look up a returning patient by phone, create a new record only if it's truly a first visit. No duplicate patient records, no separate "search patient" step before booking.

### UTC-Safe Date Storage

`Appointment.date` uses `@db.Date` — PostgreSQL's `DATE` type with no time component. JavaScript's `new Date(year, month, day)` creates a local-timezone midnight, which Prisma serializes to UTC. In UTC+ timezones this shifts the stored date backwards by one day.

```ts
// Broken in UTC+3 (stores the previous calendar day):
const appointmentDate = new Date(year, month - 1, day);

// Fixed (stores exactly the date the receptionist selected):
const appointmentDate = new Date(Date.UTC(year, month - 1, day));
```

The same UTC discipline (`setUTCHours`, `setUTCDate`) is applied in `getScheduleForDate` and the calendar page query boundaries so reads and writes stay aligned.

### Parallel DB Queries in Analytics

The analytics page needs 5 independent data points. Running them in series wastes round-trip time to Neon. Instead, `getAnalyticsData` fires all 5 simultaneously:

```ts
const [totalPatients, monthlyAppointments, weeklyAppointments,
       treatmentCounts, last8MonthsRaw] = await Promise.all([...]);
```

Total latency = the slowest single query, not the sum of all five.

### Tailwind Dynamic Class Safety

Calendar appointment cards are color-coded per dentist. Interpolating class names at runtime (`bg-${color}-500`) causes those classes to be purged from the production bundle since Tailwind scans source files statically.

The fix: a static lookup object keyed by the hex value stored in the database:

```ts
const DENTIST_STYLES: Record<string, string> = {
  "#2DD4BF": "bg-teal-500/20 border-teal-500/40 text-teal-300",
  "#818CF8": "bg-indigo-500/20 border-indigo-500/40 text-indigo-300",
  "#FB923C": "bg-orange-500/20 border-orange-500/40 text-orange-300",
};
```

All class strings are statically present in source. Nothing gets purged.

### Atomic User + Dentist Profile Creation

When an admin creates a DENTIST or ADMIN account, a `Dentist` profile record must also exist (the schedule and calendar query the `Dentist` table). Both writes are wrapped in a Prisma transaction:

```ts
await db.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  if (roleValue === "ADMIN" || roleValue === "DENTIST") {
    await tx.dentist.create({ data: { name, color: "#6366F1", userId: user.id } });
  }
});
```

If either write fails, both roll back. No orphaned user records without a linked dentist profile.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a [Neon](https://neon.tech/) serverless connection string)
- npm

### Installation

```bash
git clone https://github.com/mostafarawhy/ClinicOS.git
cd ClinicOS
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# NextAuth v5 secret — generate with: openssl rand -base64 32
AUTH_SECRET="your-secret-here"

# Base URL of your app (required by NextAuth v5)
AUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed with demo data (5 users, 15 patients, 61 appointments spread across 2 months)
npx prisma db seed
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Credentials

All three credentials are also shown on the login page for instant one-click access — no copy-pasting required.

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | admin@clinic.com | admin123 | All pages + user management |
| Dentist | dentist1@clinic.com | dentist123 | All pages except user management |
| Receptionist | reception1@clinic.com | reception123 | Schedule, appointments, patients, settings |

---

## Screenshots

![Login page](./screenshots/Login%20Page.png)
![Daily schedule view with per-dentist columns](./screenshots/Schedule%20Page.png)
![Appointment booking form](./screenshots/Appointments%20Page.png)
![Patient list with search and last-visit filter](./screenshots/Patients%20Page.png)
![Patient profile with full visit history](./screenshots/Patient%20History.png)
![Weekly calendar time-grid color-coded by dentist](./screenshots/Calendar%20Page.png)
![Analytics dashboard with bar, donut, and line charts](./screenshots/Analytics%20Page.png)
![Settings page with password, availability, and user management](./screenshots/Settings.png)
![Settings page user management](./screenshots/Settings(Admin).png)

## MObile

![Daily schedule view with per-dentist columns](./screenshots/Schedule%20Page(mobile).png)
![Appointment booking form](./screenshots/Appointments%20Page%20(mobile).png)
![Patient list with search and last-visit filter](./screenshots/Patients%20Page%20(mobile).png)
![Weekly calendar time-grid color-coded by dentist](./screenshots/Calendar%20Page%20(mobile).png)
![Analytics dashboard with bar, donut, and line charts](./screenshots/Analytics%20Page%20(mobile).png)
![Settings page with password, availability, and user management](./screenshots/Settings%20Page%20(mobile).png)


 [live demo](https://clinic-os-alpha.vercel.app/) 

---

## Roadmap

- [ ] Patient-facing appointment booking portal
- [ ] Per-dentist performance reports

---

## Author

**Mostafa Rawhy** — self-taught frontend engineer
[GitHub](https://github.com/mostafarawhy)

---

## License

[MIT](./LICENSE)
