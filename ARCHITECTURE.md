# UDEA Architecture Overview

## Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UDEA Platform                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │             Next.js 14 Frontend (React)                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │  Landing   │  │  Academy   │  │ Dashboard  │         │   │
│  │  │   Page     │  │   Page     │  │   Page     │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │Referral QR │  │ Basecamp   │  │Certificate │         │   │
│  │  │  Code      │  │ Registration  │   BKSU    │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  │                                                            │   │
│  │  Styling: Tailwind CSS + Custom Components              │   │
│  │  State: React Hooks + Sonner Toasts                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Next.js 14 Backend (API Routes)                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │  /auth/    │  │ /payments/ │  │/basecamp/  │         │   │
│  │  │  signup    │  │  process   │  │  register  │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  │  ┌────────────┐                                          │   │
│  │  │/notifications/                                        │   │
│  │  │  telegram                                             │   │
│  │  └────────────┘                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Supabase Backend (PostgreSQL)                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │  users   │ │members   │ │basecamp  │ │sponsors  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │
│  │  │commission│ │ payments │ │referrals │             │   │
│  │  └──────────┘ └──────────┘ └──────────┘             │   │
│  │                                                        │   │
│  │  Auth: Supabase Auth (Email/Password)               │   │
│  │  RLS: Row Level Security Policies                   │   │
│  │  Storage: File Storage for Certificates            │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        External Services Integration                     │   │
│  │  ┌────────────┐        ┌────────────┐                   │   │
│  │  │  Telegram  │        │  Xendit    │                   │   │
│  │  │    Bot     │        │  (Future)  │                   │   │
│  │  └────────────┘        └────────────┘                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Registration Flow
```
User fills signup form
        ↓
Select membership tier
        ↓
Submit form → /api/auth/signup
        ↓
Supabase creates auth user
        ↓
API creates user profile + membership
        ↓
If referral code: Create commission record
        ↓
Send Telegram notification to admin
        ↓
User receives confirmation
        ↓
Redirect to login
```

### Referral Commission Flow
```
User A has referral code → User B signs up with code
        ↓
API detects referral_code in signup request
        ↓
Look up User A from referral_code
        ↓
Calculate commission (5% of membership price)
        ↓
Create commission record (status: pending)
        ↓
Commission appears in User A's dashboard
        ↓
Admin approves → Status changes to "paid"
        ↓
User A can withdraw funds
```

### Payment Flow (Simulated)
```
User on dashboard clicks "Upgrade"
        ↓
Selects new membership tier
        ↓
Payment page shows amount
        ↓
Click "Pay with Xendit (Simulated)"
        ↓
POST /api/payments/process
        ↓
Generate transaction ID
        ↓
Create payment record (status: completed)
        ↓
Send Telegram notification
        ↓
Update membership active status
        ↓
Show success message
```

## Component Hierarchy

```
RootLayout
├── providers (Toast)
├── (auth) Layout (public)
│   ├── login/page
│   └── signup/page
│       └── SignupForm (2-step)
├── (protected) Layout (auth required)
│   ├── dashboard/page
│   │   ├── WelcomeCard
│   │   ├── StatsGrid
│   │   └── QuickLinks
│   ├── academy/page
│   │   └── CourseCard[]
│   ├── referral/page
│   │   ├── QRCodeSection
│   │   └── ReferralCodeSection
│   ├── basecamp/page
│   │   └── BasecampForm
│   └── certificate/page
│       └── CertificateDisplay
├── page (landing)
│   ├── Navigation
│   ├── HeroSection
│   ├── FeaturesGrid
│   ├── PricingGrid
│   ├── CTASection
│   └── Footer
└── api/
    ├── auth/signup
    ├── payments/process
    ├── basecamp/register
    └── notifications/telegram
```

## Technology Stack

### Frontend
```
Next.js 14
├── React 18.3
├── TypeScript 5.2
├── Tailwind CSS 3.3
├── React Hooks
└── Sonner (Toasts)

Components
├── qrcode.react (QR generation)
├── axios (HTTP client)
└── Custom UI Components
```

### Backend
```
Node.js 18+
├── Next.js API Routes
├── Supabase Client (@supabase/supabase-js)
└── Environment Variables
```

