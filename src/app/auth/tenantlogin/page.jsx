"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { toast as soonerToast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  X,
  AtSign,
  Lock,
  CheckCircle2,
  ChevronRight,
  Github,
  Linkedin,
  Shield,
  Zap,
  Eye,
  EyeOff,
  Building2,
} from "lucide-react";
import { useState } from "react";

const TenantLoginForm = ({ className, ...props }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm();

  const onLoginUser = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/tenant/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const responseBody = await response.json();

      if (response.ok) {
        toast.success(responseBody.message || "Login successful!");
        soonerToast.success(responseBody.message || "Login successful!");
        router.push(responseBody.redirectUrl);
        reset();
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.log("Error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-0">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className={`absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}
        ></div>
      </div>

      {/* Main Card Container */}
      <div className="relative w-full flex justify-center items-center px-6 md:px-32">
        <div className="bg-white dark:bg-slate-800 min-h-[90vh] rounded-3xl shadow-2xl shadow-slate-300/50 dark:shadow-slate-900/50 overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Panel - Brand Section */}
            <div className="lg:w-5/12 relative overflow-hidden">
              <div className="h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className={`absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}
                  ></div>
                </div>

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>

                <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 text-white">
                  <div className="max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
                    {/* Logo/Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm mb-8 border border-white/20">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>

                    {/* Main heading */}
                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                      Welcome Back
                    </h1>
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                      Sign in to unlock your personalized business experience
                    </p>

                    {/* Features list */}
                    <div className="space-y-4 mb-12">
                      {[
                        { icon: Shield, text: "Enterprise Security" },
                        { icon: Zap, text: "Lightning Fast" },
                        { icon: CheckCircle2, text: "Premium Experience" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                            <item.icon className="w-4 h-4 text-blue-200" />
                          </div>
                          <span className="text-white/90 group-hover:text-white transition-colors duration-300">
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Sign up link */}
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-white/80 mb-4">
                        Don't have an account?
                      </p>
                      <Link href="/auth/tenantsignup">
                        <div className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white font-medium transition-all duration-300 group">
                          Create Account
                          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="lg:w-7/12 relative">
              <div className="h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                <div className="flex items-center justify-center h-full p-8 lg:p-12">
                  <div className="w-full max-w-md">
                    {/* Form header */}
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Sign In
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Enter your credentials to access your dashboard
                      </p>
                    </div>

                    {/* Login form */}
                    <form
                      onSubmit={handleSubmit(onLoginUser)}
                      className="space-y-6"
                    >
                      {/* Email field */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300 font-medium mb-3 block">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                          <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              className="pl-12 h-12 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-300 rounded-lg"
                              {...register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Please enter a valid email",
                                },
                              })}
                            />
                          </div>
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password field */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300 font-medium mb-3 block">
                          Password
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-12 pr-12 h-12 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-300 rounded-lg"
                              {...register("password", {
                                required: "Password is required",
                              })}
                            />
                            <button
                              type="button"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Submit button */}
                      <div className="pt-2">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full h-12 bg-transparent hover:bg-transparent border-0 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg group-hover:shadow-blue-500/25"
                          >
                            {isSubmitting ? (
                              <>
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
                              </>
                            ) : (
                              <>
                                Sign In
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        By signing in, you agree to our{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-300"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-300"
                        >
                          Privacy Policy
                        </a>
                        .
                      </p>

                      {/* Social links */}
                      <div className="flex items-center justify-center space-x-4">
                        {[
                          { icon: Github, href: "#", label: "GitHub" },
                          { icon: Linkedin, href: "#", label: "LinkedIn" },
                        ].map((social, index) => (
                          <a
                            key={index}
                            href={social.href}
                            aria-label={social.label}
                            className="w-12 h-12 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <social.icon className="w-5 h-5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantLoginForm;
