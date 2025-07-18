"use client";

import { FaUser } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator"
import { TiHome } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";
import { RiLoader5Fill } from "react-icons/ri";
import { FiSave } from "react-icons/fi";
import { TiBusinessCard } from "react-icons/ti";
import { MdOutlinePayment } from "react-icons/md";
import { toast as sonnerToast } from "sonner";
import {
  BiSolidUserDetail,
} from "react-icons/bi";
import {
  Card,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
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
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import useMember from "@/hooks/Members";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import Loader from "@/components/Loader/Loader";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

const MemberDetails = ({ memberId }) => {
  const { user, loading } = useUser();
  const userRole = user?.user.role;

  // React hook form
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    control,
    watch,
    clearErrors,
  } = useForm();

  // For rendering states
  const [currentActionTaker, setCurrentActionTaker] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // States
  const queryClient = useQueryClient();
  const [membershipHoldDate, setMembershipHoldDate] = useState("");
  const [membershipType, setMembershipType] = useState("");
  const [membershipDuration, setMembershipDuration] = useState("");

  const [discountAmmount, setDiscountAmmount] = useState(0);
  const [dueAmmount, setDueAmmount] = useState(0);
  const [paidAmmount, setPaidAmmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const [membershipRenewDate, setMembershipRenewDate] = useState(new Date());
  const [membershipExpireDate, setMembershipExpireDate] = useState(new Date());
  const [admissionFee, setAdmissionFee] = useState("");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [membershipDurationDays, setMembershipDurationDays] = useState();
  const [planId, setPlanId] = useState("");
  const [prevMembershipExpireDate, setPrevMembershipExpireDate] = useState(null);

  // Member Hooks
  const { getSingleUserDetails } = useMember();
  const { data, isLoading } = useQuery({
    queryKey: ["member", memberId],
    queryFn: () => getSingleUserDetails(memberId),
    enabled: !!memberId,
  });
  const { member, message, qrCode } = data || {};

  // Populate Data
  useEffect(() => {
    if (member) {
      reset({
        fullName: member?.fullName,
        contactNo: member?.contactNo,
        email: member?.email,
        dob: member?.dob ? new Date(member?.dob).toISOString().split("T")[0] : "",
        secondaryContactNo: member?.secondaryContactNo,
        gender: member?.gender,
        address: member?.address,
        status: member?.status,
        membershipOption: member?.membershipOption,
        membershipType: member?.membershipType,
        membershipShift: member?.membershipShift,
        membershipDate: member?.membershipDate
          ? new Date(member?.membershipDate).toISOString().split("T")[0]
          : "",
        membershipRenewDate: member?.membershipRenewDate
          ? new Date(member?.membershipRenewDate).toISOString().split("T")[0]
          : "" && setMembershipRenewDate(new Date(member?.membershipRenewDate)),
        membershipDuration: member?.membershipDuration,
        membershipExpireDate: member?.membershipExpireDate
          ? new Date(member?.membershipExpireDate).toISOString().split("T")[0]
          : "" &&
          setMembershipExpireDate(new Date(member?.membershipExpireDate)),
        paymentMethod: member?.paymentMethod,
        discountAmmount: member?.discountAmmount,
        discountReason: member?.discountReason,
        discountCode: member?.discountCode,
        paidAmmount: member?.paidAmmount,
        finalAmmount: member?.finalAmmount,
        receiptNo: member?.receiptNo,
        remark: member?.remark,
        dueAmmount: member?.dueAmmount
      });
      setDiscountAmmount(Number(member?.discountAmmount) || 0);
      setValue('finalAmount', member?.finalAmmount);
      setValue('dueAmmount', member?.dueAmmount);
      setPrevMembershipExpireDate(
        new Date(member.membershipExpireDate).toISOString().split("T")[0]
      );
      setPlanName(
        `${member?.membership?.planName} - ${member?.membership?.price}`
      );
      setPlanSearchQuery(
        `${member?.membership?.planName} - ${member?.membership?.price}`
      );
      setAdmissionFee(member?.admissionFee);
      setSelectedPlanDetails(member?.membership);
    }
  }, [data, reset]);

  // Handle Expire Date Based On Selected Plan Details And Previous Expire Date
  const handleMembershipExpireDate = (duration) => {
    if (isNaN(duration)) return;
    const expireDate = new Date(member?.membershipExpireDate);
    expireDate.setDate(expireDate.getDate() + parseInt(duration));
    setPrevMembershipExpireDate(new Date(expireDate));
  }
  useEffect(() => {
    handleMembershipExpireDate(membershipDurationDays);
  }, [selectedPlanDetails]);

  // Calculate Final Amount By Calculating with discount, selected membership
  const CalculateAmountChanges = () => {
    // Get the base amount from the selected plan or existing member data
    const baseAmount = selectedPlanDetails?.price || member?.finalAmmount || 0;

    // Calculate final amount after discount
    const calculatedFinalAmount = baseAmount - (discountAmmount || 0);

    // Ensure final amount doesn't go negative
    const safeFinalAmount = Math.max(Number(calculatedFinalAmount || 0), 0);

    setValue('finalAmmount', Number(safeFinalAmount) || 0);

    // Calculate due amount (final amount - paid amount)
    const calculatedDueAmount = safeFinalAmount - (paidAmmount || 0);
    const safeDueAmount = Math.max(Number(calculatedDueAmount || 0), 0);
    setDueAmmount(Number(safeDueAmount) || 0);
  }

  useEffect(() => {
    CalculateAmountChanges()
  }, [selectedPlanDetails, paidAmmount, discountAmmount]);

  // Update member details
  const updateMemberDetails = async (data) => {

    if (!selectedPlanDetails) {
      sonnerToast.error('Plan not selected');
    };

    const {
      fullName,
      contactNo,
      email,
      dob,
      secondaryContactNo,
      gender,
      address,
      status,
      membershipType,
      membershipShift,
      membershipDate,
      membershipRenewDate,
      paymentMethod,
      referenceCode,
      discountReason,
      finalAmmount,
      receiptNo,
      reasonForUpdate,
      remark,
      actionTaker,
    } = data || {};

    const finalObjectData = {
      fullName,
      contactNo,
      email,
      dob,
      secondaryContactNo,
      gender,
      address,
      status,

      membershipType,
      membershipShift,
      membershipDuration,
      membershipDate,
      membershipRenewDate,
      membershipExpireDate: prevMembershipExpireDate,
      membership: selectedPlanDetails._id || null,

      paymentMethod,
      discountAmmount,
      discountReason,
      referenceCode,
      finalAmmount,
      paidAmmount,
      dueAmmount,
      receiptNo,
      reasonForUpdate,
      remark,
      actionTaker,
      bodyMeasuredate: new Date(),
    };

    try {
      const response = await fetch(
        `https://fitbinary.com/api/members/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalObjectData),
        }
      );
      const responseBody = await response.json();
      if (
        response.status === 400 ||
        response.status === 402 ||
        response.status === 404 ||
        response.status === 500
      ) {
        sonnerToast.error(responseBody.message);
      } else {
        if (response.status === 200) {
          sonnerToast.success(responseBody.message);
          setValue('actionTaker', 'Select');
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      sonnerToast.error(error.message);
    }
  };

  // Hold membership
  const holdMembership = async () => {
    const membershipHoldData = {
      membershipHoldDate,
      status: "OnHold",
      actionTaker: currentActionTaker,
      toId: memberId,
    };

    try {
      const response = await fetch(
        `https://fitbinary.com/api/members/hold-membership/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(membershipHoldData),
        }
      );
      const responseBody = await response.json();
      if (response.status !== 200) {
        sonnerToast.error(responseBody.message);
      } else {
        if (response.status === 200) {
          sonnerToast.success(responseBody.message);
        }
        queryClient.invalidateQueries(["members"]);
      }
    } catch (error) {
      console.log("Error: ", error);
      sonnerToast.error(error);
    }
  };

  const activateMembership = async () => {

    const membershipHoldData = { status: 'Active' };

    try {
      const response = await fetch(`https://fitbinary.com/api/members/resume-membership/${memberId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(membershipHoldData)
      });

      const responseBody = await response.json();
      if (response.status === 200) {
        sonnerToast.success(responseBody.message);
      };
      queryClient.invalidateQueries(['members']);
    } catch (error) {
      console.error("Error:", error);
      sonnerToast.success(responseBody.message);
    }
  };

  const getAactionTakers = async () => {
    try {
      const response = await fetch(
        `https://fitbinary.com/api/staffsmanagement/actiontakers?actionTakers=${[
          "Gym Admin",
          "Super Admin",
          "Operational Manager",
          "HR Manager",
          "CEO",
          "Intern",
          "Floor Trainer",
          "Personal Trainer",
        ]}`
      );
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      if (error) {
        sonnerToast.success(error);
      }
    }
  };

  const { data: actionTakers, isLoading: fetchingActionTakers } = useQuery({
    queryKey: ["actiontakers"],
    queryFn: getAactionTakers,
  });

  const { actionTakersDB } = actionTakers || {};

  // Get Membership Plans
  const GetMembershipPlans = async () => {
    try {
      const response = await fetch(
        `https://fitbinary.com/api/membershipplans/by-org?page=${0}&limit=${0}`
      );
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      sonnerToast.error("Internal server error");
    }
  };

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: GetMembershipPlans,
  });

  const { membershipPlans: fetchedPlans } = plans || {};

  // Plan search states
  const [planSearchQuery, setPlanSearchQuery] = useState("");
  const [selectedPlanName, setPlanName] = useState("");

  const [renderMembershipPlanDropdown, setRenderMembershipPlanDropdown] =
    useState(false);
  const planSearchRef = useRef(null);

  // Handle click outside for all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        planSearchRef.current &&
        !planSearchRef.current.contains(event.target)
      ) {
        setRenderMembershipPlanDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [planSearchRef]);

  const handleMembershipSearchFocus = () => {
    setRenderMembershipPlanDropdown(true);
  };

  // Handle Keyboard Interactivity in Plans dropdown
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [renderMembershipPlanDropdown, planSearchQuery]);

  const handleKeyDown = (e) => {
    if (!renderMembershipPlanDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredPlans.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredPlans.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = filteredPlans[highlightedIndex];
      if (selected) {
        setPlanName(selected.planName);
        setPlanSearchQuery(selected.planName);
        setPlanId(selected._id);
        setRenderStaffDropdown(false);
      }
    } else if (e.key === "Escape") {
      setRenderStaffDropdown(false);
    }
  };

  // Filter Plans
  const filteredPlans =
    fetchedPlans?.filter((plan) => {
      const planName = plan.planName.toLowerCase();
      const searchMatch = planName.includes(planSearchQuery.toLowerCase());
      const isAdmission = planName.startsWith("Admission Fee") || planName.startsWith("Admission Charge") || planName.startsWith("admission fee") || planName.startsWith("admission charge");
      return searchMatch && !isAdmission;
    }) || [];

  const convertDurationInMonths = (duration) => {
    return `${duration / 30} Months`;
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 pb-4">
      <div className="p-4 md:pt-8">
        <Breadcrumb className="mb-2">
          <BreadcrumbList className="flex items-center gap-2 text-sm">
            <BreadcrumbItem className="flex items-center gap-1.5">
              <TiHome className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <BreadcrumbLink
                href="/"
                className="text-gray-500 hover:text-primary transition-colors duration-200 dark:text-gray-400 dark:hover:text-primary"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 dark:text-gray-500" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-gray-500 hover:text-primary transition-colors duration-200 dark:text-gray-400 dark:hover:text-primary"
              >
                Member
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 dark:text-gray-500" />
            <BreadcrumbItem>
              <span className="text-primary font-medium dark:text-primary">
                {data ? `${member?.fullName || "Member Name"}` : "Loading..."}
              </span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20">
            <FaUser className="w-5 h-5 text-primary dark:text-primary/80" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Membership Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {data ? `Viewing details for ${member?.fullName || 'Member'}` : "Loading member information..."}
            </p>
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" className='mt-0 mb-4 dark:bg-gray-600' />

      <div className="w-full flex flex-col md:flex-row gap-4 items-stretch h-full px-4">
        <div className="w-full md:w-3/12">
          <Card className="w-full bg-white dark:bg-gray-800 dark:border-none h-full">
            <div className="rounded-md shadow-sm overflow-hidden p-4 md:p-2">
              <div className="w-full flex flex-col gap-2 md:gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                  <img
                    src={qrCode}
                    alt="Membership QR Code"
                    className="w-60 h-60 mx-auto p-2 rounded-xl"
                  />
                </div>

                <div className="w-full border dark:border-none p-2 rounded-lg shadow-md w-full flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300">
                    Membership Status
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={member?.status !== 'OnHold'}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          Activate
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md p-6 rounded-2xl dark:bg-gray-800 dark:border-none">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold dark:text-white">
                            Confirm Membership Resume
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-4 mt-2">
                            <div className="bg-red-50 border border-red-200 dark:border-none rounded-lg p-3">
                              <span className="text-red-600 font-medium text-sm">
                                Are you absolutely sure?
                              </span>
                            </div>
                            <span className="text-gray-600 text-sm dark:text-gray-300">
                              This action will resume the paused membership.
                            </span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-end gap-3 mt-4">
                          <AlertDialogCancel className="px-4 py-2 bg-gray-100 dark:hover:bg-gray-600 dark:border-none text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => activateMembership()}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                          >
                            Confirm Resume
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                        >
                          Hold
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md p-6 rounded-2xl dark:bg-gray-800 dark:border-none">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold dark:text-white">
                            Confirm Membership Hold
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-4 mt-2">
                            <div className="bg-red-50 border border-red-200 dark:border-none rounded-lg p-3">
                              <span className="text-red-600 font-medium text-sm">
                                Note: Stop/Start Date will be set to today by
                                default
                              </span>
                            </div>
                            <span className="text-gray-600 text-sm dark:text-gray-300">
                              To override the default Stop Date, please select a
                              date below:
                            </span>
                            <Input
                              disabled={userRole === 'Gym Admin'}
                              type="date"
                              value={membershipHoldDate ? new Date(membershipHoldDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                setMembershipHoldDate(
                                  new Date(e.target.value)
                                    .toISOString()
                                    .split("T")[0]
                                )
                              }
                              className="py-6 rounded-sm dark:bg-gray-900 dark:border-none dark:text-white"
                            />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-end gap-3 mt-4">
                          <AlertDialogCancel className="px-4 py-2 bg-gray-100 dark:hover:bg-gray-600 dark:border-none text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => holdMembership()}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                          >
                            Confirm Hold
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-blue-50 p-3 dark:bg-gray-900 dark:border-none rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 dark:text-blue-500 font-medium mb-1">
                        Hold Date
                      </p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-300">
                        {data?.member?.membershipHoldDate
                          ? new Date(data.member.membershipHoldDate)
                            .toISOString()
                            .split("T")[0]
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 dark:bg-gray-900 dark:border-none rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-600 dark:text-purple-500 font-medium mb-1">
                        Paused Days
                      </p>
                      <p className="text-base dark:text-gray-300 font-semibold text-gray-800">
                        {data ? member?.pausedDays : ""}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 dark:bg-gray-900 dark:border-none rounded-lg border border-green-200">
                      <p className="text-xs text-green-600 dark:text-green-500 font-medium mb-1">
                        Remaining Days
                      </p>
                      <p className="text-base dark:text-gray-300 font-semibold text-gray-800">
                        {data ? member?.remainingDaysOfMembership : ""}
                      </p>
                    </div>
                    <div className="bg-amber-50 p-3 dark:bg-gray-900 dark:border-none rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-600 font-medium mb-1">
                        Resumed Date
                      </p>
                      <p className="text-base font-semibold dark:text-gray-300 text-gray-800">
                        {data?.member?.resumedDate
                          ? new Date(data?.member?.resumedDate)
                            .toISOString()
                            .split("T")[0]
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full md:w-9/12">
          <Card className="w-full bg-white dark:bg-gray-800 dark:border-none p-4 h-full">
            <div className="w-full sticky">
              {data && (
                <div className="w-full">
                  {data ? (
                    <form
                      className="w-full bg-white dark:bg-gray-900 rounded-md"
                      onSubmit={handleSubmit(updateMemberDetails)}
                    >
                      <Tabs
                        defaultValue="Personal Details"
                        className="w-full dark:bg-gray-800"
                      >
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600">
                          <TabsTrigger
                            value="Personal Details"
                            className={`data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800`}
                          >
                            <BiSolidUserDetail size={22} className="mr-2" />
                            <span className="hidden md:flex">
                              Personal Information
                            </span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="Membership Details"
                            className={`data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800`}
                          >
                            <TiBusinessCard size={22} className="mr-2" />
                            <span className="hidden md:flex">
                              Membership Details
                            </span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="Payment Details"
                            className={`data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800`}
                          >
                            <MdOutlinePayment size={22} className="mr-2" />
                            <span className="hidden md:flex">
                              Payment Information
                            </span>
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="Personal Details">
                          <div className="p-2 bg-white dark:bg-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label>Full Name</Label>
                                <Input
                                  {...register("fullName")}
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                  type="text"
                                />
                                {errors.fullName && (
                                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                    {errors.fullName.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label>Contact No</Label>
                                <Input
                                  {...register("contactNo")}
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                                {errors.contactNo && (
                                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                    {errors.contactNo.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label>Email Address</Label>
                                <Input
                                  {...register("email")}
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                                {errors.email && (
                                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                    {errors.email.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label>Date Of Birth</Label>
                                <Input
                                  type="date"
                                  {...register("dob")}
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                                {errors.dob && (
                                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                    {errors.dob.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label>Secondary Contact No</Label>
                                <Input
                                  {...register("secondaryContactNo")}
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                                {errors.secondaryContactNo && (
                                  <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.secondaryContactNo.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label>Gender</Label>
                                <Controller
                                  name="gender"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      {...register("gender")}
                                      className="w-full rounded-sm p-3 dark:bg-gray-900 dark:border-none border dark:text-white border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                    >
                                      <option value="">Select</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  )}
                                />
                              </div>

                              <div>
                                <Label>Address</Label>
                                <Input
                                  {...register("address")}
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                                {errors.address && (
                                  <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.address.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label>Status</Label>
                                <Controller
                                  name="status"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      className="w-full rounded-sm p-3 dark:bg-gray-900 dark:border-none border dark:text-white border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                    >
                                      <option value="">Select</option>
                                      <option value="Active">🟢 Active</option>
                                      <option value="Inactive">
                                        🔴 Inactive
                                      </option>
                                      <option value="OnHold">🟡 OnHold</option>
                                    </select>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="Membership Details">
                          <div className="p-2 dark:bg-gray-800 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label>Membership Type</Label>
                                <Controller
                                  name="membershipType"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      value={field.value}
                                      onChange={(e) => {
                                        setMembershipType(e.target.value);
                                        field.onChange(e);
                                      }}
                                      className="w-full rounded-sm p-3 dark:bg-gray-900 dark:border-none border dark:text-white border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                    >
                                      {[
                                        "Gym",
                                        "Gym & Cardio",
                                        "Cardio",
                                        "Group Classes",
                                        "Swimming",
                                        "Zumba",
                                        "Sauna Steam",
                                        "Yoga",
                                        "Dance",
                                        "Online Classes",
                                      ].map((type, index) => (
                                        <option value={type} key={index}>
                                          {type}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                              </div>

                              <div>
                                <Label>Membership Shift</Label>
                                <Controller
                                  name="membershipShift"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      {...register("membershipShift")}
                                      className="w-full rounded-sm p-3 dark:bg-gray-900 dark:border-none border dark:text-white border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                    >
                                      {[
                                        "Flexible",
                                        "Daytime",
                                        "Morning",
                                        "Evening",
                                      ].map((type, index) => (
                                        <option value={type} key={index}>
                                          {type}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                              </div>

                              <div>
                                <Label>Membership Start Date</Label>
                                <Input
                                  {...register("membershipDate")}
                                  type="date"
                                  disabled
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                              </div>

                              <div>
                                <Label>Membership Renew Date</Label>
                                <Controller
                                  name="membershipRenewDate"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      {...register("membershipRenewDate")}
                                      type="date"
                                      value={field.value}
                                      onChange={(e) => {
                                        setMembershipRenewDate(e.target.value);
                                        field.onChange(e);
                                      }}
                                      className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                    />
                                  )}
                                />
                              </div>

                              <div>
                                <Label className="block text-sm dark:text-gray-300 mb-1 font-medium text-gray-700">
                                  Membership Plan
                                </Label>
                                <div ref={planSearchRef} className="relative">
                                  <Controller
                                    name="selectedPlanName"
                                    control={control}
                                    render={({ field }) => (
                                      <div className="relative">
                                        <Input
                                          {...field}
                                          autoComplete="off"
                                          value={`${selectedPlanName || planSearchQuery
                                            }`}
                                          onChange={(e) => {
                                            setPlanSearchQuery(e.target.value);
                                            field.onChange(e);
                                            setPlanName("");
                                          }}
                                          onFocus={handleMembershipSearchFocus}
                                          onKeyDown={handleKeyDown}
                                          className="w-full rounded-sm dark:border-none dark:bg-gray-900 bg-white py-6 dark:text-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 pl-10"
                                          placeholder="Search membership plan..."
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                          <FiSearch className="h-5 w-5 text-black dark:text-white" />
                                        </div>
                                      </div>
                                    )}
                                  />
                                  {errors.selectedPlanName && (
                                    <p className="mt-1.5 text-sm font-medium text-red-600">
                                      {errors.selectedPlanName.message}
                                    </p>
                                  )}

                                  {renderMembershipPlanDropdown && (
                                    <div className="absolute w-full bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-500 border-gray-200 rounded-sm shadow-lg max-h-52 overflow-y-auto z-[60] top-full left-0 mt-1">
                                      {filteredPlans.map((plan, index) => (
                                        <div
                                          onClick={() => {
                                            setMembershipDurationDays(
                                              parseInt(plan.duration)
                                            );
                                            setPlanName(
                                              `${plan.planName} - ${plan.price}`
                                            );
                                            setPlanSearchQuery(
                                              `${plan.planName} - ${plan.price}`
                                            );
                                            setPlanId(plan._id);
                                            setSelectedPlanDetails(plan);
                                            setRenderMembershipPlanDropdown(
                                              false
                                            );
                                            setFinalAmount(Number(plan.price));
                                            setMembershipDuration(
                                              convertDurationInMonths(
                                                plan.duration
                                              )
                                            );
                                          }}
                                          className={`px-4 py-3 text-sm cursor-pointer transition-colors ${index === highlightedIndex
                                            ? "bg-blue-100 dark:bg-gray-900"
                                            : "hover:bg-blue-50 dark:hover:bg-gray-900"
                                            }`}
                                          key={plan._id}
                                        >
                                          {plan.planName} -{" "}
                                          {convertDurationInMonths(plan.duration)}{" "}
                                          - {user?.user?.company?.tenantCurrency}{" "}
                                          {plan.price}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <Label>Membership Expire Date</Label>
                                <Input
                                  {...register("membershipExpireDate")}
                                  type="date"
                                  disabled={userRole === 'Gym Admin'}
                                  value={prevMembershipExpireDate && !isNaN(new Date(prevMembershipExpireDate))
                                    ? new Date(prevMembershipExpireDate).toISOString().split("T")[0]
                                    : ''}
                                  onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    if (!isNaN(date)) {
                                      setPrevMembershipExpireDate(date);
                                    }
                                  }}
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="Payment Details">
                          <div className="p-2 dark:bg-gray-800 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label>Payment Method</Label>
                                <Controller
                                  name="paymentMethod"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...register("paymentMethod")}
                                      className="w-full rounded-sm p-3 dark:bg-gray-900 dark:border-none border dark:text-white border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                      onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                      }
                                    >
                                      <option value="">{`${"Select"}`}</option>
                                      <option value="Mobile Banking">
                                        Mobile Banking
                                      </option>
                                      <option value="Cash">Cash</option>
                                      <option value="Cheque">Cheque</option>
                                      <option value="Card">Card</option>
                                    </select>
                                  )}
                                />
                              </div>

                              {paymentMethod === "Mobile Banking" && (
                                <div>
                                  <Label>Reference Code</Label>
                                  <Input
                                    {...register("referenceCode")}
                                    type="text"
                                    className="rounded-sm disabled:bg-gray-300 py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                  />
                                </div>
                              )}

                              <div>
                                <Label>Discount Amount</Label>
                                <Controller
                                  name="discountAmmount"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      {...register("discountAmmount")}
                                      value={field.value}
                                      onChange={(e) => {
                                        setDiscountAmmount(parseInt(e.target.value || 0));
                                        field.onChange(e);
                                      }}
                                      type="text"
                                      className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                    />
                                  )}
                                />
                              </div>

                              <div>
                                <Label>Discount Reason</Label>
                                <Input
                                  {...register("discountReason")}
                                  type="text"
                                  className="rounded-sm py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                              </div>

                              <div>
                                <Label>Admission Fee</Label>
                                <Input
                                  type="text"
                                  defaultValue={admissionFee}
                                  disabled
                                  className="rounded-sm disabled:bg-gray-300 py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                  placeholder="Admission Fee"
                                />
                              </div>

                              <div>
                                <Label>Final Amount</Label>
                                <Input
                                  {...register('finalAmmount')}
                                  type="text"
                                  disabled
                                  className="rounded-sm disabled:bg-gray-300 py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                              </div>

                              <div>
                                <Label>Paid Amount</Label>
                                <Controller
                                  name="paidAmmount"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      {...register("paidAmmount")}
                                      value={field.value}
                                      onChange={(e) => {
                                        setPaidAmmount(parseInt(e.target.value || Number(0)));
                                        field.onChange(e);
                                      }}
                                      type="text"
                                      className="rounded-sm disabled:bg-gray-300 py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                    />
                                  )}
                                />
                              </div>

                              <div>
                                <Label>Due Amount</Label>
                                <Input
                                  type="text"
                                  {...register('dueAmmount')}
                                  value={dueAmmount}
                                  disabled
                                  className="rounded-sm disabled:bg-gray-300 py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                              </div>

                              <div>
                                <Label>Receipt No</Label>
                                <Input
                                  {...register("receiptNo")}
                                  type="text"
                                  className="rounded-sm disabled:bg-gray-300 py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                />
                              </div>

                              <div>
                                <Label>Reason for Update</Label>
                                <Controller
                                  name="reasonForUpdate"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      {...register("reasonForUpdate")}
                                      className="w-full rounded-sm p-3 dark:bg-gray-900 dark:border-none border dark:text-white border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                    >
                                      <option value="">Select</option>
                                      <option value="Normal Change">
                                        Normal Change
                                      </option>
                                      <option value="Renew">Renew</option>
                                      <option value="Extend">Extend</option>
                                    </select>
                                  )}
                                />
                                {errors.reasonForUpdate && (
                                  <p className="text-sm font-semibold text-red-600">{`${errors.reasonForUpdate.message}`}</p>
                                )}
                              </div>

                              <div>
                                <Label>Remark</Label>
                                <Input
                                  {...register("remark")}
                                  type="text"
                                  className="rounded-sm disabled:bg-gray-300 py-6 dark:bg-gray-900 bg-white dark:border-none focus:outline-none"
                                  placeholder="Remark"
                                />
                              </div>

                              <div>
                                <Label>Action Taker</Label>
                                <Controller
                                  name="actionTaker"
                                  control={control}
                                  render={({ field, fieldState: { error } }) => (
                                    <div>
                                      <select
                                        {...field}
                                        className="w-full rounded-sm p-3 dark:bg-gray-900 dark:border-none border dark:text-white border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                      >
                                        <option value={""}>Select</option>
                                        {Array.isArray(actionTakersDB) &&
                                          actionTakersDB.length >= 1 ? (
                                          actionTakersDB.map((actionTaker) => (
                                            <option
                                              onClick={() =>
                                                setCurrentActionTaker(
                                                  actionTaker?.fullName
                                                )
                                              }
                                              key={actionTaker._id}
                                              value={actionTaker._id}
                                            >
                                              {actionTaker?.fullName}
                                            </option>
                                          ))
                                        ) : (
                                          <option value="">
                                            No staffs registered
                                          </option>
                                        )}
                                      </select>
                                      {error && (
                                        <p className="text-red-500 text-sm">
                                          {error.message}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                />
                                {errors.actionTaker && (
                                  <p className="text-sm font-semibold text-red-600">{`${errors.actionTaker.message}`}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end dark:bg-gray-800 space-x-2 p-2">
                            <Button
                              type="submit"
                              className="rounded-sm px-4 flex items-center justify-center"
                              disabled={isSubmitting}
                              aria-busy={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <RiLoader5Fill className="animate-spin" />
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <FiSave />
                                  <span>Update</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </form>
                  ) : (
                    <Loader />
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
