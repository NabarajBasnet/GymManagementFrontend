"use client";

import Loader from "@/components/Loader/Loader";
import { toast as sonnerToast } from "sonner";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MyOrders = () => {
  const queryClient = useQueryClient();

  const getMyOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/order/tenant`, {
        credentials: "include",
      });

      const responseBody = await response.json();
      console.log("Response Body: ", responseBody);
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to fetch orders");
      sonnerToast("Failed to fetch orders", {
        description: "It looks like you haven't made any orders yet.",
      });
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
    retry: false,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return toast.error("Failed to fetch orders");
  }

  const { tenantOrders } = data || {};

  console.log("Tenant Orders: ", tenantOrders);

  return (
    <div>
      <div></div>
    </div>
  );
};

export default MyOrders;
