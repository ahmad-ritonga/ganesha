import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

declare global {
    interface Window {
        grecaptcha: any;
        onLoginRecaptchaLoad?: () => void;
    }
}

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
    'g-recaptcha-response': string;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    recaptcha_site_key: string;
}

export default function Login({ status, canResetPassword, recaptcha_site_key }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
        'g-recaptcha-response': '',
    });

    const recaptchaRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Check if reCAPTCHA is already loaded
        if (window.grecaptcha && window.grecaptcha.render) {
            renderRecaptcha();
            return;
        }

        // Define callback function for when reCAPTCHA loads
        window.onLoginRecaptchaLoad = () => {
            renderRecaptcha();
        };

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="recaptcha"]');
        if (existingScript) {
            // Script exists, wait for it to load
            if (window.grecaptcha && window.grecaptcha.render) {
                renderRecaptcha();
            }
            return;
        }

        // Load reCAPTCHA script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onLoginRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup: remove callback
            window.onLoginRecaptchaLoad = undefined;
        };
    }, [recaptcha_site_key]);

    const renderRecaptcha = () => {
        if (window.grecaptcha && recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
            try {
                window.grecaptcha.render(recaptchaRef.current, {
                    sitekey: recaptcha_site_key,
                    callback: (response: string) => {
                        setData('g-recaptcha-response', response);
                    },
                    'expired-callback': () => {
                        setData('g-recaptcha-response', '');
                    },
                });
            } catch (error) {
                console.error('Error rendering reCAPTCHA:', error);
            }
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => {
                reset('password');
                // Reset reCAPTCHA
                if (window.grecaptcha && window.grecaptcha.reset) {
                    try {
                        window.grecaptcha.reset();
                        setData('g-recaptcha-response', '');
                    } catch (error) {
                        console.error('Error resetting reCAPTCHA:', error);
                    }
                }
            },
        });
    };

    return (
        <>
            <Head title="Log in" />
            
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
                                        <img 
                                            src="/assets/ilustrasi/login.png" 
                                            alt="Login Illustration" 
                                            className="w-full h-auto object-contain drop-shadow-2xl"
                                        />
                                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl -z-10"></div>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                                        Welcome to Ganesha
                                    </h1>
                                    <p className="text-emerald-50 text-lg leading-relaxed">
                                        Your digital library platform for managing and accessing e-books with modern elegance
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
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
                                        Sign in to your account
                                    </h2>
                                    <p className="text-slate-600 text-base">
                                        Enter your email and password below to log in
                                    </p>
                                </div>

                                {status && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl text-center shadow-sm">
                                        <p className="text-sm font-medium text-emerald-800">{status}</p>
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={submit}>
                                    <div className="space-y-5">
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
                                                placeholder="email@example.com"
                                                className="w-full h-12 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label 
                                                    htmlFor="password" 
                                                    className="block text-sm font-semibold text-black"
                                                >
                                                    Password
                                                </label>
                                                {canResetPassword && (
                                                    <TextLink 
                                                        href={route('password.request')} 
                                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 underline decoration-emerald-300 hover:decoration-emerald-500"
                                                        tabIndex={6}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Password"
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
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                tabIndex={3}
                                                disabled={processing}
                                                className="w-5 h-5 text-emerald-600 bg-white border-2 border-slate-300 rounded-md focus:ring-emerald-500 focus:ring-2 transition-all duration-200"
                                            />
                                            <label 
                                                htmlFor="remember" 
                                                className="text-sm text-black font-medium cursor-pointer"
                                            >
                                                Remember me
                                            </label>
                                        </div>

                                        <div>
                                            <div ref={recaptchaRef}></div>
                                            <InputError message={errors['g-recaptcha-response']} />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]" 
                                        tabIndex={4} 
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-3" />}
                                        Sign in
                                    </button>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-slate-600">
                                        Don't have an account?{' '}
                                        <TextLink 
                                            href={route('register')} 
                                            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 underline decoration-emerald-300 hover:decoration-emerald-500"
                                            tabIndex={5}
                                        >
                                            Sign up
                                        </TextLink>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}