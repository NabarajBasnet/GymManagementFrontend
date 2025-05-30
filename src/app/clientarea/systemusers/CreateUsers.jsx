"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  X,
  AtSign,
  User,
  Phone,
  Lock,
  MapPin,
  Calendar,
  ChevronRight,
  Github,
  Linkedin,
} from "lucide-react";

const CreateUsers = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  const watchPassword = watch("password", "");

  const onSignUp = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();
      if (response.ok) {
        toast.success("Account created successfully!");
        reset();
      } else {
        toast.error(responseBody.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.log("Error: ", error);
    }
  };

  const FormField = ({
    label,
    name,
    type = "text",
    icon,
    validation,
    error,
    placeholder,
  }) => (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 block">
        {label}
      </Label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>

        <Input
          id={name}
          type={type}
          className={`pl-10 w-full transition-all duration-200 ${
            error ? "border-red-500 focus:border-red-500" : ""
          }`}
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
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 overflow-auto">
      <motion.div
        className="w-full md:max-w-4xl rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row max-h-screen overflow-auto">
          {/* Left side - Brand panel */}
          <div className="lg:w-5/12 relative flex flex-col items-center justify-center p-6 text-white">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="md:mb-6 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                <User className="w-7 h-7 text-white" />
              </motion.div>

              <h1 className="text-2xl font-bold mb-3">Create Account</h1>
              <p className="text-white/80 md:mb-6 text-sm">
                Join thousands of users and start your journey today.
              </p>

              <div className="hidden md:flex flex-col space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Premium design templates</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Advanced analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Priority customer support</span>
                </div>
              </div>

              <div className="pt-3 text-xs">
                <p>Already have an account?</p>
                <Link
                  href="/login"
                  className="inline-flex items-center mt-2 text-white font-medium hover:underline"
                >
                  Sign in to your account{" "}
                  <ChevronRight className="ml-1 w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-7/12 p-6 bg-white/95 overflow-y-auto max-h-screen">
            <div className="w-full mx-auto">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Sign Up</h2>
                <p className="text-gray-600 text-sm">
                  Fill in your information to create an account
                </p>
              </div>

              <form onSubmit={handleSubmit(onSignUp)} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    label="First Name"
                    name="firstName"
                    icon={<User className="text-gray-400" />}
                    validation={{
                      required: "First name is required",
                    }}
                    error={errors.firstName}
                    placeholder="John"
                  />

                  <FormField
                    label="Last Name"
                    name="lastName"
                    icon={<User className="text-gray-400" />}
                    validation={{
                      required: "Last name is required",
                    }}
                    error={errors.lastName}
                    placeholder="Doe"
                  />
                </div>

                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={<AtSign className="text-gray-400" />}
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  }}
                  error={errors.email}
                  placeholder="john.doe@example.com"
                />

                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  icon={<Phone className="text-gray-400" />}
                  validation={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\-\s()]{10,15}$/,
                      message: "Please enter a valid phone number",
                    },
                  }}
                  error={errors.phoneNumber}
                  placeholder="+1 (555) 000-0000"
                />

                <div className="md:flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700 block">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="password"
                        className="pl-10 w-full transition-all duration-200"
                        placeholder="Create a password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm font-medium text-red-500 mt-1 flex items-center">
                        <X className="w-4 h-4 mr-1" /> {errors.password.message}
                      </p>
                    )}
                  </div>

                  <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    icon={<Lock className="text-gray-400" />}
                    validation={{
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watchPassword || "Passwords do not match",
                    }}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                  />
                </div>

                <FormField
                  label="Address"
                  name="address"
                  icon={<MapPin className="text-gray-400" />}
                  validation={{
                    required: "Address is required",
                  }}
                  error={errors.address}
                  placeholder="123 Main St, City, Country"
                />

                <FormField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  icon={<Calendar className="text-gray-400" />}
                  validation={{
                    required: "Date of birth is required",
                  }}
                  error={errors.dob}
                />

                <Button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                  disabled={isSubmitting}
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
                    <span>Create Account</span>
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>

                <div className="mt-4 flex items-center justify-center space-x-4">
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
};

export default CreateUsers;
