"use client";

import { toast as soonerToast } from "sonner";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  X,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Crown,
  Server,
  Database,
  Settings,
  ArrowRight,
  Github,
  Linkedin,
} from "lucide-react";
import { useState } from "react";

const RootLoginForm = ({ className, ...props }) => {
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
      const response = await fetch("https://fitbinary.com/api/rootuser/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseBody = await response.json();

      if (response.ok) {
        soonerToast.success(responseBody.message || "Login successful!");
        router.push(responseBody.redirectUrl);
        reset();
      } else {
        soonerToast.error(responseBody.message || "Login failed!");
      }
    } catch (error) {
      soonerToast.error(error.message || "Login failed!");
      console.log("Error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-5 h-full">
            {/* Left Panel - Root Admin Branding */}
            <div className="lg:col-span-2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
              {/* Background Pattern */}
              <div
                className={`absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}
              ></div>
              <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 text-white">
                <div className="max-w-sm">
                  {/* Root Admin Icon */}
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center mb-6 group hover:bg-white/20 transition-all duration-300">
                      <Crown className="w-10 h-10 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-300 font-medium">
                          System Online
                        </span>
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                        Root Access
                      </h1>
                      <p className="text-red-100 text-lg leading-relaxed">
                        Administrative portal for system management and
                        configuration.
                      </p>
                    </div>
                  </div>

                  {/* Admin Features */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3 group">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Server className="w-4 h-4 text-red-200" />
                      </div>
                      <span className="text-red-100 text-sm">
                        Server Management
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Database className="w-4 h-4 text-red-200" />
                      </div>
                      <span className="text-red-100 text-sm">
                        Database Control
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Settings className="w-4 h-4 text-red-200" />
                      </div>
                      <span className="text-red-100 text-sm">
                        System Configuration
                      </span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">
                          Security Notice
                        </h3>
                        <p className="text-xs text-red-100 leading-relaxed">
                          Root access provides full system privileges. Ensure
                          you're authorized before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="lg:col-span-3 flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto">
              <div className="w-full max-w-md">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Administrator Login
                  </h2>
                  <p className="text-gray-400">
                    Enter root credentials to access system controls
                  </p>
                </div>

                {/* Login Form */}
                <form
                  onSubmit={handleSubmit(onLoginUser)}
                  className="space-y-6"
                >
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-300"
                    >
                      Administrator Email
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <AtSign className="w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors duration-200" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@company.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 hover:bg-white/10 transition-all duration-200"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                        <X className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.email.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-300"
                    >
                      Root Password
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors duration-200" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter root password"
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 hover:bg-white/10 transition-all duration-200"
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors duration-200" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors duration-200" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                        <X className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.password.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
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
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span>Access System</span>
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Footer */}
                <div className="mt-8 space-y-6">
                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-3">
                      Need to create a root account?
                    </p>
                    <Link href="/root/signup">
                      <button className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors duration-200 hover:underline">
                        Request Root Access →
                      </button>
                    </Link>
                  </div>

                  {/* Legal */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      By accessing this system, you acknowledge compliance with
                      our{" "}
                      <a
                        href="#"
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Security Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Terms of Use
                      </a>
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 pt-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
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

export default RootLoginForm;
