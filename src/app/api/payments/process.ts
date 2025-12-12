import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateTransactionId } from '@/lib/utils';
import { sendTelegramMessage, formatTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, membership_id, tier } = body;

    const supabase = await createClient();

    // Get user and membership details
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    const { data: membership } = await supabase
      .from('memberships')
      .select('*')
      .eq('id', membership_id)
      .single();

    if (!user || !membership) {
      return NextResponse.json(
        { error: 'User atau membership tidak ditemukan' },
        { status: 404 }
      );
    }

    // Generate transaction ID
    const transaction_id = await generateTransactionId();

    // Create payment record (simulated)
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id,
        membership_id,
        amount: membership.price,
        status: 'completed', // Simulated as completed
        payment_method: 'xendit_simulated',
        transaction_id,
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Send Telegram notification
    const message = formatTelegramMessage('new_payment', {
      user_name: user.full_name,
      amount: membership.price,
      tier: membership.tier,
      transaction_id,
    });
    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      payment,
      transaction_id,
      message: 'Pembayaran berhasil diproses',
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses pembayaran' },
      { status: 500 }
    );
  }
}
