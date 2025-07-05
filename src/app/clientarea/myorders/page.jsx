"use client";

import { MdShoppingBag } from "react-icons/md";
import {
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Filter,
  RefreshCcw,
  Package,
  X,
  ShoppingBag,
  Calendar,
  CreditCard,
  Building2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const MyOrders = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient();

  const getMyOrders = async () => {
    try {
      const response = await fetch(`http://88.198.112.156:3100/api/order/tenant`, {
        credentials: "include",
      });
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tenantOrders"],
    queryFn: getMyOrders,
  });

  const { tenantOrders } = data || {};

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800";
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full mx-auto p-4 space-y-4">

        <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <MdShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Portal
                </span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Client Area
                </span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  My Orders
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-800/50 py-6 px-4 shadow-lg shadow-slate-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  My Orders
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                View and manage all your subscription orders with real-time
                updates
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-[200px] rounded-md dark:text-white h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <Filter className="w-4 h-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem
                    value="all"
                    className="focus:bg-slate-50 dark:focus:bg-slate-700"
                  >
                    All Orders
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="focus:bg-slate-50 dark:focus:bg-slate-700"
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="completed"
                    className="focus:bg-slate-50 dark:focus:bg-slate-700"
                  >
                    Completed
                  </SelectItem>
                  <SelectItem
                    value="cancelled"
                    className="focus:bg-slate-50 dark:focus:bg-slate-700"
                  >
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["orders"] })
                }
                variant="outline"
                size="icon"
                className="h-11 w-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
              >
                <RefreshCcw className="w-4 h-4 dark:text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-900/5 overflow-hidden">
          {isLoading ? (
            <div className="p-12">
              <Loader />
            </div>
          ) : (
            <CardContent className="p-0">
              {Array.isArray(tenantOrders) && tenantOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">
                          Order ID
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Organization
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Items
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Total Amount
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Order Status
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Payment Status
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Payment Method
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Order Date
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                          Expire Date
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenantOrders.map((order) => (
                        <TableRow
                          key={order._id}
                          className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-100 py-4">
                            {order.orderId}
                          </TableCell>
                          <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-slate-500" />
                              {order?.organization?.name || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">
                            <div className="flex cursor-pointer items-center gap-2">
                              <Package className="w-4 h-4 text-slate-500" />
                              {order?.cartSnapshoot?.totalItems || 0} items
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                            {order?.subTotal?.toLocaleString() || 0}{" "}
                            {order?.tenantId?.tenantCurrency || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                order.orderStatus
                              )} border font-medium px-3 py-1`}
                              variant="outline"
                            >
                              {order?.orderStatus || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getPaymentStatusColor(
                                order.paymentStatus
                              )} border font-medium px-3 py-1`}
                              variant="outline"
                            >
                              {order?.paymentStatus || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-slate-500" />
                              {order?.paymentMethod || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              {new Date(order?.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              {new Date(order?.expireDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              onClick={() => handleViewDetails(order)}
                              className="cursor-pointer dark:border-none dark:bg-gray-900 dark:text-white"
                            >
                              <Eye className="w-4 h-4 dark:text-white" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                  <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                    {filterStatus === "all"
                      ? "It looks like you haven't placed any orders yet. Orders will appear here once you place them."
                      : `No orders with status "${filterStatus}" found. Try adjusting your filter or check back later.`}
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </div>

        {/* Order Details Modal */}
        <AlertDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <AlertDialogContent className="max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 max-g-[90vh] border-slate-200 dark:border-slate-800">
            <AlertDialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <AlertDialogTitle className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Order Details - {selectedOrder?.orderId}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDetailsOpen(false)}
                  className="hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTitle>
            </AlertDialogHeader>

            <ScrollArea className="max-h-[70vh] mt-6">
              {selectedOrder && (
                <div className="space-y-8 pr-4">
                  {/* Order Information */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      Order Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Organization
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedOrder?.organization?.name || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Order Date
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {new Date(selectedOrder?.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Payment Method
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedOrder?.paymentMethod || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Payment Date
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {new Date(
                            selectedOrder?.paymentDate
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="bg-white dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Order Items
                      </h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200 dark:border-slate-700">
                          <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                            Item Name
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                            Quantity
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                            Price
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder?.cartSnapshoot?.items?.map((item) => (
                          <TableRow
                            key={item._id}
                            className="border-slate-100 dark:border-slate-700"
                          >
                            <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                              {item?.item?.subscriptionName || "N/A"}
                            </TableCell>
                            <TableCell className="text-slate-700 dark:text-slate-300">
                              {item?.quantity}
                            </TableCell>
                            <TableCell className="text-slate-700 dark:text-slate-300">
                              {(item?.price / item?.quantity).toLocaleString()}{" "}
                              {selectedOrder?.tenantId?.tenantCurrency || "N/A"}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                              {item?.price?.toLocaleString() || 0}{" "}
                              {selectedOrder?.tenantId?.tenantCurrency || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                          <TableCell
                            colSpan={3}
                            className="font-semibold text-slate-900 dark:text-slate-100"
                          >
                            Total
                          </TableCell>
                          <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                            {selectedOrder?.subTotal?.toLocaleString() || 0}{" "}
                            {selectedOrder?.tenantId?.tenantCurrency || "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Contact Person
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedOrder?.tenantId?.fullName || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Email
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedOrder?.tenantId?.email || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Phone
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedOrder?.tenantId?.phone || "N/A"}{" "}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Address
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedOrder?.tenantId?.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            <AlertDialogFooter className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyOrders;
