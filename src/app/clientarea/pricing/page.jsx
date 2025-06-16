"use client";

import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast as sonnertoast } from "sonner";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import React, { useState } from "react";
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
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loadingButtons, setLoadingButtons] = useState({});
  const { tenant, loading: tenantLoading } = useTenant();
  const router = useRouter();

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [orgSetupDialog, setOrgSetupDialog] = useState(false);
  const [resBody, setResBody] = useState();

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

// Update the calculateAdjustedPrice function to round properly
const calculateAdjustedPrice = (basePrice, durationType) => {
  switch (durationType) {
    case "monthly":
      return Math.round(basePrice);
    case "half-yearly":
      return Math.round(basePrice * 6 * 0.9); // 10% discount
    case "annually":
      return Math.round(basePrice * 12 * 0.8); // 20% discount
    default:
      return Math.round(basePrice);
  }
};

  const getDurationText = (durationType) => {
    switch (durationType) {
      case "monthly":
        return "month";
      case "half-yearly":
        return "6 months";
      case "annually":
        return "year";
      default:
        return "month";
    }
  };

  const handleAddToCart = async (plan) => {
    setLoadingButtons((prev) => ({ ...prev, [plan._id]: true }));
    try {
      // Adjust price based on selected plan
      const adjustedPlan = {
        ...plan,
        subscriptionPrice: calculateAdjustedPrice(
          plan.baseMonthlyPrice, 
          selectedPlan
        ),
        subscriptionDuration: getDurationText(selectedPlan)
      };

      const response = await fetch(`http://localhost:3000/api/cart/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: adjustedPlan }),
        credentials: "include",
      });

      const responseBody = await response.json();
      if (response.status === 404 && responseBody.falseSetup) {
        setOrgSetupDialog(true);
        setResBody(responseBody);
      }
      if (response.ok) {
        toast.success(responseBody.message);
        sonnertoast.success(responseBody.message);
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
      <AlertDialog open={orgSetupDialog} onOpenChange={setOrgSetupDialog}>
        <AlertDialogContent className="bg-white dark:bg-blue-950 border-none rounded-xl shadow-xl max-w-md text-gray-900 dark:text-white">
          <AlertDialogHeader className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 w-6 h-6 mt-1" />
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                Complete Your Organization Setup
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                {resBody?.message || "To access all features and start managing your gym efficiently, please complete the remaining onboarding steps."}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-gray-100 text-gray-700 dark:border-none hover:bg-gray-200 dark:bg-blue-900 dark:text-white">
              Not Now
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push(resBody?.redirect)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Complete Setup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {tenantLoading || isLoading ? (
        <Loader />
      ) : Array.isArray(subscriptions) && subscriptions.length > 0 ? (
        <div className="w-full">
          {/* Hero Section */}
          <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Choose Your
                  <span className="text-blue-600 dark:text-blue-400">
                    {" "}
                    Power Plan
                  </span>
                </h1>
                <p className="text-md font-medium text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
                  Transform your gym with our cutting-edge management system.
                </p>

                {/* Billing Toggle */}
                <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
                  <button
                    onClick={() => setSelectedPlan("monthly")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedPlan === "monthly"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPlan("half-yearly")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedPlan === "half-yearly"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Half-Yearly
                  </button>
                  <button
                    onClick={() => setSelectedPlan("annually")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all relative ${
                      selectedPlan === "annually"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Yearly
                    {selectedPlan !== "annually" && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-1.5 py-0.5 rounded-full text-white">
                        Save 20%
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((plan, index) => {
                const Icon = getPlanIcon(index);
                const isPopular = index === 1;
                
                // Calculate price based on selected duration
                const price = calculateAdjustedPrice(
                  plan.baseMonthlyPrice || plan.subscriptionPrice / 12, 
                  selectedPlan
                );
                const durationText = getDurationText(selectedPlan);

                return (
                  <div
                    key={plan._id}
                    className={`relative group ${
                      isPopular ? "md:-mt-2 md:mb-2" : ""
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                          🔥 Most Popular
                        </div>
                      </div>
                    )}

                    <div
                      className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border ${
                        isPopular
                          ? "border-blue-500 dark:border-blue-500 shadow-lg"
                          : "border-gray-200 dark:border-gray-700"
                      } transition-all h-full flex flex-col`}
                    >
                      {/* Plan Header */}
                      <div className="relative z-10 flex-grow">
                        <div className="inline-flex p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {plan.subscriptionName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {plan.subscriptionDescription}
                        </p>

                        {/* Pricing */}
                        <div className="mb-6">
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              ${calculateAdjustedPrice(plan.baseMonthlyPrice || plan.subscriptionPrice / 12, selectedPlan)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              /{getDurationText(selectedPlan)}
                            </span>
                          </div>
                          {selectedPlan !== "monthly" && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ${Math.round(calculateAdjustedPrice(
                                plan.baseMonthlyPrice || plan.subscriptionPrice / 12, 
                                selectedPlan
                              ) / (selectedPlan === "half-yearly" ? 6 : 12))} per month equivalent
                            </p>
                          )}
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-6">
                          {plan.subscriptionFeatures.map(
                            (feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-start"
                              >
                                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 mt-0.5">
                                  <Check className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {feature}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-auto pt-4">
                        <button
                          onClick={() => handleAddToCart(plan)}
                          disabled={loadingButtons[plan._id]}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                            isPopular
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                          } ${
                            loadingButtons[plan._id]
                              ? "opacity-75 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {loadingButtons[plan._id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              Get Started
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Trusted by fitness professionals worldwide
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 opacity-75">
                {["FitnessPro", "GymTech", "PowerFit", "FlexManage"].map(
                  (brand) => (
                    <div
                      key={brand}
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      {brand}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    question: "Can I change my plan later?",
                    answer:
                      "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.",
                  },
                  {
                    question: "Is there a free trial?",
                    answer:
                      "All plans come with a 14-day free trial. No credit card required to start.",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer:
                      "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
                  },
                  {
                    question: "Do you offer refunds?",
                    answer:
                      "Yes, we offer a 30-day money-back guarantee on all plans.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            No subscription plans available
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Please check back later or contact support.
          </p>
        </div>
      )}
    </div>
  );
};

export default TenantSubscriptionPlansManagement;