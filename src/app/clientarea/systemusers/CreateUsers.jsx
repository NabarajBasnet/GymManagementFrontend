"use client";

import { toast as soonerToast } from "sonner";
import { useForm } from "react-hook-form";
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
  Shield,
  Users,
  Building2,
  Sparkles,
  UserPlus,
  Info,
  Star,
} from "lucide-react";
import { useTenant } from "../../../components/Providers/LoggedInTenantProvider";
import { useQuery } from "@tanstack/react-query";

const CreateUsers = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm();

  const watchPassword = watch("password", "");

  const { tenant } = useTenant();
  const loggedInTenant = tenant?.tenant;

  // Check if tenant has selected features
  const selectedFeatures = loggedInTenant?.subscription?.subscriptionFeatures;
  const multiBranchSupport = selectedFeatures?.includes("Multi Branch Support");
  const onFreeTrail = loggedInTenant?.freeTrailStatus === 'Active';

  const handleRoleSelect = (value) => {
    setValue("role", value);
  };

  const handleBranchSelect = (value) => {
    setValue("orgBranch", value);
  };

  const createSystemUser = async (data) => {
    try {
      const response = await fetch("/api/systemusers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();
      if (response.ok) {
        soonerToast.success(responseBody.message);
        reset();
      } else if (responseBody.redirect) {
        window.location.href = responseBody.redirectUrl;
        soonerToast.error(responseBody.message);
      } else {
        soonerToast.error(responseBody.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Error: ", error);
      soonerToast.error(error.message);
    }
  };

  const roleCategories = [
    {
      category: "Executive Leadership",
      roles: [
        { value: "CEO", label: "CEO", icon: Star, color: "text-amber-500" },
        {
          value: "Super Admin",
          label: "Super Admin",
          icon: Shield,
          color: "text-red-500",
        },
      ],
    },
    {
      category: "Operations & Management",
      roles: [
        {
          value: "Operation Manager",
          label: "Operation Manager",
          icon: Building2,
          color: "text-blue-500",
        },
        {
          value: "Gym Admin",
          label: "Gym Admin",
          icon: Users,
          color: "text-green-500",
        },
        {
          value: "HR Manager",
          label: "HR Manager",
          icon: Users,
          color: "text-purple-500",
        },
      ],
    },
    {
      category: "Specialized Roles",
      roles: [
        {
          value: "Developer",
          label: "Developer",
          icon: Github,
          color: "text-cyan-500",
        },
        {
          value: "Accountant",
          label: "Accountant",
          icon: Building2,
          color: "text-orange-500",
        },
      ],
    },
  ];

  const getOrganizationDetails = async () => {
    try {
      const request = await fetch(`http://88.198.112.156:3100/api/organization`);
      const responseBody = await request.json();
      return responseBody;
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['organization'],
    queryFn: getOrganizationDetails
  })

  const getOrganizationBranch = async () => {
    try {
      const request = await fetch(`http://88.198.112.156:3100/api/organizationbranch/tenant`);
      const responseBody = await request.json();
      return responseBody;
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const { data: branchDetails, isLoading: isBranchLoading } = useQuery({
    queryKey: ['organizationbranches'],
    queryFn: getOrganizationBranch,
    enabled: !!multiBranchSupport || onFreeTrail
  })

  const { branches } = branchDetails || {};

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 transition-all duration-300">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-400/5 dark:to-indigo-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Create and manage system users with role-based access control
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Sidebar - Enhanced Info Card */}
          <div className="xl:col-span-4 space-y-6">
            {/* User Avatar Card */}
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <div className="text-center">
                <div className="relative mx-auto mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  New System User
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Configure user profile and access permissions
                </p>
              </div>
            </div>

            {/* Role Categories Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                  Available Roles
                </h4>
              </div>

              <div className="space-y-6">
                {roleCategories.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {category.category}
                    </h5>
                    <div className="space-y-2">
                      {category.roles.map((role, roleIndex) => (
                        <div
                          key={roleIndex}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                          <role.icon className={`w-4 h-4 ${role.color}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {role.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Security Notice
                  </h5>
                  <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                    All user accounts are created with secure authentication
                    protocols. Role permissions are automatically applied based
                    on selection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Form */}
          <div className="xl:col-span-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
              {/* Form Header */}
              <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Create New User Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Enter the required information to set up a new system user
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Secure Connection</span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form
                  onSubmit={handleSubmit(createSystemUser)}
                  className="space-y-8"
                >
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Personal Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          First Name
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="text"
                            className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            placeholder="Enter first name"
                            {...register("firstName", {
                              required: "First name is required",
                            })}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>{errors.firstName.message}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Last Name
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="text"
                            className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            placeholder="Enter last name"
                            {...register("lastName", {
                              required: "Last name is required",
                            })}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>{errors.lastName.message}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="email"
                            className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            placeholder="Enter email address"
                            {...register("email", {
                              required: "Email is required",
                            })}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>{errors.email.message}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Phone Number
                        </Label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="tel"
                            className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            placeholder="Enter phone number"
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
                          <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>{errors.phoneNumber.message}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Security Credentials
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="password"
                            className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            placeholder="Create secure password"
                            {...register("password", {
                              required: "Password is required",
                            })}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>{errors.password.message}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Confirm Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="password"
                            className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            placeholder="Confirm password"
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === watchPassword ||
                                "Passwords do not match",
                            })}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>{errors.confirmPassword.message}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Additional Information
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Address
                        </Label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="text"
                            className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            placeholder="Enter full address"
                            {...register("address", {
                              required: "Address is required",
                            })}
                          />
                        </div>
                        {errors.address && (
                          <p className="text-sm mt-2 text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>{errors.address.message}</span>
                          </p>
                        )}

                        {(multiBranchSupport || onFreeTrail) && (
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Company Branch
                            </Label>
                            <div className="relative group">
                              <Select onValueChange={handleBranchSelect}>
                                <SelectTrigger className="pl-12 h-12 bg-white dark:text-gray-300 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 rounded-xl font-medium">
                                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                                  <SelectValue
                                    placeholder="Select Branch"
                                    className="text-gray-900 dark:text-white"
                                  />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl">
                                  {branches?.map((branch) => (
                                    <SelectItem
                                      key={branch._id}
                                      value={branch._id}
                                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                                    >
                                      {branch.orgBranchName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.companyBranch && (
                                <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1 mt-1">
                                  <X className="w-3 h-3" />
                                  <span>{errors.companyBranch.message}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Date of Birth
                          </Label>
                          <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                              type="date"
                              className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-medium"
                              {...register("dob", {
                                required: "Date of birth is required",
                              })}
                            />
                          </div>
                          {errors.dob && (
                            <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1">
                              <X className="w-3 h-3" />
                              <span>{errors.dob.message}</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            System Role
                          </Label>
                          <div className="relative group">
                            <Select onValueChange={handleRoleSelect}>
                              <SelectTrigger className="pl-12 h-12 bg-white dark:bg-gray-700 border-2 dark:text-gray-300 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 rounded-xl font-medium">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                                <SelectValue
                                  placeholder="Select user role"
                                  className="text-gray-900 dark:text-white"
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl">
                                {roleCategories.flatMap((category) =>
                                  category.roles.map((role) => (
                                    <SelectItem
                                      key={role.value}
                                      value={role.value}
                                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <role.icon
                                          className={`w-4 h-4 ${role.color}`}
                                        />
                                        <span>{role.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            {errors.role && (
                              <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center space-x-1 mt-1">
                                <X className="w-3 h-3" />
                                <span>{errors.role.message}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating User...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>Create System User</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Additional Actions */}
                  <div className="flex items-center justify-between pt-4">
                    <span
                      onClick={() =>
                        (window.location.href = "/clientarea/systemusers")
                      }
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    >
                      ← Back to Users
                    </span>

                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => reset()}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        Clear Form
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All user data is encrypted and stored securely. Changes take effect
            immediately upon creation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateUsers;
