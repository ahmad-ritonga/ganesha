import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';

export default function Terms() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const sections = [
        {
            title: "Definisi dan Interpretasi",
            content: [
                "\"Platform\" merujuk pada layanan digital Ganesha Science Institute yang mencakup website, aplikasi, dan sistem penerbitan akademik.",
                "\"Pengguna\" adalah individu atau institusi yang menggunakan layanan kami untuk keperluan penerbitan, penelitian, atau akademik.",
                "\"Konten\" mencakup teks, gambar, data, dan materi lainnya yang diunggah atau dibuat melalui platform kami.",
                "\"Layanan\" merujuk pada semua fasilitas penerbitan, digital library, dan dukungan akademik yang kami sediakan."
            ]
        },
        {
            title: "Penggunaan Platform",
            content: [
                "Pengguna harus berusia minimal 18 tahun atau memiliki persetujuan dari institusi yang sah untuk menggunakan layanan kami.",
                "Akun pengguna harus menggunakan informasi yang akurat dan terkini, serta bertanggung jawab menjaga kerahasiaan kredensial login.",
                "Dilarang menggunakan platform untuk tujuan ilegal, melanggar hak cipta, atau merugikan pihak lain.",
                "Pengguna bertanggung jawab atas semua aktivitas yang dilakukan melalui akun mereka."
            ]
        },
        {
            title: "Hak Kekayaan Intelektual",
            content: [
                "Pengguna mempertahankan hak cipta atas karya asli yang mereka kirimkan untuk diterbitkan melalui platform kami.",
                "Ganesha Science Institute memiliki hak untuk menggunakan, memodifikasi, dan mendistribusikan konten dalam rangka penyediaan layanan.",
                "Pengguna menjamin bahwa konten yang dikirimkan adalah karya asli dan tidak melanggar hak pihak ketiga.",
                "Kami berhak menolak atau menghapus konten yang melanggar ketentuan hak cipta atau standar akademik."
            ]
        },
        {
            title: "Layanan Penerbitan",
            content: [
                "Semua naskah yang diserahkan akan melalui proses review dan editing sesuai standar akademik internasional.",
                "Jadwal penerbitan disesuaikan dengan paket layanan yang dipilih dan kompleksitas naskah.",
                "Biaya layanan telah ditetapkan dalam paket yang dipilih dan tidak dapat dikembalikan setelah proses dimulai.",
                "Revisi naskah dapat dilakukan dalam batas waktu dan ketentuan yang telah disepakati."
            ]
        },
        {
            title: "Pembayaran dan Pengembalian Dana",
            content: [
                "Pembayaran harus dilakukan sesuai dengan metode dan jadwal yang telah disepakati dalam kontrak layanan.",
                "Pengembalian dana hanya dapat dipertimbangkan dalam kasus kegagalan layanan yang disebabkan oleh pihak kami.",
                "Keterlambatan pembayaran dapat mengakibatkan penundaan atau pembatalan layanan.",
                "Semua pajak dan biaya administrasi bank menjadi tanggung jawab pengguna."
            ]
        },
        {
            title: "Pembatasan Layanan",
            content: [
                "Kami berhak menangguhkan atau menghentikan layanan tanpa pemberitahuan sebelumnya jika terjadi pelanggaran ketentuan.",
                "Akses ke platform dapat dibatasi untuk keperluan maintenance, upgrade sistem, atau alasan keamanan.",
                "Kami tidak bertanggung jawab atas kerugian yang timbul akibat gangguan teknis atau force majeure.",
                "Pembatasan geografis dapat diberlakukan untuk wilayah tertentu sesuai dengan regulasi yang berlaku."
            ]
        }
    ];

    return (
        <PublicLayout 
            title="Terms of Service" 
            description="Syarat dan ketentuan layanan Ganesha Science Institute - Aturan penggunaan platform"
        >
            {/* Hero Section */}
            <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Contract Document SVG */}
                        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-8">
                            <defs>
                                <linearGradient id="documentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#059669"/>
                                    <stop offset="100%" stopColor="#047857"/>
                                </linearGradient>
                            </defs>
                            <rect x="25" y="15" width="70" height="90" rx="5" fill="url(#documentGradient)" />
                            <rect x="30" y="20" width="60" height="80" rx="3" fill="white" />
                            <line x1="35" y1="30" x2="85" y2="30" stroke="#059669" strokeWidth="2" />
                            <line x1="35" y1="40" x2="75" y2="40" stroke="#6B7280" strokeWidth="1.5" />
                            <line x1="35" y1="50" x2="80" y2="50" stroke="#6B7280" strokeWidth="1.5" />
                            <line x1="35" y1="60" x2="70" y2="60" stroke="#6B7280" strokeWidth="1.5" />
                            <line x1="35" y1="70" x2="85" y2="70" stroke="#6B7280" strokeWidth="1.5" />
                            <line x1="35" y1="80" x2="65" y2="80" stroke="#6B7280" strokeWidth="1.5" />
                            <circle cx="75" cy="88" r="8" fill="#059669" />
                            <path d="M71 88 L74 91 L79 86" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>

                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Terms of Service
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-gray-600 leading-relaxed mb-8"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.1 }}
                    >
                        Syarat dan ketentuan ini mengatur penggunaan platform dan layanan Ganesha Science Institute. 
                        Dengan menggunakan layanan kami, Anda menyetujui semua ketentuan yang tercantum di bawah ini.
                    </motion.p>

                    <motion.div 
                        className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full text-sm font-semibold"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                    >
                        Berlaku sejak: 18 Agustus 2025
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
                                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-green-500 pl-6">
                                    {section.title}
                                </h2>
                                <div className="space-y-4 pl-6">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <p className="text-gray-700 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Important Notice */}
                    <motion.div
                        className="mt-16 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Perubahan Ketentuan</h3>
                        <p className="text-gray-700 mb-4">
                            Kami berhak untuk memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan 
                            diberitahukan melalui email atau pengumuman di platform. Penggunaan berkelanjutan setelah 
                            perubahan dianggap sebagai persetujuan terhadap ketentuan yang baru.
                        </p>
                        <div className="space-y-2">
                            <p className="text-gray-800"><strong>Kontak Legal:</strong> ganeshascience@gmail.com</p>
                            <p className="text-gray-800"><strong>Alamat Website:</strong> ganeshainstitute.org</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
