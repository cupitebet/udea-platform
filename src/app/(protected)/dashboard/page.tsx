'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DashboardData {
  user: any;
  membership: any;
  referralCount: number;
  commissionBalance: number;
  commissions: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Get user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        // Get membership
        const { data: membership } = await supabase
          .from('memberships')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        // Get referral count
        const { count: referralCount } = await supabase
          .from('referrals')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        // Get commission balance
        const { data: commissions } = await supabase
          .from('commissions')
          .select('*')
          .eq('user_id', user.id);

        const commissionBalance = (commissions || []).reduce(
          (sum, c) => sum + (c.status === 'pending' ? c.amount : 0),
          0
        );

        setData({
          user: userProfile,
          membership,
          referralCount: referralCount || 0,
          commissionBalance,
          commissions: commissions || [],
        });
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Gagal memuat dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">UDEA Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Selamat datang, {data?.user?.full_name}!
          </h2>
          <p className="text-blue-100">
            Paket: <span className="font-semibold">{data?.membership?.tier?.toUpperCase()}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm mb-2">Total Referral</p>
            <p className="text-3xl font-bold text-blue-600">{data?.referralCount || 0}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm mb-2">Komisi Pending</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(data?.commissionBalance || 0)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm mb-2">Status Member</p>
            <p className="text-3xl font-bold text-orange-600">
              {data?.membership?.is_active ? 'Aktif' : 'Tidak Aktif'}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/academy"
            className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition text-center"
          >
            <p className="text-2xl mb-2">📚</p>
            <p className="font-semibold text-gray-900">Academy</p>
            <p className="text-sm text-gray-600">Akses kursus premium</p>
          </Link>

          <Link
            href="/referral"
            className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition text-center"
          >
            <p className="text-2xl mb-2">🔗</p>
            <p className="font-semibold text-gray-900">Referral</p>
            <p className="text-sm text-gray-600">Bagikan kode unik</p>
          </Link>

          <Link
            href="/basecamp"
            className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition text-center"
          >
            <p className="text-2xl mb-2">📍</p>
            <p className="font-semibold text-gray-900">Basecamp</p>
            <p className="text-sm text-gray-600">Daftar lokasi</p>
          </Link>

          <Link
            href="/certificate"
            className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition text-center"
          >
            <p className="text-2xl mb-2">📜</p>
            <p className="font-semibold text-gray-900">Sertifikat</p>
            <p className="text-sm text-gray-600">Lihat BKSU</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
