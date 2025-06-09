"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Website/Navbar/Navbar";
import Footer from "@/components/Website/Footer/Footer";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { Toaster as Sooner } from "@/components/ui/sonner";

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
        setScrollDir("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDir("up");
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

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/userlogin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/root/") ||
    pathname.startsWith("/clientarea") ||
    pathname.startsWith("/StaffLogin") ||
    pathname.startsWith("/MyProfile") ||
    pathname.startsWith("/memberlogin") ||
    pathname.startsWith("/member") ||
    pathname.startsWith("/unauthorized");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className={`min-h-screen`}>
        {/* Navbar */}
        {!hideNavbar && (scrollDir === null || scrollDir === "up") && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>
        )}

        {/* Main Content with Footer */}
        <div className="">
          <main className="min-h-screen">
            {children}
            <Sooner />
          </main>

          {/* Footer */}
          {!hideNavbar && (
            <div className="w-full">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
