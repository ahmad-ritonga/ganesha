import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type Book, type PaginatedData, type PaginationLink } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Star, 
    StarHalf,
    MessageSquare, 
    CheckCircle, 
    Clock, 
    Eye,
    Check,
    X,
    Trash2,
    Search,
    MoreHorizontal
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Reviews',
        href: '/admin/reviews',
    },
];

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
    short_review: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar_url?: string;
        initials: string;
    };
    book: {
        id: string;
        title: string;
        slug: string;
        cover_image?: string;
        author: {
            id: string;
            name: string;
        } | null;
    };
}

interface ReviewStats {
    total_reviews: number;
    pending_reviews: number;
    approved_reviews: number;
    average_rating: number;
    reviews_today: number;
    reviews_this_week: number;
    reviews_this_month: number;
}

interface ReviewFilters {
    status?: string;
    rating?: string;
    book_id?: string;
    user_id?: string;
    search?: string;
}

interface AdminReviewsIndexProps {
    reviews: PaginatedData<Review>;
    stats: ReviewStats;
    filters: ReviewFilters;
    books: Book[];
    users: User[];
}

export default function AdminReviewsIndex({ reviews, stats, filters, books, users }: AdminReviewsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [rating, setRating] = useState(filters.rating || '');
    const [bookId, setBookId] = useState(filters.book_id || '');
    const [userId, setUserId] = useState(filters.user_id || '');
    const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; review: Review | null }>({
        open: false,
        review: null,
    });

    const handleSearch = () => {
        router.get('/admin/reviews', {
            search,
            status,
            rating,
            book_id: bookId,
            user_id: userId,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setRating('');
        setBookId('');
        setUserId('');
        router.get('/admin/reviews');
    };

    const handleApprove = (reviewId: string) => {
        router.patch(`/admin/reviews/${reviewId}/approve`, {}, {
            preserveScroll: true,
        });
    };

    const handleReject = (reviewId: string) => {
        router.patch(`/admin/reviews/${reviewId}/reject`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (review: Review) => {
        setDeleteDialog({ open: true, review });
    };

    const confirmDelete = () => {
        if (deleteDialog.review) {
            router.delete(`/admin/reviews/${deleteDialog.review.id}`, {
                preserveScroll: true,
            });
            setDeleteDialog({ open: false, review: null });
        }
    };

    const cancelDelete = () => {
        setDeleteDialog({ open: false, review: null });
    };

    const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
        if (selectedReviews.length === 0) {
            alert('Pilih minimal satu review');
            return;
        }

        const confirmMessage = {
            approve: 'Apakah Anda yakin ingin menyetujui review yang dipilih?',
            reject: 'Apakah Anda yakin ingin menolak review yang dipilih?',
            delete: 'Apakah Anda yakin ingin menghapus review yang dipilih?',
        };

        if (confirm(confirmMessage[action])) {
            const endpoint = {
                approve: '/admin/reviews/bulk-approve',
                reject: '/admin/reviews/bulk-reject',
                delete: '/admin/reviews/bulk-delete',
            };

            router.patch(endpoint[action], { ids: selectedReviews }, {
                preserveScroll: true,
                onSuccess: () => setSelectedReviews([]),
            });
        }
    };

    const toggleReviewSelection = (reviewId: string) => {
        setSelectedReviews(prev =>
            prev.includes(reviewId)
                ? prev.filter(id => id !== reviewId)
                : [...prev, reviewId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedReviews(
            selectedReviews.length === reviews.data.length
                ? []
                : reviews.data.map(review => review.id)
        );
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }

        return stars;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Reviews" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header dengan Statistics */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Reviews</h1>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_reviews.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{stats.reviews_today} hari ini</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending_reviews.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Menunggu persetujuan</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-500" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disetujui</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved_reviews.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Reviews disetujui</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating Rata-rata</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.average_rating}/5</p>
                                    <div className="flex items-center mt-1">
                                        {renderStars(stats.average_rating)}
                                    </div>
                                </div>
                                <Star className="h-8 w-8 text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Cari review, user, atau buku..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        >
                            <option value="">Semua Status</option>
                            <option value="approved">Disetujui</option>
                            <option value="pending">Pending</option>
                        </select>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        >
                            <option value="">Semua Rating</option>
                            <option value="5">5 Bintang</option>
                            <option value="4">4 Bintang</option>
                            <option value="3">3 Bintang</option>
                            <option value="2">2 Bintang</option>
                            <option value="1">1 Bintang</option>
                        </select>
                        <select
                            value={bookId}
                            onChange={(e) => setBookId(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        >
                            <option value="">Semua Buku</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        >
                            <option value="">Semua User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleSearch}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            Cari
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedReviews.length > 0 && (
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedReviews.length} review dipilih
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleBulkAction('approve')}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                                >
                                    <Check className="h-4 w-4" />
                                    Setujui
                                </button>
                                <button 
                                    onClick={() => handleBulkAction('reject')}
                                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 flex items-center gap-1"
                                >
                                    <X className="h-4 w-4" />
                                    Tolak
                                </button>
                                <button 
                                    onClick={() => handleBulkAction('delete')}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Table */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-neutral-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedReviews.length === reviews.data.length && reviews.data.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User & Buku
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating & Review
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {reviews.data.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedReviews.includes(review.id)}
                                            onChange={() => toggleReviewSelection(review.id)}
                                            className="rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-3">
                                            {/* User Info */}
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                    {review.user.avatar_url ? (
                                                        <img 
                                                            src={review.user.avatar_url} 
                                                            alt={review.user.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs font-medium text-gray-600">
                                                            {review.user.initials}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {review.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {review.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Book Info */}
                                            <div className="flex items-center space-x-2">
                                                {review.book.cover_image ? (
                                                    <img 
                                                        src={review.book.cover_image} 
                                                        alt={review.book.title}
                                                        className="w-6 h-8 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                        <MessageSquare className="h-3 w-3 text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {review.book.title}
                                                    </div>
                                                    {review.book.author && (
                                                        <div className="text-xs text-gray-500">
                                                            oleh {review.book.author.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm font-medium">{review.rating}/5</span>
                                            </div>
                                            {review.review_text && (
                                                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                                                    {review.short_review}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            review.is_approved
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {review.is_approved ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Disetujui
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Pending
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{new Date(review.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}</div>
                                        <div className="text-xs">{review.created_at_human}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/reviews/${review.id}`} className="flex items-center">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Detail
                                                    </Link>
                                                </DropdownMenuItem>
                                                {!review.is_approved && (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleApprove(review.id)}
                                                        className="text-green-600 flex items-center"
                                                    >
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Setujui
                                                    </DropdownMenuItem>
                                                )}
                                                {review.is_approved && (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleReject(review.id)}
                                                        className="text-yellow-600 flex items-center"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Tolak
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(review)}
                                                    className="text-red-600 flex items-center"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {reviews.links && (
                    <div className="flex justify-center space-x-1">
                        {reviews.links.map((link: PaginationLink, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-2 text-sm rounded ${
                                    link.active
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-700 dark:text-gray-300'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && cancelDelete()}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Review</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus review ini? 
                                Tindakan ini tidak dapat dibatalkan dan akan menghapus review secara permanen dari sistem.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={cancelDelete}>
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