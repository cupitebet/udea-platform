# UDEA - Edutech Platform

Production-ready Next.js edutech platform with membership system, courses, referrals, and payment simulation.

## Features

✅ **Membership Tiers**: Basic (350k/year), Exclusive (500k/2years), VIP (1M/lifetime)
✅ **User Roles**: Member, Agent, SPV, Manager, Sponsor (SPU/SGU)
✅ **Academy**: Protected course pages for members
✅ **Referral Program**: Unique QR codes with 5% commission
✅ **Basecamp Registration**: Google Maps integration for 3x3m locations
✅ **BKSU Certificates**: Digital certificates for sponsors
✅ **Dashboard**: Referral count, commission balance, program status
✅ **Telegram Integration**: Admin notifications via webhook
✅ **Payment Simulation**: "Pay with Xendit" button (simulated)
✅ **Role-Based Auth**: Supabase authentication with role-based redirects

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Components**: Custom UI + ShadCN-inspired patterns
- **QR Code**: qrcode.react
- **Notifications**: sonner toast + Telegram API

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── providers.tsx           # Client providers
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx          # Auth middleware
│   │   ├── dashboard/page.tsx
│   │   ├── academy/page.tsx
│   │   ├── referral/page.tsx
│   │   ├── basecamp/page.tsx
│   │   └── certificate/page.tsx
│   └── api/
│       ├── auth/signup.ts
│       ├── payments/process.ts
│       ├── basecamp/register.ts
│       └── notifications/telegram.ts
├── components/
│   └── ui/
│       └── button.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── types.ts
│   ├── constants.ts
│   ├── telegram.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account (https://supabase.com)
- Telegram Bot (optional, for admin notifications)

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

#### Create a new Supabase project:
1. Go to https://supabase.com/dashboard
2. Create a new project
3. Copy your **Project URL** and **Anon Key**
4. Save **Service Role Key** (keep secure)

#### 4. Create Database Tables

Run these SQL queries in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  phone VARCHAR(20),
  avatar_url TEXT,
  referral_code VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Memberships table
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL,
  duration_months INTEGER NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Basecamps table
CREATE TABLE basecamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sponsor_type VARCHAR(50) NOT NULL, -- 'spu' or 'sgu'
  organization_name VARCHAR(255),
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commissions table
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,
  amount BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payment_method VARCHAR(255),
  transaction_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for auth users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE basecamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic allow-all for testing)
CREATE POLICY "users_allow_own" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "memberships_allow_own" ON memberships FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "basecamps_allow_own" ON basecamps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "sponsors_allow_own" ON sponsors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "commissions_allow_own" ON commissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "payments_allow_own" ON payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "referrals_allow_own" ON referrals FOR ALL USING (auth.uid() = user_id OR auth.uid() = referred_user_id);
```

### 5. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_ID=@cupitebet

NEXT_PUBLIC_APP_NAME=UDEA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Telegram Setup (Optional)

1. Create a bot: Talk to @BotFather on Telegram
2. Get your bot token
3. Add to `.env.local`
4. Messages will be sent when:
   - New member signs up
   - Payment processed
   - Basecamp registered

### 7. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Default Test Accounts

None - users self-register through the signup flow.

## Key Features Explained

### Membership System
- **Basic**: Rp350k/year - Access to basic courses
- **Exclusive**: Rp500k/2years - All courses + priority support + basecamp
- **VIP**: Rp1M/lifetime - Everything + sponsor program + certificate

### Referral Program
- Each user gets unique QR code
- 5% commission on direct referrals
- Commissions shown in dashboard
- Status: Pending → Paid (admin approval needed)

### Roles
- **Member**: Can access courses, referral program
- **Agent**: Can manage multiple basecamps
- **SPV (Supervisor)**: Can supervise agents
- **Manager**: Administrative functions
- **Sponsor (SPU/SGU)**: Can get BKSU digital certificate

### Basecamp
- Register 3x3m physical location
- GPS coordinates stored
- Google Maps integration ready (add @react-google-maps/api when needed)

### Payment Simulation
- No real Xendit gateway
- Clicking "Pay" creates payment record with status: "completed"
- Real integration: Replace `/api/payments/process.ts` with Xendit API calls

## API Routes

- `POST /api/auth/signup` - Create user & membership
- `POST /api/payments/process` - Process payment (simulated)
- `POST /api/basecamp/register` - Register basecamp location
- `POST /api/notifications/telegram` - Send Telegram notification

## Security Notes

- ✅ Role-based layout authentication (protected routes check auth)
- ✅ Supabase RLS enabled on all tables
- ✅ Environment variables for sensitive data
- ⚠️ For production: Implement payment verification before marking as "completed"
- ⚠️ Add CSRF protection for all API routes
- ⚠️ Validate commission payouts with admin approval flow

## Next Steps for Production

1. **Payment Gateway**: Integrate real Xendit API
2. **Google Maps**: Add map picker for basecamp registration
3. **PDF Certificates**: Use @react-pdf/renderer to generate downloadable certificates
4. **Email Service**: Add confirmation & receipt emails (Resend/SendGrid)
5. **Admin Dashboard**: Build admin panel for approvals & analytics
6. **Analytics**: Track conversions, commissions, member retention
7. **Mobile App**: React Native version for iOS/Android
8. **Advanced Features**:
   - Tiered referral network (multi-level)
   - Withdraw fund management
   - Course progress tracking
   - Live instructor support
   - Gamification (badges, leaderboards)

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Support

For issues, check:
1. Environment variables are set correctly
2. Supabase tables are created
3. RLS policies allow read/write
4. Network request look good in browser DevTools

## License

MIT - Feel free to use for commercial projects

## Contributing

Pull requests welcome! Please follow existing code patterns.

---

**Last Updated**: November 2024
**Version**: 1.0.0
