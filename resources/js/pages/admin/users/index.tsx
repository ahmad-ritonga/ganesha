import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type UserFilters, type PaginatedData, type PaginationLink } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users, UserCheck, Shield, TrendingUp, Activity, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Manajemen Pengguna',
        href: '/admin/users',
    },
];

interface UserStatsExtended {
    total_users: number;
    verified_users: number;
    admin_users: number;
    new_users_this_month: number;
    active_users_this_month: number;
}

interface AdminUsersIndexProps {
    users: PaginatedData<User>;
    stats: UserStatsExtended;
    filters: UserFilters;
}

export default function AdminUsersIndex({ users, stats, filters }: AdminUsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role && filters.role !== '' ? filters.role : '');
    const [verified, setVerified] = useState(filters.verified && filters.verified !== '' ? filters.verified : '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = () => {
        router.get('/admin/users', { 
            search, 
            role, 
            verified, 
            date_from: dateFrom, 
            date_to: dateTo 
        });
    };

    const handleReset = () => {
        setSearch('');
        setRole('');
        setVerified('');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/users');
    };

    const getRoleColor = (role: string) => {
        return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
    };

    const getRoleLabel = (role: string) => {
        return role === 'admin' ? 'Admin' : 'User';
    };

    const getVerificationBadge = (emailVerifiedAt: string | null | undefined) => {
        return emailVerifiedAt ? (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Terverifikasi
            </span>
        ) : (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Belum Verifikasi
            </span>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Pengguna</h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pengguna</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_users.toLocaleString()}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pengguna Terverifikasi</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.verified_users.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">
                                    {((stats.verified_users / stats.total_users) * 100).toFixed(1)}% dari total
                                </p>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.admin_users.toLocaleString()}</p>
                            </div>
                            <Shield className="h-8 w-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pengguna Baru</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.new_users_this_month.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Bulan ini</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pengguna Aktif</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active_users_this_month.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Bulan ini</p>
                            </div>
                            <Activity className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filter Pengguna</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                            />
                        </div>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        >
                            <option value="">Semua Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select
                            value={verified}
                            onChange={(e) => setVerified(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        >
                            <option value="">Semua Status</option>
                            <option value="yes">Terverifikasi</option>
                            <option value="no">Belum Verifikasi</option>
                        </select>
                        <input
                            type="date"
                            placeholder="Dari Tanggal"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        />
                        <input
                            type="date"
                            placeholder="Sampai Tanggal"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                        />
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

                {/* Users Table */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daftar Pengguna</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Total {users.total} pengguna ditemukan</p>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-neutral-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pengguna
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bergabung
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        {user.avatar_url ? (
                                                            <img 
                                                                src={user.avatar_url} 
                                                                alt={user.name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getVerificationBadge(user.email_verified_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {users.from} - {users.to} dari {users.total} hasil
                                </div>
                                <div className="flex space-x-1">
                                    {users.links.map((link: PaginationLink, index: number) => (
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}