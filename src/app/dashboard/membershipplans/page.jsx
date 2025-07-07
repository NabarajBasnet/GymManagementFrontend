'use client';

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { FiChevronRight, FiSearch, FiClock, FiDollarSign, FiCalendar, FiUsers, FiCreditCard } from "react-icons/fi";
import { MdHome, MdFitnessCenter } from "react-icons/md";
import Loader from "@/components/Loader/Loader";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const ViewPlans = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const getAllMembershipPlans = async () => {
    try {
      const response = await fetch(`https://fitbinary.com/api/membershipplans/by-org?search=${debouncedSearchQuery}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["membershipPlans", debouncedSearchQuery],
    queryFn: getAllMembershipPlans,
  });

  const { membershipPlans } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 px-4 py-4 md:py-6">
      <div className="w-full mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6">
          <div className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">
            <MdHome className="w-4 h-4 mr-2" />
            <span className="flex items-center">
              Home <FiChevronRight className="mx-2" />
            </span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">
            Dashboard <FiChevronRight className="mx-2" />
          </div>
          <span className="text-gray-800 dark:text-gray-200 font-medium">Membership Plans</span>
        </nav>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                Membership Plans
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl">
                Discover our carefully crafted membership options designed to match your fitness goals and lifestyle
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans..."
                className="pl-10 h-10 dark:text-white bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Available Plans</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <Loader />
            ) : (
              Array.isArray(membershipPlans) && membershipPlans?.map((plan) => (
                <Card
                  key={plan._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="p-0">
                    <div className="h-1 bg-blue-500"></div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Plan Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {plan.planName}
                      </h3>
                      <Badge
                        className={`${plan.planStatus
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400'
                          } font-semibold px-2.5 py-0.5 text-sm rounded-full`}
                      >
                        {plan.planStatus ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {/* Price Display */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center">
                        <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          NPR {plan.price?.toLocaleString() || plan.price}
                        </span>
                      </div>
                      <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-1">Total Investment</p>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Duration</span>
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{plan.duration} days</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Payment</span>
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{plan.membershipPaymentType}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Shift</span>
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{plan.membershipShift}</span>
                      </div>

                      {plan.timeRestriction && (
                        <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FiClock className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Hours</span>
                          </div>
                          <span className="text-gray-900 dark:text-white text-sm font-semibold">
                            {plan.timeRestriction.startTime} - {plan.timeRestriction.endTime}
                          </span>
                        </div>
                      )}

                      {/* Services */}
                      {plan.servicesIncluded && plan.servicesIncluded.length > 0 && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MdFitnessCenter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Services Included</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.servicesIncluded.map((service, serviceIndex) => (
                              <Badge
                                key={serviceIndex}
                                variant="outline"
                                className="bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5"
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlans;