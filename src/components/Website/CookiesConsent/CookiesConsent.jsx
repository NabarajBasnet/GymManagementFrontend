'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShowConsent(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowConsent(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setShowConsent(false);
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-2xl">
            <div className="container-custom">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-sm">
                            We use cookies to enhance your experience and analyze our traffic.
                            By continuing to use our site, you agree to our use of cookies.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={declineCookies}
                            className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            Decline
                        </button>
                        <button
                            onClick={acceptCookies}
                            className="btn-primary text-sm"
                        >
                            Accept
                        </button>
                        <button
                            onClick={declineCookies}
                            className="text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;