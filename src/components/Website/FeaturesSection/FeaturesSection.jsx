"use client";

import { motion } from 'framer-motion';
import {
  Dumbbell, Network, Users, Calendar, Lock, UserCog, ChartBar,
  Bell, ArrowRight, CreditCard, Clock, MessageSquare, FileText
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

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
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const initialFeatures = [
    {
      icon: <Users className="text-white" size={24} />,
      title: "Member Management",
      description: "Track memberships, renewals, and member activity with detailed profiles and history."
    },
    {
      icon: <Calendar className="text-white" size={24} />,
      title: "Attendance Tracking",
      description: "Monitor gym attendance with QR code check-ins and generate detailed reports."
    },
    {
      icon: <Lock className="text-white" size={24} />,
      title: "Locker Management",
      description: "Assign lockers to members and manage locker availability and maintenance."
    },
    {
      icon: <UserCog className="text-white" size={24} />,
      title: "Staff Management",
      description: "Handle staff scheduling, staff attendance, payroll, and performance tracking in one place."
    },
    {
      icon: <ChartBar className="text-white" size={24} />,
      title: "Business Analytics",
      description: "Get insights into revenue, membership growth, and other key performance indicators."
    },
    {
      icon: <Dumbbell className="text-white" size={24} />,
      title: "Personal Training",
      description: "Manage personal training sessions, assign trainers, and track client progress effortlessly."
    },
    {
      icon: <Bell className="text-white" size={24} />,
      title: "Automated Notifications",
      description: "Send automated reminders for payments, class schedules, and membership renewals."
    },
    {
      icon: <Network className="text-white" size={24} />,
      title: "Multi-Branch Support",
      description: "Manage multiple gym branches from a single platform with centralized control and insights."
    }
  ];

  const additionalFeatures = [
    {
      icon: <CreditCard className="text-white" size={24} />,
      title: "Billing & Payments",
      description: "Automated billing, payment processing, and invoice generation with multiple payment options."
    },
    {
      icon: <Clock className="text-white" size={24} />,
      title: "Class Schedules",
      description: "Create and manage class schedules with capacity limits and waitlist functionality."
    },
    {
      icon: <FileText className="text-white" size={24} />,
      title: "Activity Logs",
      description: "Detailed logs of all system activities for security and compliance purposes."
    },
    {
      icon: <MessageSquare className="text-white" size={24} />,
      title: "Real-time Communication",
      description: "Integrated messaging system for staff and members with push notifications."
    },
    {
      icon: <Dumbbell className="text-white" size={24} />,
      title: "Equipment Maintenance",
      description: "Track gym equipment maintenance schedules and service history."
    },
    {
      icon: <Users className="text-white" size={24} />,
      title: "Group Challenges",
      description: "Create and manage fitness challenges to engage your members."
    },
    {
      icon: <ChartBar className="text-white" size={24} />,
      title: "Goal Tracking",
      description: "Help members set and track fitness goals with progress visualization."
    },
    {
      icon: <Calendar className="text-white" size={24} />,
      title: "Resource Booking",
      description: "Allow members to book courts, pools, or other facilities online."
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
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Everything you need to run your fitness business efficiently, all in one integrated platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialFeatures.map((feature, index) => (
            <FeatureCard
              key={`initial-${index}`}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.05}
            />
          ))}
        </div>

        {showAllFeatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-white mb-8 text-center">More Amazing Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <FeatureCard
                  key={`additional-${index}`}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div className="text-center mt-20">
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity duration-200"
          >
            {showAllFeatures ? 'Hide Additional Features' : 'See All Features'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;