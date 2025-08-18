import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';
import { User, Edit3, Shield, Eye, EyeOff, CheckCircle, Trash2, Camera, Upload, X } from 'lucide-react';

import PublicLayout from '../../layouts/PublicLayout';
import InputError from '@/components/input-error';

interface ProfileEditProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function ProfileEdit({ mustVerifyEmail, status }: ProfileEditProps) {
    const user = usePage<any>().props.auth.user;
    
    // Profile form
    const { data: profileData, setData: setProfileData, patch: updateProfile, errors: profileErrors, processing: profileProcessing } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });

    // Avatar upload
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password form
    const { data: passwordData, setData: setPasswordData, put: updatePassword, errors: passwordErrors, processing: passwordProcessing, reset: resetPasswordForm } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Delete account form
    const { data: deleteData, setData: setDeleteData, delete: deleteAccount, processing: deleteProcessing, reset: resetDeleteForm } = useForm({
        password: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const passwordStrength = getPasswordStrength(passwordData.password);

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

    const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (2MB)
            if (file.size > 2048 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }

            // Validate file type
            if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, JPG, GIF)');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Upload avatar
            uploadAvatar(file);
        }
    };

    const uploadAvatar = (file: File) => {
        setIsUploadingAvatar(true);
        
        const formData = new FormData();
        formData.append('avatar', file);

        router.post(route('profile.avatar.update'), formData, {
            onSuccess: () => {
                setAvatarPreview(null);
                setIsUploadingAvatar(false);
            },
            onError: () => {
                setAvatarPreview(null);
                setIsUploadingAvatar(false);
            },
        });
    };

    const removeAvatar = () => {
        router.delete(route('profile.avatar.remove'));
    };

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        updateProfile(route('profile.update'));
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        updatePassword(route('profile.password.update'), {
            onSuccess: () => resetPasswordForm(),
        });
    };

    const submitDeleteAccount: FormEventHandler = (e) => {
        e.preventDefault();
        deleteAccount(route('profile.destroy'), {
            onFinish: () => {
                resetDeleteForm();
                setShowDeleteModal(false);
            },
        });
    };

    return (
        <PublicLayout title="Profile Settings">
            <Head title="Profile" />

            <div className="bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 min-h-screen pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with Avatar */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-xl">
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt="Avatar Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : user.avatar_url ? (
                                        <img 
                                            src={user.avatar_url} 
                                            alt={user.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-16 h-16 text-white" />
                                        </div>
                                    )}
                                    
                                    {/* Upload Overlay */}
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Camera Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                    className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                
                                {/* Remove Avatar Button */}
                                {user.avatar && (
                                    <button
                                        onClick={removeAvatar}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-lg -z-10"></div>
                            </div>
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarSelect}
                            className="hidden"
                        />
                        
                        <h1 className="text-4xl font-bold text-black mb-3">Profile Settings</h1>
                        <p className="text-slate-600 text-lg">Manage your account information and security settings</p>
                        
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                            >
                                <Upload className="w-4 h-4" />
                                {isUploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                            </button>
                            
                            {user.avatar && (
                                <button
                                    onClick={removeAvatar}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl text-center shadow-sm">
                            <p className="text-sm font-medium text-emerald-800">{status}</p>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Profile Information */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-500/10 border border-white/20 backdrop-blur-sm p-8">
                            <div className="flex items-center mb-6">
                                <Edit3 className="w-6 h-6 text-emerald-600 mr-3" />
                                <h2 className="text-2xl font-bold text-black">Profile Information</h2>
                            </div>

                            <form onSubmit={submitProfile} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData('name', e.target.value)}
                                        disabled={profileProcessing}
                                        className="w-full h-12 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                        placeholder="Your full name"
                                    />
                                    <InputError message={profileErrors.name} />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData('email', e.target.value)}
                                        disabled={profileProcessing}
                                        className="w-full h-12 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                        placeholder="your.email@example.com"
                                    />
                                    <InputError message={profileErrors.email} />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData('phone', e.target.value)}
                                        disabled={profileProcessing}
                                        className="w-full h-12 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                        placeholder="+62 812-3456-7890"
                                    />
                                    <InputError message={profileErrors.phone} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={profileProcessing}
                                    className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {profileProcessing ? 'Updating...' : 'Update Profile'}
                                </button>
                            </form>
                        </div>

                        {/* Change Password - Same as before */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-500/10 border border-white/20 backdrop-blur-sm p-8">
                            <div className="flex items-center mb-6">
                                <Shield className="w-6 h-6 text-emerald-600 mr-3" />
                                <h2 className="text-2xl font-bold text-black">Change Password</h2>
                            </div>

                            <form onSubmit={submitPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="current_password" className="block text-sm font-semibold text-black mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="current_password"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                                            disabled={passwordProcessing}
                                            className="w-full h-12 px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors duration-200"
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <InputError message={passwordErrors.current_password} />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-black mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.password}
                                            onChange={(e) => setPasswordData('password', e.target.value)}
                                            disabled={passwordProcessing}
                                            className="w-full h-12 px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors duration-200"
                                        >
                                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {passwordData.password && (
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
                                        </div>
                                    )}

                                    <InputError message={passwordErrors.password} />
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-semibold text-black mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.password_confirmation}
                                            onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                            disabled={passwordProcessing}
                                            className="w-full h-12 px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium bg-white/80 backdrop-blur-sm"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <InputError message={passwordErrors.password_confirmation} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
                                    className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {passwordProcessing ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-8 bg-white rounded-3xl shadow-xl shadow-red-500/10 border border-red-200/50 backdrop-blur-sm p-8">
                        <div className="flex items-center mb-6">
                            <Trash2 className="w-6 h-6 text-red-600 mr-3" />
                            <h2 className="text-2xl font-bold text-red-600">Delete Account</h2>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                            <p className="text-red-800 text-sm leading-relaxed">
                                <strong>Warning:</strong> Once your account is deleted, all of your resources and data will be permanently deleted. 
                                Before deleting your account, please download any data or information that you wish to retain.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-2">Delete Account</h3>
                            <p className="text-slate-600">Are you sure you want to delete your account? This action cannot be undone.</p>
                        </div>

                        <form onSubmit={submitDeleteAccount} className="space-y-6">
                            <div>
                                <label htmlFor="delete_password" className="block text-sm font-semibold text-black mb-2">
                                    Confirm with your password
                                </label>
                                <input
                                    id="delete_password"
                                    type="password"
                                    value={deleteData.password}
                                    onChange={(e) => setDeleteData('password', e.target.value)}
                                    disabled={deleteProcessing}
                                    className="w-full h-12 px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200 text-black font-medium"
                                    placeholder="Enter your password"
                                />
                                <InputError message={passwordErrors.password} />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        resetDeleteForm();
                                    }}
                                    className="flex-1 h-12 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteProcessing}
                                    className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleteProcessing ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}