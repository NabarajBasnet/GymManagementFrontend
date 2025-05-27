"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, CreditCard, Package, Minus, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const TenantCartManagement = () => {
  const [processing, setProcessing] = useState({});
  const router = useRouter();

  const getCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/`, {
        credentials: "include",
      });

      if (response.status === 401) {
        router.push('/login');
        throw new Error('Unauthorized');
      }

      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to fetch cart items");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["cartItems"],
    queryFn: getCartItems,
    retry: false
  });

  const handleRemoveItem = async (itemId) => {
    setProcessing(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(`http://localhost:3000/api/cart/remove-item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
        credentials: "include",
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        toast.success("Item removed from cart");
        refetch();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setProcessing(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:3000/api/cart/checkout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Checkout successful");
        refetch();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setProcessing(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(`http://localhost:3000/api/cart/update-item`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
        credentials: "include",
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        toast.success("Quantity updated");
        refetch();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setProcessing(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please log in to view your cart
          </p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const { cart } = data || {};

  console.log('Cart: ',cart);
  
  return (
    <div className="w-full p-6 space-y-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full">
        <h1 className="text-3xl text-black dark:text-white font-bold mb-2">
          Shopping Cart
        </h1>
        <p className="text-sm font-medium dark:text-gray-100 text-gray-500">
          Review your subscription plans and proceed to checkout
        </p>
      </div>

      <div className="w-full md:flex space-y-6 md:space-y-0 items-start justify-between gap-10">
        {/* Cart Items */}
        <Card className="w-full lg:w-8/12 bg-white dark:bg-gray-800 dark:border-none">
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>
              {cart?.items?.length || 0} items in your cart
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart?.items?.map((cartItem) => (
                <div
                  key={cartItem.item._id}
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {cartItem.item.subscriptionName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Duration: {cartItem.item.subscriptionDuration} days
                      </p>
                      {cartItem.item.subscriptionFeatures && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {cartItem.item.subscriptionFeatures.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                        disabled={processing[cartItem.item._id]}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{cartItem.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="dark:border-none"
                        onClick={() => handleUpdateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                        disabled={processing[cartItem.item._id]}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {cartItem.price.toLocaleString()} {cart?.tenantId?.tenantCurrency}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cartItem.item.subscriptionPrice} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="dark:border-none"
                      onClick={() => handleRemoveItem(cartItem.item._id)}
                      disabled={processing[cartItem.item._id]}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="w-full lg:w-4/12 bg-white dark:bg-gray-800 dark:border-none">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Items</span>
                <span className="font-semibold">{cart?.totalItems || 0} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                <span className="font-semibold">
                  {cart?.totalPrice?.toLocaleString()} {cart?.tenantId?.tenantCurrency}
                </span>
              </div>
              <div className="border-t pt-4 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {cart?.totalPrice?.toLocaleString()} {cart?.tenantId?.tenantCurrency}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={processing || !cart?.items?.length}
            >
              {processing ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CreditCard className="w-5 h-5 mr-2" />
              )}
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TenantCartManagement;
