<?php

namespace Database\Seeders;

use App\Models\AuthorSubscriptionPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Regular',
                'slug' => 'regular',
                'description' => 'Paket ideal untuk penulis pemula yang ingin memulai publikasi buku digital mereka.',
                'price' => 99000,
                'max_submissions' => 2,
                'features' => [
                    'Maksimal 2 buku per bulan',
                    'Maksimal 20 chapter per buku',
                    'Upload file PDF hingga 50MB per buku',
                    'Review dalam 7 hari kerja',
                    'Royalti 60% dari penjualan',
                    'Dashboard statistik basic',
                    'Support email'
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Premium',
                'slug' => 'premium',
                'description' => 'Paket terbaik untuk penulis produktif dengan fitur lengkap dan prioritas review.',
                'price' => 199000,
                'max_submissions' => 5,
                'features' => [
                    'Maksimal 5 buku per bulan',
                    'Maksimal 50 chapter per buku',
                    'Upload file PDF hingga 100MB per buku',
                    'Priority review dalam 3 hari kerja',
                    'Royalti 70% dari penjualan',
                    'Dashboard statistik advanced',
                    'Promosi di halaman utama',
                    'Custom kategori khusus',
                    'Support prioritas via WhatsApp',
                    'Konsultasi content strategy bulanan'
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Paket premium untuk penulis profesional dan penerbit dengan kebutuhan skala besar.',
                'price' => 399000,
                'max_submissions' => 15,
                'features' => [
                    'Maksimal 15 buku per bulan',
                    'Maksimal 100 chapter per buku',
                    'Upload file PDF hingga 200MB per buku',
                    'Instant review dalam 24 jam',
                    'Royalti 80% dari penjualan',
                    'Dashboard statistik enterprise',
                    'Featured placement guaranteed',
                    'Multiple kategori per buku',
                    'Dedicated account manager',
                    'Marketing campaign support',
                    'API access untuk bulk upload',
                    'White-label publishing options',
                    'Custom branding'
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            AuthorSubscriptionPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
