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
  Dumbbell,
  Users,
  BarChart3,
  Calendar,
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

      if (response.status === 200 && responseBody.type === "Onboarding") {
        router.push(responseBody.redirectUrl);
      }

      if (response.ok) {
        soonerToast.success(responseBody.message || "Login successful!");
        router.push(responseBody.redirectUrl);
        reset();
      } else {
        soonerToast.error(responseBody.message || "Login failed!");
        router.push(responseBody.redirectUrl);
      }
    } catch (error) {
      soonerToast.error(error.message || "Login failed!");
      console.log("Error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-800 relative">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Crect%20x%3D%2211%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3Crect%20x%3D%2233%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3Crect%20x%3D%2211%22%20y%3D%2233%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3Crect%20x%3D%2233%22%20y%3D%2233%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white w-full">
          <div className="max-w-md">
            {/* Logo */}
            <div className="flex items-center mb-12">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Liftora</h1>
                <p className="text-blue-100 text-sm">Management System</p>
              </div>
            </div>

            {/* Main content */}
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Manage Your Gym
              <br />
              <span className="text-blue-200">Efficiently</span>
            </h2>
            <p className="text-blue-100 text-lg mb-12 leading-relaxed">
              Streamline your gym operations with our comprehensive management
              platform. Track members, manage schedules, and grow your business.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-12">
              {[
                { icon: Users, text: "Member Management" },
                { icon: Calendar, text: "Class Scheduling" },
                { icon: BarChart3, text: "Analytics & Reports" },
                { icon: Shield, text: "Secure & Reliable" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                    <item.icon className="w-4 h-4 text-blue-200" />
                  </div>
                  <span className="text-blue-100">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Bottom section */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-blue-200 text-sm mb-4">New to GymFlow?</p>
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white font-medium transition-all duration-300 group backdrop-blur-sm"
              >
                Start Free Trial
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Liftora</h1>
              <p className="text-gray-600 text-sm">Management System</p>
            </div>
          </div>

          {/* Form header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your gym management dashboard
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onLoginUser)} className="space-y-6">
            {/* Email field */}
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 py-6 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 rounded-sm"
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
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 py-6 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 rounded-sm"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="#"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-2">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantLoginForm;
