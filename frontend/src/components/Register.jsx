import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { LuEye, LuEyeOff, LuMail, LuLock, LuUser, LuSparkles } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { registerUser, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state, default to home
    const from = location.state?.from || "/";

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMessage("");
        try {
            await registerUser(data.email, data.password, data.name);
            setMessage("success");
            // Redirect to previous location or home after successful registration
            setTimeout(() => navigate(from, { replace: true }), 1500);
        } catch (error) {
            setMessage("Registration failed. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            setMessage("success");
            setTimeout(() => navigate("/"), 800);
        } catch (error) {
            setMessage("Google sign-in failed. Please try again.");
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Floating background decorations */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-green-500/3 rounded-full blur-2xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Card with gradient border effect */}
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="relative p-8 md:p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg"
                            >
                                <LuSparkles className="w-8 h-8 text-white" />
                            </motion.div>
                            
                            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                                Create Account
                            </h2>
                            <p className="text-slate-600">Join NovaLibrary today</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuUser className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        {...register("name", { 
                                            required: "Name is required",
                                            minLength: {
                                                value: 2,
                                                message: "Name must be at least 2 characters"
                                            }
                                        })}
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuMail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        {...register("email", { 
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        type="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuLock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        {...register("password", { 
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <LuEyeOff className="h-5 w-5" />
                                        ) : (
                                            <LuEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuLock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        {...register("confirmPassword", { 
                                            required: "Please confirm your password",
                                            validate: value => value === password || "Passwords do not match"
                                        })}
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? (
                                            <LuEyeOff className="h-5 w-5" />
                                        ) : (
                                            <LuEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Error/Success Message */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`px-4 py-3 rounded-xl text-sm ${
                                            message === "success"
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-red-50 text-red-700 border border-red-200"
                                        }`}
                                    >
                                        {message === "success" ? "Account created! Redirecting to login..." : message}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </motion.button>
                        </form>

                        {/* Terms */}
                        <p className="mt-4 text-center text-xs text-slate-500">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="text-green-600 hover:text-green-700 font-medium">Terms</a>
                            {" "}and{" "}
                            <a href="#" className="text-green-600 hover:text-green-700 font-medium">Privacy Policy</a>
                        </p>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <motion.button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                            <FaGoogle className="w-5 h-5" />
                            Sign up with Google
                        </motion.button>

                        {/* Footer Links */}
                        <p className="mt-6 text-center text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    ©2025 NovaLibrary. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default Register;