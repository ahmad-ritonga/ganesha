import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

declare global {
    interface Window {
        grecaptcha: any;
        onRecaptchaLoad: () => void;
    }
}

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    'g-recaptcha-response': string;
};

interface RegisterProps {
    recaptcha_site_key: string;
}

export default function Register({ recaptcha_site_key }: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        'g-recaptcha-response': '',
    });

    const recaptchaRef = useRef<HTMLDivElement>(null);
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

    const getPasswordMatch = () => {
        if (!data.password_confirmation) return null;
        return data.password === data.password_confirmation;
    };

    const passwordMatch = getPasswordMatch();

    useEffect(() => {
        // Check if reCAPTCHA is already loaded
        if (window.grecaptcha && window.grecaptcha.render) {
            renderRecaptcha();
            return;
        }

        // Define callback function for when reCAPTCHA loads
        window.onRecaptchaLoad = () => {
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
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup: remove callback
            if (window.onRecaptchaLoad) {
                delete window.onRecaptchaLoad;
            }
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
        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
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
            <Head title="Register" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
                <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden border border-white/20 backdrop-blur-sm">
                    <div className="flex">
                        {/* Left Side - Register Form */}
                        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-white to-slate-50/50">
                            <div className="w-full max-w-md">
                                {/* Logo and Header */}
                                <div className="text-center mb-8">
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
                                        Create an account
                                    </h2>
                                    <p className="text-slate-600 text-base">
                                        Enter your details below to create your account
                                    </p>
                                </div>

                                <form className="space-y-5" onSubmit={submit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label 
                                                htmlFor="name" 
                                                className="block text-sm font-semibold text-black mb-2"
                                            >
                                                Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                disabled={processing}
                                                placeholder="Full name"
                                                className="w-full h-11 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div>
                                            <label 
                                                htmlFor="email" 
                                                className="block text-sm font-semibold text-black mb-2"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                disabled={processing}
                                                placeholder="email@example.com"
                                                className="w-full h-11 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div>
                                            <label 
                                                htmlFor="phone" 
                                                className="block text-sm font-semibold text-black mb-2"
                                            >
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                tabIndex={3}
                                                autoComplete="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                disabled={processing}
                                                placeholder="+62 812-3456-7890"
                                                className="w-full h-11 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div>
                                            <label 
                                                htmlFor="password" 
                                                className="block text-sm font-semibold text-black mb-2"
                                            >
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Password"
                                                    className="w-full h-11 px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
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
                                                className="block text-sm font-semibold text-black mb-2"
                                            >
                                                Confirm password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    tabIndex={5}
                                                    autoComplete="new-password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Confirm password"
                                                    className="w-full h-11 px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
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
                                            
                                            {/* Password Match Indicator */}
                                            {data.password_confirmation && (
                                                <div className="mt-2">
                                                    <div className={`flex items-center text-sm ${passwordMatch ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <div>
                                            <div ref={recaptchaRef}></div>
                                            <InputError message={errors['g-recaptcha-response']} />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] mt-6" 
                                        tabIndex={6} 
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-3" />}
                                        Create account
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-slate-600">
                                        Already have an account?{' '}
                                        <TextLink 
                                            href={route('login')} 
                                            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 underline decoration-emerald-300 hover:decoration-emerald-500"
                                            tabIndex={7}
                                        >
                                            Log in
                                        </TextLink>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"></div>
                            
                            {/* Animated background elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
                                <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-teal-200/25 rounded-full blur-lg animate-pulse delay-500"></div>
                                <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-emerald-200/20 rounded-full blur-xl animate-pulse delay-700"></div>
                            </div>
                            
                            <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                                <div className="max-w-md text-center">
                                    <div className="relative mb-8">
                                        <img 
                                            src="/assets/ilustrasi/register.png" 
                                            alt="Register Illustration" 
                                            className="w-full h-auto object-contain drop-shadow-2xl"
                                        />
                                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl -z-10"></div>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                                        Join Ganesha Today
                                    </h1>
                                    <p className="text-emerald-50 text-lg leading-relaxed">
                                        Start your journey with our digital library platform and discover a world of knowledge at your fingertips
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