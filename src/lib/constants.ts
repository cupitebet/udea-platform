export const MEMBERSHIP_TIERS = {
  basic: {
    name: 'Basic',
    price: 350000, // Rp
    duration: 12, // months
    features: [
      'Access to basic courses',
      '1 year membership',
      'Referral program access',
      'Community support',
    ],
  },
  exclusive: {
    name: 'Exclusive',
    price: 500000, // Rp
    duration: 24, // months
    features: [
      'Access to all courses',
      '2 years membership',
      'Priority support',
      'Advanced referral tools',
      'Basecamp registration',
    ],
  },
  vip: {
    name: 'VIP',
    price: 1000000, // Rp
    duration: 120, // months (lifetime = 10 years)
    features: [
      'Lifetime access to all courses',
      'Lifetime membership',
      '24/7 priority support',
      'Advanced analytics dashboard',
      'Basecamp registration with Google Maps',
      'BKSU certificate eligibility',
      'Sponsor program access',
    ],
  },
};

export const USER_ROLES = {
  member: 'Member',
  agent: 'Agent',
  spv: 'Supervisor (SPV)',
  manager: 'Manager',
  sponsor: 'Sponsor (SPU/SGU)',
};

export const COMMISSION_RATES = {
  direct: 0.05, // 5% commission on direct referrals
  indirect: 0.02, // 2% on indirect referrals
};

export const TELEGRAM_API_URL = 'https://api.telegram.org';
