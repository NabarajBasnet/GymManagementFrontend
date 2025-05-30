"use client";

import { toast as soonerToast } from "sonner";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const AccountSetting = () => {
  const getAccountDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/details`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.json();

      if (!response.ok) {
        soonerToast.error(responseBody.message);
        toast.error(responseBody.message);
      }

      return responseBody;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["accountdetails"],
    queryFn: getAccountDetails,
  });

  const { tenant } = data || {};
  console.log(tenant);

  return (
    <div>
      <h1>Account Setting</h1>
    </div>
  );
};

export default AccountSetting;
