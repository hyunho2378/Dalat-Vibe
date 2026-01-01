import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// =============================================================================
// Animation Variants
// =============================================================================

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 300
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.2 }
    }
};

// =============================================================================
// Login Modal Component
// =============================================================================

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            onClose();
            // Reset form
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal Card */}
                    <motion.div
                        className="relative w-full max-w-md mx-4 sm:mx-auto"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="font-tenor text-2xl text-white mb-2">
                                    Welcome Back
                                </h2>
                                <p className="font-manrope text-sm text-white/60">
                                    Sign in to continue your journey
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                                    <p className="text-red-300 text-sm font-manrope">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label className="block font-manrope text-xs text-white/40 uppercase tracking-wider mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                            className="
                                                w-full pl-12 pr-4 py-3.5
                                                bg-white/5 border border-white/20 rounded-xl
                                                font-manrope text-white placeholder:text-white/30
                                                focus:outline-none focus:border-white/40 focus:bg-white/10
                                                transition-all
                                            "
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block font-manrope text-xs text-white/40 uppercase tracking-wider mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="
                                                w-full pl-12 pr-4 py-3.5
                                                bg-white/5 border border-white/20 rounded-xl
                                                font-manrope text-white placeholder:text-white/30
                                                focus:outline-none focus:border-white/40 focus:bg-white/10
                                                transition-all
                                            "
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="
                                        w-full py-3.5 mt-2
                                        bg-white text-slate-900
                                        font-manrope font-medium
                                        rounded-xl
                                        flex items-center justify-center gap-2
                                        hover:bg-white/90 active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all
                                    "
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5" />
                                            Sign In
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <p className="text-center mt-6 font-manrope text-sm text-white/40">
                                Don't have an account?{' '}
                                <button
                                    onClick={onSwitchToRegister}
                                    className="text-white hover:underline"
                                >
                                    Create one
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
