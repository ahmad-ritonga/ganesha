import { Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
    IconAward, 
    IconUsers, 
    IconTarget,
    IconHeart,
    IconBulb,
    IconUsersGroup,
    IconTrophy,
    IconShield,
    IconEye,
    IconCheck,
    IconBook,
    IconFileText,
    IconCloudUpload,
    IconMail,
    IconPhone,
    IconMapPin,
    IconWorld
} from '@tabler/icons-react';

export default function About() {
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

    const values = [
        {
            icon: IconShield,
            title: 'Integrity',
            description: 'Komitmen terhadap kejujuran, transparansi, dan etika dalam setiap aspek penerbitan ilmiah.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: IconBulb,
            title: 'Innovation',
            description: 'Menghadirkan solusi teknologi terdepan untuk memajukan dunia penerbitan akademik.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: IconUsersGroup,
            title: 'Collaboration',
            description: 'Membangun kemitraan strategis dengan institusi pendidikan dan peneliti terkemuka.',
            color: 'from-green-500 to-emerald-500'
        }
    ];

    const advantages = [
        { icon: IconTrophy, title: 'Kredibilitas Tinggi', description: 'Standar editorial dan peer-review yang ketat dengan jaringan reviewer internasional' },
        { icon: IconUsers, title: 'Tim Profesional', description: 'Editor dan reviewer berpengalaman dari berbagai institusi akademik terkemuka' },
        { icon: IconTarget, title: 'Proses Berkualitas', description: 'Sistem editorial yang teliti untuk memastikan kualitas dan integritas ilmiah' },
        { icon: IconEye, title: 'Transparansi Penuh', description: 'Proses review yang transparan dan komunikasi yang jelas dengan penulis' },
        { icon: IconHeart, title: 'Dukungan Komprehensif', description: 'Bantuan editorial dari submission hingga publikasi dan distribusi' },
        { icon: IconCheck, title: 'Standar Internasional', description: 'Mengikuti best practices penerbitan ilmiah global dan ethical guidelines' }
    ];

    const services = [
        {
            icon: IconBook,
            title: 'Academic Books',
            description: 'Penerbitan buku akademik berkualitas tinggi dengan proses editorial yang ketat dan standar internasional',
            features: ['Monograf & Referensi', 'Buku Ajar', 'Peer Review Process', 'ISBN & Indexing']
        },
        {
            icon: IconFileText,
            title: 'Scientific Journals',
            description: 'Platform jurnal ilmiah dengan standar peer-review internasional untuk berbagai disiplin ilmu',
            features: ['Peer Review Ketat', 'Indexing Services', 'Open Access', 'Editorial Profesional']
        },
        {
            icon: IconCloudUpload,
            title: 'Digital Platform',
            description: 'Sistem perpustakaan digital dan platform publikasi yang canggih untuk akses global',
            features: ['Multi-Device Access', 'Global Distribution', 'Cloud Technology', 'Research Analytics']
        }
    ];

    return (
        <PublicLayout 
            title="About Us" 
            description="Mengenal lebih dekat Ganesha Science Institute - Platform penerbitan akademik terdepan di Indonesia"
        >
            {/* Hero Section */}
            <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        {/* Company Intro - Left Side */}
                        <motion.div 
                            className="text-center lg:text-left space-y-8"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {/* Company Name */}
                            <motion.h1 
                                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight text-center"
                                variants={fadeInUp}
                            >
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Ganesha
                                </span>
                                <br />
                                <span className="text-gray-800">Science Institute</span>
                            </motion.h1>

                            {/* Tagline */}
                            <motion.p 
                                className="text-2xl md:text-3xl font-light text-blue-600 italic text-center"
                                variants={fadeInUp}
                            >
                                "Advanced in Academic and Scientific Publishing"
                            </motion.p>

                            {/* Brief Introduction */}
                            <motion.p 
                                className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl text-justify"
                                variants={fadeInUp}
                            >
                                Penerbit internasional terkemuka yang berkomitmen memajukan batas-batas pengetahuan ilmiah 
                                dan keunggulan akademik melalui platform penerbitan berkualitas tinggi yang dapat diakses 
                                oleh komunitas peneliti global.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div 
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                                variants={fadeInUp}
                            >
                                <Link
                                    href="/services"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    Layanan Kami
                                </Link>
                                <Link
                                    href="/contact"
                                    className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                                >
                                    Hubungi Kami
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Hero Image - Right Side */}
                        <motion.div 
                            className="flex justify-center lg:justify-end"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl opacity-20 rotate-12"></div>
                                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl opacity-20 -rotate-12"></div>
                                
                                {/* Main hero image container */}
                                <div className="relative max-w-lg">
                                    <img 
                                        src="/assets/images/logo.png" 
                                        alt="Ganesha Science Institute - Academic Publishing Platform" 
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Company Story */}
                        <motion.div 
                            className="space-y-8"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div>
                                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold mb-6">
                                    Tentang Kami
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                    Membangun Masa Depan{' '}
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Penerbitan Ilmiah
                                    </span>
                                </h2>
                            </div>

                            <div className="prose prose-lg text-gray-600 space-y-6">
                                <p className="text-justify leading-relaxed">
                                    Ganesha Science Institute adalah penerbit internasional terkemuka yang berkomitmen 
                                    memajukan batas-batas pengetahuan ilmiah dan keunggulan akademik. Didirikan pada tahun 2025, 
                                    kami telah berkembang menjadi nama terpercaya dalam penerbitan ilmiah dengan misi 
                                    menyediakan platform publikasi yang berkualitas tinggi dan dapat diakses secara global.
                                </p>
                                
                                <p className="text-justify leading-relaxed">
                                    Dengan fokus pada berbagai disiplin ilmu termasuk Psikologi, Pendidikan, Ilmu Kesehatan, 
                                    Ilmu Komputer, dan Ilmu Sosial, kami menyediakan platform yang inklusif dan berkualitas tinggi 
                                    bagi peneliti dan akademisi global. Setiap publikasi melalui proses editorial yang ketat 
                                    untuk memastikan standar akademik internasional terpenuhi.
                                </p>

                                <p className="text-justify leading-relaxed">
                                    Kami menjunjung tinggi standar tertinggi integritas ilmiah, transparansi, dan ketelitian, 
                                    memastikan setiap publikasi memenuhi kriteria paling ketat untuk kualitas dan kredibilitas. 
                                    Komitmen ini mencerminkan dedikasi kami untuk memajukan pengetahuan dan mendukung 
                                    komunitas akademik dalam menyebarluaskan penelitian berkualitas.
                                </p>
                            </div>
                        </motion.div>

                        {/* Company Details */}
                        <motion.div 
                            className="space-y-8"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                                    Informasi Perusahaan
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Nama Perusahaan</p>
                                            <p className="text-gray-700">PT. Ganesha Sains Nusantara</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Nomor AHU</p>
                                            <p className="text-gray-700">AHU-033821.AH.01.30.Tahun 2025</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Website</p>
                                            <p className="text-blue-600 font-medium">ganeshainstitute.org</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Didirikan</p>
                                            <p className="text-gray-700">2025</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Fokus Bidang</p>
                                            <p className="text-gray-700">Penerbitan Ilmiah & Akademik</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Cakupan</p>
                                            <p className="text-gray-700">Internasional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Statement */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    Misi Kami
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-justify">
                                    Menyediakan platform yang inklusif, mudah diakses, dan berkualitas tinggi bagi peneliti, 
                                    akademisi, dan profesional di seluruh dunia untuk menyebarluaskan temuan mereka dan 
                                    berkontribusi secara bermakna pada kemajuan ilmiah dan masyarakat. Kami berkomitmen 
                                    untuk menjembatani kesenjangan antara penelitian akademik dan aplikasi praktis, 
                                    memfasilitasi transfer pengetahuan yang efektif untuk kemajuan global.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Editorial Excellence Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm font-semibold mb-6">
                            Keunggulan Editorial
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Standar Publikasi
                            </span>{' '}
                            Internasional
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-justify">
                            Komitmen kami terhadap kualitas dan integritas dalam setiap tahap proses penerbitan, 
                            dari submission hingga publikasi akhir
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            className="space-y-8"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="space-y-6">
                                <h3 className="text-3xl font-bold text-gray-900">
                                    Proses Review yang Ketat
                                </h3>
                                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                    Setiap naskah dan buku yang dikirimkan menjalani proses peer-review dan editorial yang teliti, 
                                    dipandu oleh jaringan internasional editor dan reviewer berpengalaman. Hal ini memastikan 
                                    semua publikasi kami mencerminkan tingkat keunggulan ilmiah tertinggi dan berkontribusi 
                                    positif terhadap kemajuan pengetahuan dalam bidang masing-masing.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Double-Blind Peer Review</h4>
                                    <p className="text-gray-600 text-justify leading-relaxed">
                                        Proses review objektif dengan identitas reviewer dan penulis yang saling tersembunyi, 
                                        memastikan evaluasi yang adil dan tidak bias berdasarkan kualitas penelitian semata.
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Expert Reviewers</h4>
                                    <p className="text-gray-600 text-justify leading-relaxed">
                                        Reviewer ahli dari institusi akademik terkemuka dunia yang memiliki keahlian spesifik 
                                        dalam bidang penelitian yang relevan dengan naskah yang direview.
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Transparent Process</h4>
                                    <p className="text-gray-600 text-justify leading-relaxed">
                                        Komunikasi yang jelas dan timeline yang transparan sepanjang proses editorial, 
                                        memberikan kepastian dan kemudahan bagi penulis dalam melacak status manuscript.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-6">Program Penerbitan Buku</h3>
                                <p className="text-emerald-100 leading-relaxed mb-6 text-justify">
                                    Selain jurnal ilmiah, kami juga menerbitkan buku-buku akademik terkemuka yang memperkaya 
                                    literatur ilmiah global. Program ini mendukung para pemimpin pemikiran dan peneliti 
                                    untuk menjangkau audiens yang lebih luas, menyebarluaskan pengetahuan mendalam, 
                                    dan berkontribusi pada pengembangan disiplin ilmu mereka.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-emerald-500/20 rounded-xl p-4">
                                        <h4 className="font-semibold text-emerald-100 mb-2">Monograf & Buku Referensi</h4>
                                        <p className="text-emerald-200 text-sm">Publikasi mendalam untuk penelitian spesifik</p>
                                    </div>
                                    <div className="bg-emerald-500/20 rounded-xl p-4">
                                        <h4 className="font-semibold text-emerald-100 mb-2">Buku Ajar & Panduan</h4>
                                        <p className="text-emerald-200 text-sm">Material pendidikan berkualitas tinggi</p>
                                    </div>
                                    <div className="bg-emerald-500/20 rounded-xl p-4 sm:col-span-2">
                                        <h4 className="font-semibold text-emerald-100 mb-2">Prosiding Konferensi</h4>
                                        <p className="text-emerald-200 text-sm">Kumpulan paper dari event akademik internasional</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            {/* Our Values Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.div 
                            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Core Values
                        </motion.div>
                        
                        <motion.h2 
                            className="text-5xl md:text-6xl font-bold text-gray-900 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Nilai-Nilai{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Fundamental
                            </span>
                        </motion.h2>
                        
                        <motion.p 
                            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-justify"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Tiga pilar utama yang menjadi fondasi dalam setiap layanan dan inovasi 
                            yang kami hadirkan untuk memajukan ekosistem penerbitan akademik global. 
                            Nilai-nilai ini tercermin dalam setiap aspek operasional dan strategi 
                            pengembangan organisasi kami.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {values.map((value, index) => (
                            <motion.div 
                                key={index}
                                className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:scale-105"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                            >
                                {/* Background decoration */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.color} rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                                
                                {/* Icon */}
                                <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <value.icon className="w-12 h-12 text-white" />
                                </div>
                                
                                {/* Content */}
                                <div className="relative text-center space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                                
                                {/* Hover effect indicator */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-20 transition-all duration-500 rounded-full"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-semibold mb-8">
                            Keunggulan Kami
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                            Mengapa Memilih{' '}
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Ganesha Science Institute
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-justify">
                            Komitmen kami terhadap kualitas dan integritas dalam setiap aspek penerbitan ilmiah, 
                            mencakup berbagai keunggulan yang menjadikan kami pilihan utama komunitas akademik global
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {advantages.map((advantage, index) => (
                            <motion.div 
                                key={index}
                                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 mb-4">
                                        {advantage.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-justify">
                                        {advantage.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-24 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-semibold mb-8">
                            Layanan Kami
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Products & Services
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-justify">
                            Solusi lengkap untuk kebutuhan penerbitan akademik dan ilmiah dengan standar internasional, 
                            didukung teknologi terdepan dan tim profesional berpengalaman dalam industri publikasi global
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {services.map((service, index) => (
                            <motion.div 
                                key={index}
                                className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:scale-105"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                            >
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                                        <service.icon className="w-10 h-10 text-white" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 leading-relaxed text-justify mb-6">
                                        {service.description}
                                    </p>
                                    
                                    <div className="space-y-3 pt-6">
                                        {service.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center justify-center gap-3">
                                                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                                                <span className="text-gray-700 font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            
        </PublicLayout>
    );
}