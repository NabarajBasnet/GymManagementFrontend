"use client";

import { toast as sonnertoast } from "sonner";
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
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
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
      const response = await fetch(`http://localhost:3000/api/cart/`, {
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
      toast.error("Failed to fetch cart items");
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["cartItems"],
    queryFn: getCartItems,
    retry: false,
  });

  const { cart } = data || {};

  console.log('Cart: ',cart);

  const handleRemoveItem = async (itemId) => {
    setProcessing((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(
        `http://localhost:3000/api/cart/remove-item`,
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
        toast.success("Item removed from cart");
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setProcessing((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCreateOrder = async (item, subTotal) => {
    setOrdering(true);
    try {
      const response = await fetch(`http://localhost:3000/api/order/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ item, subTotal }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseBody = await response.json();
      if (response.ok) {
        toast.success(responseBody.message);
        sonnertoast(responseBody.message, {
          description: "Redirecting to orders page",
        });
        setOrdering(false);
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
        router.push(responseBody.redirectUrl);
      } else {
        toast.error(responseBody.error);
        setOrdering(false);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Checkout failed");
      setOrdering(false);
    }
  };

  const handleIncreaseQuantity = async (itemId, itemPrice) => {
    setProcessing((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(
        `http://localhost:3000/api/cart/update-item`,
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
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.error);
    } finally {
      setProcessing((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleDecreaseQuantity = async (itemId, itemPrice) => {
    setProcessing((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await fetch(
        `http://localhost:3000/api/cart/decrease-item`,
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
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        dispatch(setCartLength(cart.totalItems));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.error);
    } finally {
      setProcessing((prev) => ({ ...prev, [itemId]: false }));
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
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

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

      {cart?.[0]?.items?.length === 0 ? (
        <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Cart is Empty
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 px-4">
              Discover our subscription plans and find the perfect fit for your
              needs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <div className="text-center">
              <Button
                onClick={() => router.push("/clientarea/pricing")}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse Subscription Plans
              </Button>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                Choose from our variety of plans designed for your success
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full md:flex space-y-6 md:space-y-0 items-start justify-between gap-10">
          {/* Cart Items */}
          <Card className="w-full lg:w-8/12 bg-white dark:bg-gray-800 dark:border-none lg:min-h-80">
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                {cart?.[0]?.items?.length || 0} items in your cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart?.[0]?.items?.map((cartItem) => (
                  <div
                    key={cartItem._id}
                    className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex space-x-3 items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {cartItem?.item?.subscriptionName}
                        </h3>
                        <p className="text-xs font-medium text-gray-200">
                          {cartItem?.selectedPlanDuration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="dark:border-none dark:outline-none"
                          onClick={() =>
                            handleDecreaseQuantity(
                              cartItem?.item?._id,
                              cartItem?.item?.subscriptionPrice
                            )
                          }
                          disabled={processing[cartItem?.item?._id]}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">
                          {cartItem.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="dark:border-none dark:outline-none"
                          onClick={() =>
                            handleIncreaseQuantity(
                              cartItem?.item?._id,
                              cartItem?.item?.subscriptionPrice
                            )
                          }
                          disabled={processing[cartItem?.item?._id]}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {cartItem?.item?.currency} {cartItem?.price?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {cartItem?.item?.currency} {cartItem?.item?.subscriptionPrice} each
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="dark:border-none dark:outline-none"
                        onClick={() =>
                          handleRemoveItem(
                            cartItem?.item?._id,
                            cartItem?.item?.subscriptionPrice
                          )
                        }
                        disabled={processing[cartItem?.item?._id]}
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
                  <span className="text-gray-600 dark:text-gray-300">
                    Total Items
                  </span>
                  <span className="font-semibold">
                    {cart?.[0]?.totalItems || 0} items
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal
                  </span>
                  <span className="font-semibold">
                    $ {cart[0].totalPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-4 dark:border-gray-700">
                <div className="flex justify-between">
                    <span className="text-lg font-semibold">Next Expire Date</span>
                    <span className="text-sm font-bold">
                      {new Date(cart[0].nextExpireDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      $ {cart[0].totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button
                className="w-full flex items-center justify-center dark:bg-white dark:text-black py-3 rounded-md cursor-pointer bg-gray-900 text-white hover:bg-gray-800 hover:dark:bg-gray-200 transition-all duration-300 font-semibold"
                onClick={() => handleCreateOrder(cart?.[0]?._id, cart?.[0]?.totalPrice)}
              >
                {ordering ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingBag className="w-5 h-5 mr-2" />
                )}
                Place Order
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TenantCartManagement;
