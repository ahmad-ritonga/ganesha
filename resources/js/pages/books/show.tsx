import { Head, Link, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    Clock, 
    Calendar, 
    Users, 
    Star, 
    Play, 
    ShoppingCart, 
    Lock, 
    ChevronRight, 
    ChevronDown,
    User,
    ExternalLink,
    Heart,
    Share2,
    CheckCircle,
    Tag,
    MessageCircle,
    Send,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating, { StarDisplay } from '@/components/ui/StarRating';

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

interface Chapter {
    id: string;
    title: string;
    chapter_number: number;
    is_published: boolean;
    is_free: boolean;
    reading_time_minutes: number;
    content?: string;
    excerpt?: string;
    price?: number;
}

interface Review {
    id: string;
    rating: number;
    review_text?: string;
    created_at: string;
    rating_text: string;
    created_at_formatted: string;
    created_at_human: string;
    user: {
        id: string;
        name: string;
        initials: string;
        avatar_url?: string;
    };
}

interface ReviewStats {
    average_rating: string;
    total_reviews: number;
    rating_distribution: Record<number, number>;
    rating_percentages: Record<number, number>;
}

interface UserReview {
    id: string;
    rating: number;
    review_text?: string;
    is_approved: boolean;
    created_at: string;
    rating_text: string;
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
    chapters: Chapter[];
}

interface BookShowProps {
    book: Book;
    relatedBooks?: Book[];
    userHasPurchased?: boolean;
    userPurchasedChapters?: string[]; // Array of chapter IDs that user has purchased
    [key: string]: any;
}

export default function BookShow() {
    const { book, relatedBooks = [], auth, userHasPurchased = false, userPurchasedChapters = [] } = usePage<BookShowProps>().props;
    const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'reviews'>('overview');
    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
    const [isPurchasing, setIsPurchasing] = useState(false);
    
    // Review states
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [userReview, setUserReview] = useState<UserReview | null>(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 0,
        review_text: ''
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    // Load reviews when component mounts or tab changes
    useEffect(() => {
        if (activeTab === 'reviews') {
            loadReviews();
            checkCanReview();
            loadUserReview();
        }
    }, [activeTab]);

    const loadReviews = async () => {
        try {
            setReviewsLoading(true);
            const response = await axios.get(`/api/books/${book.slug}/reviews`);
            setReviews(response.data.reviews.data || []);
            setReviewStats(response.data.stats);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const checkCanReview = async () => {
        if (!auth?.user) {
            setCanReview(false);
            return;
        }
        
        try {
            const response = await axios.get(`/api/books/${book.slug}/can-review`);
            setCanReview(response.data.can_review);
        } catch (error) {
            console.error('Error checking review permission:', error);
            setCanReview(false);
        }
    };

    const loadUserReview = async () => {
        if (!auth?.user) return;
        
        try {
            const response = await axios.get(`/api/books/${book.slug}/user-review`);
            setUserReview(response.data.review);
        } catch (error) {
            console.error('Error loading user review:', error);
        }
    };

    const submitReview = async () => {
        if (!reviewForm.rating) return;
        
        try {
            setSubmitLoading(true);
            const response = await axios.post(`/api/books/${book.slug}/reviews`, reviewForm);
            
            if (response.data.success) {
                setUserReview(response.data.review);
                setShowReviewForm(false);
                setReviewForm({ rating: 0, review_text: '' });
                loadReviews(); // Reload reviews
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const updateReview = async () => {
        if (!userReview || !reviewForm.rating) return;
        
        try {
            setSubmitLoading(true);
            const response = await axios.put(`/api/reviews/${userReview.id}`, reviewForm);
            
            if (response.data.success) {
                setUserReview(response.data.review);
                setShowReviewForm(false);
                loadReviews(); // Reload reviews
            }
        } catch (error) {
            console.error('Error updating review:', error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const deleteReview = async () => {
        if (!userReview) return;
        
        try {
            const response = await axios.delete(`/api/reviews/${userReview.id}`);
            
            if (response.data.success) {
                setUserReview(null);
                setCanReview(true);
                loadReviews(); // Reload reviews
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const formatPrice = (price: number, discount?: number) => {
        const formatRupiah = (amount: number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
        };

        if (discount && discount > 0) {
            const discountedPrice = price * (1 - discount / 100);
            return {
                original: formatRupiah(price),
                discounted: formatRupiah(discountedPrice),
                discount: `${discount}%`
            };
        }
        return {
            original: formatRupiah(price),
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const toggleChapterExpansion = (chapterId: string) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    const canReadChapter = (chapter: any) => {
        return chapter.is_free || userHasPurchased || userPurchasedChapters.includes(chapter.id);
    };

    const formatLanguage = (languageCode: string) => {
        const languages: Record<string, string> = {
            'id': 'Bahasa Indonesia',
            'en': 'English',
            'ms': 'Bahasa Malaysia',
        };
        return languages[languageCode] || languageCode;
    };

    // Payment handling
    const handlePurchaseBook = async () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        if (userHasPurchased) {
            // Already purchased, maybe redirect to reading page
            return;
        }

        setIsPurchasing(true);
        try {
            router.post(route('payment.book', book.id));
        } catch (error) {
            console.error('Purchase failed:', error);
            setIsPurchasing(false);
        }
    };

    const handlePurchaseChapter = async (chapterId: string) => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        setIsPurchasing(true);
        try {
            router.post(route('payment.chapter', chapterId));
        } catch (error) {
            console.error('Chapter purchase failed:', error);
            setIsPurchasing(false);
        }
    };

    const priceInfo = formatPrice(book.price, book.discount_percentage);
    const freeChapters = book.chapters.filter(chapter => chapter.is_free && chapter.is_published);
    const paidChapters = book.chapters.filter(chapter => !chapter.is_free && chapter.is_published);

    return (
        <PublicLayout>
            <Head title={book.title} />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center py-4 text-sm text-gray-600">
                        <Link 
                            href="/" 
                            className="hover:text-emerald-600 transition-colors duration-200 font-medium"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        <Link 
                            href="/books" 
                            className="hover:text-emerald-600 transition-colors duration-200 font-medium"
                        >
                            E-Books
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
                            {book.title}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Book Details */}
            <section className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Book Cover & Actions */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="lg:sticky lg:top-8"
                            >
                                {/* Cover */}
                                <div className="relative mb-6">
                                    <div className="w-full aspect-[3/4] max-w-sm mx-auto lg:max-w-none bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center relative overflow-hidden rounded-xl shadow-xl">
                                        {book.cover_image ? (
                                            <img 
                                                src={book.cover_image} 
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-600" />
                                        )}
                                        
                                        {/* Featured Badge */}
                                        {book.is_featured && (
                                            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                                                Featured
                                            </div>
                                        )}
                                        
                                        {/* Discount Badge */}
                                        {priceInfo.discount && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                                                -{priceInfo.discount}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6 text-center">
                                    {priceInfo.discounted ? (
                                        <>
                                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">
                                                {priceInfo.discounted}
                                            </div>
                                            <div className="text-base sm:text-lg text-gray-500 line-through mb-1">
                                                {priceInfo.original}
                                            </div>
                                            <div className="text-sm text-red-600 font-semibold">
                                                Hemat {priceInfo.discount}!
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                                            {priceInfo.original}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {userHasPurchased ? (
                                        <button 
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg"
                                            disabled
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Sudah Dibeli
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handlePurchaseBook}
                                            disabled={isPurchasing}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                                        >
                                            {isPurchasing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-5 h-5" />
                                                    Beli Sekarang
                                                </>
                                            )}
                                        </button>
                                    )}
                                    
                                    {freeChapters.length > 0 && (
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                            <Play className="w-5 h-5" />
                                            Baca Gratis ({freeChapters.length} Bab)
                                        </button>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium">
                                            <Heart className="w-4 h-4" />
                                            <span className="hidden sm:inline">Favorit</span>
                                        </button>
                                        <button className="border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium">
                                            <Share2 className="w-4 h-4" />
                                            <span className="hidden sm:inline">Bagikan</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Book Stats */}
                                <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Buku</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Total Bab</span>
                                            <span className="font-semibold text-gray-900">{book.total_chapters}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Waktu Baca</span>
                                            <span className="font-semibold text-gray-900">{formatReadingTime(book.reading_time_minutes)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Bahasa</span>
                                            <span className="font-semibold text-gray-900">{formatLanguage(book.language)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Terbit</span>
                                            <span className="font-semibold text-gray-900">{formatDate(book.publication_date)}</span>
                                        </div>
                                        {book.isbn && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 font-medium">ISBN</span>
                                                <span className="font-semibold text-gray-900 text-sm">{book.isbn}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Book Info */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8"
                            >
                                {/* Title & Meta */}
                                <div className="mb-8">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                        {book.title}
                                    </h1>
                                    
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 text-gray-600 mb-6">
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-emerald-600" />
                                            <span className="font-medium">Oleh {book.author.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-5 h-5 text-emerald-600" />
                                            <Link 
                                                href={`/categories/${book.category.slug}`}
                                                className="hover:text-emerald-600 transition-colors font-medium"
                                            >
                                                {book.category.name}
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-emerald-600" />
                                            <span className="font-medium">{formatDate(book.publication_date)}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {book.tags && book.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {book.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 mb-8">
                                    <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
                                        {[
                                            { key: 'overview', label: 'Ringkasan' },
                                            { key: 'chapters', label: `Daftar Bab (${book.chapters.length})` },
                                            { key: 'reviews', label: 'Ulasan' }
                                        ].map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key as any)}
                                                className={`py-3 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                                                    activeTab === tab.key
                                                        ? 'border-emerald-500 text-emerald-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-96">
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="prose prose-gray max-w-none">
                                                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                                    {book.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'chapters' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="space-y-3">
                                                {book.chapters.length > 0 ? (
                                                    book.chapters.map((chapter, index) => (
                                                        <div
                                                            key={chapter.id}
                                                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-300 hover:shadow-sm transition-all duration-200"
                                                        >
                                                            {/* Chapter Header */}
                                                            <div className="flex items-center justify-between p-4 bg-white">
                                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                                        <span className="text-emerald-600 font-semibold text-sm">
                                                                            {chapter.chapter_number}
                                                                        </span>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h4 className="font-semibold text-gray-900 truncate">
                                                                            {chapter.title}
                                                                        </h4>
                                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                                            <div className="flex items-center gap-1">
                                                                                <Clock className="w-4 h-4" />
                                                                                <span>{formatReadingTime(chapter.reading_time_minutes)}</span>
                                                                            </div>
                                                                            {chapter.is_free ? (
                                                                                <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full text-xs">
                                                                                    Gratis
                                                                                </span>
                                                                            ) : userHasPurchased ? (
                                                                                <span className="text-emerald-600 font-semibold bg-emerald-100 px-2 py-1 rounded-full text-xs">
                                                                                    Terbuka (Buku Dibeli)
                                                                                </span>
                                                                            ) : userPurchasedChapters.includes(chapter.id) ? (
                                                                                <span className="text-emerald-600 font-semibold bg-emerald-100 px-2 py-1 rounded-full text-xs">
                                                                                    Terbuka (Chapter Dibeli)
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-amber-600 font-semibold bg-amber-100 px-2 py-1 rounded-full text-xs">
                                                                                    Premium - {new Intl.NumberFormat('id-ID', {
                                                                                        style: 'currency',
                                                                                        currency: 'IDR',
                                                                                        minimumFractionDigits: 0,
                                                                                        maximumFractionDigits: 0,
                                                                                    }).format(chapter.price || 0)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-2 ml-4">
                                                                    {/* Expand/Collapse Button */}
                                                                    <button
                                                                        onClick={() => toggleChapterExpansion(chapter.id)}
                                                                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                                                                        title={expandedChapters[chapter.id] ? "Tutup preview" : "Lihat preview"}
                                                                    >
                                                                        <ChevronDown 
                                                                            className={`w-5 h-5 transition-transform duration-200 ${
                                                                                expandedChapters[chapter.id] ? 'rotate-180' : ''
                                                                            }`} 
                                                                        />
                                                                    </button>

                                                                    {/* Action Buttons */}
                                                                    {chapter.is_published ? (
                                                                        canReadChapter(chapter) ? (
                                                                            <Link 
                                                                                href={`/books/${book.slug}/chapters/${chapter.id}`}
                                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
                                                                            >
                                                                                Baca
                                                                            </Link>
                                                                        ) : (
                                                                            <div className="flex items-center gap-2">
                                                                                {!userHasPurchased && !userPurchasedChapters.includes(chapter.id) && (
                                                                                    <button
                                                                                        onClick={() => handlePurchaseChapter(chapter.id)}
                                                                                        disabled={isPurchasing}
                                                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                                                                                        title="Beli chapter ini"
                                                                                    >
                                                                                        <ShoppingCart className="w-4 h-4" />
                                                                                    </button>
                                                                                )}
                                                                                <Lock className="w-5 h-5 text-gray-400" />
                                                                            </div>
                                                                        )
                                                                    ) : (
                                                                        <span className="text-gray-400 text-sm font-medium">Segera</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Chapter Content Preview */}
                                                            {expandedChapters[chapter.id] && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="border-t border-gray-200 bg-gray-50"
                                                                >
                                                                    <div className="p-4">
                                                                        {/* Excerpt/Preview */}
                                                                        <div className="mb-4">
                                                                            <h5 className="font-semibold text-gray-900 mb-2">Preview:</h5>
                                                                            <p className="text-gray-600 leading-relaxed">
                                                                                {chapter.excerpt || 'Preview tidak tersedia.'}
                                                                            </p>
                                                                        </div>

                                                                        {/* Full Content (if user can access) */}
                                                                        {canReadChapter(chapter) && chapter.content && (
                                                                            <div className="border-t border-gray-200 pt-4">
                                                                                <h5 className="font-semibold text-gray-900 mb-3">Konten Lengkap:</h5>
                                                                                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                                                                    {chapter.content?.split('\n').map((paragraph: string, idx: number) => {
                                                                                        if (paragraph.startsWith('##')) {
                                                                                            return (
                                                                                                <h3 key={idx} className="text-lg font-semibold mt-6 mb-3 text-gray-900">
                                                                                                    {paragraph.replace('##', '').trim()}
                                                                                                </h3>
                                                                                            );
                                                                                        } else if (paragraph.startsWith('###')) {
                                                                                            return (
                                                                                                <h4 key={idx} className="text-base font-semibold mt-4 mb-2 text-gray-800">
                                                                                                    {paragraph.replace('###', '').trim()}
                                                                                                </h4>
                                                                                            );
                                                                                        } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                                                                            return (
                                                                                                <p key={idx} className="font-semibold mt-3 mb-2 text-gray-900">
                                                                                                    {paragraph.replace(/\*\*/g, '')}
                                                                                                </p>
                                                                                            );
                                                                                        } else if (paragraph.startsWith('- ')) {
                                                                                            return (
                                                                                                <li key={idx} className="ml-4 mb-1">
                                                                                                    {paragraph.replace('- ', '')}
                                                                                                </li>
                                                                                            );
                                                                                        } else if (paragraph.trim()) {
                                                                                            return (
                                                                                                <p key={idx} className="mb-3">
                                                                                                    {paragraph}
                                                                                                </p>
                                                                                            );
                                                                                        }
                                                                                        return null;
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Locked Content Message */}
                                                                        {!canReadChapter(chapter) && (
                                                                            <div className="border-t border-gray-200 pt-4">
                                                                                <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg">
                                                                                    <div className="text-center">
                                                                                        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                                        <p className="text-gray-600 font-medium">
                                                                                            Konten ini terkunci
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                                            {chapter.is_free 
                                                                                                ? "Beli buku untuk mengakses konten"
                                                                                                : `Beli chapter ini seharga ${new Intl.NumberFormat('id-ID', {
                                                                                                    style: 'currency',
                                                                                                    currency: 'IDR',
                                                                                                    minimumFractionDigits: 0,
                                                                                                    maximumFractionDigits: 0,
                                                                                                }).format(chapter.price || 0)} atau beli buku lengkap untuk akses semua chapter`
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-600 font-medium">Belum ada bab yang tersedia</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {reviewsLoading ? (
                                                <div className="flex justify-center py-12">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                                </div>
                                            ) : (
                                                <div className="space-y-8">
                                                    {/* Review Stats */}
                                                    {reviewStats && (
                                                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {/* Overall Rating */}
                                                                <div className="text-center">
                                                                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                                                                        {reviewStats.average_rating}
                                                                    </div>
                                                                    <div className="flex justify-center mb-2">
                                                                        <StarDisplay 
                                                                            rating={Math.round(parseFloat(reviewStats.average_rating))}
                                                                            size="md"
                                                                        />
                                                                    </div>
                                                                    <p className="text-gray-600">
                                                                        {reviewStats.total_reviews} ulasan
                                                                    </p>
                                                                </div>

                                                                {/* Rating Distribution */}
                                                                <div className="space-y-2">
                                                                    {[5, 4, 3, 2, 1].map((rating) => (
                                                                        <div key={rating} className="flex items-center gap-3">
                                                                            <span className="w-3 text-sm font-medium">{rating}</span>
                                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                                <div
                                                                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                                                    style={{
                                                                                        width: `${reviewStats.rating_percentages[rating] || 0}%`
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-sm text-gray-600 w-10">
                                                                                {reviewStats.rating_distribution[rating] || 0}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* User Review Section */}
                                                    {auth?.user && (
                                                        <div className="border border-gray-200 rounded-xl p-6 bg-white">
                                                            {userReview ? (
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="font-semibold text-gray-900">Ulasan Anda</h4>
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setReviewForm({
                                                                                        rating: userReview.rating,
                                                                                        review_text: userReview.review_text || ''
                                                                                    });
                                                                                    setShowReviewForm(true);
                                                                                }}
                                                                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={deleteReview}
                                                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                                            >
                                                                                Hapus
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <StarDisplay 
                                                                            rating={userReview.rating}
                                                                            size="md"
                                                                        />
                                                                        <span className="text-sm text-gray-600 ml-2">
                                                                            {userReview.rating_text}
                                                                        </span>
                                                                    </div>
                                                                    {userReview.review_text && (
                                                                        <p className="text-gray-700 leading-relaxed">
                                                                            {userReview.review_text}
                                                                        </p>
                                                                    )}
                                                                    {!userReview.is_approved && (
                                                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                                            <p className="text-yellow-800 text-sm">
                                                                                Ulasan Anda sedang menunggu persetujuan
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : canReview ? (
                                                                <div className="space-y-4">
                                                                    <h4 className="font-semibold text-gray-900">Tulis Ulasan</h4>
                                                                    <button
                                                                        onClick={() => setShowReviewForm(true)}
                                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2"
                                                                    >
                                                                        <MessageCircle className="w-4 h-4" />
                                                                        Tulis Ulasan
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center py-6">
                                                                    <p className="text-gray-600">
                                                                        Anda perlu membeli buku ini untuk memberikan ulasan
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Review Form Modal */}
                                                    {showReviewForm && (
                                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                                            <div className="bg-white rounded-xl max-w-md w-full p-6">
                                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                                                    {userReview ? 'Edit Ulasan' : 'Tulis Ulasan'}
                                                                </h4>
                                                                
                                                                <div className="space-y-4">
                                                                    {/* Rating */}
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Rating
                                                                        </label>
                                                                        <StarRating
                                                                            rating={reviewForm.rating}
                                                                            onRatingChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                                                                            size="lg"
                                                                        />
                                                                    </div>

                                                                    {/* Review Text */}
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Ulasan (Opsional)
                                                                        </label>
                                                                        <textarea
                                                                            value={reviewForm.review_text}
                                                                            onChange={(e) => setReviewForm(prev => ({ ...prev, review_text: e.target.value }))}
                                                                            placeholder="Bagikan pengalaman Anda tentang buku ini..."
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                                                            rows={4}
                                                                            maxLength={1000}
                                                                        />
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {reviewForm.review_text.length}/1000 karakter
                                                                        </p>
                                                                    </div>

                                                                    {/* Buttons */}
                                                                    <div className="flex gap-3 pt-4">
                                                                        <button
                                                                            onClick={() => setShowReviewForm(false)}
                                                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            Batal
                                                                        </button>
                                                                        <button
                                                                            onClick={userReview ? updateReview : submitReview}
                                                                            disabled={!reviewForm.rating || submitLoading}
                                                                            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                                                        >
                                                                            {submitLoading ? (
                                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                            ) : (
                                                                                <>
                                                                                    <Send className="w-4 h-4" />
                                                                                    {userReview ? 'Update' : 'Kirim'}
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Reviews List */}
                                                    <div className="space-y-6">
                                                        <h4 className="text-lg font-semibold text-gray-900">
                                                            Semua Ulasan ({reviewStats?.total_reviews || 0})
                                                        </h4>
                                                        
                                                        {reviews.length > 0 ? (
                                                            <div className="space-y-6">
                                                                {reviews.map((review) => (
                                                                    <div key={review.id} className="border border-gray-200 rounded-xl p-6 bg-white">
                                                                        <div className="flex items-start gap-4">
                                                                            {/* Avatar */}
                                                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                                {review.user.avatar_url ? (
                                                                                    <img 
                                                                                        src={review.user.avatar_url} 
                                                                                        alt={review.user.name}
                                                                                        className="w-full h-full rounded-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <span className="text-emerald-600 font-semibold text-sm">
                                                                                        {review.user.initials}
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            {/* Review Content */}
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <h5 className="font-medium text-gray-900">
                                                                                        {review.user.name}
                                                                                    </h5>
                                                                                    <span className="text-sm text-gray-500">
                                                                                        {review.created_at_human}
                                                                                    </span>
                                                                                </div>
                                                                                
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                    <StarDisplay 
                                                                                        rating={review.rating}
                                                                                        size="sm"
                                                                                    />
                                                                                    <span className="text-sm text-gray-600 ml-1">
                                                                                        {review.rating_text}
                                                                                    </span>
                                                                                </div>

                                                                                {review.review_text && (
                                                                                    <p className="text-gray-700 leading-relaxed">
                                                                                        {review.review_text}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                                                                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                                <p className="text-gray-600">
                                                                    Belum ada ulasan untuk buku ini
                                                                </p>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Jadilah yang pertama memberikan ulasan!
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Books */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    E-Books Serupa
                                </h2>
                                <p className="text-gray-600">
                                    Buku lain yang mungkin Anda sukai berdasarkan kategori dan penulis
                                </p>
                            </div>
                            <Link
                                href={`/books?category=${book.category.id}`}
                                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                            >
                                Lihat semua
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {relatedBooks && relatedBooks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {relatedBooks.slice(0, 4).map((relatedBook, index) => {
                                    const relatedPriceInfo = formatPrice(relatedBook.price, relatedBook.discount_percentage);
                                    
                                    return (
                                        <motion.div
                                            key={relatedBook.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ 
                                                duration: 0.3, 
                                                delay: index * 0.1,
                                                ease: "easeOut"
                                            }}
                                            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-emerald-200"
                                        >
                                            {/* Book Cover */}
                                            <div className="relative overflow-hidden">
                                                <Link href={`/books/${relatedBook.slug}`} className="block">
                                                    <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                                                        {relatedBook.cover_image ? (
                                                            <img 
                                                                src={relatedBook.cover_image} 
                                                                alt={relatedBook.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <BookOpen className="w-12 h-12 text-gray-400" />
                                                        )}
                                                        
                                                        {/* Featured Badge */}
                                                        {relatedBook.is_featured && (
                                                            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                                                                Featured
                                                            </div>
                                                        )}
                                                        
                                                        {/* Discount Badge */}
                                                        {relatedPriceInfo.discount && (
                                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                                                                -{relatedPriceInfo.discount}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Book Info */}
                                            <div className="p-4">
                                                <Link 
                                                    href={`/books/${relatedBook.slug}`}
                                                    className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2 mb-2 block leading-tight"
                                                >
                                                    {relatedBook.title}
                                                </Link>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User className="w-4 h-4 text-emerald-500" />
                                                        <span>{relatedBook.author.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen className="w-4 h-4" />
                                                            <span>{relatedBook.total_chapters} Bab</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatReadingTime(relatedBook.reading_time_minutes)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price and Action */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                    <div className="flex flex-col">
                                                        {relatedPriceInfo.discounted ? (
                                                            <>
                                                                <span className="text-lg font-bold text-emerald-600">
                                                                    {relatedPriceInfo.discounted}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    {relatedPriceInfo.original}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold text-emerald-600">
                                                                {relatedPriceInfo.original}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Link 
                                                        href={`/books/${relatedBook.slug}`}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                                    >
                                                        Lihat
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    Belum Ada Rekomendasi
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Saat ini belum ada buku serupa yang dapat kami rekomendasikan. Silakan jelajahi kategori lain.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link
                                        href={`/books?category=${book.category.id}`}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center justify-center gap-2"
                                    >
                                        <Tag className="w-4 h-4" />
                                        Kategori {book.category.name}
                                    </Link>
                                    <Link
                                        href="/books"
                                        className="border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center justify-center gap-2"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Jelajahi Semua Buku
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
