'use client';

export default function AcademyPage() {
  const courses = [
    {
      id: 1,
      title: 'Fundamental Digital Marketing',
      description: 'Belajar dasar-dasar digital marketing dari nol',
      duration: '4 minggu',
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Advanced SEO Strategies',
      description: 'Menguasai teknik SEO tingkat lanjut',
      duration: '6 minggu',
      level: 'Intermediate',
    },
    {
      id: 3,
      title: 'Social Media Marketing Masterclass',
      description: 'Strategi komprehensif untuk media sosial',
      duration: '5 minggu',
      level: 'Intermediate',
    },
    {
      id: 4,
      title: 'Content Creation & Copywriting',
      description: 'Membuat konten yang menarik dan persuasif',
      duration: '4 minggu',
      level: 'Beginner',
    },
    {
      id: 5,
      title: 'E-Commerce Optimization',
      description: 'Optimalkan toko online Anda untuk penjualan maksimal',
      duration: '6 minggu',
      level: 'Advanced',
    },
    {
      id: 6,
      title: 'Analytics & Data-Driven Decision Making',
      description: 'Gunakan data untuk membuat keputusan bisnis yang lebih baik',
      duration: '5 minggu',
      level: 'Advanced',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">UDEA Academy</h1>
          <p className="text-gray-600 mt-2">
            Akses kursus premium eksklusif untuk member
          </p>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-40 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>⏱️ {course.duration}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      course.level === 'Beginner'
                        ? 'bg-green-100 text-green-800'
                        : course.level === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {course.level}
                  </span>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                  Mulai Belajar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
