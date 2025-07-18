"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  X,
  AtSign,
  Lock,
  User,
  CheckCircle2,
  ChevronRight,
  Github,
  Linkedin,
} from "lucide-react";

export function LoginForm({ className, ...props }) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors, isValid, isDirty },
    setError,
  } = useForm({
    mode: "onChange",
  });

  const onLoginUser = async (data) => {
    try {
      const response = await fetch("https://fitbinary.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseBody = await response.json();
      if (response.status === 404) {
        setError("email", {
          type: "manual",
          message: responseBody.message,
        });
      }

      if (response.status === 403) {
        setError("password", {
          type: "manual",
          message: responseBody.message,
        });
      }

      if (response.status === 400) {
        setError("root", {
          type: "manual",
          message: responseBody.message,
        });
      }

      if (response.status === 200) {
        toast.success(responseBody.message || "Login successful!");
        reset();
        window.location.href = responseBody.redirect;
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
      console.log("Error: ", error);
    }
  };

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
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
              <p className="text-white/80 md:mb-8">
                Log in to access your dashboard.
              </p>

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
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-7/12 p-8 bg-white/95">
            <div className="w-full md:mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                <p className="text-gray-600">
                  Fill in your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit(onLoginUser)} className="space-y-4">
                {errors.root && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {errors.root.message}
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      className={`py-6 bg-white dark:border-gray-200 border-gray-200 rounded-sm ${errors.email ? "border-red-500" : ""}`}
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    <AtSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      className={`py-6 bg-white dark:border-gray-200 border-gray-200 rounded-sm ${errors.password ? "border-red-500" : ""}`}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                  disabled={isSubmitting || !isValid || !isDirty}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="mt-4 text-xs text-gray-500">
                  By signing in, you agree to our{" "}
                  <Link
                    href="/termsofservice"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacypolicy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                <div className="mt-6 flex items-center justify-center space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
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