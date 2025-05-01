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

export function LoginForm({ className, ...props }) {
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
      const response = await fetch('https://7232397b19d1ad937691d5b90ab2d795.serveo.net/api/auth/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const responseBody = await response.json();
      if (response.status === 404) {
        setError(
          "email", {
          type: "manual",
          message: responseBody.message
        }
        );
      }

      if (response.status === 403) {
        setError(
          "password", {
          type: "manual",
          message: responseBody.message
        }
        );
      }

      if (response.status === 400) {
        setError(
          ["password", "email"], {
          type: "manual",
          message: responseBody.message
        }
        );
      }

      if (response.status === 200) {
        toast.success(responseBody.message || 'Login successful!');
        reset();
        router.push('/dashboard');
      } else {
        toast.error(responseBody.message);
      }

    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.log('Error: ', error);
    };
  };

  const FormField = ({ label, name, type = 'text', icon, validation, error, placeholder, rightElement }) => (
    <div className="space-y-1">
      <div className="flex items-center">
        <Label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 block"
        >
          {label}
        </Label>
        {rightElement && rightElement}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>

        <Input
          id={name}
          type={type}
          className={`pl-10 w-full transition-all duration-200 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder={placeholder}
          {...register(name, validation)}
        />

        {error && (
          <motion.div
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-5 w-5 text-red-500" />
          </motion.div>
        )}
      </div>
      
      {error && (
        <motion.p
          className="text-sm font-medium text-red-500 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );

  return (
    <div className="w-full flex items-center justify-center md:p-4">

      <motion.div
        className="w-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Brand panel */}
          <div className="lg:w-5/12 flex relative flex-col items-center justify-center p-8 text-white">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="md:mb-8 mb-1 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
              <p className="text-white/80 md:mb-8">Log in to access your dashboard.</p>

              <div className="hidden md:flex flex-col space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Secure account access</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Personalized dashboard</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Seamless user experience</span>
                </div>
              </div>

              <div className="pt-4 text-sm">
                <p>Don't have an account?</p>
                <Link href="/signup" className="inline-flex items-center mt-2 text-white font-medium hover:underline">
                  Create a new account <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-7/12 p-8 bg-white/95">
            <div className="w-full md:mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                <p className="text-gray-600">Fill in your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit(onLoginUser)} className="space-y-4">
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={<AtSign className="text-gray-400" />}
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email"
                    }
                  }}
                  error={errors.email}
                  placeholder="john.doe@example.com"
                />

                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  icon={<Lock className="text-gray-400" />}
                  validation={{
                    required: "Password is required"
                  }}
                  error={errors.password}
                  placeholder="Enter your password"
                  rightElement={
                    <a href="#" className="ml-auto text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  }
                />

                <Button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
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

                {/* <div className="relative text-center text-sm mt-4">
                  <span className="relative z-10 bg-white/95 px-4 text-gray-500">
                    Or continue with
                  </span>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 -z-10"></div>
                </div> */}

                {/* <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                    <FaApple className="text-xl" />
                  </Button>
                  <Button variant="outline" className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                    <FaGoogle className="text-xl" />
                  </Button>
                  <Button variant="outline" className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                    <FaMeta className="text-xl" />
                  </Button>
                </div> */}
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>

                <div className="mt-6 flex items-center justify-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                    <Linkedin className="h-5 w-5" />
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