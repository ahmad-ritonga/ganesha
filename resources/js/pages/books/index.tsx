import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    Search,
    Grid3X3,
    List,
    Star,
    Clock,
    User,
    Tag,
    Eye
} from 'lucide-react';
import { useState } from 'react';

interface Author {
    id: string;
    name: string;
    email: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Book {
    id: string;
    title: string;
    slug: string;
    description: string;
    cover_image?: string;
    author: Author;
    category: Category;
    isbn?: string;
    publication_date: string;
    price: number;
    discount_percentage?: number;
    is_published: boolean;
    is_featured: boolean;
    total_chapters: number;
    reading_time_minutes: number;
    language: string;
    tags?: string[];
}

interface BooksPageProps {
    books?: {
        data: Book[];
        links?: any[];
        meta?: any;
    };
}

export default function BooksIndex() {
    const pageProps = usePage<BooksPageProps>().props;
    const { books } = pageProps;
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('latest');

    const filteredBooks = (books?.data || []).filter(book =>
        book && 
        book.title && 
        book.author?.name &&
        book.category?.name &&
        (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedBooks = [...(filteredBooks || [])].sort((a, b) => {
        if (!a || !b) return 0;
        
        switch (sortBy) {
            case 'title':
                return (a.title || '').localeCompare(b.title || '');
            case 'author':
                return (a.author?.name || '').localeCompare(b.author?.name || '');
            case 'price-low':
                return (a.price || 0) - (b.price || 0);
            case 'price-high':
                return (b.price || 0) - (a.price || 0);
            case 'latest':
            default:
                return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
        }
    });

    // Separate featured and regular books
    const featuredBooks = (books?.data || []).filter(book => book?.is_featured && book?.is_published);
    const regularBooks = (sortedBooks || []).filter(book => book && !book.is_featured);

    const formatPrice = (price: number, discount?: number) => {
        if (discount && discount > 0) {
            const discountedPrice = price * (1 - discount / 100);
            return {
                original: new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(price),
                discounted: new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(discountedPrice),
                discount: `${discount}%`
            };
        }
        return {
            original: new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price),
            discounted: null,
            discount: null
        };
    };

    const formatReadingTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) {
            return `${hours}j ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <PublicLayout>
            <Head title="E-Books" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Koleksi E-Books
                            <span className="block bg-gradient-to-r from-green-200 to-green-100 bg-clip-text text-transparent">
                                Premium
                            </span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-green-50 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Jelajahi ribuan buku digital berkualitas tinggi dari berbagai kategori dan penulis terpercaya
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                                <BookOpen className="w-5 h-5 text-green-100" />
                                <span className="font-medium text-white">{books?.data?.length || 0} E-Books</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                                <Star className="w-5 h-5 text-yellow-300" />
                                <span className="font-medium text-white">Konten Berkualitas</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 bg-white border-b border-gray-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="flex flex-col lg:flex-row gap-6 items-start lg:items-end"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Search */}
                        <div className="w-full lg:flex-1 lg:max-w-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Cari E-Books
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari judul, penulis, atau kategori..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full lg:w-auto">
                            {/* Sort */}
                            <div className="w-full sm:w-auto">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Urutkan
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full sm:w-48 px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-sm"
                                >
                                    <option value="latest">Terbaru</option>
                                    <option value="title">Judul A-Z</option>
                                    <option value="author">Penulis A-Z</option>
                                    <option value="price-low">Harga Terendah</option>
                                    <option value="price-high">Harga Tertinggi</option>
                                </select>
                            </div>

                            {/* View Mode */}
                            <div className="w-full sm:w-auto">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Tampilan
                                </label>
                                <div className="flex bg-gray-100 rounded-xl overflow-hidden p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            viewMode === 'grid' 
                                                ? 'bg-white text-green-600 shadow-sm font-medium' 
                                                : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                        <span className="text-sm hidden sm:inline">Grid</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            viewMode === 'list' 
                                                ? 'bg-white text-green-600 shadow-sm font-medium' 
                                                : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    >
                                        <List className="w-4 h-4" />
                                        <span className="text-sm hidden sm:inline">List</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Books Section */}
            {featuredBooks.length > 0 && (
                <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-50 px-6 py-3 rounded-full border border-green-200 mb-6">
                                <Star className="w-5 h-5 text-green-600" />
                                <span className="text-green-700 font-semibold text-sm uppercase tracking-wide">Pilihan Terbaik</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Disarankan untuk Anda
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Koleksi e-books pilihan yang paling populer dan direkomendasikan
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredBooks.slice(0, 4).map((book, index) => {
                                const priceInfo = formatPrice(book.price, book.discount_percentage);
                                
                                return (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            duration: 0.4, 
                                            delay: index * 0.1,
                                            ease: "easeOut"
                                        }}
                                        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 flex flex-col h-full"
                                    >
                                        {/* Book Cover */}
                                        <div className="relative overflow-hidden">
                                            <Link href={`/books/${book.slug}`} className="block">
                                                <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                                                    {book.cover_image ? (
                                                        <img 
                                                            src={book.cover_image} 
                                                            alt={book.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <BookOpen className="w-16 h-16 text-gray-400" />
                                                    )}
                                                    
                                                    {/* Featured Badge */}
                                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="hidden sm:inline">Pilihan</span>
                                                    </div>
                                                    
                                                    {/* Discount Badge */}
                                                    {priceInfo.discount && (
                                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            -{priceInfo.discount}
                                                        </div>
                                                    )}

                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Book Info */}
                                        <div className="p-4 sm:p-6 flex flex-col flex-1">
                                            <Link 
                                                href={`/books/${book.slug}`}
                                                className="block text-lg sm:text-xl font-bold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-3 min-h-[3.5rem] leading-tight"
                                            >
                                                {book.title}
                                            </Link>

                                            <div className="space-y-2 mb-4 flex-1">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="font-medium text-sm truncate">{book.author.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                                                        <span>{book.total_chapters} Bab</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 flex-shrink-0" />
                                                        <span>{formatReadingTime(book.reading_time_minutes)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price and Actions */}
                                            <div className="flex items-end justify-between pt-4 border-t border-gray-100 mt-auto">
                                                <div className="flex flex-col">
                                                    {priceInfo.discounted ? (
                                                        <>
                                                            <span className="text-lg sm:text-xl font-bold text-green-600 leading-tight">
                                                                {priceInfo.discounted}
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-gray-500 line-through leading-tight">
                                                                {priceInfo.original}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg sm:text-xl font-bold text-green-600 leading-tight">
                                                            {priceInfo.original}
                                                        </span>
                                                    )}
                                                </div>

                                                <Link 
                                                    href={`/books/${book.slug}`}
                                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Detail</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Books Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {regularBooks.length > 0 ? (
                        <>
                            <motion.div 
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {featuredBooks.length > 0 ? 'Semua E-Books' : 'E-Books Tersedia'}
                                    </h2>
                                    <p className="text-gray-600">
                                        Menampilkan {regularBooks.length} dari {books?.meta?.total || books?.data?.length || 0} e-books
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
                                        <span className="text-gray-500">Total: </span>
                                        <span className="font-semibold text-green-600">{books?.data?.length || 0}</span>
                                    </div>
                                    {featuredBooks.length > 0 && (
                                        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
                                            <span className="text-gray-500">Pilihan: </span>
                                            <span className="font-semibold text-yellow-600">{featuredBooks.length}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Books Grid/List */}
                            <div className={
                                viewMode === 'grid' 
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                    : "space-y-6"
                            }>
                                {regularBooks.map((book, index) => {
                                    const priceInfo = formatPrice(book.price, book.discount_percentage);
                                    
                                    return (
                                        <motion.div
                                            key={book.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ 
                                                duration: 0.3, 
                                                delay: Math.min(index * 0.05, 0.3),
                                                ease: "easeOut"
                                            }}
                                            className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-200 ${
                                                viewMode === 'list' ? 'flex gap-4 sm:gap-6 p-4 sm:p-6' : 'overflow-hidden flex flex-col h-full'
                                            }`}
                                        >
                                            {/* Book Cover */}
                                            <div className={viewMode === 'list' ? 'flex-shrink-0' : 'relative overflow-hidden'}>
                                                <Link href={`/books/${book.slug}`} className="block">
                                                    <div className={`${
                                                        viewMode === 'list' ? 'w-24 sm:w-28 h-32 sm:h-40 rounded-lg' : 'w-full h-48 sm:h-56'
                                                    } bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden`}>
                                                        {book.cover_image ? (
                                                            <img 
                                                                src={book.cover_image} 
                                                                alt={book.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <BookOpen className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
                                                        )}
                                                        
                                                        {/* Discount Badge */}
                                                        {priceInfo.discount && (
                                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                                                                -{priceInfo.discount}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Book Info */}
                                            <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : 'p-4 sm:p-5 flex flex-col flex-1'}`}>
                                                <Link 
                                                    href={`/books/${book.slug}`}
                                                    className={`font-bold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-3 ${
                                                        viewMode === 'list' ? 'text-base sm:text-lg' : 'text-lg min-h-[3rem]'
                                                    }`}
                                                >
                                                    {book.title}
                                                </Link>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <User className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="font-medium text-sm truncate">{book.author.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Tag className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-sm truncate">{book.category.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen className="w-4 h-4 flex-shrink-0" />
                                                            <span>{book.total_chapters} Bab</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4 flex-shrink-0" />
                                                            <span>{formatReadingTime(book.reading_time_minutes)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {viewMode === 'list' && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 hidden sm:block">
                                                        {book.description}
                                                    </p>
                                                )}

                                                {/* Tags */}
                                                {book.tags && book.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                                                        {book.tags.slice(0, viewMode === 'list' ? 3 : 2).map((tag, tagIndex) => (
                                                            <span
                                                                key={tagIndex}
                                                                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100 truncate"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {book.tags.length > (viewMode === 'list' ? 3 : 2) && (
                                                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                                                                +{book.tags.length - (viewMode === 'list' ? 3 : 2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Price and Actions */}
                                                <div className={`flex items-center justify-between pt-4 border-t border-gray-100 ${viewMode === 'grid' ? 'mt-auto' : ''}`}>
                                                    <div className="flex flex-col">
                                                        {priceInfo.discounted ? (
                                                            <>
                                                                <span className={`font-bold text-green-600 leading-tight ${
                                                                    viewMode === 'list' ? 'text-lg sm:text-xl' : 'text-lg'
                                                                }`}>
                                                                    {priceInfo.discounted}
                                                                </span>
                                                                <span className="text-xs sm:text-sm text-gray-500 line-through leading-tight">
                                                                    {priceInfo.original}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className={`font-bold text-green-600 leading-tight ${
                                                                viewMode === 'list' ? 'text-lg sm:text-xl' : 'text-lg'
                                                            }`}>
                                                                {priceInfo.original}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Link 
                                                        href={`/books/${book.slug}`}
                                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className={viewMode === 'list' ? 'hidden sm:inline' : 'hidden sm:inline'}>
                                                            {viewMode === 'list' ? 'Detail' : 'Detail'}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {books?.links && books?.links.length > 3 && (
                                <motion.div 
                                    className="mt-12 flex justify-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <div className="flex gap-2">
                                        {books?.links?.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 text-gray-400 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                                                        link.active 
                                                            ? 'bg-green-500 text-white shadow-md' 
                                                            : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-200'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div 
                            className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Tidak ada e-books ditemukan
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm 
                                        ? `Tidak ada e-books yang sesuai dengan pencarian "${searchTerm}". Coba gunakan kata kunci yang berbeda.`
                                        : 'Belum ada e-books yang tersedia saat ini. Silakan cek kembali nanti.'
                                    }
                                </p>
                                {searchTerm && (
                                    <motion.button
                                        onClick={() => setSearchTerm('')}
                                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        Hapus Filter Pencarian
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}