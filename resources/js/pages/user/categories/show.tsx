import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    ArrowLeft, 
    Star,
    Clock,
    Users,
    Download,
    ChevronRight,
    Filter,
    SortAsc,
    Eye,
    Heart
} from 'lucide-react';

interface Book {
    id: string;
    title: string;
    slug: string;
    description: string;
    cover_image?: string;
    author: string;
    published_at: string;
    is_published: boolean;
    is_featured: boolean;
    price: number;
    rating?: number;
    downloads_count?: number;
    views_count?: number;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    books_count: number;
    published_books_count: number;
    image_url?: string;
    rumpun_display_name: string;
    books?: Book[];
}

interface CategoryShowPageProps {
    category: Category;
}

export default function CategoryShow() {
    const { category } = usePage<CategoryShowPageProps>().props;

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <PublicLayout 
            title={`${category.name} - Kategori Buku`} 
            description={category.description}
        >
            <Head title={`${category.name} - Kategori Buku`} />

            {/* Breadcrumb */}
            <section className="py-6 px-4 sm:px-6 bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-emerald-600 transition-colors">
                            Beranda
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link href="/categories" className="text-gray-500 hover:text-emerald-600 transition-colors">
                            Kategori
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-emerald-600 font-medium">{category.name}</span>
                    </nav>
                </div>
            </section>

            {/* Hero Section */}
            <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-emerald-50 to-cyan-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center"
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                    >
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Kategori
                        </Link>

                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                                <BookOpen className="w-4 h-4 mr-2" />
                                {category.rumpun_display_name}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                                {category.name}
                            </span>
                        </h1>

                        {category.description && (
                            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                {category.description}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-600 mb-1">
                                    {category.published_books_count || category.books_count}
                                </div>
                                <div className="text-sm text-gray-600">Buku Tersedia</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    4.8
                                </div>
                                <div className="text-sm text-gray-600">Rating Rata-rata</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-1">
                                    10K+
                                </div>
                                <div className="text-sm text-gray-600">Total Unduhan</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={`/books?category=${category.id}`}
                                className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <BookOpen className="w-5 h-5" />
                                Jelajahi Buku
                            </Link>
                            <button className="px-8 py-4 bg-white text-emerald-600 border border-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors duration-200 flex items-center justify-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filter & Urutkan
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Books Section */}
            {category.books && category.books.length > 0 ? (
                <section className="py-16 px-4 sm:px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Buku Terpopuler
                                </h2>
                                <p className="text-gray-600">
                                    Koleksi buku terbaik dalam kategori {category.name}
                                </p>
                            </div>
                            <Link
                                href={`/books?category=${category.id}`}
                                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                            >
                                Lihat Semua
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {category.books.slice(0, 8).map((book) => (
                                <motion.div
                                    key={book.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    variants={fadeInUp}
                                    whileHover={{ y: -8 }}
                                >
                                    <Link href={`/books/${book.slug}`} className="block">
                                        {/* Book Cover */}
                                        <div className="aspect-[3/4] bg-gradient-to-br from-emerald-100 to-cyan-100 relative overflow-hidden">
                                            {book.cover_image ? (
                                                <img
                                                    src={book.cover_image}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-emerald-400" />
                                                </div>
                                            )}
                                            
                                            {book.is_featured && (
                                                <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                                                    Featured
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                                                {book.price > 0 ? `Rp ${book.price.toLocaleString()}` : 'Gratis'}
                                            </div>

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <Eye className="w-8 h-8 mx-auto mb-2" />
                                                    <span className="text-sm font-medium">Lihat Detail</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Book Info */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                                {book.title}
                                            </h3>
                                            
                                            <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                oleh {book.author}
                                            </p>
                                            
                                            {book.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {book.description}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center justify-between text-sm mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-gray-600 font-medium">{book.rating || '4.8'}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Download className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">{book.downloads_count || '1.2K'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">{book.views_count || '5.8K'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium">
                                                    Lihat Buku
                                                </button>
                                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            ) : (
                /* No books section */
                <section className="py-16 px-4 sm:px-6 bg-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Belum Ada Buku Tersedia
                        </h3>
                        <p className="text-gray-600 mb-8">
                            Kategori {category.name} belum memiliki buku yang dipublikasikan. 
                            Silakan cek kategori lain atau kembali lagi nanti.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/categories"
                                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-medium"
                            >
                                Lihat Kategori Lain
                            </Link>
                            <Link
                                href="/books"
                                className="px-6 py-3 bg-white text-emerald-600 border border-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors duration-200 font-medium"
                            >
                                Jelajahi Semua Buku
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Categories */}
            <section className="py-16 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Kategori Terkait
                        </h2>
                        <p className="text-gray-600">
                            Jelajahi kategori lain dalam rumpun {category.rumpun_display_name}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder untuk related categories - nanti bisa diganti dengan data real */}
                        {['Matematika', 'Fisika', 'Kimia'].map((categoryName, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer"
                                whileHover={{ y: -4 }}
                            >
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                                    <BookOpen className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {categoryName}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Deskripsi kategori {categoryName.toLowerCase()} yang akan ditampilkan di sini.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{15 + index * 5} buku</span>
                                    <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-emerald-600 to-cyan-600">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Siap Menerbitkan Buku {category.name}?
                        </h2>
                        <p className="text-xl text-emerald-100 mb-8">
                            Bergabunglah dengan ribuan penulis yang telah mempercayai platform kami 
                            untuk menerbitkan karya ilmiah berkualitas tinggi.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                Mulai Menerbitkan
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/about"
                                className="px-8 py-4 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors duration-200 border border-emerald-500"
                            >
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}