"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"
import React from "react";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import {
  CalendarDays,
  CheckCircle2,
  Package,
  CreditCard,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Star,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Users,
  BarChart3,
  Settings,
  Crown,
  Timer,
  AlertCircle,
} from "lucide-react";

const MyServiceAndProductManagement = () => {
  const { tenant } = useTenant();
  const loggedInTenant = tenant?.tenant;
  const subscription = loggedInTenant?.tenantSubscription?.[0];

  // Add safe date handling
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const safeDate = (dateString) => {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return isValidDate(date) ? date : new Date();
  };

  const startDate = safeDate(loggedInTenant?.tenantSubscriptionStartDate);
  const endDate = safeDate(loggedInTenant?.tenantSubscriptionEndDate);
  const today = new Date();
  
  const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const daysUsed = totalDays - daysRemaining;
  const progressPercentage = Math.min(Math.max((daysUsed / totalDays) * 100, 0), 100);

  // Updated date formatter
  const formatDate = (date) => {
    try {
      if (!isValidDate(date)) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Update the payment date formatter
  const formatPaymentDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (!isValidDate(date)) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-900';
      case 'inactive':
        return 'bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-900';
      case 'expired':
        return 'bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-900';
      default:
        return 'border-gray-200 bg-transparent text-gray-900 dark:border-gray-700 dark:text-gray-300';
    }
  };

  const featureCategories = {
    'Core Management': ['Attendance Management', 'Staff Management', 'Equipment Management', 'Locker Management'],
    'Member Services': ['Class Booking', 'Member Web Portal', 'Personal Training', 'Progress Tracking'],
    'Business Operations': ['Billing & Invoicing', 'Payment Gateway Integration', 'Multi Branch Support', 'Customer Support'],
    'Analytics & Reports': ['Attendance Report', 'Analytics & Reporting', 'Membership Analytics'],
    'Advanced Features': ['AI Integration', 'API Integration', 'Backup & Recovery', 'Scheduled Maintenance'],
    'Customization': ['Customizable Features', 'Multi-Language Support', 'Email Notifications']
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Core Management': return <Settings className="h-4 w-4" />;
      case 'Member Services': return <Users className="h-4 w-4" />;
      case 'Business Operations': return <Building2 className="h-4 w-4" />;
      case 'Analytics & Reports': return <BarChart3 className="h-4 w-4" />;
      case 'Advanced Features': return <Zap className="h-4 w-4" />;
      case 'Customization': return <Crown className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  if (!loggedInTenant) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tenant information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 dark:bg-gray-900">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Service & Product Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription, features, and billing information
        </p>
      </div>

      {/* Organization Overview Card */}
      <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Organization Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              Organization
            </div>
            <p className="font-semibold">{loggedInTenant?.organizationName}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              Owner
            </div>
            <p className="font-semibold">{loggedInTenant?.ownerName}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <p className="font-semibold text-sm">{loggedInTenant?.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <p className="font-semibold text-sm">{loggedInTenant?.address}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-auto p-1 dark:bg-gray-800 dark:border-none">
          <TabsTrigger value="subscription" className="flex items-center gap-2 p-3 dark:data-[state=active]:bg-gray-700 dark:border-none">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Current Subscription</span>
            <span className="sm:hidden">Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2 p-3 dark:data-[state=active]:bg-gray-700 dark:border-none">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Available Features</span>
            <span className="sm:hidden">Features</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 p-3 dark:data-[state=active]:bg-gray-700 dark:border-none">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing Information</span>
            <span className="sm:hidden">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2 p-3 dark:data-[state=active]:bg-gray-700 dark:border-none">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Usage Analytics</span>
            <span className="sm:hidden">Usage</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Subscription Card */}
              <Card className="lg:col-span-2 border-l-4 border-l-blue-500 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      {subscription?.subscriptionName}
                    </div>
                    <Badge variant={getStatusColor(loggedInTenant?.tenantSubscriptionStatus)}>
                      {loggedInTenant?.tenantSubscriptionStatus}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {subscription?.subscriptionDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Start Date
                      </div>
                      <p className="font-medium">
                        {formatDate(startDate)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="h-4 w-4" />
                        End Date
                      </div>
                      <p className="font-medium">
                        {formatDate(endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subscription Progress</span>
                      <span className="font-medium">{Math.max(daysRemaining, 0)} days remaining</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 dark:bg-gray-700" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{Math.max(daysUsed, 0)} days used</span>
                      <span>{totalDays} total days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-gray-800 dark:to-gray-800 dark:border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Days Remaining</p>
                        <p className="text-2xl font-bold text-green-600">{Math.max(daysRemaining, 0)}</p>
                      </div>
                      <Timer className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-gray-800 dark:to-gray-800 dark:border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Features</p>
                        <p className="text-2xl font-bold text-blue-600">{subscription?.subscriptionFeatures?.length || 0}</p>
                      </div>
                      <Star className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 dark:from-gray-800 dark:to-gray-800 dark:border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Plan Price</p>
                        <p className="text-xl font-bold text-purple-600">
                          {loggedInTenant?.tenantCurrency} {subscription?.subscriptionPrice?.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Renewal Notice */}
            {daysRemaining <= 30 && daysRemaining > 0 && (
              <Card className="border-orange-200 bg-orange-50 dark:bg-gray-800 dark:border-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800 dark:text-orange-400">Renewal Reminder</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        Your subscription expires in {daysRemaining} days. Consider renewing to continue enjoying all features.
                      </p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 dark:border-none">
                      Renew Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Available Features
                </CardTitle>
                <CardDescription>
                  Features included in your {subscription?.subscriptionName} subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(featureCategories).map(([category, features]) => (
                    <Card key={category} className="border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {getCategoryIcon(category)}
                          {category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {features
                            .filter(feature => subscription?.subscriptionFeatures?.includes(feature))
                            .map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200 dark:bg-gray-700/50 dark:border-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm dark:text-gray-300">{feature}</span>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-green-500 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Your current payment and billing details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Payment Method</span>
                      </div>
                      <Badge variant="outline">{loggedInTenant?.tenantSubscriptionPaymentMethod}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Amount Paid</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {loggedInTenant?.tenantCurrency} {loggedInTenant?.tenantSubscriptionPaymentAmount?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Payment Date</span>
                      </div>
                      <span>
                        {formatPaymentDate(loggedInTenant?.tenantSubscriptionPaymentDate)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Account status and security information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Account Status</span>
                      </div>
                      <Badge variant={getStatusColor(loggedInTenant?.tenantStatus)}>
                        {loggedInTenant?.tenantStatus}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Language</span>
                      </div>
                      <span>{loggedInTenant?.tenantLanguage}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Timezone</span>
                      </div>
                      <span>{loggedInTenant?.tenantTimezone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-gray-800 dark:to-gray-800 dark:border-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Subscription Duration</p>
                      <p className="text-xl font-bold text-blue-600">{subscription?.subscriptionDuration} days</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-gray-800 dark:to-gray-800 dark:border-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Days Used</p>
                      <p className="text-xl font-bold text-green-600">{Math.max(daysUsed, 0)}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-gray-800 dark:to-gray-800 dark:border-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="text-xl font-bold text-orange-600">{Math.round(progressPercentage)}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-gray-800 dark:to-gray-800 dark:border-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Daily Cost</p>
                      <p className="text-xl font-bold text-purple-600">
                        {Math.round((subscription?.subscriptionPrice || 0) / (subscription?.subscriptionDuration || 1))}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="dark:bg-gray-800 dark:border-none">
              <CardHeader>
                <CardTitle>Usage Timeline</CardTitle>
                <CardDescription>Visual representation of your subscription usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subscription Progress</span>
                    <span>{Math.round(progressPercentage)}% Complete</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 dark:bg-gray-700" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Started: {formatDate(startDate)}</span>
                    <span>Ends: {formatDate(endDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyServiceAndProductManagement;