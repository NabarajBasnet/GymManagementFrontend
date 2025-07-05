"use client";

import { toast as soonerToast } from "sonner";
import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trash2,
  CreditCard,
  Package,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Calendar,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCartLength } from "@/state/slicer";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";

const TenantCartManagement = () => {
  const [ordering, setOrdering] = useState(false);
  const [processing, setProcessing] = useState({});
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const tenant = useTenant();
  const loggedInTenant = tenant?.tenant

  const getCartItems = async () => {
    try {
      const response = await fetch(`https://fitbinary.com/api/cart/`, {
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/login");
        throw new Error("Unauthorized");
      }

      const responseBody = await response.json();
      dispatch(setCartLength(responseBody?.cart?.[0].totalItems));
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      soonerToast.error("Failed to fetch cart items");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["cartItems"],
    queryFn: getCartItems,
    retry: false,
  });

  const { cart } = data || {};

  const handleRemoveItem = async (itemId) => {
    setProcessing((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(
        `https://fitbinary.com/api/cart/remove-item`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        soonerToast.success("Item removed from cart");
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
      } else {
        soonerToast.error(data.message);
      }
    } catch (error) {
      soonerToast.error("Failed to remove item");
    } finally {
      setProcessing((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCreateOrder = async (item, subTotal) => {
    setOrdering(true);
    try {
      const response = await fetch(`https://fitbinary.com/api/order/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ item, subTotal }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseBody = await response.json();
      if (response.ok) {
        soonerToast.success(responseBody.message);
        setOrdering(false);
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
        router.push(responseBody.redirectUrl);
      } else {
        soonerToast.error(responseBody.error);
        setOrdering(false);
      }
    } catch (error) {
      console.log("Error: ", error);
      soonerToast.error("Checkout failed");
      setOrdering(false);
    }
  };

  const handleIncreaseQuantity = async (itemId, itemPrice) => {
    setProcessing((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(
        `https://fitbinary.com/api/cart/update-item`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, itemPrice }),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        soonerToast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
      } else {
        soonerToast.error(data.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      soonerToast.error(error.error);
    } finally {
      setProcessing((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleDecreaseQuantity = async (itemId, itemPrice) => {
    setProcessing((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(
        `https://fitbinary.com/api/cart/decrease-item`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, itemPrice }),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        soonerToast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
      } else {
        soonerToast.error(data.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      soonerToast.error(error.error);
    } finally {
      setProcessing((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 absolute top-4 left-4" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className={`w-full ${!cart ? "h-[25vh]" : "mb-8"} flex items-center justify-center`}>
          {cart && (
            <div className="text-center w-full max-w-3xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-3">
                Shopping Cart
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Review your subscription plans and proceed to checkout
              </p>
            </div>
          )}
        </div>

        {/* Empty Cart State */}
        {cart?.[0]?.items?.length === 0 || !cart ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-lg mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Your Cart is Empty
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed px-4">
                  Discover our subscription plans and find the perfect fit for your business needs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Button
                  onClick={() => router.push("/clientarea/pricing")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                  Browse Subscription Plans
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-4 text-center">
                  Choose from our variety of plans designed for your success
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Cart Items Section */}
            <div className="xl:col-span-8">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                        <Package className="w-6 h-6 mr-3 text-blue-600" />
                        Subscription Plans
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                        {cart?.[0]?.items?.length || 0} {cart?.[0]?.items?.length === 1 ? 'item' : 'items'} in your cart
                      </CardDescription>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>Subscription Plans</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cart?.[0]?.items?.map((cartItem, index) => (
                      <div
                        key={cartItem._id}
                        className="group relative bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Premium Badge */}
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          #{index + 1}
                        </div>
                        
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          {/* Left Section */}
                          <div className="flex items-start lg:items-center space-x-4 flex-1">
                            {/* Icon */}
                            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-inner">
                              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {cartItem?.item?.subscriptionName}
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                  <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                  <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {cartItem?.selectedPlanDuration}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                  <span className="font-medium text-blue-700 dark:text-blue-300">
                                    Qty: {cartItem.quantity}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 flex items-baseline space-x-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                  {cartItem?.item?.currency} {cartItem?.price?.toLocaleString()}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {cartItem?.item?.currency} {cartItem?.price?.toLocaleString()} each
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Remove Button */}
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-12 h-12 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group/btn"
                              onClick={() =>
                                handleRemoveItem(
                                  cartItem?.item?._id,
                                  cartItem?.item?.subscriptionPrice
                                )
                              }
                              disabled={processing[cartItem?.item?._id]}
                            >
                              {processing[cartItem?.item?._id] ? (
                                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-500 group-hover/btn:scale-110 transition-transform" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Section */}
            <div className="xl:col-span-4">
              <div className="sticky top-8">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                      <CreditCard className="w-6 h-6 mr-3 text-green-600" />
                      Order Summary
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Review your order details
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Summary Items */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Total Items</span>
                          <span className="font-bold text-lg text-slate-900 dark:text-white">
                            {cart?.[0]?.totalItems || 0}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Subtotal</span>
                          <span className="font-bold text-lg text-slate-900 dark:text-white">
                            $ {cart?.[0]?.totalPrice?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white dark:bg-slate-800 px-4 text-sm text-slate-500">Summary</span>
                        </div>
                      </div>

                      {/* Total Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-slate-900 dark:text-white">Next Expire Date</span>
                          </div>
                          <span className="font-bold text-green-700 dark:text-green-400">
                            {new Date(cart?.[0]?.nextExpireDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                          <div className="flex justify-between items-center text-white">
                            <span className="text-xl font-bold">Total Amount</span>
                            <span className="text-3xl font-bold">
                              $ {cart?.[0]?.totalPrice?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <button
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleCreateOrder(cart?.[0]?._id, cart?.[0]?.totalPrice)}
                      disabled={ordering}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        {ordering ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Processing Order...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                            Place Order
                            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantCartManagement;