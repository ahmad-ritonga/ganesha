import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { SharedData } from '@/types';
import { Check, ArrowRight, Crown, Star, Zap, Award, Gift, Sparkles } from 'lucide-react';

interface AuthorSubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    max_submissions: number;
    features: string[];
    is_active: boolean;
    sort_order: number;
    formatted_price: string;
}

interface LocalPricingPlan {
    name: string;
    dbName: string;
    price: string;
    books: string;
    features: string[];
    color: string;
    icon: any;
    popular?: boolean;
    upgrade?: {
        price: string;
        feature: string;
    };
}

interface Props extends SharedData {
    plans: AuthorSubscriptionPlan[];
}

export default function Pricing({ auth, plans }: Props) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const { post, processing } = useForm();

    const handleSubscribe = (plan: AuthorSubscriptionPlan) => {
        if (processing) {
            console.log('Already processing, ignoring click');
            return;
        }
        
        console.log('Subscribing to plan:', plan);
        
        post(route('author.subscribe', plan.id), {
            onSuccess: () => {
                console.log('Subscription success - redirecting to payment');
                // Handle success - user will be redirected to payment
            },
            onError: (errors) => {
                console.error('Subscription error:', errors);
                alert('Error: ' + JSON.stringify(errors));
            }
        });
    };

    // Helper function untuk format currency
    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return (price / 1000000).toFixed(0) + ' juta';
        } else if (price >= 1000) {
            return (price / 1000) + 'rb';
        }
        return price.toString();
    };

    // Data pricing yang sesuai dengan database
    const pricingPlans: LocalPricingPlan[] = [
        {
            name: 'Reguler',
            dbName: 'Reguler',
            price: '750rb',
            books: '3 buku',
            features: ['3 buku cetak', 'Softfile digital', 'Layout profesional', 'Cover design', 'ISBN gratis'],
            color: 'bg-gray-600',
            icon: Star
        },
        {
            name: 'Silver',
            dbName: 'Silver',
            price: '1 juta',
            books: '5 buku',
            features: ['5 buku cetak', 'Softfile digital', 'Layout profesional', 'Cover design premium', 'ISBN gratis', 'Marketing support'],
            color: 'bg-slate-500',
            icon: Gift
        },
        {
            name: 'Gold',
            dbName: 'Gold',
            price: '2 juta',
            books: '7 buku',
            features: ['7 buku cetak', 'Softfile digital', 'Layout premium', 'Cover design eksklusif', 'ISBN gratis', 'Google Scholar', 'Marketing campaign'],
            color: 'bg-yellow-500',
            icon: Crown,
            popular: true,
            upgrade: {
                price: '2.5 juta',
                feature: '+ HKI (Hak Kekayaan Intelektual)'
            }
        },
        {
            name: 'Platinum',
            dbName: 'Platinum',
            price: '3 juta',
            books: '10 buku',
            features: ['10 buku cetak', 'Softfile digital', 'Layout premium+', 'Cover design eksklusif', 'ISBN gratis', 'Google Scholar', 'Full marketing', 'Priority support'],
            color: 'bg-purple-600',
            icon: Sparkles,
            upgrade: {
                price: '3.5 juta',
                feature: '+ HKI (Hak Kekayaan Intelektual)'
            }
        }
    ];    return (
        <PublicLayout 
            title="Paket Author"
            description="Pilih paket penerbitan yang sesuai dengan kebutuhan Anda"
        >
            <Head title="Paket Author" />

            <div className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 sm:mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                            <Star className="w-4 h-4 mr-2" />
                            Paket Author Premium
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Pilih Paket{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Penerbitan
                            </span>{' '}Terbaik
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                            Dapatkan layanan penerbitan berkualitas dengan harga yang kompetitif 
                            dan fleksibilitas sesuai kebutuhan penerbitan Anda.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className="relative">
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                            Paling Populer
                                        </span>
                                    </div>
                                )}
                                
                                <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${plan.popular ? 'border-yellow-200' : 'border-gray-100'} hover:-translate-y-2 h-full flex flex-col`}>
                                    {/* Plan header */}
                                    <div className="text-center mb-6 sm:mb-8">
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                                            <plan.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{plan.price}</div>
                                        <p className="text-gray-600 font-medium">{plan.books}</p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center gap-3">
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upgrade option */}
                                    {plan.upgrade && (
                                        <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                            <div className="text-center">
                                                <div className="text-sm text-purple-600 font-medium mb-1">Upgrade Option</div>
                                                <div className="text-lg font-bold text-purple-800">{plan.upgrade.price}</div>
                                                <div className="flex items-center justify-center gap-2 text-sm text-purple-700 mt-2">
                                                    <Award className="w-4 h-4" />
                                                    {plan.upgrade.feature}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    {auth.user ? (
                                        <button
                                            onClick={() => {
                                                console.log('Button clicked for plan:', plan.name);
                                                console.log('Available plans from DB:', plans);
                                                
                                                // Map hardcoded plan to database plan
                                                let matchingPlan;
                                                
                                                // Map berdasarkan nama plan di database
                                                switch(plan.name.toLowerCase()) {
                                                    case 'reguler':
                                                        matchingPlan = plans.find(p => p.slug === 'reguler' || p.name.toLowerCase().includes('reguler'));
                                                        break;
                                                    case 'silver':
                                                        matchingPlan = plans.find(p => p.slug === 'silver' || p.name.toLowerCase().includes('silver'));
                                                        break;
                                                    case 'gold':
                                                        matchingPlan = plans.find(p => p.slug === 'gold' || p.name.toLowerCase().includes('gold'));
                                                        break;
                                                    case 'platinum':
                                                        matchingPlan = plans.find(p => p.slug === 'platinum' || p.name.toLowerCase().includes('platinum'));
                                                        break;
                                                    default:
                                                        // Fallback: match berdasarkan dbName
                                                        matchingPlan = plans.find(p => p.name.toLowerCase() === plan.dbName?.toLowerCase());
                                                        // Jika masih tidak ada, gunakan index
                                                        if (!matchingPlan) {
                                                            matchingPlan = plans[index] || plans[0];
                                                        }
                                                        break;
                                                }
                                                
                                                console.log('Matching plan found:', matchingPlan);
                                                
                                                if (matchingPlan) {
                                                    handleSubscribe(matchingPlan);
                                                } else {
                                                    alert('Plan tidak ditemukan. Silakan refresh halaman atau hubungi admin.');
                                                }
                                            }}
                                            disabled={processing}
                                            className={`w-full py-3 ${plan.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {processing ? 'Processing...' : `Pilih ${plan.name}`}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <Link href="/login" className="w-full">
                                            <button className={`w-full py-3 ${plan.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto`}>
                                                Login untuk Pilih
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional info */}
                    <div className="mt-12 sm:mt-16 text-center">
                        <p className="text-gray-600 mb-6 sm:mb-8">
                            Semua paket sudah termasuk editing, layout, cover design, dan dukungan teknis
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                            {[
                                { icon: Star, text: 'Proses 2-4 minggu', color: 'text-blue-600' },
                                { icon: Award, text: 'Kualitas terjamin', color: 'text-green-600' },
                                { icon: Zap, text: 'Support 24/7', color: 'text-purple-600' }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-center gap-3">
                                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                                    <span className="text-gray-700 font-medium text-sm sm:text-base">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            Frequently Asked Questions
                        </h2>
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Bagaimana cara kerja sistem royalti?
                                </h3>
                                <p className="text-gray-600">
                                    Anda akan mendapatkan persentase royalti dari setiap penjualan buku sesuai dengan paket yang dipilih. 
                                    Pembayaran royalti dilakukan setiap bulan melalui transfer bank.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Berapa lama proses review buku?
                                </h3>
                                <p className="text-gray-600">
                                    Waktu review bervariasi tergantung paket: Regular (7 hari), Premium (3 hari), Enterprise (24 jam). 
                                    Tim kami akan melakukan review untuk memastikan kualitas konten.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Apakah bisa upgrade/downgrade paket?
                                </h3>
                                <p className="text-gray-600">
                                    Ya, Anda bisa mengubah paket kapan saja. Upgrade akan berlaku segera, 
                                    sedangkan downgrade akan berlaku di periode berikutnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
