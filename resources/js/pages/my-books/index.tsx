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
    BarChart3,
    TrendingUp,
    Award,
    Target
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
        if (percentage === 0) return 'bg-gray-300';
        if (percentage < 25) return 'bg-amber-500';
        if (percentage < 50) return 'bg-yellow-500';
        if (percentage < 75) return 'bg-blue-500';
        if (percentage < 100) return 'bg-indigo-500';
        return 'bg-emerald-500';
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

            {/* Modern Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-[65vh]">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0">
                    {/* Multiple gradient layers for depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-transparent to-indigo-100/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-indigo-50/60"></div>
                    
                    {/* Large gradient orbs */}
                    <div className="absolute top-10 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-indigo-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute -top-32 right-10 w-80 h-80 bg-gradient-to-bl from-indigo-200/35 to-purple-200/25 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-gradient-to-tr from-blue-150/30 to-cyan-200/20 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-200/25 to-indigo-200/20 rounded-full blur-2xl"></div>
                    
                    {/* Subtle overlay pattern */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="h-full w-full" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59,130,246,0.4) 1px, transparent 0)`,
                            backgroundSize: '60px 60px'
                        }}></div>
                    </div>
                    
                    {/* Light overlay for better text contrast */}
                    <div className="absolute inset-0 bg-white/10"></div>
                </div>

                <div className="relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                        {/* Header Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.2, 0.9] }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/90 backdrop-blur-xl rounded-3xl mb-8 shadow-2xl border border-blue-200/30 ring-1 ring-white/50">
                                <BookOpen className="h-12 w-12 text-blue-600" />
                            </div>
                            
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                                Koleksi <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">Buku Saya</span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                                Kelola dan lanjutkan bacaan dari koleksi buku digital Anda dengan mudah
                            </p>
                        </motion.div>

                        {/* Modern Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.6, 0.05, 0.2, 0.9] }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                        >
                            <StatCard 
                                icon={BookOpen}
                                value={stats.total_books}
                                label="Buku Lengkap"
                                color="blue"
                            />
                            {stats.total_chapters && (
                                <StatCard 
                                    icon={Target}
                                    value={stats.total_chapters}
                                    label="Bab Dibeli"
                                    color="indigo"
                                />
                            )}
                            <StatCard 
                                icon={TrendingUp}
                                value={stats.total_chapters_read}
                                label="Bab Dibaca"
                                color="emerald"
                            />
                            <StatCard 
                                icon={Clock}
                                value={formatReadingTime(stats.total_reading_time)}
                                label="Waktu Baca"
                                color="amber"
                            />
                            <StatCard 
                                icon={Award}
                                value={stats.books_completed}
                                label="Buku Selesai"
                                color="green"
                            />
                            {stats.chapters_completed !== undefined && (
                                <StatCard 
                                    icon={Target}
                                    value={stats.chapters_completed}
                                    label="Bab Selesai"
                                    color="purple"
                                />
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Modern Filter Bar */}
            <section className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-200/40 shadow-lg shadow-blue-100/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari buku atau chapter..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 bg-white shadow-sm text-sm"
                            />
                        </div>

                        {/* Filter Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            <FilterSelect
                                value={filterType}
                                onChange={(value) => setFilterType(value as FilterType)}
                                icon={Filter}
                                options={[
                                    { value: 'all', label: 'Semua Jenis' },
                                    { value: 'books', label: 'Buku Lengkap' },
                                    { value: 'chapters', label: 'Chapter' }
                                ]}
                            />

                            <FilterSelect
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                icon={Tag}
                                options={[
                                    { value: 'all', label: 'Semua Kategori' },
                                    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                                ]}
                            />

                            <FilterSelect
                                value={sortBy}
                                onChange={(value) => setSortBy(value as SortBy)}
                                icon={BarChart3}
                                options={[
                                    { value: 'recent', label: 'Terakhir Dibaca' },
                                    { value: 'purchased', label: 'Terakhir Dibeli' },
                                    { value: 'title', label: 'Judul A-Z' },
                                    { value: 'progress', label: 'Progress' }
                                ]}
                            />

                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clean Content Section */}
            <section className="min-h-screen bg-white">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredPurchases.length === 0 ? (
                            <EmptyState 
                                searchQuery={searchQuery}
                                selectedCategory={selectedCategory}
                                filterType={filterType}
                            />
                        ) : (
                            <AnimatePresence mode="wait">
                                {viewMode === 'grid' ? (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
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

// Modern Stat Card Component
const StatCard = ({ icon: Icon, value, label, color }: {
    icon: any;
    value: string | number;
    label: string;
    color: string;
}) => {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-300/60 text-blue-700 bg-white/80',
        indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-300/60 text-indigo-700 bg-white/80',
        emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-300/60 text-emerald-700 bg-white/80',
        amber: 'from-amber-500/20 to-amber-600/10 border-amber-300/60 text-amber-700 bg-white/80',
        green: 'from-green-500/20 to-green-600/10 border-green-300/60 text-green-700 bg-white/80',
        purple: 'from-purple-500/20 to-purple-600/10 border-purple-300/60 text-purple-700 bg-white/80'
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl p-6 border text-center hover:scale-105 transition-all duration-300 group shadow-xl hover:shadow-2xl`}>
            <div className="flex items-center justify-center mb-3">
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
                {value}
            </div>
            <div className="text-sm text-gray-600 font-medium">
                {label}
            </div>
        </div>
    );
};

