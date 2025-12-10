import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message_type, data } = body;

    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const message = `[${message_type}]\n${JSON.stringify(data, null, 2)}`;

    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      message: 'Notifikasi terkirim',
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim notifikasi' },
      { status: 500 }
    );
  }
}
