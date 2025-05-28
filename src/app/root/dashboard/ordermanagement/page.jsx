"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TbTruckDelivery } from "react-icons/tb";
import toast from "react-hot-toast";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MoreVertical,
  RefreshCcw,
  Package,
  X,
  ShoppingBag,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

const OrderManagement = () => {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentDetailsFormOpen, setIsPaymentDetailsFormOpen] =
    useState(false);
  const queryClient = useQueryClient();

  const getOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/order/all`, {
        credentials: "include",
      });
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const { orders } = data || {};

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

  const filteredOrders = orders?.filter((order) => {
    if (filterStatus === "all") return true;
    return order.orderStatus.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/order/update-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ orderId, status: newStatus }),
        }
      );

      const responseBody = await response.json();

      if (response.ok) {
        toast.success(responseBody.message);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } else {
        toast.error(responseBody.error);
      }
    } catch (error) {
      toast.error("Error:", error.error);
      console.error("Error updating order status:", error);
    }
  };

  const handlePaymentStatus = async (orderId, newStatus) => {
    console.log("Status: ", newStatus);
    if (newStatus === "Paid") {
      setIsPaymentDetailsFormOpen(true);
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/order/update-payment-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ orderId, status: newStatus }),
        }
      );

      const responseBody = await response.json();

      if (response.ok) {
        toast.success(responseBody.message);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } else {
        toast.error(responseBody.error);
      }
    } catch (error) {
      toast.error("Error:", error.error);
      console.error("Error updating order status:", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleAttachSubscription = async (order) => {
    console.log("Order: ", order);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-lg shadow-slate-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Order Management
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Manage and track all subscription orders with real-time updates
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
              {orders && orders.length > 0 ? (
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
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
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
                              {order?.tenantId?.organizationName || "N/A"}
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
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`${getPaymentStatusColor(
                                  order.paymentStatus
                                )} border font-medium px-3 py-1`}
                                variant="outline"
                              >
                                {order?.paymentStatus || "N/A"}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                >
                                  <DropdownMenuLabel className="text-slate-700 dark:text-slate-300">
                                    Payment Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handlePaymentStatus(order._id, "Paid")
                                    }
                                    className="flex items-center space-x-2 focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700"
                                  >
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span>Mark as Paid</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handlePaymentStatus(order._id, "Pending")
                                    }
                                    className="flex items-center space-x-2 focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700"
                                  >
                                    <CreditCard className="w-4 h-4 text-amber-500" />
                                    <span>Mark as Pending</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handlePaymentStatus(order._id, "Failed")
                                    }
                                    className="flex items-center space-x-2 focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700"
                                  >
                                    <XCircle className="w-4 h-4 text-rose-500" />
                                    <span>Mark as Failed</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
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
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                              {/* Approve Button */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button className="h-8 w-8 p-0 bg-transparent hover:dark:bg-gray-900 hover:bg-gray-100">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-gray-900 dark:text-gray-200">
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will attach the taken
                                      subscription by tenant to the tenant
                                      account. And once tenant account status is
                                      active by tenant management page then
                                      tenant will be able to access the
                                      subscription features and dashboard
                                      access.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="text-gray-900 dark:text-gray-200">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleAttachSubscription(order)
                                      }
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              {/* Actions Dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <MoreVertical className="w-4 h-4 dark:text-white" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-48"
                                >
                                  <DropdownMenuLabel className="text-slate-700 dark:text-slate-300">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(order._id, "Completed")
                                    }
                                    className="focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700 flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Mark as Completed</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(order._id, "Delivered")
                                    }
                                    className="focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700 flex items-center gap-2"
                                  >
                                    <TbTruckDelivery className="w-4 h-4" />
                                    <span>Mark as Delivered</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(order._id, "Shipped")
                                    }
                                    className="focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700 flex items-center gap-2"
                                  >
                                    <LiaShippingFastSolid className="w-4 h-4" />
                                    <span>Mark as Shipped</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(order._id, "Cancelled")
                                    }
                                    className="focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700 flex items-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span>Cancel Order</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleViewDetails(order)}
                                    className="focus:bg-slate-50 cursor-pointer dark:focus:bg-slate-700 flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>View Details</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
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
                      ? "There are no orders in the system yet. Orders will appear here once customers start placing them."
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
                          {selectedOrder?.tenantId?.organizationName || "N/A"}
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
                          {selectedOrder?.tenantId?.ownerName || "N/A"}
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
                          {selectedOrder?.tenantId?.phone?.countryCode || "N/A"}{" "}
                          {selectedOrder?.tenantId?.phone?.number || "N/A"}
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

        {/* Payment Details Modal */}
        <AlertDialog
          open={isPaymentDetailsFormOpen}
          onOpenChange={setIsPaymentDetailsFormOpen}
        >
          <AlertDialogContent className="w-full max-w-4xl h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden flex flex-col">
            {/* Fixed Header */}
            <AlertDialogHeader className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
              <AlertDialogTitle className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Payment Details
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Enter payment and order information
                    </p>
                  </div>
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-slate-900">
              <div className="space-y-6">
                {/* Payment Information Group */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Payment Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Payment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors">
                        <option value="">Select a payment method</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Amount Details Group */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Amount Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Paid Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Discount Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Due Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Total Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors bg-blue-50 dark:bg-blue-900/20 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Group */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Status Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Payment Status <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors">
                        <option value="">Select a payment status</option>
                        <option value="Pending">🟡 Pending</option>
                        <option value="Paid">🟢 Paid</option>
                        <option value="Failed">🔴 Failed</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Order Status <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors">
                        <option value="">Select order status</option>
                        <option value="Pending">⏳ Pending</option>
                        <option value="Confirmed">✅ Confirmed</option>
                        <option value="Shipped">🚚 Shipped</option>
                        <option value="Delivered">📦 Delivered</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Additional Notes
                    </h2>
                  </div>
                  <textarea
                    placeholder="Enter any additional notes or comments..."
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-100 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <AlertDialogFooter className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-900">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-red-500">*</span> Required fields
                </p>
                <div className="flex space-x-3">
                  <AlertDialogCancel className="px-6 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg">
                    Save Payment Details
                  </AlertDialogAction>
                </div>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default OrderManagement;
