import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { SharedData } from '@/types';
import { 
    ArrowLeft,
    FileText,
    Eye,
    Download,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BookOpen,
    Plus,
    BarChart3
} from 'lucide-react';

interface AuthorSubmission {
    id: string;
    submission_type: string;
    title: string;
    description: string;
    category_slug: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'published';
    submitted_at: string;
    reviewed_at?: string;
    status_label: string;
    created_book?: {
        id: string;
        title: string;
        slug: string;
    };
    transaction?: {
        id: string;
        total_amount: number;
        payment_status: string;
    };
}

interface Props extends SharedData {
    submissions: {
        data: AuthorSubmission[];
        links: any;
        meta: any;
    };
    stats: {
        total_submissions: number;
        pending_submissions: number;
        approved_submissions: number;
        published_books: number;
        rejected_submissions: number;
        has_active_subscription: boolean;
        can_submit_books: boolean;
    };
}

export default function Submissions({ auth, submissions, stats }: Props) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-orange-500" />;
            case 'under_review':
                return <AlertCircle className="h-4 w-4 text-blue-500" />;
            case 'approved':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'published':
                return <BookOpen className="h-4 w-4 text-indigo-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return "bg-orange-50 text-orange-700 border-orange-200";
            case 'under_review':
                return "bg-blue-50 text-blue-700 border-blue-200";
            case 'approved':
                return "bg-green-50 text-green-700 border-green-200";
            case 'rejected':
                return "bg-red-50 text-red-700 border-red-200";
            case 'published':
                return "bg-indigo-50 text-indigo-700 border-indigo-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <PublicLayout 
            title="My Submissions"
            description="Track your book submissions and their status"
        >
            <Head title="My Submissions" />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-b border-blue-100 pt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center mb-6">
                        <Link
                            href={route('author.dashboard')}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                My Submissions
                            </h1>
                            <p className="text-lg text-gray-600">
                                Track the status of your book submissions and publications
                            </p>
                        </div>

                        {stats.can_submit_books && (
                            <div className="mt-6 sm:mt-0">
                                <Link
                                    href={route('author.create')}
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Submit New Book
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-gray-100">
                                    <FileText className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">{stats.total_submissions}</div>
                                    <div className="text-sm text-gray-500">Total Submissions</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-orange-100">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">{stats.pending_submissions}</div>
                                    <div className="text-sm text-gray-500">Pending</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-100">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">{stats.approved_submissions}</div>
                                    <div className="text-sm text-gray-500">Approved</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-indigo-100">
                                    <BookOpen className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">{stats.published_books}</div>
                                    <div className="text-sm text-gray-500">Published</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-red-100">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-semibold text-gray-900">{stats.rejected_submissions}</div>
                                    <div className="text-sm text-gray-500">Rejected</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submissions Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <BarChart3 className="w-6 h-6 mr-3 text-gray-600" />
                                    All Submissions
                                </h2>
                                {submissions.data.length > 0 && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-sm">
                                            {submissions.meta?.total || submissions.data.length} total submissions
                                        </span>
                                        {stats.can_submit_books && (
                                            <Link
                                                href={route('author.create')}
                                                className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add New
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {submissions.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Submitted
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {submissions.data.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="p-2 rounded-lg bg-gray-100 mr-3">
                                                            <FileText className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {submission.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {submission.category_slug}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(submission.status)}`}>
                                                        {getStatusIcon(submission.status)}
                                                        <span className="ml-2">{submission.status_label}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(submission.submitted_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <Link
                                                            href={route('author.show', submission.id)}
                                                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Link>
                                                        <a
                                                            href={route('author.download', submission.id)}
                                                            className="inline-flex items-center text-green-600 hover:text-green-900 text-sm font-medium"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Download
                                                        </a>
                                                        {submission.created_book && (
                                                            <Link
                                                                href={route('books.show', submission.created_book.slug)}
                                                                target="_blank"
                                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                            >
                                                                <BookOpen className="h-4 w-4 mr-1" />
                                                                Book
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                                <p className="text-gray-500 mb-6">
                                    Start by submitting your first book for publication.
                                </p>
                                {stats.can_submit_books && (
                                    <Link
                                        href={route('author.create')}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Submit Your First Book
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {submissions.data.length > 0 && submissions.links && submissions.meta && (
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {submissions.links.prev && (
                                            <Link
                                                href={submissions.links.prev}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {submissions.links.next && (
                                            <Link
                                                href={submissions.links.next}
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
                                                <span className="font-medium">{submissions.meta.from || 1}</span>
                                                {' '}to{' '}
                                                <span className="font-medium">{submissions.meta.to || submissions.data.length}</span>
                                                {' '}of{' '}
                                                <span className="font-medium">{submissions.meta.total || submissions.data.length}</span>
                                                {' '}results
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {submissions.links.prev && (
                                                <Link
                                                    href={submissions.links.prev}
                                                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Previous
                                                </Link>
                                            )}
                                            {submissions.links.next && (
                                                <Link
                                                    href={submissions.links.next}
                                                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Next
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}