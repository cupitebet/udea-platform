'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MEMBERSHIP_TIERS } from '@/lib/constants';

export default function Home() {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">UDEA</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-900 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Selamat Datang di UDEA</h2>
          <p className="text-xl text-blue-100 mb-8">
            Platform edukasi premium dengan sistem referral menguntungkan
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Fitur Utama
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <p className="text-4xl mb-4">🎓</p>
              <h4 className="text-xl font-bold mb-2">Academy</h4>
              <p className="text-gray-600">
                Akses kursus premium eksklusif untuk semua member
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <p className="text-4xl mb-4">🔗</p>
              <h4 className="text-xl font-bold mb-2">Referral</h4>
              <p className="text-gray-600">
                Ajak teman dan dapatkan komisi 5% dari setiap membership
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <p className="text-4xl mb-4">📍</p>
              <h4 className="text-xl font-bold mb-2">Basecamp</h4>
              <p className="text-gray-600">
                Daftarkan lokasi Anda dengan Google Maps integration
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <p className="text-4xl mb-4">📜</p>
              <h4 className="text-xl font-bold mb-2">Sertifikat</h4>
              <p className="text-gray-600">
                Dapatkan sertifikat BKSU untuk sponsor program
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <p className="text-4xl mb-4">💰</p>
              <h4 className="text-xl font-bold mb-2">Komisi</h4>
              <p className="text-gray-600">
                Kelola saldo komisi dan tarik dana dengan mudah
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <p className="text-4xl mb-4">👥</p>
              <h4 className="text-xl font-bold mb-2">Multi Role</h4>
              <p className="text-gray-600">
                Berbagai role untuk struktur organisasi yang fleksibel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Pilih Paket Membership
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(Object.entries(MEMBERSHIP_TIERS) as [string, any][]).map(
              ([tier, details]) => (
                <div
                  key={tier}
                  className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                    tier === 'vip' ? 'ring-2 ring-yellow-500 md:scale-105' : ''
                  }`}
                >
                  <div
                    className={`${
                      tier === 'basic'
                        ? 'bg-blue-600'
                        : tier === 'exclusive'
                          ? 'bg-purple-600'
                          : 'bg-yellow-500'
                    } text-white p-6 text-center`}
                  >
                    <h4 className="text-2xl font-bold mb-2">{details.name}</h4>
                    <p className="text-4xl font-bold">
                      Rp {details.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm mt-2">{details.duration} bulan akses</p>
                  </div>

                  <div className="p-6 bg-white">
                    <ul className="space-y-3 mb-6">
                      {details.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/signup"
                      className={`block w-full text-center py-2 rounded-lg font-semibold transition ${
                        tier === 'basic'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : tier === 'exclusive'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      }`}
                    >
                      Pilih Paket
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Siap Memulai?</h3>
          <p className="text-lg mb-8 text-blue-100">
            Bergabunglah dengan ribuan member UDEA dan mulai raih passive income
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Daftar Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 UDEA - Platform Edukasi Premium. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
