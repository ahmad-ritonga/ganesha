import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { 
    ArrowLeft,
    Download,
    User,
    Calendar,
    FileText,
    Tag,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    BookOpen,
    Eye,
    DollarSign
} from 'lucide-react';

interface AuthorSubmission {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    submission_type: string;
    title: string;
    description: string;
    category_slug: string;
    pdf_file_path: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'published';
    transaction_id?: string;
    created_book_id?: string;
    admin_notes?: string;
    submitted_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    status_label: string;
    transaction?: {
        id: string;
        total_amount: number;
        payment_status: string;
    };
    created_book?: {
        id: string;
        title: string;
        slug: string;
    };
    reviewer?: {
        id: string;
        name: string;
        email: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Props extends SharedData {
    submission: AuthorSubmission;
    categories: Category[];
}

export default function Show({ auth, submission, categories }: Props) {
    const [activeTab, setActiveTab] = useState('details');
    const { put, post, processing, data, setData, errors } = useForm({
        status: submission.status,
        admin_notes: submission.admin_notes || '',
        category_slug: submission.category_slug,
        price: '',
    });

    const handleStatusUpdate = () => {
        put(route('admin.author-submissions.update-status', submission.id), {
            preserveScroll: true,
        });
    };

    const handleApproveAndPublish = () => {
        post(route('admin.author-submissions.approve-publish', submission.id), {
            preserveScroll: true,
        });
    };

    const handleReject = () => {
        post(route('admin.author-submissions.reject', submission.id), {
            preserveScroll: true,
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'under_review':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'published':
                return <BookOpen className="h-5 w-5 text-purple-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string, label: string) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
        
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
            <Head title={`Submission: ${submission.title}`} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('admin.author-submissions.index')}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Submissions
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <a
                            href={route('admin.author-submissions.download', submission.id)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </a>
                        
                        {submission.created_book && (
                            <Link
                                href={route('books.show', submission.created_book.slug)}
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Published Book
                            </Link>
                        )}
                    </div>
                </div>

                {/* Title and Status */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {submission.title}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {submission.description}
                            </p>
                            
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center text-sm text-gray-500">
                                    <User className="h-4 w-4 mr-1" />
                                    {submission.user.name}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(submission.submitted_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Tag className="h-4 w-4 mr-1" />
                                    {submission.category_slug}
                                </div>
                            </div>
                        </div>
                        
                        <div className="ml-4">
                            <span className={getStatusBadge(submission.status, submission.status_label)}>
                                {getStatusIcon(submission.status)}
                                <span className="ml-2">{submission.status_label}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg border">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'details'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Submission Details
                            </button>
                            <button
                                onClick={() => setActiveTab('review')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'review'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Review & Actions
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                {/* Author Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Author Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <p className="text-sm text-gray-900">{submission.user.name}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <p className="text-sm text-gray-900">{submission.user.email}</p>
                                            </div>
                                            {submission.user.phone && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                    <p className="text-sm text-gray-900">{submission.user.phone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submission Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                                <p className="text-sm text-gray-900 capitalize">{submission.submission_type.replace('_', ' ')}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                <p className="text-sm text-gray-900">{submission.category_slug}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">PDF File</label>
                                                <p className="text-sm text-gray-900">{submission.pdf_file_path.split('/').pop()}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                                                <p className="text-sm text-gray-900">
                                                    {new Date(submission.submitted_at).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Information */}
                                {(submission.reviewed_at || submission.reviewer) && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Review Information</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {submission.reviewed_at && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Reviewed At</label>
                                                        <p className="text-sm text-gray-900">
                                                            {new Date(submission.reviewed_at).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                )}
                                                {submission.reviewer && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Reviewed By</label>
                                                        <p className="text-sm text-gray-900">{submission.reviewer.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {submission.admin_notes && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded border">
                                                        {submission.admin_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'review' && (
                            <div className="space-y-6">
                                {/* Status Update */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value as any)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="under_review">Under Review</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="published">Published</option>
                                            </select>
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Admin Notes
                                            </label>
                                            <textarea
                                                value={data.admin_notes}
                                                onChange={(e) => setData('admin_notes', e.target.value)}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Add notes for the author..."
                                            />
                                            {errors.admin_notes && <p className="text-red-500 text-sm mt-1">{errors.admin_notes}</p>}
                                        </div>

                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Updating...' : 'Update Status'}
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                {submission.status === 'approved' && !submission.created_book && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Publish as Book</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Category
                                                    </label>
                                                    <select
                                                        value={data.category_slug}
                                                        onChange={(e) => setData('category_slug', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.slug}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Price (Rp)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={data.price}
                                                        onChange={(e) => setData('price', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="50000"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleApproveAndPublish}
                                                disabled={processing || !data.price}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                            >
                                                <BookOpen className="h-4 w-4 mr-2" />
                                                {processing ? 'Publishing...' : 'Publish Book'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Reject Action */}
                                {(submission.status === 'pending' || submission.status === 'under_review') && (
                                    <div>
                                        <h3 className="text-lg font-medium text-red-600 mb-4">Reject Submission</h3>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-sm text-red-600 mb-4">
                                                This action will reject the submission and notify the author.
                                            </p>
                                            <button
                                                onClick={handleReject}
                                                disabled={processing || !data.admin_notes.trim()}
                                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                {processing ? 'Rejecting...' : 'Reject Submission'}
                                            </button>
                                            {!data.admin_notes.trim() && (
                                                <p className="text-red-500 text-xs mt-2">
                                                    Please add admin notes explaining the rejection reason.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
