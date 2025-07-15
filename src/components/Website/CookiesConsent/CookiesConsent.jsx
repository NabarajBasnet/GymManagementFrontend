'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        // Check if localStorage is available (for SSR compatibility)
        if (typeof window !== 'undefined') {
            const consent = localStorage.getItem('cookieConsent');
            if (!consent) {
                // Delay appearance for better UX
                const timer = setTimeout(() => setShowConsent(true), 1000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleConsent = (value) => {
        localStorage.setItem('cookieConsent', value);
        setShowConsent(false);
    };

    return (
        <AnimatePresence>
            {showConsent && (
                <div
                    className="fixed inset-x-0 bottom-0 z-50"
                >
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-900/10 dark:bg-gray-800 dark:ring-gray-700">
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="max-w-3xl">
                                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                                        We use cookies and similar technologies to provide a better experience, analyze traffic, and personalize content. By continuing to browse, you agree to our{' '}
                                        <a href="/privacypolicy" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                            Cookie Policy
                                        </a>
                                        .
                                    </p>
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-3">
                                    <button
                                        onClick={() => handleConsent('declined')}
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleConsent('accepted')}
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                    >
                                        Accept all
                                    </button>
                                    <button
                                        onClick={() => handleConsent('declined')}
                                        className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                        aria-label="Close"
                                    >
                                        <FiX className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;