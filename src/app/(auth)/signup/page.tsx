'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { MEMBERSHIP_TIERS } from '@/lib/constants';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'membership'>('info');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [selectedTier, setSelectedTier] = useState<'basic' | 'exclusive' | 'vip'>('basic');
  const supabase = createClient();

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error('Mohon isi semua data');
      return;
    }

    setStep('membership');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        toast.error(authError.message);
        setIsLoading(false);
        return;
      }

      // Create user profile and membership
      const userId = authData.user?.id;
      if (!userId) throw new Error('User creation failed');

      // Call signup API to create user profile and membership
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          tier: selectedTier,
          referral_code: referralCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      toast.success('Akun berhasil dibuat! Silakan login.');
      router.push('/login');
    } catch (err) {
      toast.error('Terjadi kesalahan saat pendaftaran');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-2">UDEA</h1>
      <p className="text-center text-gray-600 mb-8">Daftar & Pilih Paket Membership</p>

      {step === 'info' ? (
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama Anda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon (Opsional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+62 812345678"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Lanjut ke Pilihan Paket
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">Pilih Paket Membership</p>
            {(Object.entries(MEMBERSHIP_TIERS) as [string, any][]).map(
              ([tier, details]) => (
                <label
                  key={tier}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedTier === tier
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={tier}
                    checked={selectedTier === tier}
                    onChange={(e) =>
                      setSelectedTier(e.target.value as 'basic' | 'exclusive' | 'vip')
                    }
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold">{details.name}</p>
                    <p className="text-sm text-gray-600">
                      Rp {details.price.toLocaleString('id-ID')} • {details.duration} bulan
                    </p>
                  </div>
                </label>
              )
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setStep('info')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg"
            >
              Kembali
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Login sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
