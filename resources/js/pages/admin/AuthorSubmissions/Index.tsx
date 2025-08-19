import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { 
    FileText, 
    Eye, 
    Download, 
    Filter,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    BookOpen,
    ChevronDown,
    Check,
    X
} from 'lucide-react';

interface AuthorSubmission {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    submission_type: string;
    title: string;
    description: string;
    category_slug: string;
    pdf_file_path: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'published';
    submitted_at: string;
    reviewed_at?: string;
    created_at: string;
    status_label: string;
}

interface PaginatedSubmissions {
    data: AuthorSubmission[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Stats {
    total: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
    published: number;
}

interface Props extends SharedData {
    submissions: PaginatedSubmissions;
    filters: {
        status?: string;
        search?: string;
    };
    stats: Stats;
}

export default function Index({ auth, submissions, filters, stats }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const { get, processing } = useForm();

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete('page'); // Reset to first page when filtering
        
        get(route('admin.author-submissions.index') + '?' + params.toString());
    };

    const handleQuickApprove = (submissionId: string, title: string) => {
        const confirmed = window.confirm(
            `🟢 APPROVE SUBMISSION\n\n` +
            `Apakah Anda yakin ingin menyetujui submission berikut?\n\n` +
            `📚 Judul: "${title}"\n` +
            `✅ Status akan berubah menjadi: APPROVED\n\n` +
            `Submission yang telah disetujui dapat dipublikasikan oleh author.`
        );
        
        if (confirmed) {
            router.post(route('admin.author-submissions.quick-approve', submissionId), {}, {
                onSuccess: () => {
                    alert('✅ Submission berhasil disetujui!');
                },
                onError: () => {
                    alert('❌ Gagal menyetujui submission. Silakan coba lagi.');
                }
            });
        }
    };

    const handleQuickReject = (submissionId: string, title: string) => {
        const confirmed = window.confirm(
            `🔴 REJECT SUBMISSION\n\n` +
            `Apakah Anda yakin ingin menolak submission berikut?\n\n` +
            `📚 Judul: "${title}"\n` +
            `❌ Status akan berubah menjadi: REJECTED\n\n` +
            `Submission yang ditolak memerlukan revisi sebelum dapat disetujui.`
        );
        
        if (confirmed) {
            router.post(route('admin.author-submissions.quick-reject', submissionId), {}, {
                onSuccess: () => {
                    alert('❌ Submission berhasil ditolak!');
                },
                onError: () => {
                    alert('⚠️ Gagal menolak submission. Silakan coba lagi.');
                }
            });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'under_review':
                return <AlertCircle className="h-4 w-4 text-blue-500" />;
            case 'approved':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'published':
                return <BookOpen className="h-4 w-4 text-purple-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string, label: string) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'under_review':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'published':
                return `${baseClasses} bg-purple-100 text-purple-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <AppLayout>
            <Head title="Author Submissions" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Author Submissions</h1>
                        <p className="text-gray-600">Kelola submissions dari author</p>
                    </div>
                    
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
                        <div className="text-sm text-gray-600">Under Review</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-2xl font-bold text-purple-600">{stats.published}</div>
                        <div className="text-sm text-gray-600">Published</div>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white rounded-lg border p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari judul atau nama author..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        defaultValue={filters.search || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const timeoutId = setTimeout(() => {
                                                handleFilter('search', value);
                                            }, 500);
                                            return () => clearTimeout(timeoutId);
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilter('status', e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submissions Table */}
                <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                        Author & Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.data.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {submission.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    by {submission.user.name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {submission.user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadge(submission.status, submission.status_label)}>
                                                {getStatusIcon(submission.status)}
                                                <span className="ml-2">{submission.status_label}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(submission.submitted_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 flex-wrap gap-2">
                                                <Link
                                                    href={route('admin.author-submissions.show', submission.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4 mr-1.5" />
                                                    Detail
                                                </Link>
                                                
                                                <a
                                                    href={route('admin.author-submissions.download', submission.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                                    title="Download PDF"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="h-4 w-4 mr-1.5" />
                                                    Download
                                                </a>
                                                
                                                {submission.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleQuickApprove(submission.id, submission.title)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300"
                                                            title="Quick Approve"
                                                        >
                                                            <Check className="h-4 w-4 mr-1.5" />
                                                            Approve
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => handleQuickReject(submission.id, submission.title)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
                                                            title="Quick Reject"
                                                        >
                                                            <X className="h-4 w-4 mr-1.5" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {submission.status === 'under_review' && (
                                                    <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                                                        <AlertCircle className="h-4 w-4 mr-1.5" />
                                                        Under Review
                                                    </span>
                                                )}
                                                
                                                {submission.status === 'approved' && (
                                                    <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg">
                                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                                        Approved
                                                    </span>
                                                )}
                                                
                                                {submission.status === 'rejected' && (
                                                    <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg">
                                                        <XCircle className="h-4 w-4 mr-1.5" />
                                                        Rejected
                                                    </span>
                                                )}
                                                
                                                {submission.status === 'published' && (
                                                    <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
                                                        <BookOpen className="h-4 w-4 mr-1.5" />
                                                        Published
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {submissions.last_page > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {submissions.links[0].url && (
                                        <Link
                                            href={submissions.links[0].url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {submissions.links[submissions.links.length - 1].url && (
                                        <Link
                                            href={submissions.links[submissions.links.length - 1].url!}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{' '}
                                            <span className="font-medium">
                                                {((submissions.current_page - 1) * submissions.per_page) + 1}
                                            </span>{' '}
                                            to{' '}
                                            <span className="font-medium">
                                                {Math.min(submissions.current_page * submissions.per_page, submissions.total)}
                                            </span>{' '}
                                            of{' '}
                                            <span className="font-medium">{submissions.total}</span>{' '}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {submissions.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${
                                                        index === 0 ? 'rounded-l-md' : ''
                                                    } ${
                                                        index === submissions.links.length - 1 ? 'rounded-r-md' : ''
                                                    } ${
                                                        !link.url ? 'cursor-not-allowed opacity-50' : ''
                                                    }`}
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {submissions.data.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filters.search || filters.status 
                                ? 'Try adjusting your search or filter criteria.'
                                : 'No author submissions have been made yet.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
