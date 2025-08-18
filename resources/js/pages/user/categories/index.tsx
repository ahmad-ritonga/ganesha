
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
    Atom, 
    Users, 
    Heart, 
    Wrench, 
    BookOpen, 
    Search,
    Filter,
    Grid3X3,
    List,
    ChevronRight,
    Star
} from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    books_count: number;
    is_active: boolean;
    image_url?: string;
}

interface CategoriesPageProps {
    categories: {
        data: Category[];
        links?: any[];
        meta?: any;
    };
    filters: {
        slug?: string;
        search?: string;
    };
    slugStats: Record<string, {
        total: number;
        active: number;
    }>;
    currentSlug?: string;
}

export default function CategoriesIndex() {
    const { categories, filters, slugStats, currentSlug } = usePage<CategoriesPageProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const slugConfig = [
        {
            key: 'eksakta',
            name: 'Ilmu Eksakta',
            description: 'Matematika, Fisika, Kimia, Biologi',
            icon: Atom,
            color: 'blue',
            bgColor: 'bg-blue-500',
            lightBg: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            key: 'soshum',
            name: 'Sosial Humaniora',
            description: 'Sosiologi, Psikologi, Ekonomi, Hukum',
            icon: Users,
            color: 'purple',
            bgColor: 'bg-purple-500',
            lightBg: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            key: 'terapan',
            name: 'Ilmu Terapan',
            description: 'Kedokteran, Teknik, Pertanian',
            icon: Heart,
            color: 'green',
            bgColor: 'bg-green-500',
            lightBg: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            key: 'interdisipliner',
            name: 'Interdisipliner',
            description: 'Bioteknologi, Data Science, AI',
            icon: Wrench,
            color: 'orange',
            bgColor: 'bg-orange-500',
            lightBg: 'bg-orange-50',
            textColor: 'text-orange-600'
        }
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementation for search
        window.location.href = `/categories?search=${encodeURIComponent(searchTerm)}${currentSlug ? `&slug=${currentSlug}` : ''}`;
    };

    const currentSlugConfig = slugConfig.find(s => s.key === currentSlug);

    return (
        <PublicLayout title="Kategori Buku" description="Jelajahi berbagai kategori buku ilmiah dan akademik">
            <Head title="Kategori Buku" />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-50 to-cyan-50 py-16 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Kategori Buku
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            {currentSlugConfig ? (
                                <>
                                    <span className={`${currentSlugConfig.textColor}`}>
                                        {currentSlugConfig.name}
                                    </span>
                                    <br />
                                    <span className="text-gray-600 text-2xl md:text-3xl">
                                        {currentSlugConfig.description}
                                    </span>
                                </>
                            ) : (
                                <>
                                    Jelajahi <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Kategori</span> Buku
                                </>
                            )}
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                            {currentSlugConfig 
                                ? `Temukan koleksi buku ${currentSlugConfig.name.toLowerCase()} terbaik untuk mendukung penelitian dan pembelajaran Anda.`
                                : 'Pilih kategori sesuai bidang ilmu yang Anda minati dan temukan buku-buku berkualitas untuk mendukung penelitian Anda.'
                            }
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari kategori..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-lg text-lg"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-medium"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            {!currentSlug && (
                <section className="py-8 px-4 sm:px-6 bg-white border-b">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Rumpun Ilmu</h2>
                                <p className="text-gray-600">Pilih rumpun ilmu untuk menyaring kategori</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Tampilan:</span>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100'}`}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {slugConfig.map((slug) => {
                                const Icon = slug.icon;
                                const stats = slugStats[slug.key];
                                
                                return (
                                    <Link
                                        key={slug.key}
                                        href={`/categories?slug=${slug.key}`}
                                        className="group"
                                    >
                                        <motion.div
                                            className={`${slug.lightBg} rounded-2xl p-6 border-2 border-transparent hover:border-${slug.color}-200 transition-all duration-300 hover:shadow-lg cursor-pointer`}
                                            whileHover={{ y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`w-16 h-16 ${slug.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            
                                            <h3 className={`text-xl font-bold ${slug.textColor} mb-2`}>
                                                {slug.name}
                                            </h3>
                                            
                                            <p className="text-gray-600 text-sm mb-4">
                                                {slug.description}
                                            </p>
                                            
                                            {stats && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">
                                                        {stats.active} kategori
                                                    </span>
                                                    <ChevronRight className={`w-4 h-4 ${slug.textColor} group-hover:translate-x-1 transition-transform`} />
                                                </div>
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Grid/List */}
            <section className="py-12 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {categories.data.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {currentSlugConfig ? `Kategori ${currentSlugConfig.name}` : 'Semua Kategori'}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Menampilkan {categories.data.length} dari {categories.meta?.total || categories.data.length} kategori
                                    </p>
                                </div>
                                
                                {currentSlug && (
                                    <Link
                                        href="/categories"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                                    >
                                        Lihat Semua Kategori
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>

                            <div className={`grid gap-6 ${
                                viewMode === 'grid' 
                                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                    : 'grid-cols-1'
                            }`}>
                                {categories.data.map((category) => {
                                    const categorySlugConfig = slugConfig.find(s => s.key === category.slug);
                                    
                                    return (
                                        <motion.div
                                            key={category.id}
                                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                            whileHover={{ y: -4 }}
                                        >
                                            <Link href={`/books?category=${category.id}`} className="block">
                                                {/* Category Image or Icon */}
                                                <div className={`h-32 ${categorySlugConfig?.lightBg || 'bg-gray-100'} flex items-center justify-center relative overflow-hidden`}>
                                                    {category.image_url ? (
                                                        <img 
                                                            src={category.image_url} 
                                                            alt={category.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    ) : categorySlugConfig ? (
                                                        <categorySlugConfig.icon className={`w-12 h-12 ${categorySlugConfig.textColor}`} />
                                                    ) : (
                                                        <BookOpen className="w-12 h-12 text-gray-400" />
                                                    )}
                                                    
                                                    {/* Books count badge */}
                                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                                        {category.books_count} buku
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                                                            {category.name}
                                                        </h3>
                                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
                                                    </div>
                                                    
                                                    {category.description && (
                                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                                            {category.description}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between">
                                                        {categorySlugConfig && (
                                                            <span className={`px-3 py-1 ${categorySlugConfig.lightBg} ${categorySlugConfig.textColor} text-xs font-medium rounded-full`}>
                                                                {categorySlugConfig.name}
                                                            </span>
                                                        )}
                                                        
                                                        <div className="flex items-center gap-1 text-yellow-500">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="text-xs font-medium text-gray-600">4.8</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {categories.links && categories.links.length > 3 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        {categories.links.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 text-gray-400 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }
                                            
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                                        link.active
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Kategori tidak ditemukan
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filters.search 
                                    ? `Tidak ada kategori yang cocok dengan pencarian "${filters.search}"`
                                    : 'Belum ada kategori yang tersedia untuk rumpun ilmu ini'
                                }
                            </p>
                            <div className="flex gap-4 justify-center">
                                {filters.search && (
                                    <Link
                                        href="/categories"
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 font-medium"
                                    >
                                        Lihat Semua Kategori
                                    </Link>
                                )}
                                <Link
                                    href="/"
                                    className="px-6 py-3 bg-white text-emerald-600 border border-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors duration-200 font-medium"
                                >
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}