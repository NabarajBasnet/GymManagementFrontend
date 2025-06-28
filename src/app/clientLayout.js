"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Website/Navbar/Navbar";
import Footer from "@/components/Website/Footer/Footer";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { Toaster as Sooner } from "@/components/ui/sonner";

export default function MainClientLayout({ children }) {
  const pathname = usePathname();
  const [scrollDir, setScrollDir] = useState(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            setScrollDir("down");
          } else if (currentScrollY < lastScrollY.current) {
            setScrollDir("up");
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        {!hideNavbar && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
              scrollDir === "down" ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            <Navbar />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
          <Sooner />
        </main>

        {/* Footer */}
        {!hideNavbar && <Footer />}
      </div>
    </ThemeProvider>
  );
}
