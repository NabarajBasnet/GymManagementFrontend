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
      const response = await fetch(`http://88.198.112.156:8000/api/membershipplans/by-org?search=${debouncedSearchQuery}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6 animate-fade-in">
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
                Membership Plans
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl">
                Discover our carefully crafted membership options designed to match your fitness goals and lifestyle
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans..."
                className="pl-10 h-10 dark:text-white bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70"
              />
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6 animate-slide-up-delay">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Available Plans</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <Loader />
            ) : (
              Array.isArray(membershipPlans) && membershipPlans.map((plan, index) => (
                <Card
                  key={plan._id}
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-card-entrance"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <CardHeader className="p-0 relative overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </CardHeader>

                  <CardContent className="p-6 relative">
                    {/* Plan Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {plan.planName}
                      </h3>
                      <Badge
                        className={`${plan.planStatus
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50'
                          } font-semibold px-2.5 py-0.5 text-sm rounded-full transition-all duration-300 transform hover:scale-105`}
                      >
                        {plan.planStatus ? '✓ Active' : '⏸ Inactive'}
                      </Badge>
                    </div>

                    {/* Price Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 transition-all duration-300">
                      <div className="flex items-center justify-center">
                        <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          NPR {plan.price?.toLocaleString() || plan.price}
                        </span>
                      </div>
                      <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-1">Total Investment</p>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Duration</span>
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{plan.duration} days</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Payment</span>
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{plan.membershipPaymentType}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Shift</span>
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{plan.membershipShift}</span>
                      </div>

                      {plan.timeRestriction && (
                        <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
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
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MdFitnessCenter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Services Included</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.servicesIncluded.map((service, serviceIndex) => (
                              <Badge
                                key={serviceIndex}
                                variant="outline"
                                className="bg-white/80 dark:bg-gray-700/80 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 text-xs px-2 py-0.5"
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes card-entrance {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.5s ease-out 0.1s both;
        }
        
        .animate-card-entrance {
          animation: card-entrance 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default ViewPlans;