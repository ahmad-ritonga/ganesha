import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { SharedData } from '@/types';
import { 
    ArrowLeft,
    Upload,
    FileText,
    Info,
    CheckCircle,
    AlertTriangle,
    BookOpen
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
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

interface Props extends SharedData {
    categories: Category[];
    subscription: UserAuthorSubscription;
}

export default function Submit({ auth, categories, subscription }: Props) {
    const [dragActive, setDragActive] = useState(false);
    const { data, setData, post, processing, errors, progress } = useForm({
        submission_type: 'new_book',
        title: '',
        description: '',
        category_slug: '',
        pdf_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('author.store'));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setData('pdf_file', file);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('pdf_file', e.target.files[0]);
        }
    };

    const remainingSubmissions = subscription.plan.max_submissions - subscription.submissions_used;

    return (
        <PublicLayout 
            title="Submit Book"
            description="Submit your book for publication"
        >
            <Head title="Submit New Book" />

            {/* Hero Section */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center mb-6">
                        <Link
                            href={route('author.dashboard')}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                    
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Submit Your Book
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Upload Your Manuscript
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Submit your PDF manuscript for professional review and publication on our platform
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Subscription Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-indigo-100 mr-4">
                                <Info className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {subscription.plan.name} Plan
                                </h3>
                                <p className="text-gray-600">
                                    {remainingSubmissions} submissions remaining this month
                                </p>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-indigo-600 h-2 rounded-full" 
                                            style={{ 
                                                width: `${(subscription.submissions_used / subscription.plan.max_submissions) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {subscription.submissions_used} of {subscription.plan.max_submissions} submissions used
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guidelines */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-start">
                            <div className="p-3 rounded-lg bg-yellow-100 mr-4">
                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Submission Guidelines
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                            PDF file maximum size: 100MB
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                            Content must be original
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                            Review process: 1-7 days
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                            Follow community guidelines
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                            Include proper formatting
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                            Clear chapter divisions
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submission Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Book Details</h2>
                            <p className="text-gray-600">Fill in the information about your book</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Submission Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Submission Type
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="submission_type"
                                            value="new_book"
                                            checked={data.submission_type === 'new_book'}
                                            onChange={(e) => setData('submission_type', e.target.value)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">New Book</div>
                                            <div className="text-sm text-gray-600">Submit a completely new book for publication</div>
                                        </div>
                                    </label>
                                </div>
                                {errors.submission_type && <p className="text-red-500 text-sm mt-1">{errors.submission_type}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Book Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Book Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                        placeholder="Enter your book title"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={data.category_slug}
                                        onChange={(e) => setData('category_slug', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_slug && <p className="text-red-500 text-sm mt-1">{errors.category_slug}</p>}
                                </div>

                                <div></div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Book Description *
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none text-gray-900 placeholder-gray-500"
                                        placeholder="Provide a detailed description of your book, including plot summary, themes, and target audience..."
                                        required
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                                        <span>Describe your book's content, themes, and target audience</span>
                                        <span>{data.description.length}/2000 characters</span>
                                    </div>
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                            </div>

                            {/* PDF Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PDF Manuscript *
                                </label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        dragActive 
                                            ? 'border-indigo-500 bg-indigo-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    {data.pdf_file ? (
                                        <div className="space-y-4">
                                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                                            <div className="text-center">
                                                <div className="text-base font-medium text-gray-900 mb-1 break-words px-4">
                                                    {data.pdf_file.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {(data.pdf_file.size / 1024 / 1024).toFixed(2)} MB
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setData('pdf_file', null)}
                                                className="text-sm text-red-600 hover:text-red-800 transition-colors underline"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="text-center">
                                                <div className="text-base font-medium text-gray-900 mb-1">
                                                    Drop your PDF here, or click to browse
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Maximum file size: 100MB • Supported format: PDF only
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.pdf_file && <p className="text-red-500 text-sm mt-1">{errors.pdf_file}</p>}
                            </div>

                            {/* Upload Progress */}
                            {progress && (
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex justify-between text-sm text-blue-800 mb-2">
                                        <span className="font-medium">Uploading manuscript...</span>
                                        <span className="font-semibold">{progress.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 gap-4">
                                <div className="text-sm text-gray-500">
                                    * Required fields
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <Link
                                        href={route('author.dashboard')}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.pdf_file || !data.title || !data.description || !data.category_slug}
                                        className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    >
                                        <FileText className="h-5 w-5 mr-2" />
                                        {processing ? 'Submitting...' : 'Submit for Review'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}