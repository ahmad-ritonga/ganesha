import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { 
    BookOpen, 
    Search, 
    Filter, 
    Grid3X3, 
    List, 
    Calendar, 
    Clock, 
    Eye,
    ChevronRight,
    User,
    Tag,
    BarChart3
} from 'lucide-react';

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
    price: number;
    discount_percentage?: number;
    is_featured: boolean;
    total_chapters: number;
    reading_time_minutes: number;
    language: string;
    tags?: string[];
    purchased_at: string;
    progress_percentage?: number;
    last_read_at?: string;
    chapters_read?: number;
}

interface UserPurchase {
    id: string;
    book: Book;
    purchased_at: string;
    expires_at?: string;
    progress_percentage: number;
    last_read_at?: string;
    chapters_read: number;
    is_chapter_purchase?: boolean;
    chapter?: {
        id: string;
        title: string;
        chapter_number: number;
    };
}

interface MyBooksProps {
    purchases: UserPurchase[];
    stats: {
        total_books: number;
        total_chapters?: number;
        total_chapters_read: number;
        total_reading_time: number;
        books_completed: number;
        chapters_completed?: number;
    };
    [key: string]: any;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'recent' | 'title' | 'progress' | 'purchased';
type FilterType = 'all' | 'books' | 'chapters';

export default function MyBooks() {
    const { purchases, stats, auth } = usePage<MyBooksProps>().props;
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('recent');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [filteredPurchases, setFilteredPurchases] = useState<UserPurchase[]>(purchases);

    // Get unique categories for filter
    const categories = Array.from(
        new Set(purchases.map(p => p.book.category.id))
    ).map(id => purchases.find(p => p.book.category.id === id)?.book.category)
    .filter(Boolean) as Category[];

    // Filter and sort logic
    useEffect(() => {
        let filtered = [...purchases];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(purchase => 
                purchase.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                purchase.book.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                purchase.book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (purchase.chapter?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(purchase => 
                purchase.book.category.id === selectedCategory
            );
        }

        // Type filter (books vs chapters)
        if (filterType !== 'all') {
            if (filterType === 'books') {
                filtered = filtered.filter(purchase => !purchase.is_chapter_purchase);
            } else if (filterType === 'chapters') {
                filtered = filtered.filter(purchase => purchase.is_chapter_purchase);
            }
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.book.title.localeCompare(b.book.title);
                case 'progress':
                    return b.progress_percentage - a.progress_percentage;
                case 'purchased':
                    return new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime();
                case 'recent':
                default:
                    const aLastRead = a.last_read_at ? new Date(a.last_read_at).getTime() : 0;
                    const bLastRead = b.last_read_at ? new Date(b.last_read_at).getTime() : 0;
                    return bLastRead - aLastRead;
            }
        });

        setFilteredPurchases(filtered);
    }, [purchases, searchQuery, selectedCategory, sortBy, filterType]);

