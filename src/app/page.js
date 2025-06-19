"use client";

import "./globals.css";
import "./styles/landing.css";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Zap, Shield, Users } from "lucide-react";
import FeaturesSection from "@/components/Website/FeaturesSection/FeaturesSection";
import TrustedBySection from "@/components/Website/TrustedBySection/TrustedBySection";
import PricingSection from "@/components/Website/PricingSection/PricingSection";
import CTASection from "@/components/Website/CTASection/CtaSection";
import DemoSection from "@/components/Website/DemoSection/DemoSection";
import AboutSection from "@/components/Website/AboutSection/AboutSection";
import FAQSection from "@/components/Website/FAQSection/FaqSection";
import ContactSection from "@/components/Website/ContactSection/ContactSection";
import BackToTop from "@/components/Website/BackToTop/BackToTop";

const HeroSection = () => {
  return (
    <div>
      <section
        id="home"
        className="w-full min-h-screen bg-gray-900/40 relative overflow-hidden flex items-center"
      >
        {/* Glowing Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-40 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-white/15 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container w-full mx-auto px-4 py-20 z-10 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">
                Powering 1,000+ Multi-Location Gyms
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              style={{ fontFamily: "Oswald-Bold" }}
              className="text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Enterprise Gym Management{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Platform
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-md font-medium text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Multi-tenant SaaS solution built for modern fitness enterprises.
              Manage unlimited branches, secure member data, and scale your gym
              network with lightning-fast performance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="#demo"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Try For Free</span>
                <ArrowRight size={20} />
              </motion.a>

              <motion.a
                href="#features"
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-lg text-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                See Features
              </motion.a>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Cloud-Native Speed
                </h3>
                <p className="text-gray-300 text-sm">
                  Sub-second response times
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Enterprise Security
                </h3>
                <p className="text-gray-300 text-sm">SOC 2 & GDPR compliant</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Multi-Tenant Ready
                </h3>
                <p className="text-gray-300 text-sm">
                  Unlimited branch support
                </p>
              </div>
            </motion.div>

            {/* Simple Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  500+
                </div>
                <div className="text-gray-400 text-sm">Enterprise Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  2.5M+
                </div>
                <div className="text-gray-400 text-sm">Members Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  99.9%
                </div>
                <div className="text-gray-400 text-sm">Uptime SLA</div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown size={24} />
            </motion.div>
            <span className="text-sm font-medium">Scroll to explore</span>
          </motion.div>
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
