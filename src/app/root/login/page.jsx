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
  Linkedin
} from 'lucide-react';

const RootLoginForm = ({ className, ...props })=> {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError
  } = useForm();

  const onLoginUser = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/api/rootuser/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const responseBody = await response.json();
      console.log('Response Body: ', responseBody);

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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-6xl rounded-2xl overflow-hidden bg-white shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left side - Brand panel */}
          <div className="lg:w-5/12 flex relative flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <motion.div
              className="text-center max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="md:mb-8 mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
              <p className="text-white/90 md:mb-8 text-lg">Log in to access your dashboard.</p>

              <div className="hidden md:flex flex-col space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Secure account access</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Personalized dashboard</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Seamless user experience</span>
                </div>
              </div>

              <div className="pt-4 text-sm">
                <p>Don't have an account?</p>
                <Link href="/root/signup" className="inline-flex items-center mt-2 text-white font-medium hover:underline">
                  Create a new account <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-7/12 p-8 md:p-12 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl bg-gradient-to-br from-gray-800 via-stone-600 to-neutral-800 text-white">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Sign In</h2>
                <p className="text-gray-100 mt-2 font-medium text-sm">Fill in your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit(onLoginUser)} className="space-y-6">
                  <div>
                      <Label>Email</Label>
                      <Input
                        className="text-black"
                        type="email"
                        placeholder="Eg: john.doe@example.com"
                        {...register('email', {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email"
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                  <Label>Password</Label>
                  <Input
                    className="text-black"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-gray-100">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
                </p>

                <div className="mt-6 flex items-center justify-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RootLoginForm;
