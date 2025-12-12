'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function BasecampPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(-6.2088); // Jakarta default
  const [longitude, setLongitude] = useState(106.8456);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 30,
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          toast.success('Lokasi diperbarui');
        },
        () => {
          toast.error('Gagal mendapatkan lokasi');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/basecamp/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          name: formData.name,
          location: formData.location,
          latitude,
          longitude,
          capacity: formData.capacity,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendaftarkan basecamp');
      }

      toast.success('Basecamp berhasil terdaftar!');
      setFormData({ name: '', location: '', capacity: 30 });
    } catch (error) {
      toast.error('Terjadi kesalahan saat mendaftarkan basecamp');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Daftar Basecamp</h1>
          <p className="text-gray-600 mt-2">
            Daftarkan lokasi 3x3m Anda sebagai basecamp untuk program
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Basecamp
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Basecamp Jakarta Pusat"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                placeholder="Alamat lengkap basecamp Anda"
                required
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapasitas Peserta
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
                min="1"
                required
              />
            </div>

            {/* Map Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi GPS
              </label>
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <p className="text-sm text-gray-600 mb-2">
                  Latitude: {latitude.toFixed(4)}, Longitude: {longitude.toFixed(4)}
                </p>
                <div className="bg-white rounded border border-gray-300 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">
                      📍 Koordinat: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      (Google Maps integration dapat ditambahkan kemudian)
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
              >
                📍 Gunakan Lokasi Saat Ini
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Daftarkan Basecamp'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-semibold mb-2">ℹ️ Informasi:</p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Ukuran minimum basecamp: 3m x 3m</li>
              <li>• Lokasi harus valid dan terukur</li>
              <li>• Admin akan verifikasi lokasi Anda</li>
              <li>• Google Maps integration segera hadir</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
