import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength checker
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;
        return { strength, checks };
    };

    const passwordStrength = getPasswordStrength(data.password);

    const getStrengthColor = (strength: number) => {
        if (strength < 2) return 'bg-red-500';
        if (strength < 4) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    const getStrengthText = (strength: number) => {
        if (strength < 2) return 'Weak';
        if (strength < 4) return 'Medium';
        return 'Strong';
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />
            
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
                                            <Shield className="w-24 h-24 text-white drop-shadow-lg" />
                                        </div>
                                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl -z-10"></div>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                                        Secure Reset
                                    </h1>
                                    <p className="text-emerald-50 text-lg leading-relaxed">
                                        Create a strong new password to keep your account secure and protected
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
                                        Reset your password
                                    </h2>
                                    <p className="text-slate-600 text-base">
                                        Please enter your new password below
                                    </p>
                                </div>

                                <form className="space-y-6" onSubmit={submit}>
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
                                            name="email"
                                            autoComplete="email"
                                            value={data.email}
                                            readOnly
                                            className="w-full h-12 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm bg-slate-50 text-slate-600 font-medium cursor-not-allowed"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="password" 
                                            className="block text-sm font-semibold text-black mb-3"
                                        >
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                autoComplete="new-password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                disabled={processing}
                                                autoFocus
                                                placeholder="Enter new password"
                                                className="w-full h-12 px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors duration-200"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        
                                        {/* Password Strength Indicator */}
                                        {data.password && (
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-600">Password strength:</span>
                                                    <span className={`text-sm font-semibold ${
                                                        passwordStrength.strength < 2 ? 'text-red-600' :
                                                        passwordStrength.strength < 4 ? 'text-yellow-600' : 'text-emerald-600'
                                                    }`}>
                                                        {getStrengthText(passwordStrength.strength)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.strength)}`}
                                                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className={`flex items-center ${passwordStrength.checks.length ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        8+ characters
                                                    </div>
                                                    <div className={`flex items-center ${passwordStrength.checks.uppercase ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Uppercase letter
                                                    </div>
                                                    <div className={`flex items-center ${passwordStrength.checks.lowercase ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Lowercase letter
                                                    </div>
                                                    <div className={`flex items-center ${passwordStrength.checks.number ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Number
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <InputError message={errors.password} />
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="password_confirmation" 
                                            className="block text-sm font-semibold text-black mb-3"
                                        >
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                disabled={processing}
                                                placeholder="Confirm new password"
                                                className="w-full h-12 px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors duration-200"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]" 
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-3" />}
                                        {processing ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}