// Modern Filter Select Component
const FilterSelect = ({ value, onChange, icon: Icon, options }: {
    value: string;
    onChange: (value: string) => void;
    icon: any;
    options: Array<{ value: string; label: string }>;
}) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 text-sm font-medium shadow-sm cursor-pointer transition-all"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
);

// Modern Empty State Component
const EmptyState = ({ searchQuery, selectedCategory, filterType }: {
    searchQuery: string;
    selectedCategory: string;
    filterType: string;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-24"
    >
        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <BookOpen className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {searchQuery || selectedCategory !== 'all' || filterType !== 'all' 
                ? 'Tidak ada hasil ditemukan' 
                : 'Belum ada buku'
            }
        </h3>
        <p className="text-gray-600 mb-12 max-w-md mx-auto text-lg leading-relaxed">
            {searchQuery || selectedCategory !== 'all' || filterType !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian' 
                : 'Mulai jelajahi koleksi buku digital kami'
            }
        </p>
        {!searchQuery && selectedCategory === 'all' && filterType === 'all' && (
            <Link
                href="/books"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                Jelajahi Buku
                <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
        )}
    </motion.div>
);

// Modern Grid Card Component
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:border-gray-300/60 hover:-translate-y-2">
                {/* Book Cover */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {/* Purchase Type Badge */}
                    {purchase.is_chapter_purchase && (
                        <div className="absolute top-4 left-4 z-10">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-lg backdrop-blur-sm">
                                Bab {purchase.chapter?.chapter_number}
                            </span>
                        </div>
                    )}
                    
                    {book.cover_image ? (
                        <img 
                            src={book.cover_image} 
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-gray-400" />
                        </div>
                    )}
                    
                    {/* Progress Badge */}
                    <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
                            progress_percentage === 100 ? 'bg-emerald-500' : 
                            progress_percentage > 0 ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                            {progress_percentage}%
                        </div>
                    </div>

                    {/* Featured Badge */}
                    {book.is_featured && (
                        <div className={`absolute ${purchase.is_chapter_purchase ? 'bottom-4 left-4' : 'top-4 left-4'}`}>
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                                ⭐ Featured
                            </div>
                        </div>
                    )}
                </div>

                {/* Book Info */}
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                            {book.title}
                            {purchase.is_chapter_purchase && purchase.chapter && (
                                <span className="block text-sm font-medium text-blue-600 mt-2">
                                    {purchase.chapter.title}
                                </span>
                            )}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{book.author.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Tag className="h-4 w-4" />
                                <span>{book.category.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span className="font-semibold text-gray-700">
                                {getProgressText(progress_percentage)}
                            </span>
                            <span className="text-gray-500 font-medium">
                                {progress_percentage}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(progress_percentage)}`}
                                style={{ width: `${progress_percentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Book Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
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
                        href={`/books/${book.slug}`}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-4 rounded-xl transition-all duration-200 font-semibold text-center block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        {progress_percentage > 0 ? 'Lanjutkan Baca' : 'Mulai Baca'}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

// Modern List Card Component
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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:border-gray-300/60">
                <div className="flex">
                    {/* Book Cover */}
                    <div className="relative w-40 h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                        {/* Purchase Type Badge */}
                        {purchase.is_chapter_purchase && (
                            <div className="absolute top-3 left-3 z-10">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-lg">
                                    Bab {purchase.chapter?.chapter_number}
                                </span>
                            </div>
                        )}
                        
                        {book.cover_image ? (
                            <img 
                                src={book.cover_image} 
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                        
                        {/* Progress Badge */}
                        <div className="absolute top-3 right-3">
                            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-lg ${
                                progress_percentage === 100 ? 'bg-emerald-500' : 
                                progress_percentage > 0 ? 'bg-blue-500' : 'bg-gray-500'
                            }`}>
                                {progress_percentage}%
                            </div>
                        </div>

                        {/* Featured Badge */}
                        {book.is_featured && (
                            <div className="absolute bottom-3 left-3">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
                                    ⭐
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1 pr-6">
                                <h3 className="font-bold text-gray-900 text-2xl mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                    {book.title}
                                    {purchase.is_chapter_purchase && purchase.chapter && (
                                        <span className="block text-lg font-medium text-blue-600 mt-2">
                                            {purchase.chapter.title}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex flex-wrap items-center gap-8 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{book.author.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        <span>{book.category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{book.total_chapters} bab</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatReadingTime(book.reading_time_minutes)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between text-sm mb-4">
                                <span className="font-semibold text-gray-700 text-base">
                                    {getProgressText(progress_percentage)}
                                </span>
                                <span className="text-gray-500 font-medium text-base">
                                    {progress_percentage}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div 
                                    className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(progress_percentage)}`}
                                    style={{ width: `${progress_percentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-end justify-between">
                            <div className="text-sm text-gray-400 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Dibeli: {formatDate(purchased_at)}</span>
                                </div>
                                {last_read_at && (
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span>Terakhir: {formatDate(last_read_at)}</span>
                                    </div>
                                )}
                            </div>

                            <Link
                                href={`/books/${book.slug}`}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-8 rounded-xl transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                {progress_percentage > 0 ? 'Lanjutkan' : 'Mulai'}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};