"use client";
import { motion } from 'framer-motion';
import {
  Dumbbell, Network, Users, Calendar, Lock, UserCog, ChartBar,
  Bell, ArrowRight, CreditCard, Clock, MessageSquare, FileText,
  ReceiptText, Mail, CalendarCheck, BarChart, CheckCircle
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';

const FeatureDetail = ({ icon, title, description, image, index, isEven, highlights }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="py-24 border-b border-white/5 last:border-b-0"
    >
      <div className="mx-auto px-6 lg:px-8">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-20`}>
          {/* Content Section */}
          <div className="lg:w-1/2 space-y-8">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25">
              {icon}
            </div>

            {/* Title */}
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-sky-200 to-white bg-clip-text text-transparent leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Key Highlights */}
            {highlights && (
              <div className="space-y-3">
                {highlights.map((highlight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: (index * 0.1) + (idx * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-500/20 group"
            >
              <span>Explore Feature</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: isEven ? -15 : 15 }}
              animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="relative group perspective-1000"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Main Image Container */}
              <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/20 transform transition-transform duration-500 hover:scale-105 ${isEven ? 'hover:rotate-2' : 'hover:-rotate-2'}`}>
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-50"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

                {/* Browser-like Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-700/50 rounded-md px-3 py-1 text-xs text-gray-400">
                      https://fitbinary.com/dashboard
                    </div>
                  </div>
                </div>

                {/* Image with Enhanced Display */}
                <div className="relative p-2">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={image}
                      alt={title}
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Smart Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                    {/* Feature Highlight Dots */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className={`absolute -top-6 ${isEven ? '-right-6' : '-left-6'} w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-80 blur-sm animate-pulse`}></div>
              <div className={`absolute -bottom-8 ${isEven ? '-left-8' : '-right-8'} w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 opacity-60 blur-md animate-pulse`} style={{ animationDelay: '1s' }}></div>

              {/* Floating UI Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (index * 0.1) + 0.3 }}
                className={`absolute top-8 ${isEven ? '-left-8' : '-right-8'} bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl`}
              >

              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (index * 0.1) + 0.5 }}
                className={`absolute bottom-8 ${isEven ? '-right-8' : '-left-8'} bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99%</div>
                  <div className="text-gray-400 text-xs">Uptime</div>
                </div>
              </motion.div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const [headingRef, headingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Calendar className="text-white" size={32} />,
      title: "QR & Geo-based Attendance",
      description: "Advanced attendance system with QR codes and real-time location verification to ensure members are physically present at your gym.",
      image: "/images/attendancedashboard.png",
      highlights: [
        "QR code scanning with location verification",
        "Geofencing technology prevents buddy punching",
        "Comprehensive attendance analytics"
      ]
    },
    {
      icon: <Lock className="text-white" size={32} />,
      title: "Smart Locker Management",
      description: "Digital locker management system with automated assignments, real-time availability tracking, and expiration alerts.",
      image: "/images/lockerdemo.png",
    },
    {
      icon: <ReceiptText className="text-white" size={32} />,
      title: "Automated Billing & Invoicing",
      description: "Eliminate manual billing errors with automated invoicing, recurring payments, and detailed financial reporting.",
      image: "/images/invoicepage.png",
      highlights: [
        "Professional automated invoices",
        "Recurring payment processing",
      ]
    },
    {
      icon: <Mail className="text-white" size={32} />,
      title: "Email Notifications & Alerts",
      description: "Keep members engaged with personalized automated communications and branded emails.",
      image: "/images/emailnotification.png",
      highlights: [
        "Automated emails alerts",
        "Membership expiration email alerts",
      ]
    },
    {
      icon: <UserCog className="text-white" size={32} />,
      title: "Staff & Role Management",
      description: "Role-based access control with custom permissions and dynamic shift schedules.",
      image: "/images/staffspage.png",
      highlights: [
        "Role-based access control",
        "Dynamic staff schedules",
      ]
    },
    {
      icon: <Network className="text-white" size={32} />,
      title: "Multi-Branch Management",
      description: "Manage multiple locations from a single dashboard with consolidated reporting and member transfers.",
      image: "/images/branchmanagement.png",
      highlights: [
        "Single dashboard for all locations",
        "Consolidated reporting system",
        "Easy member transfers between branches"
      ]
    },
    {
      icon: <CalendarCheck className="text-white" size={32} />,
      title: "Class Booking System",
      description: "Intuitive booking platform with waitlists, capacity management, and real-time instructor updates.",
      image: "/images/classmanagement.png",
      highlights: [
        "Real-time class booking",
      ]
    },
    {
      icon: <CreditCard className="text-white" size={32} />,
      title: "Flexible Plan Management",
      description: "Create unlimited membership tiers with customizable pricing, benefits, and automated billing cycles.",
      image: "/images/planmanagement.png",
      highlights: [
        "Unlimited membership tiers",
        "Custom dynamic plan creation",
        "Unlimited plans storage"
      ]
    },
    {
      icon: <BarChart className="text-white" size={32} />,
      title: "Business Analytics & Reports",
      description: "Make data-driven decisions with comprehensive analytics, revenue tracking, and performance metrics.",
      image: "/images/reports.png",
      highlights: [
        "Real-time business dashboards",
        "Revenue and retention analytics",
        "Exportable custom reports"
      ]
    }
  ];

  return (
    <section id="features" className="w-full relative overflow-hidden bg-gray-950 to-black">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-cyan-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-blue-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-8 py-32 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headingRef}
          className="text-center w-full mx-auto mb-32"
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={headingInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-8"
          >
            <Dumbbell size={18} className="text-blue-400" />
            <span className="text-blue-400 font-medium">Complete Gym Management</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Professional{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-300 to-white">
              Fitness Solutions
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            Streamline operations, engage members, and accelerate growth with our comprehensive gym management platform designed for modern fitness businesses.
          </p>
        </motion.div>

        {/* Features List */}
        <div className="space-y-0">
          {features.map((feature, index) => (
            <FeatureDetail
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              index={index}
              isEven={index % 2 === 0}
              highlights={feature.highlights}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;