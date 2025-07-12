"use client";

import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TenantSubscriptionPlansManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState();
  const [selectedPlanDuration, setSelectedPlanDuration] = useState();
  const [nextExpireDate, setNextExpireDate] = useState(new Date());
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [loadingButtons, setLoadingButtons] = useState({});
  const { tenant, loading: tenantLoading } = useTenant();
  const router = useRouter();
  const loggedInTenant = tenant?.tenant;

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [orgSetupDialog, setOrgSetupDialog] = useState(false);
  const [resBody, setResBody] = useState();

  const calculateNextExpireDate = (duration) => {
    switch (duration) {
      case '1 Month':
        return new Date(new Date().setMonth(new Date().getMonth() + 1 * quantity));
      case '3 Months':
        return new Date(new Date().setMonth(new Date().getMonth() + 3 * quantity));
      case '6 Months':
        return new Date(new Date().setMonth(new Date().getMonth() + 6 * quantity));
      case '9 Months':
        return new Date(new Date().setMonth(new Date().getMonth() + 9 * quantity));
      case '12 Months':
        return new Date(new Date().setMonth(new Date().getMonth() + 12 * quantity));
    }
  };

  useEffect(() => {
    if (selectedPlanDuration) {
      setNextExpireDate(calculateNextExpireDate(selectedPlanDuration));
    }
  }, [selectedPlanDuration, selectedPlan, quantity]);

  // Calculate total price
  useEffect(() => {
    if (selectedPlan && selectedPlanDuration && quantity) {
      switch (selectedPlanDuration) {
        case '1 Month':
          setTotalPrice(selectedPlan?.subscriptionPrice * quantity);
          break;
        case '3 Months':
          setTotalPrice(selectedPlan?.subscriptionPrice * quantity * 3);
          break;
        case '6 Months':
          setTotalPrice(selectedPlan?.subscriptionPrice * quantity * 6);
          break;
        case '9 Months':
          setTotalPrice(selectedPlan?.subscriptionPrice * quantity * 9);
          break;
        case '12 Months':
          setTotalPrice(selectedPlan?.subscriptionPrice * quantity * 12);
          break;
        default:
          setTotalPrice(selectedPlan?.subscriptionPrice * quantity);
          break;
      }
    }
  }, [selectedPlan, selectedPlanDuration, quantity]);

  const fetchPlans = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/subscription/getall`
      );
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      sonnertoast.error("Error fetching plans:", error.error);
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
        body: JSON.stringify({
          selectedPlan: selectedPlan,
          quantity: quantity,
          selectedPlanDuration: selectedPlanDuration,
          nextExpireDate: nextExpireDate,
          totalPrice: totalPrice,
        }),
        credentials: "include",
      });

      const responseBody = await response.json();
      if (response.status === 404 && responseBody.falseSetup) {
        setOrgSetupDialog(true);
        setResBody(responseBody);
      };
      if (response.ok) {
        sonnertoast.success(responseBody.message)
        // Invalidate cart query to refresh cart data
        queryClient.invalidateQueries(["cart"]);
        dispatch(setCartLength(responseBody.cart.totalItems));
      } else {
        sonnertoast.error(responseBody.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      sonnertoast.error("Error adding to cart");
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

              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="w-full mx-auto px-4 py-16 sm:px-6 lg:px-4">
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
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {plan.subscriptionDescription}
                        </p>

                        {/* Pricing */}
                        <div className="mb-4">
                          <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                              {plan.currency} {plan.subscriptionPrice}
                            </span>
                            <span className="text-gray-500 text-lg font-medium dark:text-gray-400 ml-2">
                              / mo
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 mb-4">
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild className="w-full rounded-xl">
                            <button
                              onClick={() => setSelectedPlan(plan)}
                              disabled={loadingButtons[plan._id]}
                              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center group ${isPopular
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
                                : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                                } ${loadingButtons[plan._id] ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            >
                              {loadingButtons[plan._id] ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  Pick Plan
                                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md p-6">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                Configure Your Plan
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                Customize your subscription details
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <form className="space-y-6 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</Label>
                                  <Select onValueChange={(value) => setSelectedPlanDuration(value)}>
                                    <SelectTrigger className="h-12 bg-gray-50 dark:text-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg">
                                      <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                      {['1 Month', '3 Months', '6 Months', '9 Months', '12 Months'].map((option) => (
                                        <SelectItem
                                          key={option}
                                          value={option}
                                          className="px-8 py-2 cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                        >
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</Label>
                                  <Input
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    type="number"
                                    min="1"
                                    placeholder="Enter quantity"
                                    className="h-12 bg-gray-50 dark:text-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg"
                                  />
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{selectedPlan?.subscriptionName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Price:</span>
                                    <span className="font-medium text-xl text-gray-900 dark:text-white">
                                      {selectedPlan?.currency} {selectedPlan?.subscriptionPrice}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{selectedPlanDuration || '-'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{quantity || '0'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {nextExpireDate ? new Date(nextExpireDate).toISOString().split('T')[0] : '-'}
                                    </span>
                                  </div>
                                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                      {selectedPlan?.currency} {totalPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </form>

                            <AlertDialogFooter className="mt-6">
                              <AlertDialogCancel className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md transition-all"
                                onClick={() => handleAddToCart(plan)}
                              >
                                Add to Cart
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

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
            {/* <div className="mt-16 text-center">
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
            </div> */}

            {/* FAQ Section */}
            {/* <div className="mt-20">
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
                    All plans come with a 3 weeks free trial. No credit card
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
            </div> */}
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="p-28 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                No Plans Found
              </h1>
              <p className="text-gray-500 text-sm font-medium dark:text-gray-300">
                Looks like the subscription models are not added yet.
              </p>
              <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => router.push("/clientarea/dashboard")}>
                Back to dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSubscriptionPlansManagement;
