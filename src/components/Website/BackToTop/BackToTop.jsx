"use client";

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 50) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            className={`fixed bottom-6 right-6 p-3 rounded-full bg-cyan-500 text-white shadow-lg transition-all duration-300 z-50 ${isVisible ? 'opacity-100' : 'fixed bottom-6 right-6 opacity-0 pointer-events-none z-50'
                }`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <ChevronUp size={24} />
        </button>
    );
};

export default BackToTop;