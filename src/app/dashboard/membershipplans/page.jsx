'use client';

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { FiChevronRight } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import Loader from "@/components/Loader/Loader";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
      const response = await fetch(`http://localhost:3000/api/membershipplans/by-org?search=${debouncedSearchQuery}`);
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

  // Categorize plans by type with fallback
  const categorizedPlans = membershipPlans?.reduce((acc, plan) => {
    const type = plan.accessDetails?.type || 'Standard';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(plan);
    return acc;
  }, {});

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading plans: {error.message}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="w-full mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MdHome className="w-4 h-4 mr-2" />
          <span className="flex items-center">
            Home <FiChevronRight className="mx-2" />
          </span>
          <span className="flex items-center">
            Dashboard <FiChevronRight className="mx-2" />
          </span>
          <span className="text-gray-800 font-medium">Membership Plans</span>
        </div>

        {/* Page Header */}
        <div className="mb-12 w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <div className="w-full lg:w-6/12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Membership <span className="text-blue-600">Plans</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Discover our carefully crafted membership options designed to match your fitness goals and lifestyle
            </p>
          </div>

          <div className="w-full lg:w-6/12 border-b">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name"
              className="w-full border-none bg-transparent"
            />
          </div>
        </div>

        {/* Plans Display */}

        <div className="space-y-16">
          {categorizedPlans && Object.entries(categorizedPlans).map(([type, plans]) => (
            <section key={type} className="relative">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {type} Plans
                </h2>
                <div className="h-[2px] w-16 bg-blue-500"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-lg">
                    <CardHeader className="p-0">
                      <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <Badge
                          className={`${plan.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'} font-medium`}
                        >
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between pb-3 border-b border-gray-100">
                          <span className="text-gray-500">Duration</span>
                          <span className="text-gray-800 font-medium">{plan.duration} days</span>
                        </div>

                        <div className="flex justify-between pb-3 border-b border-gray-100">
                          <span className="text-gray-500">Price</span>
                          <span className="text-gray-900 font-bold">
                            {plan.priceDetails?.currency} {plan.priceDetails?.amount}
                          </span>
                        </div>

                        <div className="flex justify-between pb-3 border-b border-gray-100">
                          <span className="text-gray-500">Shift</span>
                          <span className="text-gray-800 capitalize">{plan.membershipShift.toLowerCase()}</span>
                        </div>

                        <div className="flex justify-between pb-3 border-b border-gray-100">
                          <span className="text-gray-500">For</span>
                          <span className="text-gray-800">{plan.targetAudience}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPlans;