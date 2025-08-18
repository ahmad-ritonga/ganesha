import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Star, 
    StarHalf,
    MessageSquare, 
    User as UserIcon, 
    BookOpen, 
    Calendar, 
    Mail,
    CheckCircle,
    Clock,
    X,
    Check,
    Trash2,
    ArrowLeft
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface ReviewUser {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
    created_at: string;
}

interface ReviewBook {
    id: string;
    title: string;
    slug: string;
    description?: string;
    cover_image?: string;
    price: number;
    formatted_price: string;
    author: {
        id: string;
        name: string;
    } | null;
    category: {
        id: string;
        name: string;
    } | null;
}

interface Review {
    id: string;
    rating: number;
    review_text: string | null;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    rating_text: string;
    rating_stars: string;
    created_at_formatted: string;
    created_at_human: string;
    has_text: boolean;
    user: ReviewUser;
    book: ReviewBook;
}

interface RelatedReview {
    id: string;
    rating: number;
    review_text?: string;
    is_approved: boolean;
    created_at: string;
    book?: {
        id: string;
        title: string;
    };
    user?: {
        id: string;
        name: string;
    };
}

interface AdminReviewsShowProps {
    review: Review;
    user_reviews: RelatedReview[];
    book_reviews: RelatedReview[];
}

export default function AdminReviewsShow({ review, user_reviews, book_reviews }: AdminReviewsShowProps) {
    const [deleteDialog, setDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Reviews',
            href: '/admin/reviews',
        },
        {
            title: `Review #${review.id.slice(-8)}`,
            href: `/admin/reviews/${review.id}`,
        },
    ];

    const handleApprove = () => {
        router.patch(`/admin/reviews/${review.id}/approve`, {}, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const handleReject = () => {
        router.patch(`/admin/reviews/${review.id}/reject`, {}, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const handleDelete = () => {
        setDeleteDialog(true);
    };

    const confirmDelete = () => {
        router.delete(`/admin/reviews/${review.id}`, {
            onSuccess: () => {
                router.visit('/admin/reviews');
            }
        });
        setDeleteDialog(false);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
        }

        return stars;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatShortDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Review - ${review.user.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Review</h1>
                    <Link
                        href="/admin/reviews"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Reviews
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                    <div className="flex gap-2 justify-end">
                        {!review.is_approved && (
                            <button
                                onClick={handleApprove}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Check className="h-4 w-4" />
                                Setujui Review
                            </button>
                        )}
                        {review.is_approved && (
                            <button
                                onClick={handleReject}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Tolak Review
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Hapus Review
                        </button>
                    </div>
                </div>

                {/* Main Review Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    {review.user.avatar_url ? (
                                        <img 
                                            src={review.user.avatar_url} 
                                            alt={review.user.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="h-8 w-8 text-gray-600" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{review.user.name}</h2>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center space-x-1">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">{review.user.email}</span>
                                        </div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            review.user.role === 'admin' 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {review.user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                review.is_approved
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {review.is_approved ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Disetujui
                                    </>
                                ) : (
                                    <>
                                        <Clock className="h-4 w-4 mr-2" />
                                        Pending
                                    </>
                                )}
                            </span>
                        </div>

                        {/* Rating */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Rating & Review</h3>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{review.rating}/5</span>
                                <span className="text-gray-600 dark:text-gray-400">({review.rating_text})</span>
                            </div>
                            {review.review_text && (
                                <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{review.review_text}</p>
                                </div>
                            )}
                            {!review.review_text && (
                                <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg text-center text-gray-500">
                                    Tidak ada teks review
                                </div>
                            )}
                        </div>

                        {/* Review Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Dibuat</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(review.created_at)}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Terakhir Update</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(review.updated_at)}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">ID Review</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">{review.id}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book Information */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Informasi Buku</h3>
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                {review.book.cover_image ? (
                                    <img 
                                        src={review.book.cover_image} 
                                        alt={review.book.title}
                                        className="w-16 h-20 object-cover rounded"
                                    />
                                ) : (
                                    <BookOpen className="h-8 w-8 text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{review.book.title}</h4>
                                {review.book.author && (
                                    <p className="text-gray-600 dark:text-gray-400">oleh {review.book.author.name}</p>
                                )}
                                {review.book.category && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-2">
                                        {review.book.category.name}
                                    </span>
                                )}
                                {review.book.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">
                                        {review.book.description}
                                    </p>
                                )}
                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="text-lg font-bold text-green-600">
                                        {review.book.formatted_price}
                                    </div>
                                    <Link
                                        href={`/admin/books/${review.book.id}`}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                        Lihat Detail Buku
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Other Reviews by Same User */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Review Lain dari {review.user.name}
                            </h3>
                            {user_reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {user_reviews.map((userReview) => (
                                        <div key={userReview.id} className="border-b border-gray-200 dark:border-neutral-700 pb-4 last:border-b-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex">
                                                    {renderStars(userReview.rating).slice(0, 5)}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatShortDate(userReview.created_at)}
                                                </div>
                                            </div>
                                            {userReview.book && (
                                                <div className="text-sm font-medium mb-1 text-gray-900 dark:text-white">
                                                    {userReview.book.title}
                                                </div>
                                            )}
                                            {userReview.review_text && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{userReview.review_text}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    userReview.is_approved 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {userReview.is_approved ? 'Disetujui' : 'Pending'}
                                                </span>
                                                <Link
                                                    href={`/admin/reviews/${userReview.id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Tidak ada review lain dari user ini
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Other Reviews for Same Book */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Review Lain untuk Buku Ini
                            </h3>
                            {book_reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {book_reviews.map((bookReview) => (
                                        <div key={bookReview.id} className="border-b border-gray-200 dark:border-neutral-700 pb-4 last:border-b-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex">
                                                    {renderStars(bookReview.rating).slice(0, 5)}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatShortDate(bookReview.created_at)}
                                                </div>
                                            </div>
                                            {bookReview.user && (
                                                <div className="text-sm font-medium mb-1 text-gray-900 dark:text-white">
                                                    oleh {bookReview.user.name}
                                                </div>
                                            )}
                                            {bookReview.review_text && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{bookReview.review_text}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Disetujui
                                                </span>
                                                <Link
                                                    href={`/admin/reviews/${bookReview.id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Tidak ada review lain untuk buku ini
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Review</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus review ini? 
                                Tindakan ini tidak dapat dibatalkan dan akan menghapus review secara permanen dari sistem.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteDialog(false)}>
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>
                                Hapus Review
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}