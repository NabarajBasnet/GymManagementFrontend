"use client";

import { FiSearch } from "react-icons/fi";
import { BiSolidUserCircle } from "react-icons/bi";
import { useFieldAvailabilityCheck } from "@/hooks/useFieldAvailabilityCheck";
import { toast as sonnerToast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { BiSolidUserDetail } from "react-icons/bi";
import { TiBusinessCard } from "react-icons/ti";
import { MdOutlinePayment } from "react-icons/md";
import { BiHomeAlt } from "react-icons/bi";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast as notify } from "react-hot-toast";
import { cn } from "@/lib/utils";

// Import UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NewMemberRegistrationForm = () => {
  const membershipPlans = [
    {
      title: "ADMISSION FEE",
      type: "Admission",
      admissionFee: 1000,
    },
    {
      regularMemberships: [
        {
          option: "Regular",
          type: "Gym",
          gymRegularFees: {
            "1 Month": 4000,
            "3 Months": 10500,
            "6 Months": 18000,
            "12 Months": 30000,
          },
        },
        {
          option: "Regular",
          type: "Gym & Cardio",
          gymCardioRegularFees: {
            "1 Month": 5000,
            "3 Months": 12000,
            "6 Months": 21000,
            "12 Months": 36000,
          },
        },
      ],
      daytimeMemberships: [
        {
          option: "Daytime",
          type: "Gym",
          gymDayFees: {
            "1 Month": 3000,
            "3 Months": 7500,
            "6 Months": 12000,
            "12 Months": 18000,
          },
        },
        {
          option: "Daytime",
          type: "Gym & Cardio",
          gymCardioDayFees: {
            "1 Month": 4000,
            "3 Months": 10500,
            "6 Months": 18000,
            "12 Months": 30000,
          },
        },
      ],
    },
  ];

  const [membershipDuration, setMembershipDuration] = useState("");

  // Members details
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState(false);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState("");
  const [actionTaker, setActionTaker] = useState("");

  // Membership details
  const [membershipOption, setMembershipOption] = useState("");
  const [membershipType, setMembershipType] = useState("");
  const [membershipShift, setMembershipShift] = useState("");

  // Date Detais
  const [membershipDate, setMembershipDate] = useState(new Date());
  const [membershipRenewDate, setMembershipRenewDate] = useState(new Date());
  const [membershipExpireDate, setMembershipExpireDate] = useState(new Date());

  // Payment Details
  const [finalAmmount, setFinalAmmount] = useState("");
  const [discountAmmount, setDiscountAmmount] = useState("");
  const [paidAmmount, setPaidAmmount] = useState("");
  const [dueAmmount, setDueAmmount] = useState("");
  const [planId, setPlanId] = useState("");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  console.log("Selected Plan Details: ", selectedPlanDetails);

  const calculateDueAmmount = () => {
    const due = finalAmmount - paidAmmount;
    setDueAmmount(due);
  };

  useEffect(() => {
    calculateDueAmmount();
  }, [finalAmmount, discountAmmount, paidAmmount]);

  const calculateFinalAmmount = () => {
    let selectedPlan = null;

    membershipPlans.forEach((plan) => {
      if (plan.regularMemberships) {
        plan.regularMemberships.forEach((regular) => {
          if (
            regular.option === membershipOption &&
            regular.type === membershipType
          ) {
            selectedPlan = regular;
          }
        });
      }

      if (plan.daytimeMemberships) {
        plan.daytimeMemberships.forEach((day) => {
          if (day.option === membershipOption && day.type === membershipType) {
            selectedPlan = day;
          }
        });
      }
    });

    if (selectedPlan) {
      let selectedFee = 0;

      if (membershipOption === "Regular" && membershipType === "Gym") {
        selectedFee = selectedPlan.gymRegularFees[membershipDuration];
      } else if (
        membershipOption === "Regular" &&
        membershipType === "Gym & Cardio"
      ) {
        selectedFee = selectedPlan.gymCardioRegularFees[membershipDuration];
      } else if (membershipOption === "Daytime" && membershipType === "Gym") {
        selectedFee = selectedPlan.gymDayFees[membershipDuration];
      } else if (
        membershipOption === "Daytime" &&
        membershipType === "Gym & Cardio"
      ) {
        selectedFee = selectedPlan.gymCardioDayFees[membershipDuration];
      }

      const admissionFee = membershipPlans.find(
        (plan) => plan.type === "Admission"
      ).admissionFee;
      setFinalAmmount(admissionFee + selectedFee - discountAmmount);
    } else {
      setFinalAmmount(0);
    }
  };

  useEffect(() => {
    calculateFinalAmmount();
  }, [membershipOption, membershipType, membershipDuration, discountAmmount]);

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    clearErrors,
    watch,
    control,
  } = useForm();

  const handleMembershipSelection = (duration) => {
    setMembershipDuration(duration);
    const newMembershipExpireDate = new Date(membershipRenewDate);

    switch (duration) {
      case "1 Month":
        newMembershipExpireDate.setMonth(
          newMembershipExpireDate.getMonth() + 1
        );
        break;

      case "3 Months":
        newMembershipExpireDate.setMonth(
          newMembershipExpireDate.getMonth() + 3
        );
        break;

      case "6 Months":
        newMembershipExpireDate.setMonth(
          newMembershipExpireDate.getMonth() + 6
        );
        break;

      case "12 Months":
        newMembershipExpireDate.setFullYear(
          newMembershipExpireDate.getFullYear() + 1
        );
        break;

      default:
        break;
    }
    setMembershipExpireDate(newMembershipExpireDate);
  };

  useEffect(() => {
    handleMembershipSelection(membershipDuration);
  }, [membershipRenewDate]);

  const onRegisterMember = async (data) => {
    console.log("Data: ", data);
    clearErrors();

    let isValid = true;

    if (!gender) {
      setError("gender", { type: "manual", message: "Gender is required" });
      isValid = false;
    }

    if (!status) {
      setError("status", { type: "manual", message: "Status is required" });
      isValid = false;
    }

    if (!membershipOption) {
      setError("membershipOption", {
        type: "manual",
        message: "Membership option is required",
      });
      isValid = false;
    }

    if (!membershipType) {
      setError("membershipType", {
        type: "manual",
        message: "Membership type is required",
      });
      isValid = false;
    }

    if (!membershipShift) {
      setError("membershipShift", {
        type: "manual",
        message: "Membership shift is required",
      });
      isValid = false;
    }

    if (!paymentMethod) {
      setError("paymentMethod", {
        type: "manual",
        message: "Payment method is required",
      });
      isValid = false;
    }

    if (!actionTaker) {
      setError("actionTaker", {
        type: "manual",
        message: "Select action taker",
      });
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const {
        fullName,
        contactNo,
        email,
        dob,
        secondaryContactNo,
        address,

        discountReason,
        discountCode,
        receiptNo,
        referenceCode,
        remark,
      } = data;

      const membersFinalData = {
        fullName,
        contactNo,
        email,
        dob,
        secondaryContactNo,
        gender,
        address,

        status,
        membershipOption,
        membershipType,
        membershipShift,
        membershipDate,
        membershipRenewDate,
        membershipDuration,
        membershipExpireDate,
        paymentMethod,
        discountAmmount,
        discountReason,
        discountCode,
        admissionFee: 1000,
        finalAmmount,
        paidAmmount,
        receiptNo,
        dueAmmount,
        referenceCode,
        remark,
        actionTaker,
      };

      console.log("membersFinalData: ", membersFinalData);

      if (discountAmmount && !discountReason) {
        setError("discountReason", {
          type: "manual",
          message: "Discount reason is required",
        });
      }

      if (!paidAmmount) {
        setError("paidAmmount", {
          type: "manual",
          message: "Paid ammount is required",
        });
      }
      const response = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(membersFinalData),
      });
      const responseBody = await response.json();

      if (response.ok) {
        notify.success(responseBody.message);
        sonnerToast.success("Member registration completed", {
          description: responseBody.message,
        });
        reset();
      } else {
        notify.error(responseBody.message);
        sonnerToast.error("Coultn't register member", {
          description: responseBody.message,
        });
      }

      if (response.status === 400 && type === "fullName") {
        setError("fullName", {
          type: "manual",
          message: "This full name already exists",
        });
      }

      if (response.status === 400) {
        notify.error(responseBody.message);
        sonnerToast.error("Member registration completed", {
          description: responseBody.message,
        });
        setError("userRegistered", {
          type: "manual",
          message: "User exists with this email",
        });
      }
    } catch (error) {
      nofity.error(error.message);
      sonnerToast.error("Internal server error", {
        description: error.message,
      });
      console.log("Error: ", error);
    }
  };

  const getAactionTakers = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/staffsmanagement/actiontakers?actionTakers=${[
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
        sonnerToast.error("Internal server error", {
          description: error.message,
        });
      }
    }
  };

  const { data: actionTakers, isLoading: fetchingActionTakers } = useQuery({
    queryKey: ["actiontakers"],
    queryFn: getAactionTakers,
  });

  const { actionTakersDB } = actionTakers || {};

  // Add new state for step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Function to handle step navigation
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          !errors.fullName &&
          !errors.contactNo &&
          !errors.email &&
          !errors.dob &&
          !errors.secondaryContactNo &&
          !errors.address &&
          !errors.gender
        );
      case 2:
        return (
          !errors.membershipOption &&
          !errors.membershipType &&
          !errors.membershipShift &&
          !errors.membershipDuration
        );
      case 3:
        return !errors.paymentMethod && !errors.paidAmmount;
      default:
        return false;
    }
  };

  // Check if members name already taken

  const fullName = watch("fullName");
  useFieldAvailabilityCheck({
    fieldValue: fullName,
    fieldName: "fullName",
    apiUrl: "http://localhost:3000/api/members/membername-exist",
    onError: setError,
    onSuccess: clearErrors,
  });

  // Check if members phone number already taken
  const contactNo = watch("contactNo");
  useFieldAvailabilityCheck({
    fieldValue: contactNo,
    fieldName: "contactNo",
    apiUrl: "http://localhost:3000/api/members/memberphoneno-exist",
    onError: setError,
    onSuccess: clearErrors,
  });

  // Check if members email already taken
  const email = watch("email");
  useFieldAvailabilityCheck({
    fieldValue: email,
    fieldName: "email",
    apiUrl: "http://localhost:3000/api/members/memberemail-exist",
    onError: setError,
    onSuccess: clearErrors,
  });

  // Get Membership Plans
  const GetMembershipPlans = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/membershipplans/`
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

  // Member search states
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

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

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

  const filteredPlans =
    fetchedPlans?.filter((plan) =>
      plan.planName.toLowerCase().includes(planSearchQuery.toLowerCase())
    ) || [];

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 px-4 py-6">
      <div className="flex items-center gap-2 mb-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1"
              >
                <BiHomeAlt size={18} /> Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-gray-600 dark:text-gray-300">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-gray-600 dark:text-gray-300">
                New Member
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full">
        <h1 className="text-xl font-bold text-gray-600 dark:text-gray-100 my-3">
          Register New Member
        </h1>
      </div>

      <div className="w-full flex items-stretch gap-2">
        <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex-grow">
          <CardHeader>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Step {currentStep} of {totalSteps}:{" "}
              {currentStep === 1
                ? "Personal Information"
                : currentStep === 2
                ? "Membership Details"
                : "Payment Information"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onRegisterMember)}>
            <CardContent>
              <Card className="w-full mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-none">
                <CardContent className="pt-6 pb-4 px-4">
                  {/* Stepper Steps */}
                  <div className="flex items-center justify-between relative w-full">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className="flex flex-col items-center z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center
              ${
                currentStep >= step
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
                        >
                          {step}
                        </div>
                        <span
                          className={`mt-2 text-sm font-medium text-center
              ${
                currentStep >= step
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
                        >
                          {step === 1
                            ? "Personal Info"
                            : step === 2
                            ? "Membership"
                            : "Payment"}
                        </span>
                      </div>
                    ))}

                    {/* Progress Bar */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-0">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{
                          width: `${
                            ((currentStep - 1) / (totalSteps - 1)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs value={`step${currentStep}`} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600">
                  <TabsTrigger
                    value="step1"
                    className={`data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 ${
                      currentStep === 1 ? "bg-white dark:bg-gray-800" : ""
                    }`}
                    onClick={() => setCurrentStep(1)}
                  >
                    <BiSolidUserDetail size={22} className="mr-2" /> Personal
                    Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="step2"
                    className={`data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 ${
                      currentStep === 2 ? "bg-white dark:bg-gray-800" : ""
                    }`}
                    onClick={() => setCurrentStep(2)}
                  >
                    <TiBusinessCard size={22} className="mr-2" /> Membership
                    Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="step3"
                    className={`data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 ${
                      currentStep === 3 ? "bg-white dark:bg-gray-800" : ""
                    }`}
                    onClick={() => setCurrentStep(3)}
                  >
                    <MdOutlinePayment size={22} className="mr-2" /> Payment
                    Information
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="step1">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="w-full flex md:flex-row flex-col items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                      <Card className="w-full lg:w-4/12 py-6 h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-center p-2">
                            <BiSolidUserCircle className="w-32 h-32" />
                          </div>
                          <div className="w-full items-center justify-center">
                            <div className="flex flex-col items-center justify-center my-3 space-y-1">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Status
                              </Label>
                              <Switch
                                id="airplane-mode"
                                checked={status}
                                className="dark:data-[state=checked]:bg-blue-blue-600 dark:data-[state=unchecked]:bg-blue-white"
                                onCheckedChange={setStatus}
                              />
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Select membership status
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="w-full lg:w-8/12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Full Name
                              </Label>
                              <Input
                                {...register("fullName", {
                                  required: "This field is required",
                                })}
                                placeholder="Full Name"
                                className="rounded-md py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              />
                              {errors.fullName && (
                                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                  {errors.fullName.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Contact No
                              </Label>
                              <Input
                                {...register("contactNo", {
                                  required: "This field is required",
                                })}
                                placeholder="Contact Number"
                                className="rounded-md py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              />
                              {errors.contactNo && (
                                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                  {errors.contactNo.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Email Address
                              </Label>
                              <Input
                                {...register("email", {
                                  required: "This field is required",
                                })}
                                placeholder="Email address"
                                className="rounded-md py-6 bg-transparent dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              />
                              {errors.email && (
                                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Date Of Birth
                              </Label>
                              <Input
                                type="date"
                                {...register("dob", {
                                  required: "Date of birth required",
                                })}
                                className="rounded-md py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 
                                  appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.dob && (
                                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                  {errors.dob.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Secondary Contact No
                              </Label>
                              <Input
                                {...register("secondaryContactNo", {
                                  required:
                                    "Enter secondary contact number here!",
                                })}
                                placeholder="Secondary Contact Number"
                                className="rounded-md py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              />
                              {errors.secondaryContactNo && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {errors.secondaryContactNo.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Address
                              </Label>
                              <Input
                                {...register("address", {
                                  required: "Enter address!",
                                })}
                                className="rounded-md py-6 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                placeholder="Address"
                              />
                              {errors.address && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {errors.address.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Gender
                              </Label>
                              <Select
                                onValueChange={(value) => {
                                  setGender(value);
                                  if (value) clearErrors("gender");
                                }}
                              >
                                <SelectTrigger className="w-full py-6 rounded-md bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                  <SelectGroup>
                                    <SelectLabel className="text-gray-700 dark:text-gray-300">
                                      Gender
                                    </SelectLabel>
                                    <SelectItem
                                      value="Male"
                                      className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                    >
                                      Male
                                    </SelectItem>
                                    <SelectItem
                                      value="Female"
                                      className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                    >
                                      Female
                                    </SelectItem>
                                    <SelectItem
                                      value="Other"
                                      className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                    >
                                      Other
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {errors.gender && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {errors.gender.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="step2">
                  {/* Step 2: Membership Information */}
                  {currentStep === 2 && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Membership Option
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                setMembershipOption(value);
                                if (value) clearErrors("membershipOption");
                              }}
                            >
                              <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                <SelectValue placeholder="Select Option" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectGroup>
                                  <SelectLabel className="text-gray-700 dark:text-gray-300">
                                    Membership Option
                                  </SelectLabel>
                                  <SelectItem
                                    value="Regular"
                                    className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                  >
                                    Regular
                                  </SelectItem>
                                  <SelectItem
                                    value="Daytime"
                                    className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                  >
                                    Daytime
                                  </SelectItem>
                                  <SelectItem
                                    value="Temporary"
                                    className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                  >
                                    Temporary
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {errors.membershipOption && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.membershipOption.message}
                              </p>
                            )}
                          </div> */}

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Membership Type
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                setMembershipType(value);
                                if (value) clearErrors("membershipType");
                              }}
                            >
                              <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectGroup className="overflow-y-auto">
                                  <SelectLabel className="text-gray-700 dark:text-gray-300 cursor-pointer">
                                    Select
                                  </SelectLabel>
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
                                    <SelectItem
                                      value={type}
                                      key={index}
                                      className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                    >
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {errors.membershipType && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.membershipType.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Membership Shift
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                setMembershipShift(value);
                                if (value) clearErrors("membershipShift");
                              }}
                            >
                              <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                <SelectValue placeholder="Select Shift" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectGroup>
                                  <SelectLabel className="text-gray-700 dark:text-gray-300">
                                    Membership Shift
                                  </SelectLabel>
                                  {[
                                    "Flexible",
                                    "Daytime",
                                    "Morning",
                                    "Evening",
                                  ].map((shift, index) => (
                                    <SelectItem
                                      key={index}
                                      value={shift}
                                      className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                    >
                                      {shift}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {errors.membershipShift && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.membershipShift.message}
                              </p>
                            )}
                          </div>

                          {/* <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Membership Duration
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                handleMembershipSelection(value);
                                if (value) clearErrors("membershipDuration");
                              }}
                            >
                              <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                <SelectValue placeholder="Select Duration" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectGroup>
                                  <SelectLabel className="text-gray-700 dark:text-gray-300">
                                    Membership Duration
                                  </SelectLabel>
                                  <SelectItem
                                    value="1 Month"
                                    className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                  >
                                    1 Month
                                  </SelectItem>
                                  <SelectItem
                                    value="3 Months"
                                    className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                  >
                                    3 Months
                                  </SelectItem>
                                  <SelectItem
                                    value="6 Months"
                                    className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                  >
                                    6 Months
                                  </SelectItem>
                                  <SelectItem
                                    value="12 Months"
                                    className="cursor-pointer hover:bg-blue-600 text-gray-900 dark:text-gray-100"
                                  >
                                    12 Months
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {errors.membershipDuration && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.membershipDuration.message}
                              </p>
                            )}
                          </div> */}

                          <div className="space-y-3">
                            <Label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
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
                                      value={
                                        selectedPlanName || planSearchQuery
                                      }
                                      onChange={(e) => {
                                        setPlanSearchQuery(e.target.value);
                                        field.onChange(e);
                                        setPlanName("");
                                      }}
                                      onFocus={handleMembershipSearchFocus}
                                      onKeyDown={handleKeyDown}
                                      className="w-full rounded-sm dark:border-none dark:bg-gray-700 py-6 dark:text-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 pl-10"
                                      placeholder="Search membership plan..."
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                      <FiSearch className="h-5 w-5" />
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
                                <div className="absolute w-full bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-600 border-gray-200 rounded-sm shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                                  {filteredPlans.map((plan, index) => (
                                    <div
                                      onClick={() => {
                                        setPlanName(plan.planName);
                                        setPlanSearchQuery(plan.planName);
                                        setPlanId(plan._id);
                                        setSelectedPlanDetails(plan);
                                        setRenderMembershipPlanDropdown(false);
                                      }}
                                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                                        index === highlightedIndex
                                          ? "bg-blue-100 dark:bg-gray-900"
                                          : "hover:bg-blue-50 dark:hover:bg-gray-900"
                                      }`}
                                      key={plan._id}
                                    >
                                      {plan.planName}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Membership Date
                            </Label>
                            <Popover>
                              <PopoverTrigger className="py-6" asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                                    !membershipDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {membershipDate ? (
                                    format(membershipDate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <Calendar
                                  mode="single"
                                  selected={membershipDate}
                                  onSelect={setMembershipDate}
                                  initialFocus
                                  className="bg-white dark:bg-gray-800"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Membership Renew Date
                            </Label>
                            <Popover>
                              <PopoverTrigger className="py-6" asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                                    !membershipRenewDate &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {membershipRenewDate ? (
                                    format(membershipRenewDate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <Calendar
                                  mode="single"
                                  selected={membershipRenewDate}
                                  onSelect={setMembershipRenewDate}
                                  initialFocus
                                  className="bg-white dark:bg-gray-800"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Membership Expire Date
                            </Label>
                            <Popover>
                              <PopoverTrigger className="py-6" asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                                    !membershipExpireDate &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {membershipExpireDate ? (
                                    format(membershipExpireDate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <Calendar
                                  mode="single"
                                  selected={membershipExpireDate}
                                  onSelect={setMembershipExpireDate}
                                  initialFocus
                                  className="bg-white dark:bg-gray-800"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="step3">
                  {/* Step 3: Payment Information */}
                  {currentStep === 3 && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Payment Method
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                setPaymentMethod(value);
                                if (value) clearErrors("paymentMethod");
                              }}
                            >
                              <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                <SelectValue placeholder="Select Method" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectGroup>
                                  <SelectLabel className="text-gray-700 dark:text-gray-300">
                                    Payment Method
                                  </SelectLabel>
                                  <SelectItem
                                    value="Fonepay"
                                    className="text-gray-900 cursor-pointer hover:bg-blue-600 dark:text-gray-100"
                                  >
                                    Fonepay
                                  </SelectItem>
                                  <SelectItem
                                    value="Cash"
                                    className="text-gray-900 cursor-pointer hover:bg-blue-600 dark:text-gray-100"
                                  >
                                    Cash
                                  </SelectItem>
                                  <SelectItem
                                    value="Card"
                                    className="text-gray-900 cursor-pointer hover:bg-blue-600 dark:text-gray-100"
                                  >
                                    Card
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {errors.paymentMethod && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.paymentMethod.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Discount Amount
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              value={discountAmmount}
                              onChange={(e) =>
                                setDiscountAmmount(e.target.value)
                              }
                              type="text"
                              placeholder="Discount Amount"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Discount Reason
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              {...register("discountReason")}
                              onChange={(e) => clearErrors("discountReason")}
                              type="text"
                              placeholder="Discount Reason"
                            />
                            {errors.discountReason && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.discountReason.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Discount Code
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              {...register("discountCode")}
                              type="text"
                              placeholder="Discount Code"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Admission Fee
                            </Label>
                            <Input
                              {...register("admissionFee")}
                              type="text"
                              defaultValue={"1000"}
                              disabled
                              className="py-6 rounded-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
                              placeholder="Admission Fee"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Final Amount
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              value={finalAmmount}
                              disabled
                              placeholder="Final Amount"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Paid Amount
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              value={paidAmmount}
                              onChange={(e) => {
                                setPaidAmmount(e.target.value);
                                if (e.target.value) clearErrors("paidAmmount");
                              }}
                              placeholder="Paid Amount"
                            />
                            {errors.paidAmmount && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.paidAmmount.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Due Amount
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              value={dueAmmount}
                              disabled
                              placeholder="Due Amount"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Receipt No
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              {...register("receiptNo", {
                                required: "Mention receipt no!",
                              })}
                              type="text"
                              placeholder="Receipt No"
                            />
                            {errors.receiptNo && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.receiptNo.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Reference Code
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              {...register("referenceCode")}
                              type="text"
                              placeholder="Reference Code"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Remark
                            </Label>
                            <Input
                              className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              {...register("remark")}
                              type="text"
                              placeholder="Remark"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">
                              Action Taker
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                setActionTaker(value);
                                if (value) clearErrors("actionTaker");
                              }}
                            >
                              <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                <SelectValue placeholder="Select Action Taker" />
                              </SelectTrigger>
                              <SelectContent className="bg-white rounded-sm dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectGroup>
                                  <SelectItem
                                    value="Not Selected"
                                    className="text-gray-900 dark:text-gray-100 cursor-pointer"
                                  >
                                    Select
                                  </SelectItem>
                                  {Array.isArray(actionTakersDB) &&
                                  actionTakersDB.length >= 1 ? (
                                    actionTakersDB.map((actionTaker) => (
                                      <div key={actionTaker._id}>
                                        <SelectItem
                                          value={
                                            actionTaker.fullName ||
                                            "Not Selected"
                                          }
                                          className="hover:bg-blue-600 cursor-pointer text-gray-900 dark:text-gray-100"
                                        >
                                          {actionTaker.fullName}
                                        </SelectItem>
                                      </div>
                                    ))
                                  ) : (
                                    <SelectItem
                                      value="Revive Fitness"
                                      className="text-gray-900 dark:text-gray-100"
                                    >
                                      No staffs registered
                                    </SelectItem>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {errors.actionTaker && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.actionTaker.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between space-x-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  variant="outline"
                  className="border-gray-200 dark:border-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Previous
                </Button>
              )}
              <div className="flex gap-2">
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!validateStep(currentStep)}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-gray-100 dark:border-none disabled:opacity-50"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !validateStep(currentStep)}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-gray-100 dark:border-none disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Register Member"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewMemberRegistrationForm;
