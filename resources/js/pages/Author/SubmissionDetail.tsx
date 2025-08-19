import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { SharedData } from '@/types';
import { 
    ArrowLeft,
    FileText,
    Download,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BookOpen,
    User,
    Calendar,
    Eye,
    DollarSign
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
    pdf_file_path?: string;
    cover_image_path?: string;
    price?: number;
    reviewer?: {
        id: string;
        name: string;
    };
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
    submission: AuthorSubmission;
}

export default function SubmissionDetail({ auth, submission }: Props) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-orange-500" />;
            case 'under_review':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'published':
                return <BookOpen className="h-5 w-5 text-indigo-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-400" />;
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
            title={submission.title}
            description="View submission details and status"
        >
            <Head title={`Submission: ${submission.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-24 pb-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link
                            href={route('author.submissions')}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Submissions
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {submission.title}
                                    </h1>
                                    <p className="text-lg text-gray-600">
                                        {submission.description}
                                    </p>
                                </div>
                                <div className="ml-6">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(submission.status)}`}>
                                        {getStatusIcon(submission.status)}
                                        <span className="ml-2">{submission.status_label}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Type</div>
                                        <div className="text-sm text-gray-600 capitalize">
                                            {submission.submission_type.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Submitted</div>
                                        <div className="text-sm text-gray-600">
                                            {new Date(submission.submitted_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {submission.reviewed_at && (
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Reviewed</div>
                                            <div className="text-sm text-gray-600">
                                                {new Date(submission.reviewed_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Cover Preview */}
                            {submission.cover_image_path && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Cover</h3>
                                    <div className="flex justify-center">
                                        <img
                                            src={`/storage/${submission.cover_image_path}`}
                                            alt={submission.title}
                                            className="max-w-xs rounded-lg shadow-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {submission.description}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                                <div className="flex flex-wrap gap-3">
                                    {submission.pdf_file_path && (
                                        <>
                                            <a
                                                href={route('author.download', submission.id)}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download PDF
                                            </a>
                                            <a
                                                href={route('author.download-alt', submission.id)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Direct Link
                                            </a>
                                        </>
                                    )}
                                    {submission.created_book && (
                                        <Link
                                            href={route('books.show', submission.created_book.slug)}
                                            target="_blank"
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Published Book
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Details */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Category</div>
                                        <div className="text-sm text-gray-900 capitalize">
                                            {submission.category_slug.replace('-', ' ')}
                                        </div>
                                    </div>
                                    {submission.price && (
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Price</div>
                                            <div className="text-sm text-gray-900">
                                                Rp {new Intl.NumberFormat('id-ID').format(submission.price)}
                                            </div>
                                        </div>
                                    )}
                                    {submission.reviewer && (
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Reviewer</div>
                                            <div className="flex items-center mt-1">
                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">
                                                    {submission.reviewer.name}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Info */}
                            {submission.transaction && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Amount</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                Rp {new Intl.NumberFormat('id-ID').format(submission.transaction.total_amount)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Status</span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                submission.transaction.payment_status === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : submission.transaction.payment_status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {submission.transaction.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Info */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-2">Submission Status</h3>
                                <p className="text-indigo-100 text-sm mb-4">
                                    Track your submission progress through our review process.
                                </p>
                                <div className="flex items-center">
                                    {getStatusIcon(submission.status)}
                                    <span className="ml-2 font-medium">
                                        {submission.status_label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
