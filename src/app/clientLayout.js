'use client';

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Website/Navbar/Navbar";
import Footer from "@/components/Website/Footer/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function MainClientLayout({ children }) {
    const pathname = usePathname();
    const lenisRef = useRef(null);
    const [scrollDir, setScrollDir] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let scrollTimeout;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setScrollDir('down');
            } else if (currentScrollY < lastScrollY) {
                setScrollDir('up');
            }

            lastScrollY = currentScrollY;
            setIsScrolling(true);

            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, []);

    const hideNavbar = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup');

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            smoothTouch: false,
            wheelMultiplier: 1,
            lerp: 0.1,
            infinite: false,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            normalizeWheel: true,
            syncTouch: true,
            syncTouchLerp: 0.04,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenisRef.current = lenis;
        return () => lenis.destroy();
    }, []);

    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
            {/* Navbar */}
            {(!hideNavbar && (scrollDir === null || scrollDir === 'up')) && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    <Navbar />
                </div>
            )}

            {/* Main Content with Footer */}
            <div className="lenis-content">
                <main className="min-h-screen">
                    {children}
                </main>

                {/* Footer */}
                {!hideNavbar && (
                    <div className="w-full">
                        <Footer />
                    </div>
                )}
            </div>
        </div>
    );
}
