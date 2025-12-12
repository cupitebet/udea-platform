'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import QRCode from 'qrcode.react';
import { toast } from 'sonner';

export default function ReferralPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) return;

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser(userData);

        // Generate referral code from user ID
        const code = `UDEA${authUser.id.substring(0, 8).toUpperCase()}`;
        setReferralCode(code);

        // Generate QR code URL
        const refUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${code}`;
        setQrCodeUrl(refUrl);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Gagal memuat data referral');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `UDEA-Referral-${referralCode}.png`;
      link.click();
      toast.success('QR Code berhasil diunduh');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Kode referral disalin!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat data referral...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Program Referral</h1>
          <p className="text-gray-600 mt-2">
            Ajak teman dan dapatkan komisi untuk setiap member baru
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Code Referral</h2>

            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                {qrCodeUrl && (
                  <QRCode
                    value={qrCodeUrl}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                )}
              </div>

              <p className="text-center text-gray-600 mb-6">
                Bagikan QR Code ini untuk ajak teman bergabung
              </p>

              <button
                onClick={handleDownloadQR}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-3"
              >
                📥 Download QR Code
              </button>

              <button
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const image = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = image;
                    link.download = `referral-${referralCode}.png`;
                    link.click();
                  }
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition"
              >
                🖨️ Cetak QR Code
              </button>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kode Referral</h2>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-600 rounded-lg p-6 mb-6">
              <p className="text-gray-600 text-sm mb-2">Kode Unik Anda:</p>
              <p className="text-3xl font-bold text-blue-600 mb-4">{referralCode}</p>

              <button
                onClick={handleCopyCode}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                📋 Salin Kode
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Cara Menggunakan:</h3>

              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Bagikan kode atau QR Code dengan teman</span>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Teman daftar menggunakan kode Anda</span>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Anda dapatkan komisi 5% dari pembelian membership</span>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>
                    Komisi akan ditambahkan ke saldo Anda (pending hingga disetujui)
                  </span>
                </li>
              </ol>
            </div>

            {/* Commission Info */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">💰 Komisi Referral:</p>
              <p className="text-green-700 text-sm">
                • Direct Referral: 5% dari harga membership
              </p>
              <p className="text-green-700 text-sm">
                • Komisi langsung ditambahkan ke akun Anda
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
