'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaApple, FaGoogle } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import {
  X,
  AtSign,
  Lock,
  User,
  CheckCircle2,
  ChevronRight,
  Github,
  Linkedin,
  Sparkles,
  Shield,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';

const TenantLoginForm = ({ className, ...props })=> {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError
  } = useForm();

  const onLoginUser = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/api/tenant/auth/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const responseBody = await response.json();

      if(response.ok){
        toast.success(responseBody.message || 'Login successful!');
        router.push(responseBody.redirectUrl);
        reset();
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.log('Error: ', error);
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <motion.div
          className="w-full px-28"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.3)]"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col lg:flex-row min-h-[90vh]">
              {/* Left side - Enhanced brand panel */}
              <motion.div 
                className="lg:w-5/12 relative overflow-hidden"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Gradient background with animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
                
                {/* Animated geometric shapes */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute bottom-20 right-10 w-24 h-24 border border-white/20 rounded-lg"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
                  <motion.div
                    className="text-center max-w-sm"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 0 30px rgba(255,255,255,0.3)'
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>

                    <motion.h1 
                      className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                      variants={itemVariants}
                    >
                      Welcome Back
                    </motion.h1>
                    
                    <motion.p 
                      className="text-white/90 mb-8 text-lg font-light"
                      variants={itemVariants}
                    >
                      Sign in to unlock your personalized experience
                    </motion.p>

                    <motion.div 
                      className="hidden md:flex flex-col space-y-6 mb-8"
                      variants={containerVariants}
                    >
                      {[
                        { icon: Shield, text: "Military-grade security" },
                        { icon: Zap, text: "Lightning-fast access" },
                        { icon: Sparkles, text: "Premium experience" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-4 text-sm group"
                          variants={itemVariants}
                          whileHover={{ x: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                            <item.icon className="w-4 h-4 text-emerald-300" />
                          </div>
                          <span className="group-hover:text-white transition-colors duration-300">{item.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div 
                      className="pt-6 text-sm"
                      variants={itemVariants}
                    >
                      <p className="text-white/80 mb-3">Don't have an account?</p>
                      <Link href="/auth/tenantsignup">
                        <motion.div 
                          className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300 group"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Create new account 
                          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right side - Ultra-modern form */}
              <motion.div 
                className="lg:w-7/12 relative overflow-hidden"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-gray-800/30 to-slate-900/50 backdrop-blur-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-cyan-500/5"></div>
                
                <div className="relative z-10 p-8 md:p-12 h-full flex items-center">
                  <div className="w-full max-w-md mx-auto">
                    <motion.div 
                      className="mb-10"
                      variants={itemVariants}
                    >
                      <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Sign In
                      </h2>
                      <p className="text-gray-400 font-light">
                        Enter your credentials to access your dashboard
                      </p>
                    </motion.div>

                    <motion.form 
                      onSubmit={handleSubmit(onLoginUser)} 
                      className="space-y-8"
                      variants={containerVariants}
                    >
                      <motion.div variants={itemVariants}>
                        <Label className="text-white/90 font-medium mb-3 block">Email Address</Label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                          <div className="relative flex items-center">
                            <AtSign className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                            <Input
                              className="pl-12 rounded-sm py-7 pr-4 bg-transparent text-gray-800 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                              type="email"
                              placeholder="john.doe@example.com"
                              {...register('email', {
                                required: "Email is required",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Please enter a valid email"
                                }
                              })}
                            />
                          </div>
                        </div>
                        {errors.email && (
                          <motion.p 
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            {errors.email.message}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Label className="text-white/90 font-medium mb-3 block">Password</Label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                            <Input
                              className="pl-12 rounded-sm py-7 pr-4 bg-transparent text-gray-800 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...register('password', {
                                required: "Password is required",
                              })}
                            />
                            <button
                              type="button"
                              className="absolute right-4 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        {errors.password && (
                          <motion.p 
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            {errors.password.message}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <motion.div
                          className="relative group"
                          onHoverStart={() => setIsHovered(true)}
                          onHoverEnd={() => setIsHovered(false)}
                        >
                          {/* Animated gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-300"></div>
                          
                          <Button
                            type="submit"
                            className="relative w-full py-6 bg-transparent border-0 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden group-hover:shadow-2xl group-hover:shadow-purple-500/25"
                            disabled={isSubmitting}
                          >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_ease-in-out] opacity-0 group-hover:opacity-100"></div>
                            
                            {isSubmitting ? (
                              <motion.span 
                                className="flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </motion.span>
                            ) : (
                              <motion.span 
                                className="flex items-center"
                                whileHover={{ scale: 1.02 }}
                              >
                                Sign In
                                <motion.div
                                  className="ml-2"
                                  animate={isHovered ? { x: 5 } : { x: 0 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </motion.div>
                              </motion.span>
                            )}
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.form>

                    <motion.div 
                      className="mt-10 text-center"
                      variants={itemVariants}
                    >
                      <p className="text-sm text-gray-400 mb-6">
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline">Privacy Policy</a>.
                      </p>

                      <div className="flex items-center justify-center space-x-6">
                        {[
                          { icon: Github, href: "#", color: "hover:text-gray-300" },
                          { icon: Linkedin, href: "#", color: "hover:text-blue-400" }
                        ].map((social, index) => (
                          <motion.a 
                            key={index}
                            href={social.href}
                            className={`w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/10 hover:border-white/20`}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <social.icon className="h-5 w-5" />
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default TenantLoginForm;