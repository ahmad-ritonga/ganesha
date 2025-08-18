import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';

export default function Privacy() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const sections = [
        {
            title: "Informasi yang Kami Kumpulkan",
            content: [
                "Informasi pribadi yang Anda berikan secara langsung seperti nama, email, dan nomor telepon saat mendaftar atau menghubungi kami.",
                "Data penggunaan platform termasuk halaman yang dikunjungi, fitur yang digunakan, dan waktu akses untuk meningkatkan layanan kami.",
                "Informasi teknis seperti alamat IP, jenis browser, dan sistem operasi untuk keperluan keamanan dan optimalisasi platform."
            ]
        },
        {
            title: "Penggunaan Informasi",
            content: [
                "Memberikan layanan penerbitan akademik dan digital library sesuai dengan kebutuhan Anda.",
                "Berkomunikasi dengan Anda mengenai layanan, pembaruan, dan informasi penting lainnya.",
                "Meningkatkan kualitas platform dan mengembangkan fitur-fitur baru berdasarkan feedback pengguna.",
                "Memastikan keamanan dan mencegah penyalahgunaan platform."
            ]
        },
        {
            title: "Perlindungan Data",
            content: [
                "Kami menerapkan enkripsi SSL/TLS untuk melindungi data selama transmisi.",
                "Data disimpan di server yang aman dengan akses terbatas hanya untuk tim authorized.",
                "Backup data dilakukan secara teratur untuk memastikan ketersediaan dan integritas informasi.",
                "Kami tidak akan menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan."
            ]
        },
        {
            title: "Hak Pengguna",
            content: [
                "Mengakses dan memperbarui informasi pribadi Anda kapan saja melalui dashboard akun.",
                "Meminta penghapusan data pribadi sesuai dengan ketentuan yang berlaku.",
                "Menarik persetujuan penggunaan data untuk keperluan marketing dan komunikasi.",
                "Mendapatkan salinan data pribadi yang kami simpan dalam format yang dapat dibaca."
            ]
        },
        {
            title: "Cookies dan Teknologi Serupa",
            content: [
                "Kami menggunakan cookies untuk meningkatkan pengalaman browsing dan mengingat preferensi Anda.",
                "Analytics cookies membantu kami memahami bagaimana platform digunakan untuk perbaikan berkelanjutan.",
                "Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur platform mungkin tidak berfungsi optimal."
            ]
        }
    ];

    return (
        <PublicLayout 
            title="Privacy Policy" 
            description="Kebijakan privasi Ganesha Science Institute - Perlindungan data dan informasi pengguna"
        >
            {/* Hero Section */}
            <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Privacy Shield SVG */}
                        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-8">
                            <defs>
                                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6"/>
                                    <stop offset="100%" stopColor="#1D4ED8"/>
                                </linearGradient>
                            </defs>
                            <path d="M60 10 L90 25 L90 55 Q90 85 60 110 Q30 85 30 55 L30 25 Z" fill="url(#shieldGradient)" />
                            <path d="M45 55 L55 65 L75 45" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>

                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Privacy Policy
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-gray-600 leading-relaxed mb-8"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.1 }}
                    >
                        Kami berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. 
                        Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
                    </motion.p>

                    <motion.div 
                        className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                    >
                        Terakhir diperbarui: 18 Agustus 2025
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-16">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                className="space-y-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-blue-500 pl-6">
                                    {section.title}
                                </h2>
                                <div className="space-y-4 pl-6">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <p className="text-gray-700 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <motion.div
                        className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Hubungi Kami</h3>
                        <p className="text-gray-700 mb-4">
                            Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin menggunakan hak-hak Anda 
                            terkait data pribadi, silakan hubungi kami:
                        </p>
                        <div className="space-y-2">
                            <p className="text-gray-800"><strong>Email:</strong> ganeshascience@gmail.com</p>
                            <p className="text-gray-800"><strong>Website:</strong> ganeshainstitute.org</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
