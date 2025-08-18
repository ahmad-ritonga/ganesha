import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Clock, User } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

interface Chapter {
    id: string;
    title: string;
    chapter_number: number;
    content: string;
    reading_time_minutes: number;
}

interface Book {
    id: string;
    title: string;
    slug: string;
    author: {
        name: string;
    };
    category: {
        name: string;
    };
}

interface ReaderProps {
    book: Book;
    chapter: Chapter;
    previousChapter?: Chapter;
    nextChapter?: Chapter;
    [key: string]: any;
}

export default function ChapterReader() {
    const { book, chapter, previousChapter, nextChapter } = usePage<ReaderProps>().props;

    const formatReadingTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) {
            return `${hours}j ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    const renderContent = (content: string) => {
        return content.split('\n').map((paragraph, idx) => {
            if (paragraph.startsWith('##')) {
                return (
                    <h2 key={idx} className="text-3xl font-bold mt-12 mb-6 text-gray-900">
                        {paragraph.replace('##', '').trim()}
                    </h2>
                );
            } else if (paragraph.startsWith('###')) {
                return (
                    <h3 key={idx} className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
                        {paragraph.replace('###', '').trim()}
                    </h3>
                );
            } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                    <p key={idx} className="font-semibold mt-6 mb-3 text-gray-900 text-lg">
                        {paragraph.replace(/\*\*/g, '')}
                    </p>
                );
            } else if (paragraph.startsWith('- ')) {
                return (
                    <li key={idx} className="ml-8 mb-3 text-gray-700 leading-relaxed text-lg">
                        {paragraph.replace('- ', '')}
                    </li>
                );
            } else if (paragraph.trim()) {
                return (
                    <p key={idx} className="mb-6 text-gray-700 leading-relaxed text-lg">
                        {paragraph}
                    </p>
                );
            }
            return null;
        });
    };

    return (
        <PublicLayout>
            <Head title={`${chapter.title} - ${book.title}`} />

            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10 pt-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={`/books/${book.slug}`}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="font-medium">Kembali ke Buku</span>
                                </Link>
                            </div>
                            
                            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{book.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{book.author.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatReadingTime(chapter.reading_time_minutes)} baca</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="prose prose-lg max-w-none"
                    >
                        {/* Chapter Header */}
                        <div className="border-b border-gray-200 pb-8 mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    Bab {chapter.chapter_number}
                                </span>
                                <span className="text-gray-500 text-sm">{book.category.name}</span>
                            </div>
                            
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {chapter.title}
                            </h1>
                            
                            <div className="flex items-center gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{book.author.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatReadingTime(chapter.reading_time_minutes)} untuk dibaca</span>
                                </div>
                            </div>
                        </div>

                        {/* Chapter Content */}
                        <div className="prose prose-lg max-w-none">
                            {renderContent(chapter.content)}
                        </div>
                    </motion.article>
                </div>

                {/* Navigation Footer */}
                <div className="border-t border-gray-200 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            {previousChapter ? (
                                <Link
                                    href={`/books/${book.slug}/chapters/${previousChapter.id}`}
                                    className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full group-hover:border-emerald-300 transition-colors">
                                        <ChevronLeft className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Sebelumnya</div>
                                        <div className="font-medium">Bab {previousChapter.chapter_number}: {previousChapter.title}</div>
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}

                            {nextChapter ? (
                                <Link
                                    href={`/books/${book.slug}/chapters/${nextChapter.id}`}
                                    className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors group text-right"
                                >
                                    <div>
                                        <div className="text-sm text-gray-500">Selanjutnya</div>
                                        <div className="font-medium">Bab {nextChapter.chapter_number}: {nextChapter.title}</div>
                                    </div>
                                    <div className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full group-hover:border-emerald-300 transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>

                        {/* Back to Book Button */}
                        <div className="flex justify-center mt-8">
                            <Link
                                href={`/books/${book.slug}`}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                Kembali ke Daftar Bab
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
