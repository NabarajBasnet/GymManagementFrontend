'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoIosInformationCircleOutline } from "react-icons/io";
import React, { ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useForm, Controller } from 'react-hook-form';
import { MdDone, MdError, MdClose } from "react-icons/md";
import useMember from "@/hooks/Members";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";

const MemberDetails = ({ memberId }) => {
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
    };

    // For rendering states
    const [renderPersonalInformationForm, setRenderPersonalInformationForm] = useState(true);
    const [renderBodyMeasurementsForm, setRenderBodyMeasurementsForm] = useState(false);
    const [renderMembershipInformationForm, setRenderMembershipInformationForm] = useState(true);
    const [renderPaymentDetailForm, setRenderPaymentDetailForm] = useState(true);
    const [renderProfileDetails, setRenderProfileDetails] = useState(false);

    // States
    const queryClient = useQueryClient();
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('')
    const responseResultType = ['Success', 'Failure'];

    const [membershipHoldDate, setMembershipHoldDate] = useState('');
    const [membershipOption, setMembershipOption] = useState('');
    const [membershipType, setMembershipType] = useState('');
    const [membershipDuration, setMembershipDuration] = useState('');
    const [finalAmmount, setFinalAmmount] = useState(0);
    const [discountAmmount, setDiscountAmmount] = useState(0);
    const [dueAmmount, setDueAmmount] = useState(0);
    const [paidAmmount, setPaidAmmount] = useState(0);
    const [membershipRenewDate, setMembershipRenewDate] = useState(new Date());
    const [membershipExpireDate, setMembershipExpireDate] = useState(new Date());

    // Objects 
    const membershipPlans = [
        {
            title: "ADMISSION FEE",
            type: "Admission",
            admissionFee: 1000
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
                        "12 Months": 30000
                    }
                },
                {
                    option: "Regular",
                    type: "Gym & Cardio",
                    gymCardioRegularFees: {
                        "1 Month": 5000,
                        "3 Months": 12000,
                        "6 Months": 21000,
                        "12 Months": 36000
                    }
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
                        "12 Months": 18000
                    }
                },
                {
                    option: "Daytime",
                    type: "Gym & Cardio",
                    gymCardioDayFees: {
                        "1 Month": 4000,
                        "3 Months": 10500,
                        "6 Months": 18000,
                        "12 Months": 30000
                    }
                },
            ]
        }
    ];

    // React hook form
    const { register, reset, handleSubmit, setValue, formState: { errors, isSubmitting }, setError, control } = useForm();

    // Hooks
    const { getSingleUserDetails } = useMember();

    // Get member details
    const { data, isLoading } = useQuery({
        queryKey: ['member', memberId],
        queryFn: () => getSingleUserDetails(memberId),
        enabled: !!memberId,
    });
    const { member, message, qrCode } = data || {};
    console.log("Member: ", member);
    console.log("Qr Code: ", qrCode);
    // Populate Data
    useEffect(() => {
        if (data) {
            reset({
                fullName: member.fullName,
                contactNo: member.contactNo,
                email: member.email,
                dob: member.dob ? new Date(member.dob).toISOString().split("T")[0] : '',
                secondaryContactNo: member.secondaryContactNo,
                gender: member.gender,
                address: member.address,
                status: member.status,
                membershipOption: member.membershipOption,
                membershipType: member.membershipType,
                membershipShift: member.membershipShift,
                membershipDate: member.membershipDate ? new Date(member.membershipDate).toISOString().split("T")[0] : '',
                membershipRenewDate: member.membershipRenewDate ? new Date(member.membershipRenewDate).toISOString().split("T")[0] : '' && setMembershipRenewDate(new Date(member.membershipRenewDate)),
                membershipDuration: member.membershipDuration,
                membershipExpireDate: member.membershipExpireDate ? new Date(member.membershipExpireDate).toISOString().split("T")[0] : "" && setMembershipExpireDate(new Date(member.membershipExpireDate)),
                paymentMethod: member.paymentMethod,
                discountAmmount: member.discountAmmount,
                discountReason: member.discountReason,
                discountCode: member.discountCode,
                paidAmmount: member.paidAmmount,
                dueAmmount: member.dueAmmount,
                receiptNo: member.receiptNo,
                remark: member.remark,
            });
        };

    }, [data, reset]);

    // Function to handle membership calculations
    const handleMembershipInformation = () => {
        // Calculate membership expiration date
        const calculateMembershipExpireDate = () => {
            if (membershipRenewDate && membershipDuration) {
                const newExpireDate = new Date(membershipRenewDate);

                if (isNaN(newExpireDate.getTime())) {
                    return;
                };

                switch (membershipDuration) {
                    case "1 Month":
                        newExpireDate.setMonth(newExpireDate.getMonth() + 1);
                        break;
                    case "3 Months":
                        newExpireDate.setMonth(newExpireDate.getMonth() + 3);
                        break;
                    case "6 Months":
                        newExpireDate.setMonth(newExpireDate.getMonth() + 6);
                        break;
                    case "12 Months":
                        newExpireDate.setFullYear(newExpireDate.getFullYear() + 1);
                        break;
                    default:
                        console.warn("Unhandled membership duration:", membershipDuration);
                        break;
                }
                setMembershipExpireDate(newExpireDate.toISOString().split('T')[0]);
                setValue('membershipExpireDate', newExpireDate.toISOString().split('T')[0]);
            } else {
                console.warn("Membership Renew Date or Duration is missing.");
            }
        };

        // Calculate final amount
        const calculateFinalAmmount = () => {
            let selectedPlan = null;
            membershipPlans.forEach((plan) => {
                if (plan.regularMemberships) {
                    plan.regularMemberships.forEach((regular) => {
                        if (regular.option === membershipOption && regular.type === membershipType) {
                            selectedPlan = regular;
                        }
                    });
                };

                if (plan.daytimeMemberships) {
                    plan.daytimeMemberships.forEach((day) => {
                        if (day.option === membershipOption && day.type === membershipType) {
                            selectedPlan = day;
                        }
                    });
                };
            });

            if (selectedPlan) {
                let selectedFee = 0;

                if (membershipOption === "Regular" && membershipType === "Gym") {
                    selectedFee = selectedPlan.gymRegularFees[membershipDuration];
                } else if (membershipOption === "Regular" && membershipType === "Gym & Cardio") {
                    selectedFee = selectedPlan.gymCardioRegularFees[membershipDuration];
                } else if (membershipOption === "Daytime" && membershipType === "Gym") {
                    selectedFee = selectedPlan.gymDayFees[membershipDuration];
                } else if (membershipOption === "Daytime" && membershipType === "Gym & Cardio") {
                    selectedFee = selectedPlan.gymCardioDayFees[membershipDuration];
                };

                const admissionFee = membershipPlans.find(plan => plan.type === "Admission")?.admissionFee || 0;
                setFinalAmmount(admissionFee + selectedFee - (discountAmmount || 0));
                setValue('finalAmmount', admissionFee + selectedFee - (discountAmmount || 0));

            } else {
                setFinalAmmount(0);
                setValue('finalAmmount', 0); 0
            };
        };

        // Call sub-functions
        calculateMembershipExpireDate();
        calculateFinalAmmount();
    };

    // Update due amount in a separate effect to ensure finalAmount is up-to-date
    useEffect(() => {
        setDueAmmount(finalAmmount - paidAmmount);
        setValue('dueAmmount', finalAmmount - paidAmmount);
    }, [finalAmmount, paidAmmount]);

    // Main useEffect to handle changes in membership details
    useEffect(() => {
        handleMembershipInformation();
    }, [membershipOption, membershipType, membershipRenewDate, membershipDuration]);

    // Functions
    // Update member details
    const updateMemberDetails = async (data) => {

        try {
            const response = await fetch(`http://localhost:3000/api/members/${memberId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(data)
            })
            const responseBody = await response.json();
            if (response.status === 400 || response.status === 402 || response.status === 404 || response.status === 500) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
            }
            else {
                if (response.status === 200) {
                    setResponseType(responseResultType[0]);
                    setToast(true);
                    setTimeout(() => {
                        setToast(false)
                    }, 10000);
                    setSuccessMessage({
                        icon: MdError,
                        message: responseBody.message || 'Unauthorized action'
                    })
                }
            }
        } catch (error) {
            console.log('Error: ', error);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || error
            });
        }
    };

    // Hold membership
    const holdMembership = async () => {

        const membershipHoldData = { membershipHoldDate, status: 'OnHold' };

        try {
            const response = await fetch(`http://localhost:3000/api/members/hold-membership/${memberId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membershipHoldData)
            });
            const responseBody = await response.json();
            if (response.status !== 200) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
            }
            else {
                if (response.status === 200) {
                    setResponseType(responseResultType[0]);
                    setToast(true);
                    setTimeout(() => {
                        setToast(false)
                    }, 10000);
                    setSuccessMessage({
                        icon: MdError,
                        message: responseBody.message || 'Unauthorized action'
                    })
                }
                queryClient.invalidateQueries(['members']);
            }

        } catch (error) {
            console.log("Error: ", error);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: "An unexpected error occurred."
            })
        };
    };

    const getAactionTakers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement/actiontakers?actionTakers=${['Gym Admin', 'Super Admin', 'Operational Manager', 'HR Manager', 'CEO', 'Intern', 'Floor Trainer', 'Personal Trainer']}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            if (error) {
                alert("Error: ", error)
            }
        };
    };

    const { data: actionTakers, isLoading: fetchingActionTakers } = useQuery({
        queryKey: ['actiontakers'],
        queryFn: getAactionTakers
    });

    const { actionTakersDB } = actionTakers || {};

    return (
        <div className="w-full p-1 bg-gray-100">
            <div className='w-full p-6' onClick={() => setToast(false)}>

                {toast && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
                            onClick={() => setToast(false)}
                        ></div>

                        <div className="fixed top-4 right-4 z-50 animate-slide-in">
                            <div className={`relative flex items-start gap-3 px-4 py-3 bg-white shadow-lg border-l-[5px] rounded-xl
                            transition-all duration-300 ease-in-out w-80
                            ${responseType === 'Success' ? 'border-emerald-500' : 'border-rose-500'}`}>

                                <div className={`flex items-center justify-center p-2 rounded-full 
                                    ${responseType === 'Success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                    {responseType === 'Success' ? (
                                        <MdDone className="text-xl text-emerald-600" />
                                    ) : (
                                        <MdError className="text-xl text-rose-600" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-base font-semibold mb-1
                                    ${responseType === 'Success' ? 'text-emerald-800' : 'text-rose-800'}`}>
                                        {responseType === 'Success' ? "Request successful!" : "Action required"}
                                    </h3>

                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {responseType === 'Success'
                                            ? (<>{`${successMessage.message}`}</>)
                                            : (<>{`${errorMessage.message}`}</>)
                                        }
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        {responseType === 'Success' ? (
                                            <button className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline">
                                                Done
                                            </button>
                                        ) : (
                                            <button className="text-xs font-medium text-rose-700 hover:text-rose-900 underline">
                                                Retry Now
                                            </button>
                                        )}
                                        <span className="text-gray-400">|</span>
                                        <button
                                            className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
                                            onClick={() => setToast(false)}>
                                            Dismiss
                                        </button>
                                    </div>
                                </div>

                                <MdClose
                                    onClick={() => setToast(false)}
                                    className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition mt-0.5"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className='w-full'>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
                                <BreadcrumbLink href="/dashboard">Member</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {data ? `${member.fullName || 'Member Name'}` : `${''}`}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold my-1">Membership Details</h1>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center bg-blue-600 py-2 my-2 w-full cursor-pointer" onClick={() => setRenderProfileDetails(!renderProfileDetails)}>
                <h1 className="mx-4 text-white font-semibold">Profile Details</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IoIosInformationCircleOutline className="text-white mx-4 cursor-pointer h-5 w-5" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click here to view members profile details.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {renderProfileDetails && (
                <div className=" bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="grid md:grid-cols-3 gap-6 p-6">
                                {/* Image Upload Section */}
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg overflow-hidden">
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold text-gray-800">Member Profile</h2>

                                            {imagePreview ? (
                                                <div className="relative group">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-80 object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                                                    />
                                                    <button
                                                        onClick={removeImage}
                                                        className="absolute top-3 right-3 p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                                                        aria-label="Remove image"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 transition-colors duration-300 hover:border-blue-400 cursor-pointer">
                                                    <div className="flex flex-col items-center justify-center space-y-3">
                                                        <div className="p-3 bg-blue-50 rounded-full">
                                                            <ImagePlus className="w-8 h-8 text-blue-500" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                                    </div>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                id="imageInput"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />

                                            <label
                                                htmlFor="imageInput"
                                                className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                            >
                                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Section */}
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Membership QR</h2>
                                    <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <img
                                            src={qrCode}
                                            alt="Membership QR Code"
                                            className="w-64 h-64 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Membership Controls & Info */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Membership Status</h2>

                                    <div className="flex gap-4">
                                        <Button
                                            disabled
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                                        >
                                            Start
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                                >
                                                    Hold
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="max-w-lg p-6 rounded-xl shadow-xl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-2xl font-bold">Confirm Membership Hold</AlertDialogTitle>
                                                    <AlertDialogDescription className="space-y-4">
                                                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4">
                                                            <p className="text-red-600 font-semibold">Note: Stop/Start Date will be set to today by default</p>
                                                        </div>
                                                        <p className="text-gray-600">To override the default Stop Date, please select a date below:</p>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full flex items-center justify-between text-left p-4 border rounded-lg hover:border-blue-400 transition-colors duration-300"
                                                                >
                                                                    <CalendarIcon className="text-blue-500" />
                                                                    <span>{membershipHoldDate ? format(membershipHoldDate, "PPP") : "Select Hold Date"}</span>
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={membershipHoldDate}
                                                                    onSelect={setMembershipHoldDate}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="flex justify-end gap-3 mt-6">
                                                    <AlertDialogCancel className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => holdMembership()}
                                                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
                                                    >
                                                        Confirm Hold
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                            <p className="text-sm text-blue-600 font-medium mb-1">Hold Date</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {data && data.member && data.member.membershipHoldDate
                                                    ? new Date(data.member.membershipHoldDate).toISOString().split("T")[0]
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                            <p className="text-sm text-purple-600 font-medium mb-1">Paused Days</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {data ? member.pausedDays : ''}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                                            <p className="text-sm text-green-600 font-medium mb-1">Remaining Days</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {data ? member.remainingDaysOfMembership : ''}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                                            <p className="text-sm text-amber-600 font-medium mb-1">Resumed Date</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {data && data.member && data.member.resumedDate
                                                    ? new Date(data.member.resumedDate).toISOString().split("T")[0]
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            <div className="w-full flex justify-center">
                <div className="w-full">
                    <div className="w-full">
                        {
                            data && (
                                <div className="w-full">
                                    {
                                        data ? (
                                            <form className="w-full" onSubmit={handleSubmit(updateMemberDetails)}>
                                                <div className="bg-blue-600 py-2 my-2 w-full cursor-pointer" onClick={() => setRenderPersonalInformationForm(!renderPersonalInformationForm)}>
                                                    <h1 className="mx-4 text-white font-semibold">Personal Information</h1>
                                                </div>
                                                {
                                                    renderPersonalInformationForm ? (
                                                        <div className="p-2 bg-white">
                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                                <div>
                                                                    <Label>Full Name</Label>
                                                                    <Input
                                                                        {...register("fullName")}
                                                                        className='rounded-md focus:outline-none'
                                                                        type='text'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Contact No</Label>
                                                                    <Input
                                                                        {...register("contactNo")}
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Email Address</Label>
                                                                    <Input
                                                                        {...register("email")}
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Date Of Birth</Label>
                                                                    <Input
                                                                        type='date'
                                                                        {...register("dob")}
                                                                        className='rounded-md focus:outline-none cursor-pointer'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Secondary Contact No</Label>
                                                                    <Input
                                                                        {...register("secondaryContactNo")}
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Gender</Label>
                                                                    <Controller
                                                                        name="gender"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <select
                                                                                {...field} {...register('gender')}
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
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
                                                                        {...register('address')}
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Status</Label>
                                                                    <Controller
                                                                        name="status"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <select
                                                                                {...field}
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="Active" className="text-white bg-green-600">Active</option>
                                                                                <option value="Inactive" className="text-white bg-red-600">Inactive</option>
                                                                                <option value="OnHold" className="text-white bg-yellow-500">OnHold</option>
                                                                            </select>
                                                                        )}
                                                                    />
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='ease-in-out duration-700'></div>
                                                    )
                                                }

                                                <div className="bg-blue-600 py-2 my-2 w-full cursor-pointer" onClick={() => setRenderBodyMeasurementsForm(!renderBodyMeasurementsForm)}>
                                                    <h1 className="mx-4 text-white font-semibold">Body Measurements</h1>
                                                </div>
                                                {
                                                    renderBodyMeasurementsForm ? (
                                                        <div className="p-2 bg-white ease-in-out duration-700">
                                                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                                                <div>
                                                                    <Label>Date</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('bodyMeasuredate', {
                                                                        })
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Date'
                                                                        type='date'
                                                                    />
                                                                    {errors.bodyMeasuredate && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.bodyMeasuredate.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Weight</Label>
                                                                    <Input
                                                                        {

                                                                        ...register('weight', {
                                                                            required: {
                                                                                value: true,
                                                                                message: "Enter client weight!"
                                                                            }
                                                                        })
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Weight'
                                                                    />
                                                                    {errors.weight && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.weight.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Height</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('height', {
                                                                        })
                                                                        }
                                                                        onChange={() => clearErrors('userRegistered')}
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Enter height'
                                                                    />
                                                                    {errors.height && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.height.message}`}</p>
                                                                    )}
                                                                    {errors.userRegistered && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.userRegistered.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Upper Arm</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('upperArm')
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Upper Arm Size'
                                                                    />
                                                                    {errors.upperArm && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.upperArm.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Fore Arm</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('foreArm', {
                                                                        })
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Fore Arm Size'
                                                                    />
                                                                    {errors.foreArm && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.foreArm.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Chest</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('chest', {
                                                                        })
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Chest Size'
                                                                    />
                                                                    {errors.chest && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.chest.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Waist</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('waist', {
                                                                        })
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Waist Size'
                                                                    />
                                                                    {errors.waist && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.waist.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Thigh</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('thigh', {
                                                                        })
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Thigh Size'
                                                                    />
                                                                    {errors.thigh && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.thigh.message}`}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Calf</Label>
                                                                    <Input
                                                                        {
                                                                        ...register('calf', {
                                                                        })
                                                                        }
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Calf Size'
                                                                    />
                                                                    {errors.calf && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.calf.message}`}</p>
                                                                    )}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='ease-in-out duration-700'></div>
                                                    )
                                                }

                                                <div className="bg-blue-600 py-2 my-2 w-full cursor-pointer" onClick={() => setRenderMembershipInformationForm(!renderMembershipInformationForm)}>
                                                    <h1 className="mx-4 text-white font-semibold">Membership Information</h1>
                                                </div>
                                                {
                                                    renderMembershipInformationForm ? (
                                                        <div className="p-2 bg-white">
                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                                                                <div>
                                                                    <Label>Membership Option</Label>
                                                                    <Controller
                                                                        name="membershipOption"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <select
                                                                                {...field}
                                                                                value={field.value}
                                                                                onChange={(e) => {
                                                                                    setMembershipOption(e.target.value);
                                                                                    field.onChange(e);
                                                                                }}
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="Regular">Regular</option>
                                                                                <option value="Daytime">Daytime</option>
                                                                                <option value="Temporary">Temporary</option>
                                                                            </select>
                                                                        )}
                                                                    />
                                                                </div>

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
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="Gym">Gym</option>
                                                                                <option value="Gym & Cardio">Gym & Cardio</option>
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
                                                                                {...field} {...register('membershipShift')}
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="Morning">Morning</option>
                                                                                <option value="Day">Day</option>
                                                                                <option value="Evening">Evening</option>
                                                                            </select>
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Membership Start Date</Label>
                                                                    <Input
                                                                        {...register("membershipDate")}
                                                                        type='date'
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
                                                                                {...register('membershipRenewDate')}
                                                                                type='date'
                                                                                value={field.value}
                                                                                onChange={(e) => {
                                                                                    setMembershipRenewDate(e.target.value);
                                                                                    field.onChange(e);
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Membership Duration</Label>
                                                                    <Controller
                                                                        name="membershipDuration"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <select
                                                                                {...field}
                                                                                value={field.value}
                                                                                onChange={(e) => {
                                                                                    setMembershipDuration(e.target.value);
                                                                                    field.onChange(e);
                                                                                }}
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="1 Month">1 Month</option>
                                                                                <option value="3 Months">3 Months</option>
                                                                                <option value="6 Months">6 Months</option>
                                                                                <option value="12 Months">12 Months</option>
                                                                            </select>
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Membership Expire Date</Label>
                                                                    <Controller
                                                                        name="membershipExpireDate"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Input
                                                                                {...field}
                                                                                {...register('membershipExpireDate')}
                                                                                type='date'
                                                                                value={field.value}
                                                                                onChange={(e) => {
                                                                                    setMembershipExpireDate(e.target.value);
                                                                                    field.onChange(e);
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>


                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='ease-in-out duration-700'></div>
                                                    )
                                                }

                                                <div className="bg-blue-600 py-2 my-2 w-full cursor-pointer" onClick={() => setRenderPaymentDetailForm(!renderPaymentDetailForm)}>
                                                    <h1 className="mx-4 text-white font-semibold">Payment Details</h1>
                                                </div>
                                                {
                                                    renderPaymentDetailForm ? (
                                                        <div className="p-2 bg-white">
                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                                <div>
                                                                    <Label>Payment Method</Label>
                                                                    <Controller
                                                                        name="paymentMethod"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <select
                                                                                {...field} {...register('paymentMethod')}
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="Fonepay">Fonepay</option>
                                                                                <option value="Cash">Cash</option>
                                                                                <option value="Card">Card</option>
                                                                            </select>
                                                                        )}
                                                                    />
                                                                </div>

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
                                                                                    setDiscountAmmount(e.target.value);
                                                                                    field.onChange(e);
                                                                                }}
                                                                                type='text'
                                                                                className='rounded-md focus:outline-none'
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Discount Reason</Label>
                                                                    <Input
                                                                        {...register('discountReason')}
                                                                        type='text'
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Discount Code</Label>
                                                                    <Input
                                                                        {...register('discountCode')}
                                                                        type='text'
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Admission Fee</Label>
                                                                    <Input
                                                                        type='text'
                                                                        defaultValue={'1000'}
                                                                        disabled
                                                                        className='rounded-md disabled:bg-gray-300 text-black focus:outline-none'
                                                                        placeholder='Admission Fee'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Final Amount</Label>
                                                                    <Input
                                                                        {...register('finalAmmount')}
                                                                        type='text'
                                                                        disabled
                                                                        className='rounded-md disabled:bg-gray-300 text-black focus:outline-none'
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
                                                                                    setPaidAmmount(e.target.value);
                                                                                    field.onChange(e);
                                                                                }}
                                                                                type='text'
                                                                                className='rounded-md focus:outline-none'
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Due Amount</Label>
                                                                    <Input
                                                                        {...register('dueAmmount')}
                                                                        type='text'
                                                                        disabled
                                                                        className='rounded-md disabled:bg-gray-300 text-black focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Receipt No</Label>
                                                                    <Input
                                                                        {...register('receiptNo')}
                                                                        type='text'
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Reference Code</Label>
                                                                    <Input
                                                                        {...register('referenceCode')}
                                                                        type='text'
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label>Reason for Update</Label>
                                                                    <Controller
                                                                        name="reasonForUpdate"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <select
                                                                                {...field} {...register('reasonForUpdate')}
                                                                                className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option value="Normal Change">Normal Change</option>
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
                                                                        {...register('remark')}
                                                                        type='text'
                                                                        className='rounded-md focus:outline-none'
                                                                        placeholder='Remark'
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
                                                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring focus:ring-blue-600"
                                                                                >
                                                                                    <option value={''}>
                                                                                        Select
                                                                                    </option>
                                                                                    {Array.isArray(actionTakersDB) && actionTakersDB.length >= 1 ? (
                                                                                        actionTakersDB.map((actionTaker) => (
                                                                                            <option key={actionTaker._id} value={actionTaker.fullName}>
                                                                                                {actionTaker.fullName}
                                                                                            </option>
                                                                                        ))
                                                                                    ) : (
                                                                                        <option value="">No staffs registered</option>
                                                                                    )}
                                                                                </select>
                                                                                {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                    {errors.actionTaker && (
                                                                        <p className="text-sm font-semibold text-red-600">{`${errors.actionTaker.message}`}</p>
                                                                    )}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className=' ease-in-out duration-700'></div>
                                                    )
                                                }

                                                <div className="flex items-center space-x-2 p-2">
                                                    <Button type='submit' className='rounded-md'>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <Loader />
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MemberDetails;
