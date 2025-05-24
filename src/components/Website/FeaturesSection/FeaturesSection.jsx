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
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.1, delay }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 -z-10" />

      <div className="h-full cursor-pointer bg-white/5 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/10 hover:border-blue-400/30 transition-all duration-300 overflow-hidden">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4 shadow-lg">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
          <p className="text-gray-400 mb-6">{description}</p>

          {/* Animated button */}
          <motion.button
            className="flex items-center gap-1 text-blue-400 group-hover:text-white text-sm font-medium"
            whileHover={{ x: 5 }}
            animate={{
              x: [0, 3, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            Learn more
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 -z-10 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-blue-500/30" />
          <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px]" />
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
    <section id="features" className="w-full py-28 relative overflow-hidden bg-gray-950">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[100px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[80px]"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container w-full mx-auto px-4 relative z-10">
        <motion.div
          ref={headingRef}
          className="text-center w-full mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            Powerful <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Features</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            Everything you need to run your fitness business efficiently, all in one integrated platform.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Animated CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="#demo"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">See All Features</span>
            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;