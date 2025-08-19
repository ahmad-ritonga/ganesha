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
                'name' => 'Reguler',
                'slug' => 'reguler',
                'description' => 'Paket ideal untuk penulis pemula yang ingin memulai publikasi buku mereka.',
                'price' => 750000,
                'max_submissions' => 3,
                'features' => [
                    '3 buku cetak',
                    'Softfile digital',
                    'Layout profesional',
                    'Cover design',
                    'ISBN gratis'
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Silver',
                'slug' => 'silver',
                'description' => 'Paket terbaik untuk penulis yang ingin publikasi dengan fitur marketing support.',
                'price' => 1000000,
                'max_submissions' => 5,
                'features' => [
                    '5 buku cetak',
                    'Softfile digital',
                    'Layout profesional',
                    'Cover design premium',
                    'ISBN gratis',
                    'Marketing support'
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Gold',
                'slug' => 'gold',
                'description' => 'Paket premium dengan fitur Google Scholar dan marketing campaign yang lengkap.',
                'price' => 2000000,
                'max_submissions' => 7,
                'features' => [
                    '7 buku cetak',
                    'Softfile digital',
                    'Layout premium',
                    'Cover design eksklusif',
                    'ISBN gratis',
                    'Google Scholar',
                    'Marketing campaign'
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Platinum',
                'slug' => 'platinum',
                'description' => 'Paket enterprise dengan fitur terlengkap dan priority support untuk penulis profesional.',
                'price' => 3000000,
                'max_submissions' => 10,
                'features' => [
                    '10 buku cetak',
                    'Softfile digital',
                    'Layout premium+',
                    'Cover design eksklusif',
                    'ISBN gratis',
                    'Google Scholar',
                    'Full marketing',
                    'Priority support'
                ],
                'is_active' => true,
                'sort_order' => 4,
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
