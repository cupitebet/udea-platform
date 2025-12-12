import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTelegramMessage, formatTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, name, location, latitude, longitude, capacity } = body;

    const supabase = await createClient();

    // Create basecamp record
    const { data: basecamp, error: basecampError } = await supabase
      .from('basecamps')
      .insert({
        user_id,
        name,
        location,
        latitude,
        longitude,
        capacity,
      })
      .select()
      .single();

    if (basecampError) throw basecampError;

    // Get user details
    const { data: user } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user_id)
      .single();

    // Send Telegram notification
    const message = formatTelegramMessage('new_basecamp', {
      user_name: user?.full_name,
      name,
      location,
    });
    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      basecamp,
      message: 'Basecamp berhasil terdaftar',
    });
  } catch (error) {
    console.error('Basecamp error:', error);
    return NextResponse.json(
      { error: 'Gagal mendaftarkan basecamp' },
      { status: 500 }
    );
  }
}
