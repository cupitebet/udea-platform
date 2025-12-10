# UDEA Quick Reference

## File Locations

| Component | File | Purpose |
|-----------|------|---------|
| Homepage | `src/app/page.tsx` | Landing page with pricing |
| Login | `src/app/(auth)/login/page.tsx` | User login |
| Signup | `src/app/(auth)/signup/page.tsx` | Registration & membership selection |
| Dashboard | `src/app/(protected)/dashboard/page.tsx` | Main user dashboard |
| Academy | `src/app/(protected)/academy/page.tsx` | Course listing |
| Referral | `src/app/(protected)/referral/page.tsx` | QR code & referral links |
| Basecamp | `src/app/(protected)/basecamp/page.tsx` | Location registration |
| Certificate | `src/app/(protected)/certificate/page.tsx` | BKSU display |
| Signup API | `src/app/api/auth/signup.ts` | Create user & membership |
| Payment API | `src/app/api/payments/process.ts` | Process payment (simulated) |
| Basecamp API | `src/app/api/basecamp/register.ts` | Register basecamp |
| Telegram API | `src/app/api/notifications/telegram.ts` | Send notifications |
| Supabase Client | `src/lib/supabase/client.ts` | Browser client |
| Supabase Server | `src/lib/supabase/server.ts` | Server-side client |
| Types | `src/lib/types.ts` | TypeScript interfaces |
| Constants | `src/lib/constants.ts` | App constants & config |
| Utils | `src/lib/utils.ts` | Helper functions |
| Telegram | `src/lib/telegram.ts` | Telegram integration |

## Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_ADMIN_ID=@cupitebet
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=UDEA
```

## Common Tasks

### Add a New Course to Academy
Edit: `src/app/(protected)/academy/page.tsx`
```tsx
const courses = [
  {
    id: 7,
    title: 'Your Course',
    description: 'Description',
    duration: '5 minggu',
    level: 'Beginner',
  },
  // ... existing courses
];
```

### Change Membership Pricing
Edit: `src/lib/constants.ts`
```ts
export const MEMBERSHIP_TIERS = {
  basic: {
    price: 350000,  // Change this
    duration: 12,
    // ...
  },
  // ...
};
```

### Modify Commission Rate
Edit: `src/lib/constants.ts`
```ts
export const COMMISSION_RATES = {
  direct: 0.05,   // 5% → change to 0.10 for 10%
  indirect: 0.02,
};
```

### Update Telegram Admin ID
Edit: `.env.local`
```env
TELEGRAM_ADMIN_ID=@new_admin_username
```

### Add New User Role
1. Update `src/lib/types.ts`:
```ts
export type UserRole = 'member' | 'agent' | 'spv' | 'manager' | 'sponsor' | 'newrole';
```

2. Add to `src/lib/constants.ts`:
```ts
export const USER_ROLES = {
  member: 'Member',
  agent: 'Agent',
  // ...
  newrole: 'New Role Label',
};
```

## API Response Examples

### Signup Response
```json
{
  "success": true,
  "membership": {
    "id": "uuid",
    "user_id": "uuid",
    "tier": "basic",
    "price": 350000,
    "duration_months": 12,
    "is_active": true
  },
  "message": "User berhasil didaftarkan"
}
```

### Payment Response
```json
{
  "success": true,
  "payment": {
    "id": "uuid",
    "user_id": "uuid",
    "amount": 350000,
    "status": "completed",
    "transaction_id": "TXN-1234567890-ABC123"
  },
  "message": "Pembayaran berhasil diproses"
}
```

### Error Response
```json
{
  "error": "Error message here",
  "status": 400
}
```

## Membership Tiers

| Tier | Price | Duration | Features |
|------|-------|----------|----------|
| Basic | Rp350k | 1 year | Basic courses, referral |
| Exclusive | Rp500k | 2 years | All courses, priority support, basecamp |
| VIP | Rp1M | Lifetime | Everything + sponsor program + certificate |

## User Roles & Permissions

| Role | Access | Features |
|------|--------|----------|
| Member | Academy, Referral, Dashboard | Basic member functions |
| Agent | + Basecamp management | Can register multiple locations |
| SPV | + Multiple agents | Supervises agents |
| Manager | + Admin functions | Administrative access |
| Sponsor (SPU/SGU) | + Certificates | Can download BKSU certificate |

## Database Query Examples

### Get User Membership
```sql
SELECT * FROM memberships 
WHERE user_id = 'user-id' 
AND is_active = true;
```

### Get User Commissions
```sql
SELECT * FROM commissions 
WHERE user_id = 'user-id' 
AND status = 'pending';
```

### Get Referral Count
```sql
SELECT COUNT(*) FROM referrals 
WHERE user_id = 'user-id' 
AND status = 'active';
```

### Get Basecamps
```sql
SELECT * FROM basecamps 
WHERE user_id = 'user-id';
```

## Debugging Tips

### Check Supabase Connection
Open browser DevTools → Network tab → Look for supabase API calls

### View Auth Status
In any client component:
```ts
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### Check Database
1. Go to Supabase dashboard
2. Click "SQL Editor"
3. Query tables manually
4. Check RLS policies are correct

### Enable API Logs
In Supabase dashboard → Logs → Recent API calls

## Performance Tips

1. **Lazy Load Images**: Use `next/image` component
2. **Cache API Calls**: Use SWR with revalidation
3. **Code Split Routes**: Automatic with App Router
4. **Optimize Tailwind**: Only includes used classes

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "User not found" | Check user was created in auth.users table |
| "RLS policy violation" | Enable appropriate RLS policies |
| "NEXT_PUBLIC_SUPABASE_URL is undefined" | Check .env.local exists |
| "Telegram notification failed" | Verify bot token and admin ID |
| "QR Code not rendering" | Check qrcode.react is installed |

## Resources

- **Docs**: Check README.md & SETUP.md
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs

## Version Info

- Node.js: 18+
- Next.js: 14.0.0
- React: 18.3.0
- TypeScript: 5.2.0
- Tailwind CSS: 3.3.0

---

**Last Updated**: November 2024
