<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Book;
use App\Models\Chapter;

class ChapterContentSeeder extends Seeder
{
    public function run()
    {
        // Delete existing chapters using delete instead of truncate to handle foreign keys
        Chapter::query()->delete();

        $books = Book::all();

        foreach ($books as $book) {
            $chapterCount = rand(8, 12);

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

            // Update book with chapter count
            $book->update(['total_chapters' => $chapterCount]);

            $this->command->info("Created {$chapterCount} chapters for book: {$book->title}");
        }
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

    private function generateChapterContent($bookTitle, $chapterNumber)
    {
        $contentTemplates = [
            1 => [
                'title' => 'Pengantar dan Konsep Dasar',
                'content' => "Selamat datang di perjalanan pembelajaran yang menarik tentang {subject}. Pada bab ini, kita akan memulai dengan memahami konsep-konsep dasar yang menjadi fondasi dari seluruh materi yang akan dipelajari.\n\n## Tujuan Pembelajaran\n\nSetelah mempelajari bab ini, Anda diharapkan dapat:\n- Memahami definisi dan ruang lingkup {subject}\n- Mengenali komponen-komponen utama dalam bidang ini\n- Mengidentifikasi pentingnya mempelajari {subject}\n- Memahami sejarah dan perkembangan {subject}\n\n## Pengantar\n\n{subject} merupakan bidang ilmu yang sangat penting dalam era modern ini. Dengan perkembangan teknologi dan tuntutan zaman, pemahaman yang mendalam tentang {subject} menjadi semakin krusial.\n\n### Definisi Dasar\n\n{subject} dapat didefinisikan sebagai bidang studi yang mengkaji berbagai aspek teoretis dan praktis dalam domain tertentu. Pemahaman yang mendalam tentang {subject} memerlukan pendekatan yang sistematis dan komprehensif.\n\n### Sejarah Singkat\n\nPerkembangan {subject} dimulai sejak beberapa dekade yang lalu ketika para ahli mulai menyadari pentingnya pendekatan yang lebih terstruktur. Timeline historis menunjukkan berbagai milestone penting yang membentuk disiplin ilmu ini.\n\n## Konsep Fundamental\n\nBeberapa konsep fundamental yang perlu dipahami meliputi:\n\n1. **Konsep Dasar Pertama**: Merupakan foundation utama yang harus dikuasai sebelum melanjutkan ke materi yang lebih advanced. Konsep ini mencakup prinsip-prinsip dasar dan aplikasinya dalam konteks nyata.\n\n2. **Konsep Dasar Kedua**: Melengkapi pemahaman dari konsep pertama dengan memberikan perspektif yang berbeda. Konsep ini penting untuk membangun pemahaman yang holistik.\n\n3. **Konsep Dasar Ketiga**: Mengintegrasikan kedua konsep sebelumnya dan memberikan framework untuk aplikasi praktis dalam berbagai situasi.\n\n## Prinsip-Prinsip Utama\n\nDalam mempelajari {subject}, terdapat beberapa prinsip utama yang harus selalu diingat:\n\n### Prinsip Kesistematisan\nSetiap pendekatan harus dilakukan secara sistematis dan terstruktur untuk memastikan hasil yang optimal.\n\n### Prinsip Kontinuitas\nPembelajaran dan implementasi harus dilakukan secara berkelanjutan untuk mencapai pemahaman yang mendalam.\n\n### Prinsip Adaptabilitas\nKemampuan untuk beradaptasi dengan berbagai situasi dan konteks merupakan kunci keberhasilan dalam {subject}.\n\n## Aplikasi dalam Kehidupan Sehari-hari\n\nKonsep-konsep {subject} dapat diterapkan dalam berbagai aspek kehidupan sehari-hari. Beberapa contoh aplikasi meliputi:\n\n- Pengambilan keputusan yang lebih baik\n- Pemecahan masalah yang lebih efektif\n- Peningkatan produktivitas dan efisiensi\n- Komunikasi yang lebih baik dengan orang lain\n\n## Latihan Pemahaman\n\nUntuk memastikan pemahaman yang baik tentang materi pada bab ini, coba jawab pertanyaan-pertanyaan berikut:\n\n1. Jelaskan dengan kata-kata sendiri apa yang dimaksud dengan {subject}\n2. Sebutkan tiga konsep fundamental dan berikan contoh aplikasinya\n3. Bagaimana prinsip-prinsip utama dapat diterapkan dalam situasi konkret?\n4. Identifikasi area dalam kehidupan Anda yang dapat diimprove dengan menerapkan konsep {subject}\n\n## Rangkuman\n\nPada bab ini kita telah mempelajari dasar-dasar {subject} yang akan menjadi foundation untuk pembelajaran selanjutnya. Pemahaman yang solid tentang konsep-konsep dasar ini sangat penting untuk dapat mengikuti materi yang lebih advanced di bab-bab berikutnya.\n\nPastikan Anda telah memahami dengan baik semua konsep yang telah dibahas sebelum melanjutkan ke bab selanjutnya. Jika ada bagian yang belum jelas, jangan ragu untuk mengulang kembali atau mencari referensi tambahan."
            ],
            2 => [
                'title' => 'Teori dan Landasan',
                'content' => "Bab ini akan membahas landasan teoretis yang mendukung pemahaman {subject}. Teori-teori yang akan dibahas telah terbukti dan digunakan secara luas dalam praktik profesional.\n\n## Pendahuluan Teoritis\n\nSetelah memahami konsep dasar pada bab sebelumnya, sekarang kita akan mendalami aspek teoretis yang menjadi backbone dari {subject}. Teori-teori ini dikembangkan berdasarkan research ekstensif dan pengalaman praktis dari para ahli.\n\n## Teori Utama\n\n### Teori Klasik\nTeori klasik dalam {subject} dikembangkan oleh para pionir dan memiliki beberapa karakteristik utama:\n\n- **Prinsip Fundamental**: Basis yang tidak dapat diganggu gugat\n- **Asumsi Dasar**: Kondisi-kondisi yang dianggap benar\n- **Aplikasi Praktis**: Bagaimana teori diterapkan dalam real world\n- **Validasi Empiris**: Bukti-bukti yang mendukung teori\n\n### Teori Modern\nMelengkapi teori klasik dengan pendekatan yang lebih kontemporer:\n\n- **Metodologi Inovatif**: Pendekatan baru yang lebih efektif\n- **Teknologi Integration**: Penggunaan teknologi modern\n- **Global Perspective**: Pandangan yang lebih luas dan inklusif\n- **Sustainability Focus**: Perhatian pada keberlanjutan jangka panjang\n\n### Teori Integratif\nMenggabungkan berbagai pendekatan untuk solusi yang komprehensif:\n\n- **Multi-disciplinary Approach**: Mengintegrasikan berbagai disiplin ilmu\n- **Holistic View**: Melihat masalah secara menyeluruh\n- **Systems Thinking**: Memahami interkoneksi antar komponen\n- **Adaptive Framework**: Kemampuan untuk menyesuaikan dengan perubahan\n\n## Model Konseptual\n\nModel konseptual membantu dalam memahami hubungan antar komponen dalam {subject}:\n\n### Model Linear\nPendekatan step-by-step yang mengikuti sequence tertentu:\n\n1. **Input Phase**: Mengidentifikasi semua input yang diperlukan\n2. **Process Phase**: Memproses input menjadi output\n3. **Output Phase**: Menghasilkan hasil yang diinginkan\n4. **Feedback Phase**: Evaluasi dan improvement\n\n### Model Siklis\nProses yang berulang dan berkelanjutan untuk improvement terus-menerus:\n\n- **Planning**: Perencanaan yang matang\n- **Implementation**: Eksekusi sesuai rencana\n- **Evaluation**: Penilaian hasil\n- **Adjustment**: Penyesuaian berdasarkan evaluasi\n\n### Model Hierarkis\nStruktur berlapis dengan prioritas dan dependencies:\n\n- **Strategic Level**: Visi dan direction jangka panjang\n- **Tactical Level**: Rencana dan strategies jangka menengah\n- **Operational Level**: Implementasi harian dan detil\n\n## Framework Teoretis\n\n### Framework A: Comprehensive Analysis\nFramework ini menyediakan struktur untuk analisis yang mendalam:\n\n- **Context Analysis**: Memahami environment dan kondisi\n- **Stakeholder Mapping**: Identifikasi semua pihak yang terlibat\n- **Impact Assessment**: Evaluasi dampak dari berbagai alternatif\n- **Risk Management**: Identifikasi dan mitigation risiko\n\n### Framework B: Implementation Guide\nPanduan praktis untuk implementasi yang efektif:\n\n- **Resource Planning**: Alokasi sumber daya yang optimal\n- **Timeline Management**: Penjadwalan yang realistis\n- **Quality Control**: Memastikan standar kualitas\n- **Change Management**: Mengelola perubahan dengan baik\n\n## Implementasi Teori\n\nBagaimana teori-teori ini diterapkan dalam praktik? Mari kita lihat beberapa contoh:\n\n### Contoh Implementasi 1: Sektor Pendidikan\nPenerapan teori {subject} dalam konteks pendidikan menunjukkan hasil yang signifikan:\n\n- Improvement dalam learning outcomes\n- Efficiency dalam resource utilization\n- Better engagement dari students\n- Enhanced satisfaction dari educators\n\n### Contoh Implementasi 2: Sektor Bisnis\nDalam dunia bisnis, teori {subject} terbukti memberikan competitive advantage:\n\n- Increased productivity dan profitability\n- Better customer satisfaction\n- Improved employee engagement\n- Enhanced innovation capabilities\n\n### Contoh Implementasi 3: Sektor Publik\nImplementasi di sektor publik menunjukkan improvement dalam service delivery:\n\n- Better public service quality\n- Increased transparency\n- Enhanced accountability\n- Improved citizen satisfaction\n\n## Evaluasi dan Kritik\n\nSetiap teori memiliki kelebihan dan kekurangan. Analisis kritis diperlukan untuk:\n\n### Kekuatan Teoritis\n- Scientific rigor dalam development\n- Empirical evidence yang kuat\n- Practical applicability yang terbukti\n- Flexibility untuk berbagai konteks\n\n### Limitasi dalam Praktik\n- Complexity dalam implementation\n- Resource requirements yang tinggi\n- Cultural barriers yang mungkin ada\n- Time constraints dalam real world\n\n### Perkembangan dan Modifikasi\n- Continuous research dan development\n- Adaptation untuk new challenges\n- Integration dengan emerging technologies\n- Enhancement berdasarkan best practices\n\n## Tren dan Perkembangan Terkini\n\n### Digital Transformation\nBagaimana teknologi digital mengubah landscape {subject}:\n\n- Automation dan AI integration\n- Data-driven decision making\n- Real-time monitoring dan analytics\n- Digital collaboration tools\n\n### Sustainability Focus\nPeningkatan perhatian pada aspek sustainability:\n\n- Environmental considerations\n- Social responsibility\n- Economic viability jangka panjang\n- Stakeholder value creation\n\n## Studi Kasus Mendalam\n\n### Kasus A: Transformation Success Story\n[Detailed analysis of successful implementation]\n\n### Kasus B: Lessons from Challenges\n[Learning from difficulties and setbacks]\n\n### Kasus C: Innovation in Application\n[Creative approaches to theory application]\n\n## Latihan dan Evaluasi\n\n1. Bandingkan dan kontraskan teori klasik dengan teori modern dalam {subject}\n2. Pilih satu model konseptual dan jelaskan bagaimana mengaplikasikannya dalam konteks spesifik\n3. Identifikasi potential challenges dalam implementasi dan propose solutions\n4. Analisis kritis terhadap salah satu framework yang telah dibahas\n5. Design implementation plan menggunakan prinsip-prinsip teoretis yang telah dipelajari\n\n## Kesimpulan Bab\n\nLandasan teoretis yang kuat sangat penting untuk memahami {subject} secara komprehensif. Teori-teori yang telah dipelajari akan menjadi dasar untuk pembahasan yang lebih advanced di bab-bab selanjutnya. Pemahaman yang mendalam tentang aspek teoretis akan membantu dalam aplikasi praktis yang lebih efektif."
            ]
        ];

        // Tentukan subject berdasarkan judul buku
        $subject = $this->getSubjectFromTitle($bookTitle);

        // Pilih template berdasarkan chapter number, atau gunakan template umum
        $template = $contentTemplates[$chapterNumber] ?? $this->getGeneralTemplate($chapterNumber);

        $content = str_replace('{subject}', $subject, $template['content']);

        return $content;
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
            3 => [
                'title' => 'Metodologi dan Pendekatan',
                'content' => "Pada bab ini, kita akan mempelajari berbagai metodologi dan pendekatan yang digunakan dalam {subject}. Pemilihan metodologi yang tepat sangat penting untuk mencapai hasil yang optimal.\n\n## Jenis-jenis Metodologi\n\n### Metodologi Kuantitatif\nPendekatan yang berfokus pada data numerik dan analisis statistik dengan karakteristik:\n- Statistical rigor dalam analysis\n- Measurable outcomes dan metrics\n- Objective evaluation criteria\n- Reproducible results\n\n### Metodologi Kualitatif\nPendekatan yang menekankan pada pemahaman mendalam dengan fokus pada:\n- In-depth understanding\n- Contextual analysis\n- Subjective interpretation\n- Rich descriptive data\n\n### Metodologi Campuran\nKombinasi yang mengintegrasikan kedua pendekatan untuk:\n- Comprehensive understanding\n- Triangulation of data\n- Enhanced validity\n- Holistic perspective\n\n## Framework dan Tools\n\nBerbagai framework dan tools yang mendukung implementasi metodologi dalam {subject}.\n\n## Implementasi Praktis\n\nPanduan step-by-step untuk mengimplementasikan metodologi yang telah dipelajari.\n\n## Studi Kasus\n\nContoh-contoh nyata penerapan metodologi dalam berbagai konteks dan situasi.\n\n## Best Practices\n\nPraktik terbaik yang telah terbukti efektif dalam penerapan metodologi {subject}."
            ],
            4 => [
                'title' => 'Analisis dan Pembahasan',
                'content' => "Bab ini membahas analisis mendalam tentang {subject} dengan berbagai pendekatan dan teknik analisis yang relevan.\n\n## Teknik Analisis\n\n### Analisis Deskriptif\nMemberikan gambaran comprehensive tentang data dan fenomena yang diamati.\n\n### Analisis Komparatif\nMembandingkan berbagai aspek untuk mendapatkan insight yang lebih dalam.\n\n### Analisis Prediktif\nMenggunakan data dan patterns untuk memprediksi trends masa depan.\n\n## Tools dan Metodologi\n\nBerbagai tools analisis yang dapat digunakan dalam {subject}.\n\n## Interpretasi Results\n\nBagaimana menginterpretasikan hasil analisis dengan benar dan objektif.\n\n## Case Studies\n\nPenerapan teknik analisis dalam konteks real-world scenarios."
            ],
            5 => [
                'title' => 'Implementasi Praktis',
                'content' => "Bab ini fokus pada implementasi praktis dari konsep-konsep {subject} yang telah dipelajari.\n\n## Planning dan Preparation\n\n### Resource Assessment\nIdentifikasi dan alokasi resources yang diperlukan untuk implementasi.\n\n### Risk Management\nIdentifikasi potential risks dan development mitigation strategies.\n\n### Timeline Development\nPembuatan timeline yang realistic dan achievable.\n\n## Execution Strategies\n\n### Phase-by-Phase Implementation\nPendekatan bertahap untuk memastikan success dan minimize risks.\n\n### Quality Control\nSistem monitoring dan control untuk maintain standards.\n\n### Team Coordination\nStrategies untuk effective team collaboration.\n\n## Success Factors\n\nFaktor-faktor critical yang menentukan keberhasilan implementasi.\n\n## Troubleshooting\n\nPanduan untuk mengatasi common challenges dalam implementasi."
            ],
            'default' => [
                'title' => "Advanced Topics in {subject}",
                'content' => "Bab ini membahas topik-topik advanced dalam {subject} yang memerlukan pemahaman mendalam.\n\n## Core Concepts\n\nKonsep-konsep inti yang perlu dikuasai untuk memahami materi advanced.\n\n## Advanced Techniques\n\nTeknik-teknik sophisticated yang digunakan oleh practitioners expert.\n\n## Current Trends\n\nPerkembangan terkini dan emerging trends dalam field {subject}.\n\n## Future Directions\n\nVisi dan predictions untuk future development dalam {subject}.\n\n## Practical Applications\n\nBagaimana menerapkan advanced concepts dalam real-world situations.\n\n## Research Opportunities\n\nArea-area research yang menarik untuk future exploration."
            ]
        ];

        $template = $templates[$chapterNumber] ?? $templates['default'];

        return $template;
    }
}
