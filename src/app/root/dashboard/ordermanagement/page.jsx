"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const OrderManagement = () => {
  const getOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart`, {
        credentials: "include",
      });
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const { cart } = data || {};
  console.log("Cart: ", cart);

  const { items, tenantId, createdAt, confirmCheckout, totalPrice } =
    cart || {};

  console.log("Create at: ", createdAt);
  console.log("confirmCheckout: ", confirmCheckout);
  console.log("totalPrice: ", totalPrice);

  return (
    <div className="w-full p-6 space-y-6 min-h-screen dark:bg-gray-900 bg-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Order Management</h1>
      </div>

      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Card className="w-full dark:bg-gray-800 bg-white dark:border-none text-white">
              {Array.isArray(items) && items.length > 0 ? (
                <Table>
                  <TableCaption>
                    A list of your recent services and products.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Tenant Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.subscriptionName}</TableCell>
                        <TableCell>{tenantId?.ownerName}</TableCell>
                        <TableCell>{tenantId?.organizationName}</TableCell>
                        <TableCell>
                          {createdAt
                            ? new Date(createdAt).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : ""}
                        </TableCell>
                        <TableCell>{item.subscriptionPrice}</TableCell>
                        <TableCell>{item.subscriptionPrice}</TableCell>
                        <TableCell>{item.subscriptionPrice}</TableCell>
                        <TableCell>{item.subscriptionPrice}</TableCell>
                        <TableCell>{item.subscriptionPrice}</TableCell>
                        <TableCell>{item.subscriptionPrice}</TableCell>
                        <TableCell>{item.subscriptionPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No orders found</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