### Database
```
PostgreSQL (via Supabase)
├── 7 Tables
├── Row Level Security
├── Authentication (JWT)
└── Real-time Subscriptions (optional)
```

### External Services
```
Telegram Bot API
├── Notifications
├── Webhook Handlers
└── Message Formatting

Future Integrations
├── Xendit (Payments)
├── Google Maps (Basecamp)
├── Email Service (Resend/SendGrid)
└── PDF Generator (@react-pdf/renderer)
```

## File Organization

```
UDEA/
├── src/
│   ├── app/
│   │   ├── api/                    (Backend routes)
│   │   ├── (auth)/                 (Public routes)
│   │   ├── (protected)/            (Auth required)
│   │   ├── layout.tsx              (Root layout)
│   │   ├── page.tsx                (Landing)
│   │   └── providers.tsx           (Client providers)
│   │
│   ├── components/
│   │   └── ui/                     (Reusable components)
│   │       └── button.tsx
│   │
│   ├── lib/
│   │   ├── supabase/              (Supabase clients)
│   │   │   ├── client.ts          (Browser)
│   │   │   └── server.ts          (Server-side)
│   │   ├── types.ts               (TypeScript interfaces)
│   │   ├── constants.ts           (App config)
│   │   ├── utils.ts               (Helper functions)
│   │   └── telegram.ts            (Bot integration)
│   │
│   └── styles/
│       └── globals.css            (Global styles)
│
├── public/                         (Static assets)
├── package.json                    (Dependencies)
├── tsconfig.json                   (TypeScript)
├── tailwind.config.ts             (Tailwind)
├── next.config.js                 (Next.js)
├── .env.local.example             (Env template)
├── .gitignore
│
├── README.md                       (Main docs)
├── SETUP.md                        (Setup guide)
├── QUICKREF.md                     (Quick ref)
├── COMPLETION.md                   (Checklist)
└── Architecture.md                 (This file)
```

## Database Schema Diagram

```
users
├── id (PK, UUID)
├── email (UNIQUE)
├── full_name
├── role (member|agent|spv|manager|sponsor)
├── phone
├── avatar_url
├── referral_code (UNIQUE)
└── created_at

    ↓ 1:many
    
memberships
├── id (PK)
├── user_id (FK)
├── tier (basic|exclusive|vip)
├── price
├── duration_months
├── started_at
├── expires_at
├── is_active
└── created_at

basecamps
├── id (PK)
├── user_id (FK)
├── name
├── location
├── latitude
├── longitude
├── capacity
└── created_at

sponsors
├── id (PK)
├── user_id (FK)
├── sponsor_type (spu|sgu)
├── organization_name
└── created_at

commissions
├── id (PK)
├── user_id (FK)
├── referred_user_id (FK)
├── amount
├── status (pending|paid|cancelled)
└── created_at

payments
├── id (PK)
├── user_id (FK)
├── membership_id (FK)
├── amount
├── status (pending|completed|failed)
├── payment_method
├── transaction_id (UNIQUE)
└── created_at

referrals
├── id (PK)
├── user_id (FK)
├── referred_user_id (FK)
├── status (active|inactive)
└── created_at
```

## Security Layers

```
1. Transport Layer
   └── HTTPS/TLS (production)

2. Authentication
   └── Supabase Auth (JWT tokens)

3. Authorization
   ├── Role-based access (roles table)
   └── Row Level Security (Supabase RLS)

4. API Layer
   ├── Input validation (Zod ready)
   ├── Rate limiting (ready)
   └── CORS configuration

5. Database
   ├── Encrypted passwords (Supabase)
   ├── Parameterized queries (Supabase client)
   └── RLS policies on all tables

6. Environment
   └── Secrets in .env.local (never committed)
```

## Performance Optimization

```
Frontend
├── Code splitting (automatic with App Router)
├── Image optimization (next/image ready)
├── CSS minification (Tailwind)
└── Client component lazy loading

Backend
├── Database indexing ready
├── Query optimization patterns
├── Connection pooling (Supabase)
└── API response caching (ready)

Deployment
├── CDN for static assets (Vercel)
├── Edge functions ready
├── Database replication ready
└── Monitoring setup ready
```

---

**Architecture Version**: 1.0
**Last Updated**: November 2024
**Status**: Production-Ready
