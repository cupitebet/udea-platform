# UDEA Setup & Deployment Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Create project at https://supabase.com
2. Copy URL and Anon Key
3. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://sfibvjbeecznyerragmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaWJ2amJlZWN6bnllcnJhZ21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjMzMTMsImV4cCI6MjA3ODkzOTMxM30.dFHfnCQ9M_hLKeIew_IumfMzFqIKXmOn6toQD9jFFc8
SUPABASE_SERVICE_ROLE_KEY=your_service_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_ID=@cupitebet
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Create Database Tables (Supabase SQL)
Copy-paste all SQL from README.md into Supabase SQL Editor

### 4. Run Development
```bash
npm run dev
```

Visit http://localhost:3000

---

## Detailed Supabase Configuration

### Step 1: Project Creation
1. Go to dashboard.supabase.com
2. Click "New Project"
3. Fill in details:
   - Project name: UDEA
   - Database password: (strong password)
   - Region: Choose closest to your users
   - Pricing: Free tier works for development

### Step 2: Get Credentials
After project is ready:
1. Click project name
2. Settings → API
3. Copy:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Service Role Key → SUPABASE_SERVICE_ROLE_KEY (save securely!)

### Step 3: SQL Schema Setup
1. Go to SQL Editor
2. Click "New Query"
3. Paste the SQL from README.md section "Create Database Tables"
4. Click "Run"

### Step 4: Enable Realtime (Optional)
1. Go to Realtime tab
2. Select tables to enable realtime updates
3. Useful for live notifications

---

## Authentication Setup

### Supabase Auth Configuration
1. Authentication → Providers
2. Email/Password: Enable (default)
3. OAuth (optional):
   - Google: Add Google OAuth credentials
   - GitHub: Add GitHub OAuth credentials

### User Registration Flow
```
User signs up → Supabase creates auth user → API creates profile → Membership created → Telegram notification sent
```

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | https://abc.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Anonymous API key | eyJhbGciOi... |
| SUPABASE_SERVICE_ROLE_KEY | Server-side key (secret) | eyJhbGciOi... |
| TELEGRAM_BOT_TOKEN | Telegram bot token | 123456:ABCdef... |
| TELEGRAM_ADMIN_ID | Admin chat ID | @cupitebet |
| NEXT_PUBLIC_APP_URL | App URL | http://localhost:3000 |
| NEXT_PUBLIC_APP_NAME | App name | UDEA |

---

## Telegram Bot Setup

### Create Bot
1. Open Telegram
2. Search for @BotFather
3. Send /newbot
4. Follow prompts (name, username)
5. Copy bot token

### Get Admin Chat ID
1. Add bot to group or start DM
2. Send any message
3. Visit: https://api.telegram.org/bot[TOKEN]/getUpdates
4. Find your chat_id
5. Use as TELEGRAM_ADMIN_ID

### Test Notifications
When new user signs up, admin receives notification with:
- User name & email
- Membership tier
- Timestamp

---

## Running Locally

### Development Mode
```bash
npm run dev
```
- Hot reload enabled
- Visit http://localhost:3000
- Open browser DevTools for errors

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## Database Schema Overview

### users
- id (UUID, primary key)
- email (unique)
- full_name
- role (member|agent|spv|manager|sponsor)
- phone
- avatar_url
- referral_code (unique)
- created_at

### memberships
- id
- user_id (FK to users)
- tier (basic|exclusive|vip)
- price
- duration_months
- started_at, expires_at
- is_active
- created_at

### basecamps
- id
- user_id (FK)
- name, location
- latitude, longitude
- capacity
- created_at

### sponsors
- id
- user_id (FK)
- sponsor_type (spu|sgu)
- organization_name
- certificate_url
- created_at

### commissions
- id
- user_id (FK)
- referred_user_id (FK)
- amount
- status (pending|paid|cancelled)
- created_at

### payments
- id
- user_id, membership_id (FK)
- amount
- status (pending|completed|failed)
- payment_method
- transaction_id
- created_at

### referrals
- id
- user_id, referred_user_id (FK)
- status (active|inactive)
- created_at

---

## API Routes

### Authentication
```
POST /api/auth/signup
Body: {
  user_id, full_name, email, phone, 
  tier, referral_code
}
Response: { success, membership }
```

### Payments
```
POST /api/payments/process
Body: { user_id, membership_id, tier }
Response: { success, payment, transaction_id }
```

### Basecamp
```
POST /api/basecamp/register
Body: { 
  user_id, name, location, 
  latitude, longitude, capacity 
}
Response: { success, basecamp }
```

### Notifications
```
POST /api/notifications/telegram
Body: { message_type, data }
Response: { success }
```

---

## Testing Checklist

- [ ] User can sign up
- [ ] User can login
- [ ] Dashboard loads with user data
- [ ] Academy shows courses
- [ ] Referral QR code generates
- [ ] Basecamp form submits
- [ ] Payment simulates
- [ ] Telegram notification sends
- [ ] Certificate displays for sponsors

---

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
→ Run `npm install`

### "NEXT_PUBLIC_SUPABASE_URL is undefined"
→ Check `.env.local` exists with correct values

### Auth not working
→ Verify Supabase auth is enabled (Authentication → Providers)

### Telegram notifications not sending
→ Check bot token is valid and admin ID is correct

### Database errors
→ Ensure RLS policies are created correctly
→ Check user has permission to access table

### Port 3000 already in use
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Then: taskkill /PID [process_id] /F
```

---

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Add environment variables (from .env.local)
5. Click Deploy

### 3. Configure Custom Domain
Vercel → Settings → Domains → Add domain

---

## Deployment to Other Platforms

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build & run:
```bash
docker build -t udea .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  udea
```

### Heroku
```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
heroku config:set NEXT_PUBLIC_SUPABASE_URL=...
```

---

## Performance Optimization

### Caching
- API responses cached with SWR
- Images optimized with next/image
- CSS minimized with Tailwind

### Code Splitting
- Routes automatically code-split by Next.js
- Dynamic imports for heavy components

### Database
- Create indexes on frequently queried fields:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_commissions_user ON commissions(user_id);
```

---

## Monitoring & Logging

### Supabase Analytics
1. Go to Supabase dashboard
2. Select your project
3. View "Logs" and "Stats"
4. Monitor database performance

### Error Tracking (Optional)
Add Sentry for error monitoring:
```bash
npm install @sentry/nextjs
```

---

## Security Best Practices

✅ **What we did:**
- Environment variables for secrets
- Supabase RLS policies enabled
- Auth middleware on protected routes
- HTTPS forced

⚠️ **For production, add:**
- CSRF protection middleware
- Rate limiting on API routes
- Input validation & sanitization
- SQL injection prevention (use parameterized queries)
- XSS protection headers
- CORS configuration
- Payment verification flow

---

## Maintenance

### Regular Tasks
- Monitor disk usage in Supabase
- Review database backups
- Check error logs weekly
- Update dependencies monthly

### Database Cleanup
```sql
-- Archive old commissions (>6 months)
DELETE FROM commissions WHERE created_at < NOW() - INTERVAL '6 months' AND status = 'cancelled';

-- Cleanup inactive users
DELETE FROM users WHERE created_at < NOW() - INTERVAL '1 year' AND id NOT IN (SELECT user_id FROM memberships WHERE is_active = true);
```

---

## Getting Help

1. **Documentation**: https://supabase.com/docs
2. **Next.js**: https://nextjs.org/docs
3. **Tailwind**: https://tailwindcss.com/docs
4. **Community**: Supabase Discord, Next.js Discord

---

**Last Updated**: November 2024
**Version**: 1.0.0
