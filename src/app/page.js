"use client";

import './styles/landing.css';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import FeaturesSection from '@/components/Website/FeaturesSection/FeaturesSection';
import TrustedBySection from '@/components/Website/TrustedBySection/TrustedBySection';
import PricingSection from '@/components/Website/PricingSection/PricingSection';
import CTASection from '@/components/Website/CTASection/CtaSection';
import DemoSection from '@/components/Website/DemoSection/DemoSection';
import AboutSection from '@/components/Website/AboutSection/AboutSection';
import FAQSection from '@/components/Website/FAQSection/FaqSection';
import ContactSection from '@/components/Website/ContactSection/ContactSection';
import BackToTop from '@/components/Website/BackToTop/BackToTop';

const HeroSection = () => {
  return (
    <div>
      <section id="home" className="hero-gradient w-full min-h-screen flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container w-full mx-auto px-4 py-20 z-10 relative">
          <div className="flex w-full flex-col md:flex-row items-center justify-between">
            {/* Left side content */}
            <motion.div
              className="w-full text-center md:text-left mb-12 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Manage Your Gym <span className="gradient-text">Smarter</span>, Not Harder
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                The all-in-one gym management solution designed to streamline operations,
                boost member engagement, and grow your fitness business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="#demo"
                  className="btn-primary bg-gradient-to-r from-blue-600 to-indigo-400 px-8 py-3 rounded-full text-white font-medium text-lg shadow-xl"
                >
                  Try For Free
                </a>
                <a
                  href="#features"
                  className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-lg backdrop-blur-sm transition-colors"
                >
                  See Features
                </a>
              </div>
            </motion.div>

            {/* Right side image/animation */}
            <motion.div
              className="w-full md:w-1/2"
            >
              <div className="relative mx-auto max-w-md">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/4162450/pexels-photo-4162450.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    alt="Fit Loft Dashboard"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
                {/* Floating Elements */}
                <div className="absolute top-20 -left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 animate-bounce">
                  <div className="flex items-center dark:text-gray-200">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">+27% Revenue</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 animate-pulse">
                  <div className="flex items-center dark:text-gray-200">
                    <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">152 Active Members</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
            <div className="animate-bounce">
              <ChevronDown size={32} />
            </div>
            <span className="text-sm font-medium">Scroll to explore</span>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <TrustedBySection />
      <PricingSection />
      <CTASection />
      <DemoSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <BackToTop />
    </div>
  );
};

export default HeroSection;
