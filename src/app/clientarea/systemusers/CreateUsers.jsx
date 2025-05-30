"use client";

import {toast as soonerToast} from "sonner";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const createSystemUser = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/systemusers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();
      if (response.ok) {
        toast.success(responseBody.message);
        soonerToast.success(responseBody.message);
        reset();
      } else {
        toast.error(responseBody.message || "Failed to create account");
        soonerToast.error(responseBody.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      soonerToast.error("An unexpected error occurred. Please try again.");
      console.log("Error: ", error);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full mx-auto flex flex-col lg:flex-row gap-4">
        {/* Left Card - User Info */}
        <div className="w-full lg:w-3/12 flex">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full transition-colors duration-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4">
                <User className="w-full h-full p-4 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">New User</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Create a new system user</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Available Roles</h4>
                <ul className="text-sm font-medium text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>Super Admin</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>Gym Admin</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>Operation Manager</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>Developer</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>CEO</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>HR Manager</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>Accountant</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card - Form */}
        <div className="w-full lg:w-9/12 flex">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full transition-colors duration-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New User</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Fill in the information below to create a new system user</p>
            </div>

            <form onSubmit={handleSubmit(createSystemUser)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="text"
                      className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                      {...register("firstName", { required: "First name is required" })}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="text"
                      className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                      {...register("lastName", { required: "Last name is required" })}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="email"
                      className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="tel"
                      className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9+\-\s()]{10,15}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="password"
                      className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                      {...register("password", { required: "Password is required" })}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="password"
                      className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === watchPassword || "Passwords do not match",
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    type="text"
                    className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                    {...register("address", { required: "Address is required" })}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="date"
                      className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-900 dark:text-white"
                      {...register("dob", { required: "Date of birth is required" })}
                    />
                  </div>
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.dob.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Role</Label>
                  <div className="relative">
                    <Select>
                      <SelectTrigger className="pl-10 py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                        <SelectItem value="super_admin" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Super Admin</SelectItem>
                        <SelectItem value="gym_admin" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Gym Admin</SelectItem>
                        <SelectItem value="operation_manager" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Operation Manager</SelectItem>
                        <SelectItem value="developer" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Developer</SelectItem>
                        <SelectItem value="ceo" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">CEO</SelectItem>
                        <SelectItem value="hr_manager" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">HR Manager</SelectItem>
                        <SelectItem value="accountant" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUsers;
