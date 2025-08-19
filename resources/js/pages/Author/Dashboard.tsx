import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { SharedData } from '@/types';
import { 
    Plus,
    FileText, 
    Eye, 
    Download,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BookOpen,
    Package,
    TrendingUp,
    Calendar,
    Star,
    Award,
    Crown,
    User,
    Settings,
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

interface UserAuthorSubscription {
    id: string;
    plan: {
        id: string;
        name: string;
        max_submissions: number;
        formatted_price: string;
    };
    submissions_used: number;
    starts_at: string;
    expires_at?: string;
    status: string;
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
    total_submissions: number;
    pending_submissions: number;
    approved_submissions: number;
    published_books: number;
    rejected_submissions: number;
    has_active_subscription: boolean;
    can_submit_books: boolean;
}

interface Props extends SharedData {
    activeSubscription?: UserAuthorSubscription;
    submissions: PaginatedSubmissions;
    stats: Stats;
}

export default function Dashboard({ auth, activeSubscription, submissions, stats }: Props) {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'under_review':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'approved':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'published':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <PublicLayout 
            title="Author Dashboard"
            description="Dashboard author untuk mengelola submissions dan publikasi"
        >
            <Head title="Author Dashboard" />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-indigo-200 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium mb-8 shadow-lg">
                            <Crown className="w-5 h-5 mr-2" />
                            Welcome Back, {auth.user.name}!
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                            Author Dashboard
                        </h1>
                        
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
                            {activeSubscription 
                                ? `🎉 Ready to publish! You're subscribed to ${activeSubscription.plan.name} plan. Submit your manuscript now!`
                                : "Start your publishing journey by choosing a subscription plan that fits your needs."
                            }
                        </p>

                        {/* Quick Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            {stats.can_submit_books ? (
                                <>
                                    <Link
                                        href={route('author.create')}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <Plus className="h-6 w-6 mr-3" />
                                        🚀 Submit New Book
                                    </Link>
                                    
                                    <Link
                                        href={route('author.submissions')}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <FileText className="h-6 w-6 mr-3" />
                                        📚 View Submissions
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={route('author.pricing')}
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <Package className="h-6 w-6 mr-3" />
                                    Choose Your Plan
                                </Link>
                            )}
                            
                            <Link
                                href="/profile"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <Settings className="h-6 w-6 mr-3" />
                                 Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Subscription Status */}
                    {activeSubscription ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <Award className="w-6 h-6 text-indigo-600 mr-3" />
                                    Current Subscription
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {activeSubscription.status_label}
                                    </span>
                                    {stats.can_submit_books && (
                                        <Link
                                            href={route('author.create')}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Submit Book
                                        </Link>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-500 mb-1">Plan</div>
                                    <div className="text-xl font-semibold text-gray-900">{activeSubscription.plan.name}</div>
                                    <div className="text-sm text-indigo-600 font-medium">{activeSubscription.plan.formatted_price}</div>
                                </div>
                                <div className="text-center bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-500 mb-1">Submissions Used</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {activeSubscription.submissions_used} / {activeSubscription.plan.max_submissions}
                                    </div>
                                </div>
                                <div className="text-center bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-500 mb-1">Started</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {new Date(activeSubscription.starts_at).toLocaleDateString('id-ID')}
                                    </div>
                                </div>
                                <div className="text-center bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-500 mb-1">Expires</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {activeSubscription.expires_at 
                                            ? new Date(activeSubscription.expires_at).toLocaleDateString('id-ID')
                                            : 'Never'
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Submission Usage</span>
                                    <span>{Math.round((activeSubscription.submissions_used / activeSubscription.plan.max_submissions) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                                        style={{ 
                                            width: `${Math.min((activeSubscription.submissions_used / activeSubscription.plan.max_submissions) * 100, 100)}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                            <div className="flex items-center">
                                <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-red-800">No Active Subscription</h3>
                                    <p className="text-red-700 mt-1">
                                        You need an active author subscription to submit books for publication.
                                    </p>
                                    <Link
                                        href={route('author.pricing')}
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                    >
                                        <Package className="h-4 w-4 mr-2" />
                                        View Pricing Plans
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

                    {/* Recent Submissions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <BarChart3 className="w-6 h-6 mr-3 text-gray-600" />
                                    Recent Submissions
                                </h2>
                                {submissions.data.length > 0 && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-sm">
                                            {submissions.total} total submissions
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
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {submission.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {submission.category_slug}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                                        {getStatusIcon(submission.status)}
                                                        <span className="ml-1">{submission.status_label}</span>
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
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('author.show', submission.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('author.download', submission.id)}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                                            title="Download PDF"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Link>
                                                        {submission.created_book && (
                                                            <Link
                                                                href={route('books.show', submission.created_book.slug)}
                                                                target="_blank"
                                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                                                                title="View Published Book"
                                                            >
                                                                <BookOpen className="h-4 w-4" />
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
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}