export async function requireAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return null;
  }

  return authHeader.replace('Bearer ', '');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function generateQRCodeData(userId: string, referralCode: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}&user=${userId}`;
}

export async function generateTransactionId(): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}
