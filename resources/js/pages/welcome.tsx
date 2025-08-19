import { Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { 
    IconBook, 
    IconFileText, 
    IconCloudUpload, 
    IconUsers, 
    IconAward, 
    IconCertificate, 
    IconStar, 
    IconCheck, 
    IconClock, 
    IconShieldCheck, 
    IconHeadphones,
    IconMail,
    IconArrowRight,
    IconBrandGoogle,
    IconPrinter,
    IconCopyright
} from '@tabler/icons-react';

export default function Welcome() {
    // Simplified animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const pricingPlans = [
        {
            name: 'Reguler',
            price: '750rb',
            books: '3 buku',
            features: ['3 buku cetak', 'Softfile digital', 'Layout profesional', 'Cover design', 'ISBN gratis'],
            color: 'bg-gray-600'
        },
        {
            name: 'Silver',
            price: '1 juta',
            books: '5 buku',
            features: ['5 buku cetak', 'Softfile digital', 'Layout profesional', 'Cover design premium', 'ISBN gratis', 'Marketing support'],
            color: 'bg-slate-500'
        },
        {
            name: 'Gold',
            price: '2 juta',
            books: '7 buku',
            features: ['7 buku cetak', 'Softfile digital', 'Layout premium', 'Cover design eksklusif', 'ISBN gratis', 'Google Scholar', 'Marketing campaign'],
            popular: true,
            color: 'bg-yellow-500',
            upgrade: {
                price: '2.5 juta',
                feature: '+ HKI (Hak Kekayaan Intelektual)'
            }
        },
        {
            name: 'Platinum',
            price: '3 juta',
            books: '10 buku',
            features: ['10 buku cetak', 'Softfile digital', 'Layout premium+', 'Cover design eksklusif', 'ISBN gratis', 'Google Scholar', 'Full marketing', 'Priority support'],
            color: 'bg-purple-600',
            upgrade: {
                price: '3.5 juta',
                feature: '+ HKI (Hak Kekayaan Intelektual)'
            }
        }
    ];

    const services = [
        {
            title: 'Buku Akademik',
            description: 'Platform untuk menerbitkan karya ilmiah dalam format buku dengan layanan lengkap dari proofreading hingga distribusi.',
            icon: IconBook,
            color: 'from-blue-500 to-indigo-600',
            features: ['Monograf & Referensi', 'Buku Ajar', 'Royalti 50%', 'ISBN & Google Scholar']
        },
        {
            title: 'Jurnal Ilmiah',
            description: 'IJHTM: Indonesia Journal of Hygiene and Infectious Disease dengan standar internasional dan proses review profesional.',
            icon: IconFileText,
            color: 'from-emerald-500 to-teal-600',
            features: ['Kesehatan Lingkungan', 'Epidemiologi', 'Penyakit Tropis', 'Perubahan Iklim']
        },
        {
            title: 'Perpustakaan Digital',
            description: 'Akses koleksi e-book dan jurnal ilmiah dengan sistem manajemen yang canggih dan user-friendly.',
            icon: IconCloudUpload,
            color: 'from-purple-500 to-pink-600',
            features: ['Akses Multi-Device', 'Pencarian Cerdas', 'Sinkronisasi Cloud', 'Organisasi Otomatis']
        }
    ];

    const testimonials = [
        {
            name: "Dr. Sari Wijaya, M.Pd",
            role: "Dosen Universitas Indonesia",
            content: "Proses penerbitan sangat profesional dan hasil akhirnya melampaui ekspektasi. Tim editor sangat membantu dalam penyempurnaan naskah.",
            rating: 5
        },
        {
            name: "Prof. Ahmad Rahman, Ph.D",
            role: "Peneliti LIPI", 
            content: "Layanan yang excellent! Dari editing hingga distribusi, semua berjalan lancar. Royalti 50% juga sangat menguntungkan penulis.",
            rating: 5
        },
        {
            name: "Dr. Maya Putri, S.Kom",
            role: "Dosen ITB",
            content: "Sangat puas dengan kualitas cetak dan desain cover. Buku saya juga sudah terdaftar di Google Scholar dengan cepat.",
            rating: 5
        }
    ];

    const faqs = [
        {
            question: "Saya ingin buku cetak lebih banyak, bagaimana?",
            answer: "Paket penerbitan sudah termasuk cetakan sesuai paket. Jika ingin cetak tambahan, Anda cukup membayar biaya cetak yang lebih murah dan hemat."
        },
        {
            question: "Apakah gratis desain cover?",
            answer: "Ya betul! Kami menyediakan layanan desain cover dan layout buku gratis. Jika Anda sudah memiliki desain sendiri, kami juga bisa menggunakannya."
        },
        {
            question: "Apa saja kelengkapan naskah yang harus dikirim?",
            answer: "Naskah lengkap meliputi: Halaman Judul, Kata Pengantar, isi, tentang penulis, dan blurb/sinopsis buku. Tim kami akan menginformasikan kelengkapan lainnya."
        },
        {
            question: "Bagaimana prosedur penerbitan buku?",
            answer: "Untuk Paket Mandiri: 1) Persiapkan naskah, 2) Isi identitas diri, 3) Lakukan pembayaran, 4) Unggah naskah. Untuk Tulis Bareng: 1) Pilih judul, 2) Isi data diri, 3) Bayar, 4) Susun sub-bab."
        },
        {
            question: "Berapa lama proses penerbitan?",
            answer: "Proses penerbitan memakan waktu 2-4 minggu setelah naskah final dan pembayaran diterima. Kami akan memberikan update progress secara berkala."
        },
        {
            question: "Apakah mendapatkan HKI (Hak Kekayaan Intelektual)?",
            answer: "Untuk paket Gold dan Platinum, tersedia opsi tambahan HKI dengan biaya tambahan 500rb. HKI memberikan perlindungan hukum untuk karya Anda."
        }
    ];

    return (
        <PublicLayout 
            title="Welcome" 
            description="Terdepan dalam penerbitan ilmiah dan akademis"
        >
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Content - Mobile first order */}
                        <motion.div 
                            className="text-center order-1 lg:order-1 z-10 relative"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            <motion.h1 
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight text-center"
                                variants={fadeInUp}
                            >
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Terdepan
                                </span>{' '}dalam{' '}
                                <br className="hidden sm:block" />
                                Penerbitan Ilmiah{' '}
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    & Akademis
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed text-center lg:text-justify"
                                variants={fadeInUp}
                            >
                                Platform digital terdepan untuk penerbitan buku ilmiah, jurnal akademik, 
                                dan perpustakaan digital dengan standar internasional yang telah dipercaya 
                                oleh ribuan akademisi di seluruh Indonesia.
                            </motion.p>

                            {/* Stats */}
                            <motion.div 
                                className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-12 mb-8 sm:mb-12"
                                variants={fadeInUp}
                            >
                                {[
                                    // { icon: IconBook, value: '1000+', label: 'Buku Diterbitkan' },
                                    { icon: IconUsers, value: '500+', label: 'Peneliti Bergabung' },
                                    { icon: IconAward, value: '10+', label: 'Universitas Partner' }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center lg:text-left">
                                        <div className="flex items-center justify-center lg:justify-start mb-2">
                                            <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2" />
                                            <div className="text-2xl sm:text-4xl font-bold text-blue-600">{stat.value}</div>
                                        </div>
                                        <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div 
                                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-8 sm:mb-12"
                                variants={fadeInUp}
                            >
                                <Link href="/author/pricing" className="w-full sm:w-auto">
                                    <motion.button 
                                        className="group w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg flex items-center justify-center gap-3"
                                        whileHover={{ y: -2, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Jadi Author
                                        <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                                <Link href="/login" className="w-full sm:w-auto">
                                    <motion.button 
                                        className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-blue-600 font-semibold text-base sm:text-lg rounded-xl border-2 border-blue-200 shadow-md"
                                        whileHover={{ y: -2, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Masuk
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div 
                                className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 text-sm text-gray-600"
                                variants={fadeInUp}
                            >
                                {[
                                    { icon: IconCheck, text: 'ISBN Gratis' },
                                    { icon: IconCheck, text: 'Royalti 50%' },
                                    { icon: IconCheck, text: 'Standar Internasional' },
                                    { icon: IconBrandGoogle, text: 'Google Scholar' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        <span className="font-medium text-xs sm:text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                        
                        {/* Hero Image - Better sizing and positioning */}
                        <motion.div 
                            className="relative flex justify-center lg:justify-end order-2 lg:order-2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl">
                                <DotLottieReact
                                    src="/assets/images/study.lottie"
                                    loop
                                    autoplay
                                    className="w-full h-auto object-contain transform scale-110 sm:scale-125 lg:scale-150"
                                />
                                
                                {/* Floating elements for visual enhancement */}
                                <div className="absolute top-10 -left-4 sm:-left-8 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                                <div className="absolute bottom-20 -right-4 sm:-right-8 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
                                <div className="absolute top-1/2 -right-8 sm:-right-12 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-500"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator - Fixed positioning to avoid overlap */}
                <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16 sm:mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                            <IconPrinter className="w-4 h-4 mr-2" />
                            Paket Penerbitan & Percetakan
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Pilih Paket{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Terbaik
                            </span>{' '}untuk Anda
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                            Dapatkan layanan penerbitan berkualitas dengan harga yang kompetitif 
                            dan fleksibilitas sesuai kebutuhan penerbitan Anda.
                        </p>
                    </div>

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
                                
                                <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${plan.popular ? 'border-yellow-200' : 'border-gray-100'} hover:-translate-y-2 h-full`}>
                                    {/* Plan header */}
                                    <div className="text-center mb-6 sm:mb-8">
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                                            {plan.name === 'Reguler' && <IconBook className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                                            {plan.name === 'Silver' && <IconStar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                                            {plan.name === 'Gold' && <IconAward className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                                            {plan.name === 'Platinum' && <IconCertificate className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{plan.price}</div>
                                        <p className="text-gray-600 font-medium">{plan.books}</p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center gap-3">
                                                <IconCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upgrade option */}
                                    {plan.upgrade && (
                                        <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-purple-600 mb-1">{plan.upgrade.price}</div>
                                                <div className="text-sm text-purple-700 flex items-center justify-center gap-2">
                                                    <IconCopyright className="w-4 h-4" />
                                                    {plan.upgrade.feature}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    <Link href="/author/pricing" className="w-full">
                                        <button className={`w-full py-3 ${plan.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto`}>
                                            Pilih {plan.name}
                                            <IconArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
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
                                { icon: IconClock, text: 'Proses 2-4 minggu', color: 'text-blue-600' },
                                { icon: IconShieldCheck, text: 'Kualitas terjamin', color: 'text-green-600' },
                                { icon: IconHeadphones, text: 'Support 24/7', color: 'text-purple-600' }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-center gap-3">
                                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                                    <span className="text-gray-700 font-medium text-sm sm:text-base">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16 sm:mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6">
                            <IconFileText className="w-4 h-4 mr-2" />
                            Layanan Unggulan
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Solusi Lengkap untuk{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Penerbitan Akademik
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                            Dari konsep hingga publikasi, kami menyediakan layanan end-to-end 
                            untuk mewujudkan karya ilmiah berkualitas tinggi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="space-y-3 mb-6">
                                    {service.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center gap-3">
                                            <IconCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                            <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/author/pricing" className="w-full">
                                    <button className={`w-full py-3 bg-gradient-to-r ${service.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300`}>
                                        Pelajari Lebih Lanjut
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-gray-900 to-blue-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                            <IconUsers className="w-4 h-4 mr-2" />
                            Testimoni
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                            Apa Kata{' '}
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                Para Penulis
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
                            Ribuan peneliti dan akademisi telah mempercayai kami untuk menerbitkan karya mereka.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                        <IconUsers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h4>
                                        <p className="text-blue-200 text-xs sm:text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <IconStar key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                
                                <p className="text-blue-100 leading-relaxed text-sm sm:text-base">{testimonial.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6">
                            <IconFileText className="w-4 h-4 mr-2" />
                            FAQ
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Pertanyaan yang{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Sering Ditanyakan
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <IconFileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
        </PublicLayout>
    );
}