<?php

// database/seeders/CategorySeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // ILMU EKSAKTA (Natural & Formal Sciences)
            [
                'name' => 'Matematika',
                'slug' => 'eksakta',
                'description' => 'Aljabar, Kalkulus, Geometri, Statistika, Matematika Diskret, dan cabang matematika lainnya',
            ],
            [
                'name' => 'Fisika',
                'slug' => 'eksakta',
                'description' => 'Mekanika, Termodinamika, Elektromagnetisme, Fisika Modern, Fisika Kuantum',
            ],
            [
                'name' => 'Kimia',
                'slug' => 'eksakta',
                'description' => 'Kimia Organik, Anorganik, Analitik, Fisikokimia, dan Biokimia',
            ],
            [
                'name' => 'Biologi',
                'slug' => 'eksakta',
                'description' => 'Botanik, Zoologi, Mikrobiologi, Genetika, Ekologi, dan Evolusi',
            ],
            [
                'name' => 'Astronomi',
                'slug' => 'eksakta',
                'description' => 'Astrofisika, Kosmologi, Sistem Tata Surya, dan Eksplorasi Ruang Angkasa',
            ],
            [
                'name' => 'Geologi',
                'slug' => 'eksakta',
                'description' => 'Mineralogi, Petrologi, Stratigrafi, dan Geofisika',
            ],
            [
                'name' => 'Ilmu Komputer',
                'slug' => 'eksakta',
                'description' => 'Algoritma, Struktur Data, Teori Komputasi, dan Pemrograman Teoritis',
            ],
            [
                'name' => 'Statistika',
                'slug' => 'eksakta',
                'description' => 'Statistika Deskriptif, Inferensial, Analisis Data, dan Probabilitas',
            ],

            // ILMU SOSIAL HUMANIORA (Social Sciences & Humanities)
            [
                'name' => 'Sosiologi',
                'slug' => 'soshum',
                'description' => 'Struktur Sosial, Perubahan Sosial, Masyarakat, dan Interaksi Sosial',
            ],
            [
                'name' => 'Antropologi',
                'slug' => 'soshum',
                'description' => 'Budaya, Etnografi, Arkeologi, dan Antropologi Fisik',
            ],
            [
                'name' => 'Psikologi',
                'slug' => 'soshum',
                'description' => 'Psikologi Kognitif, Sosial, Klinis, Perkembangan, dan Eksperimental',
            ],
            [
                'name' => 'Ilmu Politik',
                'slug' => 'soshum',
                'description' => 'Teori Politik, Hubungan Internasional, Kebijakan Publik, dan Pemerintahan',
            ],
            [
                'name' => 'Ekonomi',
                'slug' => 'soshum',
                'description' => 'Mikroekonomi, Makroekonomi, Ekonomi Pembangunan, dan Ekonomi Internasional',
            ],
            [
                'name' => 'Hukum',
                'slug' => 'soshum',
                'description' => 'Hukum Pidana, Perdata, Tata Negara, Internasional, dan Hukum Bisnis',
            ],
            [
                'name' => 'Sejarah',
                'slug' => 'soshum',
                'description' => 'Sejarah Dunia, Indonesia, Kuno, Modern, dan Historiografi',
            ],
            [
                'name' => 'Filsafat',
                'slug' => 'soshum',
                'description' => 'Metafisika, Epistemologi, Etika, Logika, dan Filsafat Ilmu',
            ],
            [
                'name' => 'Sastra dan Bahasa',
                'slug' => 'soshum',
                'description' => 'Linguistik, Sastra Indonesia, Sastra Dunia, dan Kajian Bahasa',
            ],
            [
                'name' => 'Seni dan Budaya',
                'slug' => 'soshum',
                'description' => 'Seni Rupa, Musik, Teater, Tari, dan Studi Budaya',
            ],
            [
                'name' => 'Komunikasi',
                'slug' => 'soshum',
                'description' => 'Jurnalistik, Public Relations, Media Digital, dan Komunikasi Massa',
            ],

            // ILMU TERAPAN (Applied Sciences)
            [
                'name' => 'Kedokteran',
                'slug' => 'terapan',
                'description' => 'Anatomi, Fisiologi, Patologi, Farmakologi, dan Ilmu Kedokteran Klinis',
            ],
            [
                'name' => 'Kesehatan Masyarakat',
                'slug' => 'terapan',
                'description' => 'Epidemiologi, Biostatistik, Kesehatan Lingkungan, dan Promosi Kesehatan',
            ],
            [
                'name' => 'Keperawatan',
                'slug' => 'terapan',
                'description' => 'Keperawatan Dasar, Klinis, Komunitas, dan Manajemen Keperawatan',
            ],
            [
                'name' => 'Farmasi',
                'slug' => 'terapan',
                'description' => 'Farmakologi, Farmasetika, Kimia Farmasi, dan Farmasi Klinis',
            ],
            [
                'name' => 'Teknik Sipil',
                'slug' => 'terapan',
                'description' => 'Struktur, Geoteknik, Transportasi, dan Manajemen Konstruksi',
            ],
            [
                'name' => 'Teknik Mesin',
                'slug' => 'terapan',
                'description' => 'Termodinamika, Mekanika Fluida, Material, dan Manufaktur',
            ],
            [
                'name' => 'Teknik Elektro',
                'slug' => 'terapan',
                'description' => 'Elektronika, Sistem Tenaga, Telekomunikasi, dan Kontrol',
            ],
            [
                'name' => 'Teknik Informatika',
                'slug' => 'terapan',
                'description' => 'Pemrograman, Database, Jaringan, dan Pengembangan Software',
            ],
            [
                'name' => 'Arsitektur',
                'slug' => 'terapan',
                'description' => 'Desain Arsitektur, Perencanaan Kota, dan Teknologi Bangunan',
            ],
            [
                'name' => 'Pertanian',
                'slug' => 'terapan',
                'description' => 'Agronomi, Horticultura, Ilmu Tanah, dan Teknologi Pertanian',
            ],
            [
                'name' => 'Peternakan',
                'slug' => 'terapan',
                'description' => 'Nutrisi Ternak, Reproduksi, Genetika Ternak, dan Manajemen Peternakan',
            ],
            [
                'name' => 'Teknologi Pangan',
                'slug' => 'terapan',
                'description' => 'Pengolahan Pangan, Keamanan Pangan, dan Nutrisi',
            ],

            // INTERDISIPLINER / MULTIDISIPLINER
            [
                'name' => 'Ilmu Lingkungan',
                'slug' => 'interdisipliner',
                'description' => 'Ekologi, Konservasi, Perubahan Iklim, dan Pembangunan Berkelanjutan',
            ],
            [
                'name' => 'Bioteknologi',
                'slug' => 'interdisipliner',
                'description' => 'Rekayasa Genetika, Fermentasi, Biomedis, dan Bioindustri',
            ],
            [
                'name' => 'Data Science',
                'slug' => 'interdisipliner',
                'description' => 'Machine Learning, Big Data, Analytics, dan Artificial Intelligence',
            ],
            [
                'name' => 'Ilmu Kesehatan Global',
                'slug' => 'interdisipliner',
                'description' => 'Kesehatan Internasional, Epidemi Global, dan Sistem Kesehatan',
            ],
            [
                'name' => 'Mitigasi Bencana',
                'slug' => 'interdisipliner',
                'description' => 'Manajemen Risiko, Kesiapsiagaan, dan Tanggap Darurat',
            ],
            [
                'name' => 'Artificial Intelligence',
                'slug' => 'interdisipliner',
                'description' => 'Machine Learning, Deep Learning, Natural Language Processing, Computer Vision',
            ],
            [
                'name' => 'Cybersecurity',
                'slug' => 'interdisipliner',
                'description' => 'Keamanan Informasi, Kriptografi, Forensik Digital, dan Ethical Hacking',
            ],
            [
                'name' => 'Renewable Energy',
                'slug' => 'interdisipliner',
                'description' => 'Energi Surya, Angin, Biomassa, dan Teknologi Energi Berkelanjutan',
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }
    }
}
