"use client";

import { ArrowLeft, Dumbbell, Activity, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-md w-full">
                {/* Logo/Brand */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">Fitbinary</span>
                    </div>
                </div>

                {/* 404 with Animation */}
                <div className="relative mb-6">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-16 h-16 text-blue-400/20 animate-pulse" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-3xl font-bold text-white">
                        Workout Not Found
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Looks like this page skipped leg day and disappeared.
                        Let's get you back to your fitness journey.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/"
                        className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </a>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 border border-slate-700 hover:border-slate-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-slate-700">
                    <p className="text-slate-500 text-sm">
                        Need help? Contact our support team at{" "}
                        <a href="mailto:support@fitbinary.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                            support@fitbinary.com
                        </a>
                    </p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        </div>
    );
}