    // Helper functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatReadingTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) {
            return `${hours}j ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    const getProgressColor = (percentage: number) => {
        if (percentage === 0) return 'bg-slate-300';
        if (percentage < 25) return 'bg-amber-400';
        if (percentage < 50) return 'bg-yellow-400';
        if (percentage < 75) return 'bg-blue-400';
        if (percentage < 100) return 'bg-indigo-400';
        return 'bg-emerald-400';
    };

    const getProgressText = (percentage: number) => {
        if (percentage === 0) return 'Belum Dimulai';
        if (percentage < 25) return 'Baru Dimulai';
        if (percentage < 50) return 'Sedang Dibaca';
        if (percentage < 75) return 'Hampir Selesai';
        if (percentage === 100) return 'Selesai';
        return 'Dalam Progress';
    };

    return (
        <PublicLayout>
            <Head title="Buku Saya" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0">
                    {/* Subtle geometric patterns */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-100/40 rounded-full blur-lg"></div>
                    <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-100/30 rounded-full blur-lg"></div>
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-200/25 rounded-full blur-md"></div>
                    
                    {/* Floating book icons */}
                    <div className="absolute top-32 right-10 opacity-10">
                        <BookOpen className="w-16 h-16 text-blue-400 transform rotate-12" />
                    </div>
                    <div className="absolute bottom-32 left-20 opacity-8">
                        <BookOpen className="w-12 h-12 text-indigo-400 transform -rotate-6" />
                    </div>
                    
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20"></div>
                </div>

                <div className="relative pt-32 pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6 shadow-lg shadow-blue-100/50 ring-1 ring-blue-200/30">
                                <BookOpen className="h-10 w-10 text-blue-600" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                                Koleksi Buku Saya
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Kelola dan lanjutkan bacaan dari koleksi buku digital Anda dengan mudah
                            </p>
                        </motion.div>

                        {/* Stats Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6"
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/60 text-center shadow-lg hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 hover:bg-white/90">
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {stats.total_books}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Buku Lengkap</div>
                            </div>
                            {stats.total_chapters && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/60 text-center shadow-lg hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 hover:bg-white/90">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {stats.total_chapters}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Bab Dibeli</div>
                                </div>
                            )}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/60 text-center shadow-lg hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 hover:bg-white/90">
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {stats.total_chapters_read}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Bab Dibaca</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/60 text-center shadow-lg hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 hover:bg-white/90">
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {formatReadingTime(stats.total_reading_time)}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Waktu Baca</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/60 text-center shadow-lg hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 hover:bg-white/90">
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {stats.books_completed}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Buku Selesai</div>
                            </div>
                            {stats.chapters_completed !== undefined && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/60 text-center shadow-lg hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 hover:bg-white/90">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {stats.chapters_completed}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Bab Selesai</div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filter and Search Section */}
            <section className="bg-white/95 backdrop-blur-md border-b border-blue-100/60 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari buku atau chapter..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 bg-white shadow-sm"
                            />
                        </div>

                        {/* Filters and View Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Type Filter */}
                            <div className="relative">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                                    className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-700 text-sm font-medium shadow-sm cursor-pointer"
                                >
                                    <option value="all">Semua Jenis</option>
                                    <option value="books">Buku Lengkap</option>
                                    <option value="chapters">Chapter</option>
                                </select>
                                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-700 text-sm font-medium shadow-sm cursor-pointer"
                                >
                                    <option value="all">Semua Kategori</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                                    className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-700 text-sm font-medium shadow-sm cursor-pointer"
                                >
                                    <option value="recent">Terakhir Dibaca</option>
                                    <option value="purchased">Terakhir Dibeli</option>
                                    <option value="title">Judul A-Z</option>
                                    <option value="progress">Progress</option>
                                </select>
                                <BarChart3 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* View Toggle */}
                            <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 transition-all duration-200 ${
                                        viewMode === 'grid' 
                                            ? 'bg-blue-50 text-blue-600 shadow-sm' 
                                            : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Grid3X3 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 transition-all duration-200 border-l border-gray-200 ${
                                        viewMode === 'list' 
                                            ? 'bg-blue-50 text-blue-600 shadow-sm' 
                                            : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Books Section */}
            <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-100/25 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-50/30 rounded-full blur-3xl"></div>
                </div>

                <div className="relative py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredPurchases.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="text-center py-20"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                                    <BookOpen className="h-12 w-12 text-blue-500" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                    {searchQuery || selectedCategory !== 'all' || filterType !== 'all' ? 'Tidak ada hasil ditemukan' : 'Belum ada buku'}
                                </h3>
                                <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                                    {searchQuery || selectedCategory !== 'all' || filterType !== 'all'
                                        ? 'Coba ubah filter atau kata kunci pencarian' 
                                        : 'Mulai jelajahi koleksi buku digital kami'
                                    }
                                </p>
                                {!searchQuery && selectedCategory === 'all' && filterType === 'all' && (
                                    <Link
                                        href="/books"
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        Jelajahi Buku
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Link>
                                )}
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {viewMode === 'grid' ? (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                                    >
                                        {filteredPurchases.map((purchase, index) => (
                                            <BookCardGrid 
                                                key={purchase.id} 
                                                purchase={purchase} 
                                                index={index}
                                                formatDate={formatDate}
                                                formatReadingTime={formatReadingTime}
                                                getProgressColor={getProgressColor}
                                                getProgressText={getProgressText}
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {filteredPurchases.map((purchase, index) => (
                                            <BookCardList 
                                                key={purchase.id} 
                                                purchase={purchase} 
                                                index={index}
                                                formatDate={formatDate}
                                                formatReadingTime={formatReadingTime}
                                                getProgressColor={getProgressColor}
                                                getProgressText={getProgressText}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

// Grid View Component
const BookCardGrid = ({ 
    purchase, 
    index, 
    formatDate, 
    formatReadingTime, 
    getProgressColor, 
    getProgressText 
}: { 
    purchase: UserPurchase; 
    index: number;
    formatDate: (dateString: string) => string;
    formatReadingTime: (minutes: number) => string;
    getProgressColor: (percentage: number) => string;
    getProgressText: (percentage: number) => string;
}) => {
    const { book, progress_percentage, last_read_at, purchased_at } = purchase;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 group hover:border-slate-300/60 hover:bg-white/95"
        >
            {/* Book Cover */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {/* Purchase Type Badge */}
                {purchase.is_chapter_purchase && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg">
                            Bab {purchase.chapter?.chapter_number}
                        </span>
                    </div>
                )}
                
                {book.cover_image ? (
                    <img 
                        src={book.cover_image} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-slate-400" />
                    </div>
                )}
                
                {/* Progress Badge */}
                <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
                        progress_percentage === 100 ? 'bg-emerald-500' : 
                        progress_percentage > 0 ? 'bg-blue-500' : 'bg-slate-500'
                    }`}>
                        {progress_percentage}%
                    </div>
                </div>

                {/* Featured Badge */}
                {book.is_featured && (
                    <div className={`absolute ${purchase.is_chapter_purchase ? 'bottom-3 left-3' : 'top-3 left-3'}`}>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Featured
                        </div>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            {/* Book Info */}
            <div className="p-6">
                <div className="mb-5">
                    <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {book.title}
                        {purchase.is_chapter_purchase && purchase.chapter && (
                            <span className="block text-sm font-medium text-blue-600 mt-2">
                                {purchase.chapter.title}
                            </span>
                        )}
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{book.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Tag className="h-4 w-4" />
                            <span>{book.category.name}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                    <div className="flex items-center justify-between text-sm mb-3">
                        <span className="font-semibold text-slate-700">
                            {getProgressText(progress_percentage)}
                        </span>
                        <span className="text-slate-500 font-medium">
                            {progress_percentage}%
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(progress_percentage)}`}
                            style={{ width: `${progress_percentage}%` }}
                        />
                    </div>
                </div>

                {/* Book Stats */}
                <div className="flex items-center justify-between text-sm text-slate-500 mb-5">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium">{book.total_chapters} bab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{formatReadingTime(book.reading_time_minutes)}</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={purchase.is_chapter_purchase ? `/books/${book.slug}/chapter/${purchase.chapter?.chapter_number}` : `/books/${book.slug}`}
                    className="inline-flex w-full items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    {progress_percentage === 0 ? 'Mulai Baca' : progress_percentage === 100 ? 'Baca Ulang' : 'Lanjutkan Baca'}
                </Link>

                {/* Purchase and Last Read Info */}
                <div className="mt-5 text-xs text-slate-500 space-y-2">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Dibeli: {formatDate(purchased_at)}</span>
                    </div>
                    {last_read_at && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>Terakhir dibaca: {formatDate(last_read_at)}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// List View Component
const BookCardList = ({ 
    purchase, 
    index, 
    formatDate, 
    formatReadingTime, 
    getProgressColor, 
    getProgressText 
}: { 
    purchase: UserPurchase; 
    index: number;
    formatDate: (dateString: string) => string;
    formatReadingTime: (minutes: number) => string;
    getProgressColor: (percentage: number) => string;
    getProgressText: (percentage: number) => string;
}) => {
    const { book, progress_percentage, last_read_at, purchased_at } = purchase;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 group hover:border-slate-300/60 hover:bg-white/95 flex flex-col md:flex-row gap-6 p-6"
        >
            {/* Book Cover */}
            <div className="relative w-full md:w-48 aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden flex-shrink-0">
                {/* Purchase Type Badge */}
                {purchase.is_chapter_purchase && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg">
                            Bab {purchase.chapter?.chapter_number}
                        </span>
                    </div>
                )}
                
                {book.cover_image ? (
                    <img 
                        src={book.cover_image} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-slate-400" />
                    </div>
                )}
                
                {/* Progress Badge */}
                <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
                        progress_percentage === 100 ? 'bg-emerald-500' : 
                        progress_percentage > 0 ? 'bg-blue-500' : 'bg-slate-500'
                    }`}>
                        {progress_percentage}%
                    </div>
                </div>

                {/* Featured Badge */}
                {book.is_featured && (
                    <div className={`absolute ${purchase.is_chapter_purchase ? 'bottom-3 left-3' : 'top-3 left-3'}`}>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Featured
                        </div>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            {/* Book Info */}
            <div className="flex-1">
                <div className="mb-5">
                    <h3 className="font-bold text-slate-900 text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {book.title}
                        {purchase.is_chapter_purchase && purchase.chapter && (
                            <span className="block text-sm font-medium text-blue-600 mt-2">
                                {purchase.chapter.title}
                            </span>
                        )}
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{book.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Tag className="h-4 w-4" />
                            <span>{book.category.name}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                    <div className="flex items-center justify-between text-sm mb-3">
                        <span className="font-semibold text-slate-700">
                            {getProgressText(progress_percentage)}
                        </span>
                        <span className="text-slate-500 font-medium">
                            {progress_percentage}%
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(progress_percentage)}`}
                            style={{ width: `${progress_percentage}%` }}
                        />
                    </div>
                </div>

                {/* Book Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 mb-5">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium">{book.total_chapters} bab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{formatReadingTime(book.reading_time_minutes)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Dibeli: {formatDate(purchased_at)}</span>
                    </div>
                    {last_read_at && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>Terakhir dibaca: {formatDate(last_read_at)}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={purchase.is_chapter_purchase ? `/books/${book.slug}/chapter/${purchase.chapter?.chapter_number}` : `/books/${book.slug}`}
                    className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    {progress_percentage === 0 ? 'Mulai Baca' : progress_percentage === 100 ? 'Baca Ulang' : 'Lanjutkan Baca'}
                </Link>
            </div>
        </motion.div>
    );
};