import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Transaction } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface AdminTransactionsShowProps {
    transaction: Transaction;
}

export default function AdminTransactionsShow({ transaction }: AdminTransactionsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Transaksi',
            href: '/admin/transactions',
        },
        {
            title: transaction.transaction_code,
            href: `/admin/transactions/${transaction.id}`,
        },
    ];

    const getStatusColor = (status: Transaction['status']) => {
        const colors = {
            pending: 'yellow',
            paid: 'green',
            failed: 'red',
            expired: 'gray',
        };
        return colors[status] || 'gray';
    };

    const getStatusLabel = (status: Transaction['status']) => {
        const labels = {
            pending: 'Menunggu Pembayaran',
            paid: 'Pembayaran Berhasil',
            failed: 'Pembayaran Gagal',
            expired: 'Pembayaran Kadaluarsa',
        };
        return labels[status] || status;
    };

    const getTypeLabel = (type: Transaction['type']) => {
        return type === 'book_purchase' ? 'Pembelian Buku' : 'Pembelian Chapter';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transaksi ${transaction.transaction_code}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {transaction.transaction_code}
                            </h1>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-${getStatusColor(transaction.status)}-100 text-${getStatusColor(transaction.status)}-800 dark:bg-${getStatusColor(transaction.status)}-900 dark:text-${getStatusColor(transaction.status)}-200`}>
                                {getStatusLabel(transaction.status)}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {getTypeLabel(transaction.type)} • {formatCurrency(transaction.total_amount)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>User: {transaction.user.name}</span>
                            <span>•</span>
                            <span>Payment: {transaction.payment_method}</span>
                        </div>
                    </div>
                    
                    <Link
                        href="/admin/transactions"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Transaction Items */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Item Transaksi</h2>
                            
                            <div className="space-y-4">
                                {transaction.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {item.item_title}
                                                </h3>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {item.item_type === 'book' ? 'Buku' : 'Chapter'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {formatCurrency(item.price)}
                                            </div>
                                            {item.quantity > 1 && (
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Total: {formatCurrency(item.price * item.quantity)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-600">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Total Pembayaran
                                    </span>
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {formatCurrency(transaction.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Purchases */}
                        {transaction.purchases && transaction.purchases.length > 0 && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Akses yang Diberikan</h2>
                                
                                <div className="space-y-3">
                                    {transaction.purchases.map((purchase, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {purchase.purchasable_type === 'book' ? 'Akses Buku' : 'Akses Chapter'}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Dibeli pada: {formatDate(purchase.purchased_at)}
                                                </div>
                                            </div>
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                {purchase.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Timeline */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Timeline Pembayaran</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">Transaksi Dibuat</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(transaction.created_at)}
                                        </div>
                                    </div>
                                </div>

                                {transaction.paid_at && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                                        <div className="ml-3">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">Pembayaran Berhasil</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(transaction.paid_at)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {transaction.expired_at && transaction.status === 'expired' && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-3 h-3 bg-gray-500 rounded-full mt-1"></div>
                                        <div className="ml-3">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">Pembayaran Kadaluarsa</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(transaction.expired_at)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {transaction.status === 'failed' && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                                        <div className="ml-3">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">Pembayaran Gagal</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(transaction.updated_at)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Transaction Info */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Info Transaksi</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        ID Transaksi
                                    </label>
                                    <div className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded">
                                        {transaction.id}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Kode Transaksi
                                    </label>
                                    <div className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded">
                                        {transaction.transaction_code}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-${getStatusColor(transaction.status)}-100 text-${getStatusColor(transaction.status)}-800 dark:bg-${getStatusColor(transaction.status)}-900 dark:text-${getStatusColor(transaction.status)}-200`}>
                                        {getStatusLabel(transaction.status)}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tipe
                                    </label>
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {getTypeLabel(transaction.type)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Metode Pembayaran
                                    </label>
                                    <div className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                                        {transaction.payment_method}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Total
                                    </label>
                                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                        {formatCurrency(transaction.total_amount)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Info Pembeli</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nama
                                    </label>
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {transaction.user.name}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {transaction.user.email}
                                    </div>
                                </div>

                                {transaction.user.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Telepon
                                        </label>
                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                            {transaction.user.phone}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role
                                    </label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        transaction.user.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    }`}>
                                        {transaction.user.role === 'admin' ? 'Admin' : 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Midtrans Info */}
                        {(transaction.midtrans_order_id || transaction.midtrans_transaction_id) && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Info Midtrans</h2>
                                
                                <div className="space-y-4">
                                    {transaction.midtrans_order_id && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Order ID
                                            </label>
                                            <div className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded">
                                                {transaction.midtrans_order_id}
                                            </div>
                                        </div>
                                    )}

                                    {transaction.midtrans_transaction_id && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Transaction ID
                                            </label>
                                            <div className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded">
                                                {transaction.midtrans_transaction_id}
                                            </div>
                                        </div>
                                    )}

                                    {transaction.midtrans_payment_type && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Payment Type
                                            </label>
                                            <div className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                                                {transaction.midtrans_payment_type}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}