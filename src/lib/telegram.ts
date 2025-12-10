import axios from 'axios';

const TELEGRAM_API_URL = 'https://api.telegram.org';

export async function sendTelegramMessage(
  message: string,
  chatId?: string
): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn('Telegram bot token not configured');
      return;
    }

    const adminId = process.env.TELEGRAM_ADMIN_ID;
    const targetChatId = chatId || adminId;

    if (!targetChatId) {
      console.warn('Telegram target ID not configured');
      return;
    }

    const response = await axios.post(
      `${TELEGRAM_API_URL}/bot${botToken}/sendMessage`,
      {
        chat_id: targetChatId,
        text: message,
        parse_mode: 'HTML',
      }
    );

    console.log('Telegram message sent:', response.data);
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

export function formatTelegramMessage(type: string, data: Record<string, any>): string {
  switch (type) {
    case 'new_member':
      return `
🎉 <b>New Member Registered!</b>
👤 Name: ${data.full_name}
📧 Email: ${data.email}
📱 Phone: ${data.phone || 'N/A'}
💳 Tier: ${data.tier}
🕐 Time: ${new Date().toLocaleString()}
      `.trim();

    case 'new_payment':
      return `
💰 <b>New Payment Processed!</b>
👤 User: ${data.user_name}
💵 Amount: Rp${data.amount.toLocaleString('id-ID')}
📦 Tier: ${data.tier}
🔗 Transaction ID: ${data.transaction_id}
🕐 Time: ${new Date().toLocaleString()}
      `.trim();

    case 'new_basecamp':
      return `
📍 <b>New Basecamp Registered!</b>
👤 User: ${data.user_name}
🏢 Basecamp: ${data.name}
📌 Location: ${data.location}
🕐 Time: ${new Date().toLocaleString()}
      `.trim();

    default:
      return JSON.stringify(data);
  }
}
