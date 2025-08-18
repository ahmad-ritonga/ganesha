import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

type ForgotPasswordForm = {
    email: string;
};

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm<Required<ForgotPasswordForm>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden border border-white/20 backdrop-blur-sm">
                    <div className="flex">
                        {/* Left Side - Illustration */}
                        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"></div>
                            
                            {/* Animated background elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute bottom-20 left-10 w-40 h-40 bg-cyan-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
                                <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-teal-200/25 rounded-full blur-lg animate-pulse delay-500"></div>
                            </div>
                            
                            <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                                <div className="max-w-md text-center">
                                    <div className="relative mb-8">
                                        <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                            <Mail className="w-24 h-24 text-white drop-shadow-lg" />
                                        </div>
                                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl -z-10"></div>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                                        Reset Your Password
                                    </h1>
                                    <p className="text-emerald-50 text-lg leading-relaxed">
                                        Don't worry! We'll send you a reset link to get back into your account safely
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-white to-slate-50/50">
                            <div className="w-full max-w-md">
                                {/* Logo and Header */}
                                <div className="text-center mb-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <img 
                                                src="/assets/images/logo.png" 
                                                alt="Ganesha Logo" 
                                                className="h-24 w-24 object-contain drop-shadow-lg"
                                            />
                                            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-lg -z-10"></div>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold text-black mb-3 tracking-tight">
                                        Forgot your password?
                                    </h2>
                                    <p className="text-slate-600 text-base">
                                        Enter your email address and we'll send you a link to reset your password
                                    </p>
                                </div>

                {status && (
                    <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl shadow-sm">
                        <div className="flex items-start">
                            <Mail className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-emerald-800 mb-3">{status}</p>
                                <div className="text-sm text-emerald-700 space-y-2">
                                    <p className="font-medium">📧 Tidak melihat email di inbox?</p>
                                    <ul className="ml-4 space-y-1 text-emerald-600">
                                        <li>• Periksa folder <strong>Spam</strong> atau <strong>Junk Mail</strong></li>
                                        <li>• Cek folder <strong>Promosi</strong> jika menggunakan Gmail</li>
                                        <li>• Email mungkin butuh beberapa menit untuk sampai</li>
                                        <li>• Pastikan email yang dimasukkan sudah benar</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}                                <form className="space-y-6" onSubmit={submit}>
                                    <div>
                                        <label 
                                            htmlFor="email" 
                                            className="block text-sm font-semibold text-black mb-3"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your email address"
                                            className="w-full h-12 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]" 
                                        tabIndex={2} 
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-3" />}
                                        {processing ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>

                                <div className="mt-8 text-center">
                                    <TextLink 
                                        href={route('login')} 
                                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 underline decoration-emerald-300 hover:decoration-emerald-500"
                                        tabIndex={3}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to login
                                    </TextLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}