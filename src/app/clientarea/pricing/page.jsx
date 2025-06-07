"use client";

import { toast as sonnertoast } from "sonner";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import React, { useState, useEffect } from "react";
import {
  Check,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Loader2,
  Star,
} from "lucide-react";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { useDispatch } from "react-redux";
import { setCartLength } from "@/state/slicer";

const TenantSubscriptionPlansManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState("annually");
  const [loadingButtons, setLoadingButtons] = useState({});
  const { tenant, loading: tenantLoading } = useTenant();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const fetchPlans = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/subscription/getall`
      );
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      toast.error("Error fetching plans:", error.error);
      console.error("Error fetching plans:", error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const { subscriptions } = data || {};

  const getPlanIcon = (index) => {
    const icons = [Zap, Crown, Sparkles];
    return icons[index] || Star;
  };

  const handleAddToCart = async (plan) => {
    setLoadingButtons((prev) => ({ ...prev, [plan._id]: true }));
    try {
      const response = await fetch(`http://localhost:3000/api/cart/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
        credentials: "include",
      });

      const responseBody = await response.json();

      if (response.ok) {
        toast.success(responseBody.message);
        sonnertoast.success(responseBody.message)
        // Invalidate cart query to refresh cart data
        queryClient.invalidateQueries(["cart"]);
        dispatch(setCartLength(responseBody.cart.totalItems));
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [plan._id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {tenantLoading || isLoading ? (
        <Loader />
      ) : Array.isArray(subscriptions) && subscriptions.length > 0 ? (
        <div className="w-full">
          {/* Hero Section */}
          <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Choose Your
                  <span className="text-blue-600 dark:text-blue-400">
                    {" "}
                    Power Plan
                  </span>
                </h1>
                <p className="text-md font-medium text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                  Transform your gym with our cutting-edge management system.
                  From small studios to enterprise facilities, we've got you
                  covered.
                </p>

                {/* Billing Toggle */}
                <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <button
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedPlan === "monthly"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${selectedPlan === "annually"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    Annually
                    <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-2 py-1 rounded-full text-white">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subscriptions.map((plan, index) => {
                const Icon = getPlanIcon(index);
                const isPopular = index === 1;

                return (
                  <div
                    key={plan._id}
                    className={`relative group ${isPopular ? "scale-105 z-10" : "hover:scale-105"
                      } transition-all my-4 md:my-0 duration-300`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm">
                          🔥 Most Popular
                        </div>
                      </div>
                    )}

                    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full shadow-sm flex flex-col">
                      {/* Plan Header */}
                      <div className="relative z-10 flex-grow">
                        <div className="inline-flex p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mb-6">
                          <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {plan.subscriptionName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {plan.subscriptionDescription}
                        </p>

                        {/* Pricing */}
                        <div className="mb-8">
                          <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                              {plan.subscriptionPrice}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              /{plan.subscriptionDuration} days
                            </span>
                          </div>
                          {selectedPlan === "monthly" && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {Math.round(plan.subscriptionPrice / 12)} per
                              month
                            </p>
                          )}
                        </div>

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                          {plan.subscriptionFeatures.map(
                            (feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-center"
                              >
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                                  <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {feature}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* CTA Button and Guarantee - Always at bottom */}
                      <div className="mt-auto pt-6">
                        <button
                          onClick={() => handleAddToCart(plan)}
                          disabled={loadingButtons[plan._id]}
                          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center group ${isPopular
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                            } ${loadingButtons[plan._id]
                              ? "opacity-75 cursor-not-allowed"
                              : ""
                            }`}
                        >
                          {loadingButtons[plan._id] ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              Add to Cart
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>

                        {/* Money Back Guarantee */}
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                          30-day money-back guarantee
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Trusted by 10,000+ fitness professionals worldwide
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-75">
                <div className="text-xl font-bold text-gray-500 dark:text-gray-400">
                  FitnessPro
                </div>
                <div className="text-xl font-bold text-gray-500 dark:text-gray-400">
                  GymTech
                </div>
                <div className="text-xl font-bold text-gray-500 dark:text-gray-400">
                  PowerFit
                </div>
                <div className="text-xl font-bold text-gray-500 dark:text-gray-400">
                  FlexManage
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Can I change my plan later?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes, you can upgrade or downgrade your plan at any time.
                    Changes will be prorated.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Is there a free trial?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All plans come with a 14-day free trial. No credit card
                    required to start.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We accept all major credit cards, PayPal, and bank transfers
                    for annual plans.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Do you offer refunds?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes, we offer a 30-day money-back guarantee on all plans, no
                    questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <h1 className="text-4xl font-bold text-center">No plans found</h1>
        </div>
      )}
    </div>
  );
};

export default TenantSubscriptionPlansManagement;
