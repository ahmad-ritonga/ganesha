-- Ganesha Database Export
-- Generated: 2025-08-20 16:27:43

SET FOREIGN_KEY_CHECKS=0;

-- Table: author_submissions
DROP TABLE IF EXISTS `author_submissions`;
CREATE TABLE `author_submissions` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submission_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `transaction_id` char(26) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_book_id` char(26) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `submitted_at` timestamp NOT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` char(26) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author_submissions_transaction_id_foreign` (`transaction_id`),
  KEY `author_submissions_created_book_id_foreign` (`created_book_id`),
  KEY `author_submissions_reviewed_by_foreign` (`reviewed_by`),
  KEY `author_submissions_user_id_status_index` (`user_id`,`status`),
  KEY `author_submissions_submission_type_index` (`submission_type`),
  KEY `author_submissions_status_index` (`status`),
  CONSTRAINT `author_submissions_created_book_id_foreign` FOREIGN KEY (`created_book_id`) REFERENCES `books` (`id`) ON DELETE SET NULL,
  CONSTRAINT `author_submissions_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `author_submissions_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `author_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: author_subscription_plans
DROP TABLE IF EXISTS `author_subscription_plans`;
CREATE TABLE `author_subscription_plans` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `max_submissions` int NOT NULL,
  `features` json NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `author_subscription_plans_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for author_subscription_plans
INSERT INTO `author_subscription_plans` (`id`, `name`, `slug`, `description`, `price`, `max_submissions`, `features`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('01k344qzwjw55x0vxdy8c0sjrr', 'Reguler', 'reguler', 'Paket ideal untuk penulis pemula yang ingin memulai publikasi buku mereka.', '750000.00', '3', '[\"3 buku cetak\", \"Softfile digital\", \"Layout profesional\", \"Cover design\", \"ISBN gratis\"]', '1', '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `author_subscription_plans` (`id`, `name`, `slug`, `description`, `price`, `max_submissions`, `features`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('01k344qzwkpawtge3qyv1mx1y6', 'Silver', 'silver', 'Paket terbaik untuk penulis yang ingin publikasi dengan fitur marketing support.', '1000000.00', '5', '[\"5 buku cetak\", \"Softfile digital\", \"Layout profesional\", \"Cover design premium\", \"ISBN gratis\", \"Marketing support\"]', '1', '2', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `author_subscription_plans` (`id`, `name`, `slug`, `description`, `price`, `max_submissions`, `features`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('01k344qzwm5rgm23qb3pyyhjdh', 'Gold', 'gold', 'Paket premium dengan fitur Google Scholar dan marketing campaign yang lengkap.', '2000000.00', '7', '[\"7 buku cetak\", \"Softfile digital\", \"Layout premium\", \"Cover design eksklusif\", \"ISBN gratis\", \"Google Scholar\", \"Marketing campaign\"]', '1', '3', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `author_subscription_plans` (`id`, `name`, `slug`, `description`, `price`, `max_submissions`, `features`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('01k344qzwnbsarjb0ax3prkfjw', 'Platinum', 'platinum', 'Paket enterprise dengan fitur terlengkap dan priority support untuk penulis profesional.', '3000000.00', '10', '[\"10 buku cetak\", \"Softfile digital\", \"Layout premium+\", \"Cover design eksklusif\", \"ISBN gratis\", \"Google Scholar\", \"Full marketing\", \"Priority support\"]', '1', '4', '2025-08-20 16:24:40', '2025-08-20 16:24:40');

-- Table: books
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isbn` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publication_date` date DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_percentage` int NOT NULL DEFAULT '0',
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `total_chapters` int NOT NULL DEFAULT '0',
  `reading_time_minutes` int NOT NULL DEFAULT '0',
  `language` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'id',
  `tags` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `books_slug_unique` (`slug`),
  UNIQUE KEY `books_isbn_unique` (`isbn`),
  KEY `books_is_published_is_featured_index` (`is_published`,`is_featured`),
  KEY `books_category_id_is_published_index` (`category_id`,`is_published`),
  KEY `books_author_id_is_published_index` (`author_id`,`is_published`),
  CONSTRAINT `books_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `books_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cache
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cache_locks
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qztte5b9j92353kw10g2', 'Matematika', 'eksakta', 'Aljabar, Kalkulus, Geometri, Statistika, Matematika Diskret, dan cabang matematika lainnya', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qztzkvavxs36v6gsg1rt', 'Fisika', 'eksakta', 'Mekanika, Termodinamika, Elektromagnetisme, Fisika Modern, Fisika Kuantum', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv0s7b5etgc5sx2msrb', 'Kimia', 'eksakta', 'Kimia Organik, Anorganik, Analitik, Fisikokimia, dan Biokimia', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv1qdhfdj2pxj3zpgdf', 'Biologi', 'eksakta', 'Botanik, Zoologi, Mikrobiologi, Genetika, Ekologi, dan Evolusi', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv36xxgnccfw1b0depg', 'Astronomi', 'eksakta', 'Astrofisika, Kosmologi, Sistem Tata Surya, dan Eksplorasi Ruang Angkasa', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv4kryk0x1tvak912bc', 'Geologi', 'eksakta', 'Mineralogi, Petrologi, Stratigrafi, dan Geofisika', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv550twjaw3rrp3b7zm', 'Ilmu Komputer', 'eksakta', 'Algoritma, Struktur Data, Teori Komputasi, dan Pemrograman Teoritis', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv6ppbd7tjkac3dydcb', 'Statistika', 'eksakta', 'Statistika Deskriptif, Inferensial, Analisis Data, dan Probabilitas', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv8fb9y33hq0qxw3k3x', 'Sosiologi', 'soshum', 'Struktur Sosial, Perubahan Sosial, Masyarakat, dan Interaksi Sosial', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzv90zw82671ypg7g88s', 'Antropologi', 'soshum', 'Budaya, Etnografi, Arkeologi, dan Antropologi Fisik', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvaht5d90kshf4z95h5', 'Psikologi', 'soshum', 'Psikologi Kognitif, Sosial, Klinis, Perkembangan, dan Eksperimental', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvcxfgaf52m5m8jtzk5', 'Ilmu Politik', 'soshum', 'Teori Politik, Hubungan Internasional, Kebijakan Publik, dan Pemerintahan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvdgmsare2f1vsh14bx', 'Ekonomi', 'soshum', 'Mikroekonomi, Makroekonomi, Ekonomi Pembangunan, dan Ekonomi Internasional', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvecxgpj02csncezfvt', 'Hukum', 'soshum', 'Hukum Pidana, Perdata, Tata Negara, Internasional, dan Hukum Bisnis', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvgemvryrpzf16wyt3e', 'Sejarah', 'soshum', 'Sejarah Dunia, Indonesia, Kuno, Modern, dan Historiografi', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvhdcsj9fw79ssw6b5e', 'Filsafat', 'soshum', 'Metafisika, Epistemologi, Etika, Logika, dan Filsafat Ilmu', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvjbw3pvwsh474mksdz', 'Sastra dan Bahasa', 'soshum', 'Linguistik, Sastra Indonesia, Sastra Dunia, dan Kajian Bahasa', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvkvdws559wm01jyczb', 'Seni dan Budaya', 'soshum', 'Seni Rupa, Musik, Teater, Tari, dan Studi Budaya', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvm9r0vng0wzmmwjrjk', 'Komunikasi', 'soshum', 'Jurnalistik, Public Relations, Media Digital, dan Komunikasi Massa', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvpt98ykfxty7g420fm', 'Kedokteran', 'terapan', 'Anatomi, Fisiologi, Patologi, Farmakologi, dan Ilmu Kedokteran Klinis', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvq6fddmqxyjdvkpyy0', 'Kesehatan Masyarakat', 'terapan', 'Epidemiologi, Biostatistik, Kesehatan Lingkungan, dan Promosi Kesehatan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvrsdx0f9yr8fbzv8db', 'Keperawatan', 'terapan', 'Keperawatan Dasar, Klinis, Komunitas, dan Manajemen Keperawatan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvt71p6pc37tw89w9f6', 'Farmasi', 'terapan', 'Farmakologi, Farmasetika, Kimia Farmasi, dan Farmasi Klinis', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvv5kxaq9kjk4z8nrhp', 'Teknik Sipil', 'terapan', 'Struktur, Geoteknik, Transportasi, dan Manajemen Konstruksi', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvw22yw90077z78ntg2', 'Teknik Mesin', 'terapan', 'Termodinamika, Mekanika Fluida, Material, dan Manufaktur', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvxdgzjbztpqkkpv5ds', 'Teknik Elektro', 'terapan', 'Elektronika, Sistem Tenaga, Telekomunikasi, dan Kontrol', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzvyhjhvhkwxcm14njnm', 'Teknik Informatika', 'terapan', 'Pemrograman, Database, Jaringan, dan Pengembangan Software', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw08wvfc9a7b1jkdp3z', 'Arsitektur', 'terapan', 'Desain Arsitektur, Perencanaan Kota, dan Teknologi Bangunan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw1kq65h3aafna25n1b', 'Pertanian', 'terapan', 'Agronomi, Horticultura, Ilmu Tanah, dan Teknologi Pertanian', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw2rnenjd3yyth00brm', 'Peternakan', 'terapan', 'Nutrisi Ternak, Reproduksi, Genetika Ternak, dan Manajemen Peternakan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw32dckhp2kab8206n4', 'Teknologi Pangan', 'terapan', 'Pengolahan Pangan, Keamanan Pangan, dan Nutrisi', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw4rk1w09tg2xv6xzpf', 'Ilmu Lingkungan', 'interdisipliner', 'Ekologi, Konservasi, Perubahan Iklim, dan Pembangunan Berkelanjutan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw5det0zbd20ybkkq3v', 'Bioteknologi', 'interdisipliner', 'Rekayasa Genetika, Fermentasi, Biomedis, dan Bioindustri', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw72xtbmc8g9g3hsvep', 'Data Science', 'interdisipliner', 'Machine Learning, Big Data, Analytics, dan Artificial Intelligence', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzw8wjq6ysmmwfngzwjd', 'Ilmu Kesehatan Global', 'interdisipliner', 'Kesehatan Internasional, Epidemi Global, dan Sistem Kesehatan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzwas2szswanc24y71g5', 'Mitigasi Bencana', 'interdisipliner', 'Manajemen Risiko, Kesiapsiagaan, dan Tanggap Darurat', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzwbdnhx4631478wz6ss', 'Artificial Intelligence', 'interdisipliner', 'Machine Learning, Deep Learning, Natural Language Processing, Computer Vision', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzwcgkmvjk5bk9gzpgbr', 'Cybersecurity', 'interdisipliner', 'Keamanan Informasi, Kriptografi, Forensik Digital, dan Ethical Hacking', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `is_active`, `created_at`, `updated_at`) VALUES ('01k344qzwebbqg0b88zsdpycb0', 'Renewable Energy', 'interdisipliner', 'Energi Surya, Angin, Biomassa, dan Teknologi Energi Berkelanjutan', NULL, '1', '2025-08-20 16:24:40', '2025-08-20 16:24:40');

