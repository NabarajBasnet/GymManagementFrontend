"use client";

import { motion } from 'framer-motion';
import {
  Users, Calendar, Lock, UserCog, ChartBar,
  CreditCard, Bell, MessageSquare, ArrowRight
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const FeatureCard = ({ icon, title, description, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="relative h-full"
    >
      <div className="h-full bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-400/30 transition-colors duration-200">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        
        <button className="flex items-center gap-1 text-blue-400 hover:text-white text-sm font-medium transition-colors duration-200">
          Learn more
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>
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
      icon: <Users className="text-white" size={24} />,
      title: "Member Management",
      description: "Track memberships, renewals, and member activity with detailed profiles and history."
    },
    {
      icon: <Calendar className="text-white" size={24} />,
      title: "Attendance Tracking",
      description: "Monitor gym attendance with automated check-ins and generate detailed reports."
    },
    {
      icon: <Lock className="text-white" size={24} />,
      title: "Locker Management",
      description: "Assign lockers to members and manage locker availability and maintenance."
    },
    {
      icon: <UserCog className="text-white" size={24} />,
      title: "Staff Management",
      description: "Handle staff scheduling, payroll, and performance tracking in one place."
    },
    {
      icon: <ChartBar className="text-white" size={24} />,
      title: "Business Analytics",
      description: "Get insights into revenue, membership growth, and other key performance indicators."
    },
    {
      icon: <CreditCard className="text-white" size={24} />,
      title: "Payment Processing",
      description: "Process payments, handle billing cycles, and manage recurring memberships."
    },
    {
      icon: <Bell className="text-white" size={24} />,
      title: "Automated Notifications",
      description: "Send automated reminders for payments, class schedules, and membership renewals."
    },
    {
      icon: <MessageSquare className="text-white" size={24} />,
      title: "Member Communication",
      description: "Keep your members engaged with built-in messaging and announcement systems."
    }
  ];

  return (
    <section id="features" className="w-full py-28 bg-gray-900/40 relative overflow-hidden">
      {/* Glowing Background Effects - Matching Hero Section */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-40 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-white/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container w-full mx-auto px-4 relative z-10">
        <motion.div
          ref={headingRef}
          className="text-center w-full mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to run your fitness business efficiently, all in one integrated platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.05}
            />
          ))}
        </div>

        <div className="text-center mt-20">
          <a
            href="#demo"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity duration-200"
          >
            See All Features
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;