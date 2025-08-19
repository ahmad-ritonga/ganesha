<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;
use App\Models\Chapter;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have users and categories
        $users = User::all();
        $categories = Category::all();

        if ($users->isEmpty() || $categories->isEmpty()) {
            $this->command->warn('Please run UserSeeder and CategorySeeder first');
            return;
        }

        $books = [
            [
                'title' => 'Matematika Dasar untuk Pemula',
                'description' => 'Buku panduan lengkap untuk memahami konsep-konsep dasar matematika. Cocok untuk siswa SMA dan mahasiswa tingkat awal yang ingin memperkuat fondasi matematika mereka.',
                'cover_image' => 'https://i.pinimg.com/736x/6f/d5/5b/6fd55ba2830542dae6472509ba0877c3.jpg',
                'author_id' => $users->where('email', 'admin@example.com')->first()?->id ?? $users->first()->id,
                'category_id' => $categories->where('name', 'Matematika')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-56-7',
                'publication_date' => '2024-01-15',
                'price' => 75000,
                'discount_percentage' => 20,
                'is_published' => true,
                'is_featured' => true,
                'total_chapters' => 12,
                'reading_time_minutes' => 480,
                'language' => 'id',
                'tags' => ['matematika', 'dasar', 'pemula', 'SMA', 'kuliah'],
            ],
            [
                'title' => 'Fisika Modern dan Aplikasinya',
                'description' => 'Eksplorasi mendalam tentang fisika modern meliputi mekanika kuantum, relativitas, dan aplikasinya dalam teknologi masa kini. Dilengkapi dengan contoh-contoh praktis dan eksperimen.',
                'cover_image' => 'https://i.pinimg.com/1200x/e2/9a/af/e29aaf80dbcc410ba1cf12274c77b594.jpg',
                'author_id' => $users->random()->id,
                'category_id' => $categories->where('name', 'Fisika')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-57-8',
                'publication_date' => '2024-02-20',
                'price' => 120000,
                'discount_percentage' => 15,
                'is_published' => true,
                'is_featured' => false,
                'total_chapters' => 15,
                'reading_time_minutes' => 720,
                'language' => 'id',
                'tags' => ['fisika', 'modern', 'kuantum', 'relativitas', 'teknologi'],
            ],
            [
                'title' => 'Kimia Organik Terapan',
                'description' => 'Panduan komprehensif kimia organik dengan fokus pada aplikasi praktis dalam industri farmasi, makanan, dan material. Berisi studi kasus dan praktikum virtual.',
                'cover_image' => 'https://i.pinimg.com/736x/5a/f9/0d/5af90dc82af9aebf469ce345a4646dd0.jpg',
                'author_id' => $users->random()->id,
                'category_id' => $categories->where('name', 'Kimia')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-58-9',
                'publication_date' => '2024-03-10',
                'price' => 95000,
                'is_published' => true,
                'is_featured' => true,
                'total_chapters' => 10,
                'reading_time_minutes' => 600,
                'language' => 'id',
                'tags' => ['kimia', 'organik', 'farmasi', 'industri', 'praktikum'],
            ],
            [
                'title' => 'Psikologi Kepribadian Kontemporer',
                'description' => 'Analisis mendalam tentang teori-teori kepribadian modern, assessment psikologis, dan aplikasinya dalam kehidupan sehari-hari. Cocok untuk mahasiswa psikologi dan praktisi.',
                'cover_image' => 'https://i.pinimg.com/1200x/c0/6f/64/c06f645aaaebbe1e102718c7a2920424.jpg',
                'author_id' => $users->random()->id,
                'category_id' => $categories->where('name', 'Psikologi')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-59-0',
                'publication_date' => '2024-01-25',
                'price' => 85000,
                'discount_percentage' => 10,
                'is_published' => true,
                'is_featured' => false,
                'total_chapters' => 8,
                'reading_time_minutes' => 420,
                'language' => 'id',
                'tags' => ['psikologi', 'kepribadian', 'assessment', 'kontemporer'],
            ],
            [
                'title' => 'Sosiologi Digital Era 4.0',
                'description' => 'Kajian sosiologi dalam era digital yang membahas dampak teknologi terhadap masyarakat, perubahan sosial, dan transformasi digital dalam berbagai aspek kehidupan.',
                'cover_image' => 'https://i.pinimg.com/736x/a8/7b/bd/a87bbd817ea422c315a8885d067d0861.jpg',
                'author_id' => $users->random()->id,
                'category_id' => $categories->where('name', 'Sosiologi')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-60-6',
                'publication_date' => '2024-02-05',
                'price' => 78000,
                'is_published' => true,
                'is_featured' => true,
                'total_chapters' => 9,
                'reading_time_minutes' => 380,
                'language' => 'id',
                'tags' => ['sosiologi', 'digital', 'era 4.0', 'teknologi', 'masyarakat'],
            ],
            [
                'title' => 'Manajemen Strategis Modern',
                'description' => 'Konsep dan praktik manajemen strategis dalam era bisnis modern. Membahas perencanaan strategis, implementasi, evaluasi, dan adaptasi dalam lingkungan bisnis yang dinamis.',
                'cover_image' => 'https://i.pinimg.com/1200x/90/79/8f/90798f1c0b3f2d836954a8f5922c62b0.jpg',
                'author_id' => $users->random()->id,
                'category_id' => $categories->where('name', 'Ekonomi')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-61-7',
                'publication_date' => '2024-03-15',
                'price' => 110000,
                'discount_percentage' => 25,
                'is_published' => true,
                'is_featured' => false,
                'total_chapters' => 14,
                'reading_time_minutes' => 650,
                'language' => 'id',
                'tags' => ['manajemen', 'strategis', 'bisnis', 'perencanaan', 'modern'],
            ],
            [
                'title' => 'Teknik Informatika Fundamental',
                'description' => 'Dasar-dasar teknik informatika meliputi algoritma, struktur data, pemrograman, dan sistem komputer. Ideal untuk mahasiswa baru dan yang ingin memahami fondasi IT.',
                'cover_image' => 'https://i.pinimg.com/736x/00/7f/72/007f72888ea21d93569f12af3018f272.jpg',
                'author_id' => $users->random()->id,
                'category_id' => $categories->where('name', 'Teknik Informatika')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-62-8',
                'publication_date' => '2024-01-30',
                'price' => 125000,
                'is_published' => true,
                'is_featured' => true,
                'total_chapters' => 16,
                'reading_time_minutes' => 800,
                'language' => 'id',
                'tags' => ['informatika', 'algoritma', 'programming', 'fundamental', 'IT'],
            ],
            [
                'title' => 'Rekayasa Perangkat Lunak Agile',
                'description' => 'Metodologi pengembangan perangkat lunak dengan pendekatan Agile. Membahas Scrum, Kanban, DevOps, dan best practices dalam software development modern.',
                'cover_image' => 'https://i.pinimg.com/1200x/88/75/f4/8875f427e39c993f0e18d163f639b85e.jpg',
                'author_id' => $users->random()->id,
                'category_id' => $categories->where('name', 'Teknik Informatika')->first()?->id ?? $categories->first()->id,
                'isbn' => '978-602-1234-63-9',
                'publication_date' => '2024-02-12',
                'price' => 135000,
                'discount_percentage' => 30,
                'is_published' => true,
                'is_featured' => false,
                'total_chapters' => 12,
                'reading_time_minutes' => 560,
                'language' => 'id',
                'tags' => ['software engineering', 'agile', 'scrum', 'devops', 'development'],
            ],
        ];

        foreach ($books as $bookData) {
            $book = Book::create($bookData);

            // Create chapters for each book
            $chapterCount = rand(5, 12);
            for ($j = 1; $j <= $chapterCount; $j++) {
                $chapterContent = $this->generateChapterContent($book->title, $j);
                $chapterTemplate = $this->getChapterTemplate($book->title, $j);

                $readingTime = rand(10, 30); // 10-30 minutes

                Chapter::create([
                    'id' => Str::ulid(),
                    'book_id' => $book->id,
                    'title' => $chapterTemplate['title'],
                    'slug' => Str::slug($chapterTemplate['title']) . '-' . $j,
                    'chapter_number' => $j,
                    'content' => $chapterContent,
                    'excerpt' => Str::limit(strip_tags($chapterContent), 200),
                    'reading_time_minutes' => $readingTime,
                    'is_free' => $j <= 2, // First 2 chapters are free
                    'price' => $j > 2 ? rand(5000, 15000) : 0,
                    'is_published' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $this->command->info("Created book: {$book->title} with {$chapterCount} chapters");
        }
    }

    private function generateChapterTitle($bookTitle, $chapterNumber)
    {
        $titles = [
            'Pengantar dan Konsep Dasar',
            'Teori dan Landasan',
            'Metodologi dan Pendekatan',
            'Analisis dan Pembahasan',
            'Implementasi Praktis',
            'Studi Kasus',
            'Evaluasi dan Penilaian',
            'Pengembangan Lanjutan',
            'Aplikasi dalam Dunia Nyata',
            'Tantangan dan Solusi',
            'Tren dan Perkembangan Terkini',
            'Integrasi dengan Teknologi',
            'Best Practices',
            'Kesimpulan dan Rekomendasi',
            'Masa Depan dan Prospek',
            'Latihan dan Praktikum'
        ];

        return $titles[($chapterNumber - 1) % count($titles)] ?? "Materi Bab {$chapterNumber}";
    }

    private function generateChapterContent($bookTitle, $chapterNumber)
    {
        $contentTemplates = [
            1 => [
                'title' => 'Pengantar dan Konsep Dasar',
                'content' => "Selamat datang di perjalanan pembelajaran yang menarik tentang {subject}. Pada bab ini, kita akan memulai dengan memahami konsep-konsep dasar yang menjadi fondasi dari seluruh materi yang akan dipelajari.\n\n## Tujuan Pembelajaran\n\nSetelah mempelajari bab ini, Anda diharapkan dapat:\n- Memahami definisi dan ruang lingkup {subject}\n- Mengenali komponen-komponen utama dalam bidang ini\n- Mengidentifikasi pentingnya mempelajari {subject}\n- Memahami sejarah dan perkembangan {subject}\n\n## Pengantar\n\n{subject} merupakan bidang ilmu yang sangat penting dalam era modern ini. Dengan perkembangan teknologi dan tuntutan zaman, pemahaman yang mendalam tentang {subject} menjadi semakin krusial.\n\n### Definisi Dasar\n\n{subject} dapat didefinisikan sebagai... [konten akan berlanjut dengan penjelasan mendalam tentang topik tersebut]\n\n### Sejarah Singkat\n\nPerkembangan {subject} dimulai sejak... [timeline historis dan milestone penting]\n\n## Konsep Fundamental\n\nBeberapa konsep fundamental yang perlu dipahami meliputi:\n\n1. **Konsep Pertama**: Penjelasan detail tentang konsep ini\n2. **Konsep Kedua**: Bagaimana konsep ini berkaitan dengan praktik\n3. **Konsep Ketiga**: Aplikasi dalam dunia nyata\n\n## Rangkuman\n\nPada bab ini kita telah mempelajari dasar-dasar {subject} yang akan menjadi foundation untuk pembelajaran selanjutnya."
            ],
            2 => [
                'title' => 'Teori dan Landasan',
                'content' => "Bab ini akan membahas landasan teoretis yang mendukung pemahaman {subject}. Teori-teori yang akan dibahas telah terbukti dan digunakan secara luas dalam praktik.\n\n## Teori Utama\n\n### Teori A\nTeori ini dikembangkan oleh para ahli dan memiliki beberapa karakteristik utama:\n- Prinsip fundamental\n- Asumsi dasar\n- Aplikasi praktis\n\n### Teori B\nMelengkapi teori sebelumnya dengan pendekatan yang berbeda:\n- Metodologi yang unik\n- Keunggulan dan keterbatasan\n- Studi kasus penerapan\n\n## Model Konseptual\n\nModel konseptual membantu dalam memahami hubungan antar komponen dalam {subject}. Model yang akan dibahas meliputi:\n\n1. **Model Linear**: Pendekatan step-by-step\n2. **Model Siklis**: Proses yang berulang dan berkelanjutan\n3. **Model Hierarkis**: Struktur berlapis dengan prioritas\n\n## Implementasi Teori\n\nBagaimana teori-teori ini diterapkan dalam praktik? Mari kita lihat beberapa contoh:\n\n### Contoh Kasus 1\n[Penjelasan detail implementasi]\n\n### Contoh Kasus 2\n[Analisis mendalam tentang penerapan teori]\n\n## Evaluasi dan Kritik\n\nSetiap teori memiliki kelebihan dan kekurangan. Pada bagian ini kita akan menganalisis:\n- Kekuatan teoritis\n- Limitasi dalam praktik\n- Perkembangan dan modifikasi\n\n## Latihan Pemahaman\n\n1. Jelaskan perbedaan antara Teori A dan Teori B\n2. Berikan contoh penerapan model konseptual dalam kehidupan sehari-hari\n3. Analisis kelebihan dan kekurangan masing-masing pendekatan\n\n## Kesimpulan Bab\n\nLandasan teoretis yang kuat sangat penting untuk memahami {subject} secara komprehensif. Teori-teori yang telah dipelajari akan menjadi dasar untuk pembahasan yang lebih advanced di bab-bab selanjutnya."
            ],
            3 => [
                'title' => 'Metodologi dan Pendekatan',
                'content' => "Pada bab ini, kita akan mempelajari berbagai metodologi dan pendekatan yang digunakan dalam {subject}. Pemilihan metodologi yang tepat sangat penting untuk mencapai hasil yang optimal.\n\n## Jenis-jenis Metodologi\n\n### Metodologi Kuantitatif\nPendekatan yang berfokus pada data numerik dan analisis statistik:\n- Karakteristik utama\n- Kelebihan dan kekurangan\n- Kapan menggunakan pendekatan ini\n- Tools dan teknik yang diperlukan\n\n### Metodologi Kualitatif\nPendekatan yang menekankan pada pemahaman mendalam:\n- Prinsip-prinsip dasar\n- Teknik pengumpulan data\n- Analisis dan interpretasi\n- Validitas dan reliabilitas\n\n### Metodologi Campuran\nKombinasi antara pendekatan kuantitatif dan kualitatif:\n- Keunggulan pendekatan mixed-method\n- Strategi integrasi\n- Tantangan dalam implementasi\n\n## Framework Kerja\n\nBeberapa framework yang commonly used dalam {subject}:\n\n### Framework 1: [Nama Framework]\n- Komponen utama\n- Langkah-langkah implementasi\n- Studi kasus penerapan\n- Best practices\n\n### Framework 2: [Nama Framework]\n- Filosofi dan prinsip\n- Metodologi spesifik\n- Metrics dan evaluasi\n- Adaptasi untuk konteks berbeda\n\n## Tools dan Teknologi\n\nDalam era digital ini, berbagai tools mendukung implementasi metodologi:\n\n### Software Tools\n- Tool A: Fitur dan kegunaan\n- Tool B: Kelebihan untuk analisis\n- Tool C: Integration capabilities\n\n### Hardware Requirements\n- Spesifikasi minimum\n- Recommended setup\n- Pertimbangan budget\n\n## Studi Kasus Implementasi\n\n### Kasus 1: Implementasi di Industri\n[Detailed case study dengan analysis]\n\n### Kasus 2: Aplikasi dalam Penelitian\n[Research methodology application]\n\n### Kasus 3: Penerapan dalam Pendidikan\n[Educational context implementation]\n\n## Best Practices\n\nPelajaran dari berbagai implementasi:\n1. Preparation dan planning\n2. Execution dan monitoring\n3. Evaluation dan improvement\n4. Documentation dan knowledge sharing\n\n## Latihan Praktis\n\n1. Pilih metodologi yang tepat untuk scenario yang diberikan\n2. Design framework untuk problem solving\n3. Evaluate kelebihan dan kekurangan setiap pendekatan\n\n## Rangkuman\n\nPemilihan metodologi yang tepat adalah kunci sukses dalam {subject}. Kombinasi antara theoretical understanding dan practical experience akan menghasilkan outcome yang optimal."
            ]
        ];

        // Tentukan subject berdasarkan judul buku
        $subject = $this->getSubjectFromTitle($bookTitle);

        // Pilih template berdasarkan chapter number, atau gunakan template umum
        $template = $contentTemplates[$chapterNumber] ?? $this->getGeneralTemplate($chapterNumber);

        $content = str_replace('{subject}', $subject, $template['content']);

        return $content;
    }

    private function getChapterTemplate($bookTitle, $chapterNumber)
    {
        $generalTemplates = [
            1 => 'Pengantar dan Konsep Dasar',
            2 => 'Teori dan Landasan',
            3 => 'Metodologi dan Pendekatan',
            4 => 'Analisis dan Pembahasan',
            5 => 'Implementasi Praktis',
            6 => 'Studi Kasus dan Aplikasi',
            7 => 'Evaluasi dan Pengukuran',
            8 => 'Tantangan dan Solusi',
            9 => 'Perkembangan Terkini',
            10 => 'Masa Depan dan Tren',
            11 => 'Integrasi dan Sintesis',
            12 => 'Kesimpulan dan Rekomendasi'
        ];

        $title = $generalTemplates[$chapterNumber] ?? "Materi Lanjutan Bab {$chapterNumber}";

        return [
            'title' => "Bab {$chapterNumber}: {$title}"
        ];
    }

    private function getSubjectFromTitle($bookTitle)
    {
        $subjects = [
            'Matematika Dasar untuk Pemula' => 'matematika dasar',
            'Fisika Modern dan Aplikasinya' => 'fisika modern',
            'Kimia Organik Terapan' => 'kimia organik',
            'Psikologi Kepribadian Kontemporer' => 'psikologi kepribadian',
            'Sosiologi Digital Era 4.0' => 'sosiologi digital',
            'Manajemen Strategis Modern' => 'manajemen strategis',
            'Teknik Informatika Fundamental' => 'teknik informatika',
            'Rekayasa Perangkat Lunak Agile' => 'rekayasa perangkat lunak'
        ];

        return $subjects[$bookTitle] ?? 'bidang studi';
    }

    private function getGeneralTemplate($chapterNumber)
    {
        $templates = [
            4 => ['title' => 'Analisis dan Pembahasan', 'content' => "Bab ini membahas analisis mendalam tentang {subject} dengan berbagai pendekatan dan teknik analisis yang relevan.\n\n## Teknik Analisis\n\nBeberapa teknik analisis yang akan dipelajari:\n\n### Analisis Deskriptif\nMemberikan gambaran umum tentang data dan fenomena yang diamati.\n\n### Analisis Komparatif\nMembandingkan berbagai aspek untuk mendapatkan insight yang lebih dalam.\n\n### Analisis Prediktif\nMenggunakan data historis untuk memprediksi tren dan pola di masa depan.\n\n## Studi Kasus\n\nPenerapan teknik analisis dalam konteks nyata melalui beberapa studi kasus yang relevan.\n\n## Tools dan Software\n\nBerbagai tools yang dapat digunakan untuk mendukung proses analisis.\n\n## Interpretasi Hasil\n\nBagaimana menginterpretasikan hasil analisis dengan benar dan objektif.\n\n## Kesimpulan\n\nAnalisis yang tepat memberikan foundation yang kuat untuk pengambilan keputusan."],

            5 => ['title' => 'Implementasi Praktis', 'content' => "Bab ini fokus pada implementasi praktis dari konsep-konsep {subject} yang telah dipelajari di bab-bab sebelumnya.\n\n## Langkah-langkah Implementasi\n\n### Tahap Persiapan\n- Planning dan resource allocation\n- Risk assessment dan mitigation\n- Timeline dan milestone\n\n### Tahap Eksekusi\n- Step-by-step implementation\n- Monitoring dan quality control\n- Problem solving dan adaptasi\n\n### Tahap Evaluasi\n- Performance measurement\n- Feedback collection\n- Continuous improvement\n\n## Tantangan Umum\n\nBerbagai tantangan yang sering dihadapi dalam implementasi dan cara mengatasinya.\n\n## Success Factors\n\nFaktor-faktor yang menentukan keberhasilan implementasi.\n\n## Studi Kasus Implementasi\n\nContoh-contoh real-world implementation dengan analysis mendalam.\n\n## Best Practices\n\nPraktik terbaik yang telah terbukti efektif dalam berbagai konteks.\n\n## Troubleshooting\n\nPanduan mengatasi masalah yang umum terjadi selama implementasi."],

            // Template default untuk chapter lainnya
            'default' => ['title' => "Materi Bab {chapter}", 'content' => "Pada bab ini, kita akan mempelajari aspek-aspek penting dari {subject} yang relevan dengan topik pembahasan.\n\n## Pendahuluan\n\nMateri pada bab ini merupakan kelanjutan dari pembelajaran sebelumnya dan akan membahas topik-topik advanced yang penting untuk dipahami.\n\n## Konsep Utama\n\nBeberapa konsep utama yang akan dibahas meliputi:\n- Konsep A dengan penjelasan detail\n- Konsep B dengan contoh aplikasi\n- Konsep C dengan studi kasus\n\n## Pembahasan Mendalam\n\nAnalisis komprehensif tentang setiap aspek dari materi yang dibahas.\n\n## Aplikasi Praktis\n\nBagaimana menerapkan konsep-konsep yang telah dipelajari dalam situasi nyata.\n\n## Latihan dan Evaluasi\n\nSoal-soal latihan untuk menguji pemahaman dan kemampuan aplikasi.\n\n## Rangkuman\n\nRingkasan materi penting yang telah dipelajari pada bab ini."]
        ];

        $template = $templates[$chapterNumber] ?? $templates['default'];
        if ($template['title'] === "Materi Bab {chapter}") {
            $template['title'] = str_replace('{chapter}', $chapterNumber, $template['title']);
        }

        return $template;
    }
}
