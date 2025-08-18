import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';

export default function Copyright() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const sections = [
        {
            title: "Hak Cipta Konten Pengguna",
            content: [
                "Pengguna mempertahankan kepemilikan penuh atas hak cipta karya intelektual yang mereka kirimkan untuk diterbitkan.",
                "Dengan menyerahkan naskah, pengguna memberikan lisensi non-eksklusif kepada Ganesha Science Institute untuk menerbitkan, mendistribusikan, dan mempromosikan karya tersebut.",
                "Hak moral penulis termasuk hak untuk diakui sebagai pencipta karya dan hak untuk mempertahankan integritas karya tetap dilindungi.",
                "Pengguna dapat menggunakan kembali karya mereka sendiri dengan mencantumkan kredit publikasi melalui platform kami."
            ]
        },
        {
            title: "Perlindungan Hak Cipta",
            content: [
                "Kami berkomitmen untuk melindungi hak cipta semua karya yang diterbitkan melalui platform kami dari pelanggaran dan penggunaan ilegal.",
                "Setiap publikasi akan didaftarkan dengan ISBN dan metadata yang sesuai untuk memastikan identifikasi dan perlindungan yang tepat.",
                "Sistem deteksi plagiarisme dan verifikasi originalitas digunakan untuk memastikan integritas akademik semua publikasi.",
                "Kami akan mengambil tindakan hukum yang diperlukan terhadap pelanggaran hak cipta yang dilaporkan dan terbukti valid."
            ]
        },
        {
            title: "Penggunaan Materi Berhak Cipta",
            content: [
                "Pengguna harus memastikan bahwa semua materi yang disertakan dalam naskah mereka telah memperoleh izin yang sesuai atau berada dalam domain publik.",
                "Penggunaan kutipan, gambar, tabel, atau data dari sumber lain harus mengikuti prinsip fair use dan mencantumkan attribution yang tepat.",
                "Untuk materi yang memerlukan izin khusus, pengguna bertanggung jawab untuk memperoleh lisensi sebelum penyerahan naskah.",
                "Kami menyediakan panduan tentang penggunaan materi berhak cipta dan bantuan dalam proses perizinan jika diperlukan."
            ]
        },
        {
            title: "Lisensi dan Distribusi",
            content: [
                "Publikasi melalui platform kami menggunakan lisensi yang memungkinkan akses luas sambil melindungi hak penulis.",
                "Pengguna dapat memilih jenis lisensi yang sesuai dengan kebutuhan mereka, termasuk Creative Commons atau lisensi proprietary.",
                "Distribusi digital melalui platform kami mencakup akses melalui perpustakaan digital, database akademik, dan search engine.",
                "Versi cetak dan digital dilindungi dengan watermark digital dan teknologi anti-pembajakan untuk mencegah distribusi ilegal."
            ]
        },
        {
            title: "Pelaporan Pelanggaran",
            content: [
                "Jika Anda menemukan pelanggaran hak cipta terhadap karya Anda, segera laporkan kepada kami dengan bukti yang memadai.",
                "Kami akan menginvestigasi semua laporan pelanggaran dalam waktu 7-14 hari kerja dan mengambil tindakan yang diperlukan.",
                "Proses DMCA takedown tersedia untuk pemegang hak cipta yang sah yang ingin menghapus konten yang melanggar.",
                "Kami bekerja sama dengan institusi akademik dan penegak hukum untuk menangani kasus pelanggaran yang serius."
            ]
        },
        {
            title: "Hak Platform",
            content: [
                "Ganesha Science Institute memiliki hak cipta atas desain platform, sistem, teknologi, dan konten yang kami ciptakan.",
                "Penggunaan trademark, logo, dan materi branding kami memerlukan izin tertulis yang eksplisit.",
                "Reverse engineering, copying, atau distribusi ulang sistem platform kami dilarang dan dapat dikenakan sanksi hukum.",
                "Metadata, format, dan template yang kami kembangkan dilindungi sebagai kekayaan intelektual perusahaan."
            ]
        }
    ];

    return (
        <PublicLayout 
            title="Copyright Policy" 
            description="Kebijakan hak cipta Ganesha Science Institute - Perlindungan kekayaan intelektual"
        >
            {/* Hero Section */}
            <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Copyright Symbol SVG */}
                        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-8">
                            <defs>
                                <linearGradient id="copyrightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#7C3AED"/>
                                    <stop offset="100%" stopColor="#C026D3"/>
                                </linearGradient>
                            </defs>
                            <circle cx="60" cy="60" r="45" fill="url(#copyrightGradient)" />
                            <circle cx="60" cy="60" r="35" fill="none" stroke="white" strokeWidth="4" />
                            <path d="M75 45 Q85 45 85 60 Q85 75 75 75" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                            
                            {/* Book pages */}
                            <rect x="35" y="25" width="50" height="70" rx="3" fill="white" opacity="0.9" />
                            <rect x="38" y="28" width="44" height="64" rx="2" fill="url(#copyrightGradient)" opacity="0.1" />
                            <line x1="42" y1="35" x2="78" y2="35" stroke="#7C3AED" strokeWidth="1.5" opacity="0.6" />
                            <line x1="42" y1="42" x2="70" y2="42" stroke="#7C3AED" strokeWidth="1" opacity="0.6" />
                            <line x1="42" y1="49" x2="75" y2="49" stroke="#7C3AED" strokeWidth="1" opacity="0.6" />
                            <line x1="42" y1="56" x2="68" y2="56" stroke="#7C3AED" strokeWidth="1" opacity="0.6" />
                        </svg>
                    </motion.div>

                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Copyright Policy
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-gray-600 leading-relaxed mb-8"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.1 }}
                    >
                        Kebijakan ini mengatur perlindungan hak cipta dan kekayaan intelektual dalam ekosistem 
                        penerbitan akademik Ganesha Science Institute. Kami berkomitmen melindungi hak penulis dan penerbit.
                    </motion.p>

                    <motion.div 
                        className="inline-flex items-center px-6 py-3 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                    >
                        Kebijakan berlaku: 18 Agustus 2025
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
                                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-purple-500 pl-6">
                                    {section.title}
                                </h2>
                                <div className="space-y-4 pl-6">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <p className="text-gray-700 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* DMCA Notice */}
                    <motion.div
                        className="mt-16 p-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">DMCA Notice & Takedown</h3>
                        <p className="text-gray-700 mb-4">
                            Jika Anda yakin bahwa konten di platform kami melanggar hak cipta Anda, kirimkan notice 
                            DMCA yang lengkap. Kami akan merespons dalam 24-48 jam dan mengambil tindakan yang sesuai 
                            setelah verifikasi klaim Anda.
                        </p>
                        <div className="space-y-2">
                            <p className="text-gray-800"><strong>Copyright Agent:</strong> ganeshascience@gmail.com</p>
                            <p className="text-gray-800"><strong>Response Time:</strong> 24-48 jam</p>
                            <p className="text-gray-800"><strong>Platform:</strong> ganeshainstitute.org</p>
                        </div>
                    </motion.div>

                    {/* License Information */}
                    <motion.div
                        className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Lisensi Creative Commons</h3>
                        <p className="text-gray-700 mb-4">
                            Kami mendukung berbagai model lisensi Creative Commons untuk memberikan fleksibilitas 
                            kepada penulis dalam menentukan bagaimana karya mereka dapat digunakan oleh orang lain, 
                            sambil tetap mempertahankan hak cipta.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <strong>CC BY:</strong> Atribusi
                            </div>
                            <div>
                                <strong>CC BY-SA:</strong> Atribusi + ShareAlike
                            </div>
                            <div>
                                <strong>CC BY-NC:</strong> Atribusi + Non-Commercial
                            </div>
                            <div>
                                <strong>CC BY-ND:</strong> Atribusi + No Derivatives
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
