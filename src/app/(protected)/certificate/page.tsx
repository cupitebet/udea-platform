'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function CertificatePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [sponsor, setSponsor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login');
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser(userData);

        // Check if user is a sponsor
        if (userData?.role === 'sponsor') {
          const { data: sponsorData } = await supabase
            .from('sponsors')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          setSponsor(sponsorData);
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificateData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat sertifikat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Sertifikat BKSU</h1>
          <p className="text-gray-600 mt-2">
            Lihat dan kelola sertifikat digital Anda
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user?.role !== 'sponsor' ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-800">
              ⚠️ Anda belum memiliki akses ke program Sponsor (SPU/SGU). Hubungi admin
              untuk menjadi sponsor dan mendapatkan sertifikat BKSU.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Certificate Preview */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sertifikat BKSU Anda
              </h2>

              <div className="bg-gradient-to-b from-amber-50 to-yellow-50 border-4 border-amber-600 rounded-lg p-8 text-center min-h-96 flex flex-col justify-center">
                <div className="mb-6">
                  <p className="text-sm font-semibold text-amber-800">SERTIFIKAT</p>
                </div>

                <h3 className="text-2xl font-bold text-amber-900 mb-2">
                  Bisnis Kemitraan Strategis Utama
                </h3>
                <p className="text-amber-800 mb-6">(BKSU)</p>

                <div className="border-t-2 border-b-2 border-amber-600 py-4 mb-6">
                  <p className="text-amber-900 font-semibold text-lg">
                    {user?.full_name}
                  </p>
                  {sponsor?.sponsor_type === 'spu' && (
                    <p className="text-amber-800 text-sm">Sponsor Prioritas Utama</p>
                  )}
                  {sponsor?.sponsor_type === 'sgu' && (
                    <p className="text-amber-800 text-sm">Sponsor Global Utama</p>
                  )}
                </div>

                <p className="text-sm text-amber-800 mb-4">
                  Diterbitkan: {new Date().toLocaleDateString('id-ID')}
                </p>

                <div className="flex justify-around mb-4">
                  <div>
                    <p className="text-xs text-amber-700 mb-4">Direktur</p>
                    <div className="w-24 h-12 border-b border-amber-800"></div>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 mb-4">Cap UDEA</p>
                    <div className="w-24 h-12 border-2 border-amber-800 rounded-full flex items-center justify-center text-2xl">
                      🏢
                    </div>
                  </div>
                </div>

                <p className="text-xs text-amber-600">
                  No. {sponsor?.id?.substring(0, 12).toUpperCase()}
                </p>
              </div>

              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                📥 Download PDF
              </button>
            </div>

            {/* Certificate Details */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Sertifikat</h2>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.full_name}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Tipe Sponsor</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {sponsor?.sponsor_type === 'spu'
                      ? 'SPU (Sponsor Prioritas Utama)'
                      : 'SGU (Sponsor Global Utama)'}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Organisasi</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {sponsor?.organization_name || '-'}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Status Sertifikat</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ✓ Aktif
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Terbit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date().toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-2">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
                  🖨️ Cetak Sertifikat
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition">
                  📤 Bagikan Sertifikat
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