-- Table: chapter_media
DROP TABLE IF EXISTS `chapter_media`;
CREATE TABLE `chapter_media` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('image','video','audio','document') COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int DEFAULT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caption` text COLLATE utf8mb4_unicode_ci,
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chapter_media_chapter_id_type_index` (`chapter_id`,`type`),
  KEY `chapter_media_chapter_id_order_index_index` (`chapter_id`,`order_index`),
  CONSTRAINT `chapter_media_chapter_id_foreign` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: chapters
DROP TABLE IF EXISTS `chapters`;
CREATE TABLE `chapters` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `book_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter_number` int NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `is_free` tinyint(1) NOT NULL DEFAULT '0',
  `price` decimal(8,2) NOT NULL DEFAULT '0.00',
  `reading_time_minutes` int NOT NULL DEFAULT '0',
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_book_chapter` (`book_id`,`chapter_number`),
  UNIQUE KEY `unique_book_slug` (`book_id`,`slug`),
  KEY `chapters_book_id_is_published_index` (`book_id`,`is_published`),
  KEY `chapters_book_id_chapter_number_index` (`book_id`,`chapter_number`),
  KEY `chapters_is_free_is_published_index` (`is_free`,`is_published`),
  CONSTRAINT `chapters_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: failed_jobs
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: job_batches
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: jobs
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: migrations
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for migrations
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('4', '2025_08_16_020959_create_categories_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('5', '2025_08_16_023334_create_books_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('6', '2025_08_16_060515_create_chapters_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('7', '2025_08_18_064501_create_chapter_media_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('8', '2025_08_18_070605_create_transactions_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('9', '2025_08_18_070609_create_transaction_items_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('10', '2025_08_18_070612_create_user_purchases_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('11', '2025_08_18_074940_create_reading_progress_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('12', '2025_08_18_074944_create_reviews_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('13', '2025_08_18_233922_create_author_submissions_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('14', '2025_08_18_233957_create_author_subscription_plans_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('15', '2025_08_18_234034_create_user_author_subscriptions_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('16', '2025_08_19_005731_add_author_subscription_to_transaction_items_item_type', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('17', '2025_08_19_005907_increase_price_column_size_in_transaction_items', '1');

-- Table: password_reset_tokens
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reading_progress
DROP TABLE IF EXISTS `reading_progress`;
CREATE TABLE `reading_progress` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress_percentage` int NOT NULL DEFAULT '0',
  `last_position` text COLLATE utf8mb4_unicode_ci,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_chapter` (`user_id`,`chapter_id`),
  KEY `reading_progress_user_id_progress_percentage_index` (`user_id`,`progress_percentage`),
  KEY `reading_progress_chapter_id_progress_percentage_index` (`chapter_id`,`progress_percentage`),
  CONSTRAINT `reading_progress_chapter_id_foreign` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reading_progress_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reviews
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `book_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `review_text` text COLLATE utf8mb4_unicode_ci,
  `is_approved` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_book_review` (`user_id`,`book_id`),
  KEY `reviews_book_id_is_approved_rating_index` (`book_id`,`is_approved`,`rating`),
  KEY `reviews_user_id_is_approved_index` (`user_id`,`is_approved`),
  KEY `reviews_rating_is_approved_index` (`rating`,`is_approved`),
  CONSTRAINT `reviews_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: transaction_items
DROP TABLE IF EXISTS `transaction_items`;
CREATE TABLE `transaction_items` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_type` enum('book','chapter','author_subscription') COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `transaction_items_transaction_id_item_type_index` (`transaction_id`,`item_type`),
  KEY `transaction_items_item_type_item_id_index` (`item_type`,`item_id`),
  CONSTRAINT `transaction_items_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: transactions
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('book_purchase','chapter_purchase') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `midtrans_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtrans_transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `expired_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transactions_transaction_code_unique` (`transaction_code`),
  UNIQUE KEY `transactions_midtrans_order_id_unique` (`midtrans_order_id`),
  KEY `transactions_user_id_payment_status_index` (`user_id`,`payment_status`),
  KEY `transactions_payment_status_created_at_index` (`payment_status`,`created_at`),
  KEY `transactions_transaction_code_index` (`transaction_code`),
  CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: user_author_subscriptions
DROP TABLE IF EXISTS `user_author_subscriptions`;
CREATE TABLE `user_author_subscriptions` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submissions_used` int NOT NULL DEFAULT '0',
  `starts_at` timestamp NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_author_subscriptions_plan_id_foreign` (`plan_id`),
  KEY `user_author_subscriptions_transaction_id_foreign` (`transaction_id`),
  KEY `user_author_subscriptions_user_id_status_index` (`user_id`,`status`),
  KEY `user_author_subscriptions_status_index` (`status`),
  CONSTRAINT `user_author_subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `author_subscription_plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_author_subscriptions_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_author_subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: user_purchases
DROP TABLE IF EXISTS `user_purchases`;
CREATE TABLE `user_purchases` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchasable_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchasable_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchased_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_purchase` (`user_id`,`purchasable_type`,`purchasable_id`),
  KEY `user_purchases_transaction_id_foreign` (`transaction_id`),
  KEY `user_purchases_user_id_purchasable_type_index` (`user_id`,`purchasable_type`),
  KEY `user_purchases_purchasable_type_purchasable_id_index` (`purchasable_type`,`purchasable_id`),
  CONSTRAINT `user_purchases_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_purchases_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for users
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `avatar`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('01k344qzcrva49nstk8ec0ss5p', 'Administrator', 'admin@example.com', '+62812345678', NULL, '2025-08-20 16:24:39', '$2y$12$99UcQtXf/0TrTRYfwydhJ.pN8dMHYbRZmmLziukSjzMJ5jlgg25/W', 'admin', NULL, '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `avatar`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('01k344qzkrf849fkavsr4r0545', 'Regular User', 'user@example.com', '+62812345679', NULL, '2025-08-20 16:24:40', '$2y$12$4oDliKIqBHYwSqhEyfPy3.NtaKaT.n8nkZDYcokaRRnH2EI9TZ8lG', 'user', NULL, '2025-08-20 16:24:40', '2025-08-20 16:24:40');
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `avatar`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('01k344qztkrmy8ytacfxkgny1a', 'Ahmad Rian', 'ahmad.ritonga@mhs.unsoed.ac.id', '082123479638', NULL, '2025-08-20 16:24:40', '$2y$12$BXY80ljTnIlRXdBm./.vKuPSh8c2S39n5B09LV/4Rj9HQCUxdkrJe', 'user', NULL, '2025-08-20 16:24:40', '2025-08-20 16:24:40');

SET FOREIGN_KEY_CHECKS=1;