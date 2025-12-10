import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTelegramMessage, formatTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, full_name, phone, email, tier, referral_code } = body;

    const supabase = await createClient();

    // Create user profile
    const { error: userError } = await supabase.from('users').insert({
      id: user_id,
      email,
      full_name,
      phone,
      role: 'member',
    });

    if (userError) throw userError;

    // Determine membership price and duration
    const tierConfig = {
      basic: { price: 350000, duration: 12 },
      exclusive: { price: 500000, duration: 24 },
      vip: { price: 1000000, duration: 120 },
    };

    const config = tierConfig[tier as keyof typeof tierConfig];

    // Create membership
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + config.duration);

    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id,
        tier,
        price: config.price,
        duration_months: config.duration,
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (membershipError) throw membershipError;

    // Create referral if ref code provided
    if (referral_code) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referral_code)
        .single();

      if (referrer) {
        const { error: referralError } = await supabase
          .from('referrals')
          .insert({
            user_id: referrer.id,
            referred_user_id: user_id,
            status: 'active',
          });

        if (!referralError) {
          // Create commission record
          const commission = config.price * 0.05; // 5% commission
          await supabase.from('commissions').insert({
            user_id: referrer.id,
            referred_user_id: user_id,
            amount: commission,
            status: 'pending',
          });
        }
      }
    }

    // Send Telegram notification
    const message = formatTelegramMessage('new_member', {
      full_name,
      email,
      phone,
      tier,
    });
    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      membership,
      message: 'User berhasil didaftarkan',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat akun' },
      { status: 500 }
    );
  }
}
