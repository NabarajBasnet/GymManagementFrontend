'use client'

import { toast as notify } from 'react-hot-toast';
import '../../globals.css';
import { MdDone, MdError, MdClose } from "react-icons/md";
import { ImagePlus, X } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query";

const NewMemberRegistrationForm = () => {
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

    const [toast, setToast] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [signUpAlert, setSignUpAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];
    const [membershipDuration, setMembershipDuration] = useState('');

    // Members details
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');

    // Payment Details
    const [paymentMethod, setPaymentMethod] = useState('');
    const [actionTaker, setActionTaker] = useState('');

    // Membership details
    const [membershipOption, setMembershipOption] = useState('');
    const [membershipType, setMembershipType] = useState('');
    const [membershipShift, setMembershipShift] = useState('');

    // Date Detais
    const [dob, setDob] = useState(new Date());
    const [membershipDate, setMembershipDate] = useState(new Date());
    const [membershipRenewDate, setMembershipRenewDate] = useState(new Date());
    const [membershipExpireDate, setMembershipExpireDate] = useState(new Date());

    // Payment Details
    const [finalAmmount, setFinalAmmount] = useState('');
    const [discountAmmount, setDiscountAmmount] = useState('');
    const [paidAmmount, setPaidAmmount] = useState('');
    const [dueAmmount, setDueAmmount] = useState('');

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
                    if (regular.option === membershipOption && regular.type === membershipType) {
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
            } else if (membershipOption === "Regular" && membershipType === "Gym & Cardio") {
                selectedFee = selectedPlan.gymCardioRegularFees[membershipDuration];
            } else if (membershipOption === "Daytime" && membershipType === "Gym") {
                selectedFee = selectedPlan.gymDayFees[membershipDuration];
            } else if (membershipOption === "Daytime" && membershipType === "Gym & Cardio") {
                selectedFee = selectedPlan.gymCardioDayFees[membershipDuration];
            }

            const admissionFee = membershipPlans.find(plan => plan.type === "Admission").admissionFee;
            setFinalAmmount(admissionFee + selectedFee - discountAmmount);
        } else {
            setFinalAmmount(0);
        }
    };

    useEffect(() => {
        calculateFinalAmmount()
    }, [membershipOption, membershipType, membershipDuration, discountAmmount]);

    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
        clearErrors
    } = useForm();

    const handleMembershipSelection = (duration) => {
        setMembershipDuration(duration);
        const newMembershipExpireDate = new Date(membershipRenewDate)

        switch (duration) {
            case "1 Month":
                newMembershipExpireDate.setMonth(newMembershipExpireDate.getMonth() + 1);
                break;

            case "3 Months":
                newMembershipExpireDate.setMonth(newMembershipExpireDate.getMonth() + 3);
                break;

            case "6 Months":
                newMembershipExpireDate.setMonth(newMembershipExpireDate.getMonth() + 6);
                break;

            case "12 Months":
                newMembershipExpireDate.setFullYear(newMembershipExpireDate.getFullYear() + 1);
                break;

            default:
                break;
        }
        setMembershipExpireDate(newMembershipExpireDate);
    };

    useEffect(() => {
        handleMembershipSelection(membershipDuration);
    }, [membershipRenewDate])

    const onRegisterMember = async (data) => {

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
            setError("membershipOption", { type: "manual", message: "Membership option is required" });
            isValid = false;
        }

        if (!membershipType) {
            setError("membershipType", { type: "manual", message: "Membership type is required" });
            isValid = false;
        }

        if (!membershipShift) {
            setError("membershipShift", { type: "manual", message: "Membership shift is required" });
            isValid = false;
        }

        if (!paymentMethod) {
            setError("paymentMethod", { type: "manual", message: "Payment method is required" });
            isValid = false;
        }

        if (!actionTaker) {
            setError("actionTaker", { type: "manual", message: "Select action taker" });
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

                bodyMeasuredate,
                weight,
                height,
                upperArm,
                foreArm,
                chest,
                waist,
                thigh,
                calf,

                discountReason,
                discountCode,
                receiptNo,
                referenceCode,
                remark
            } = data;

            const membersFinalData = {
                fullName,
                contactNo,
                email,
                dob,
                secondaryContactNo,
                gender,
                address,

                bodyMeasuredate,
                weight,
                height,
                upperArm,
                foreArm,
                chest,
                waist,
                thigh,
                calf,

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
                actionTaker
            };

            if (discountAmmount && !discountReason) {
                setError(
                    'discountReason', {
                    type: 'manual',
                    message: "Discount reason is required"
                }
                )
            };

            if (!paidAmmount) {
                setError(
                    'paidAmmount', {
                    type: 'manual',
                    message: "Paid ammount is required"
                }
                )
            }
            const response = await fetch('http://88.198.115.156:3000/api/members', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membersFinalData)
            })
            const responseBody = await response.json();

            if (response.status === 400 && type === 'fullName') {
                setError('fullName', {
                    type: 'manual',
                    message: 'This full name already exists',
                });
            };

            if (response.status === 400) {
                notify.error(responseBody.message);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 7000);
                setResponseMessage(responseBody.message);
                setError(
                    'userRegistered', {
                    type: "manual",
                    message: "User exists with this email"
                }
                )
                setResponseMessage(responseBody.message);
                setResponseType(responseResultType[1]);
                setSignUpAlert(true);
                setTimeout(() => {
                    setSignUpAlert(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
            }

            if (response.ok) {
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 7000);
                setResponseMessage(responseBody.message);
                setResponseType(responseResultType[0]);
                setSignUpAlert(true);
                setTimeout(() => {
                    setSignUpAlert(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                });
                reset();
            };

        } catch (error) {
            setResponseType(responseResultType[1]);
            setSignUpAlert(true);
            setTimeout(() => {
                setSignUpAlert(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: responseBody.message || 'Unauthorized action'
            });
            console.log('Error: ', error);
        }
    };

    const getAactionTakers = async () => {
        try {
            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement/actiontakers?actionTakers=${['Gym Admin', 'Super Admin', 'Operational Manager', 'HR Manager', 'CEO', 'Intern', 'Floor Trainer', 'Personal Trainer']}`);
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
        <div className="w-full p-1" onClick={() => {
            setToast(false);
            setSignUpAlert(false);
        }}>
            <div className='w-full p-6' onClick={() => {
                setToast(false);
                setSignUpAlert(false);
            }}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className='font-medium text-gray-600'>Home</BreadcrumbLink>
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
                            <BreadcrumbLink className='font-medium text-gray-600'>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-medium text-gray-600'>New Member</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold text-gray-600 mt-3">Register New Member</h1>
            </div>

            {signUpAlert && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
                        onClick={() => setSignUpAlert(false)}
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
                                    {responseType === 'Success' ? "Successfully sent!" : "Action required"}
                                </h3>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {
                                        responseType === 'Success' ?
                                            (
                                                <p>
                                                    {`${successMessage.message}`}
                                                </p>
                                            ) : (
                                                <p>
                                                    {`${errorMessage.message}`}
                                                </p>
                                            )
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
                                        onClick={() => setSignUpAlert(false)}>
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            <MdClose
                                onClick={() => setSignUpAlert(false)}
                                className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition mt-0.5"
                            />
                        </div>
                    </div>
                </>
            )}
            {/* 
            <div className="flex justify-between items-center bg-blue-600 py-2 w-full cursor-pointer" onClick={() => setRenderProfileDetails(!renderProfileDetails)}>
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
            </div> */}

            {renderProfileDetails && (
                <div className=" bg-gray-50">
                    <div className="max-w-full mx-4">
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
                                                        className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
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
                                                        <p className="text-sm font-medium text-gray-700">This feature will available soon.</p>
                                                        <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
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

                                            {imagePreview ? (
                                                <Button
                                                    onClick={uploadMemberImage}
                                                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                                >
                                                    {imageUloading ? "Uploading..." : "Upload Image"}
                                                </Button>
                                            ) : (
                                                <label
                                                    htmlFor="imageInput"
                                                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                                >
                                                    Select Image
                                                </label>
                                            )}

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
                    <div className="w-full px-4">
                        <form onSubmit={handleSubmit(onRegisterMember)} className="w-full">
                            <div className="bg-blue-50 border rounded-md py-2 my-2 w-full cursor-pointer" onClick={() => setRenderPersonalInformationForm(!renderPersonalInformationForm)}>
                                <h1 className="mx-4 text-blue-600 font-semibold">Personal Information</h1>
                            </div>
                            {
                                renderPersonalInformationForm ? (
                                    <div className="p-2 bg-white ease-in-out duration-700">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <Label>Member Full Name</Label>
                                                <Input
                                                    {
                                                    ...register('fullName', {
                                                        required: {
                                                            value: true,
                                                            message: "Enter member's full name here!"
                                                        }
                                                    })
                                                    }
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Full Name'
                                                />
                                                {errors.fullName && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.fullName.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Contact No</Label>
                                                <Input
                                                    {
                                                    ...register('contactNo', {
                                                        required: {
                                                            value: true,
                                                            message: "Enter contact number here!"
                                                        }
                                                    })
                                                    }
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Contact Number'
                                                />
                                                {errors.contactNo && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.contactNo.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Email Address</Label>
                                                <Input
                                                    {
                                                    ...register('email', {
                                                        required: {
                                                            value: true,
                                                            message: "Email address is required!"
                                                        }
                                                    })
                                                    }
                                                    onChange={() => clearErrors('userRegistered')}
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Email Address'
                                                />
                                                {errors.email && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.email.message}`}</p>
                                                )}
                                                {errors.userRegistered && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.userRegistered.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Date Of Birth</Label>
                                                <Input
                                                    {
                                                    ...register('dob')
                                                    }
                                                    type='date'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Membership Expire Date'
                                                />
                                                {errors.dob && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.dob.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Secondary Contact No</Label>
                                                <Input
                                                    {
                                                    ...register('secondaryContactNo', {
                                                        required: {
                                                            value: true,
                                                            message: "Enter secondary contact number here!"
                                                        }
                                                    })
                                                    }
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Secondary Contact Number'
                                                />
                                                {errors.secondaryContactNo && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.secondaryContactNo.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Gender</Label>
                                                <Select onValueChange={(value) => {
                                                    setGender(value);
                                                    if (value) {
                                                        clearErrors("gender");
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Gender</SelectLabel>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.gender && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.gender.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Address</Label>
                                                <Input
                                                    {
                                                    ...register('address', {
                                                        required: {
                                                            value: true,
                                                            message: "Enter address!"
                                                        }
                                                    })
                                                    }
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Address'
                                                />
                                                {errors.address && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.address.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Status</Label>
                                                <Select onValueChange={(value) => {
                                                    setStatus(value);
                                                    if (value) {
                                                        clearErrors('status')
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Status</SelectLabel>
                                                            <SelectItem value="Active" className='bg-green-600'>Active</SelectItem>
                                                            <SelectItem value="Inactive" className='bg-red-600'>Inactive</SelectItem>
                                                            <SelectItem value="OnHold" className='bg-yellow-400'>Hold</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.status.message}`}</p>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <div className='ease-in-out duration-700'></div>
                                )
                            }

                            <div className="bg-blue-50 border rounded-md py-2 my-2 w-full cursor-pointer" onClick={() => setRenderMembershipInformationForm(!renderMembershipInformationForm)}>
                                <h1 className="mx-4 text-blue-600 font-semibold">Membership Information</h1>
                            </div>
                            {
                                renderMembershipInformationForm ? (
                                    <div className="p-2 bg-white ease-in-out duration-700">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                                            <div>
                                                <Label>Membership Option</Label>
                                                <Select onValueChange={(value) => {
                                                    setMembershipOption(value);
                                                    if (value) {
                                                        clearErrors('membershipOption')
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Membership Option" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Membership Option</SelectLabel>
                                                            <SelectItem value="Regular">Regular</SelectItem>
                                                            <SelectItem value="Daytime">Daytime</SelectItem>
                                                            <SelectItem value="Temporary">Temporary</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.membershipOption && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.membershipOption.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Membership Type</Label>
                                                <Select onValueChange={(value) => {
                                                    setMembershipType(value);
                                                    if (value) {
                                                        clearErrors('membershipType')
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Membership Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Membership Type</SelectLabel>
                                                            <SelectItem value="Gym">Gym</SelectItem>
                                                            <SelectItem value="Gym & Cardio">Gym & Cardio</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.membershipType && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.membershipType.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Membership Shift</Label>
                                                <Select onValueChange={(value) => {
                                                    setMembershipShift(value);
                                                    if (value) {
                                                        clearErrors('membershipShift')
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Membership Shift" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Membership Shift</SelectLabel>
                                                            <SelectItem value="Morning">Morning</SelectItem>
                                                            <SelectItem value="Day">Day</SelectItem>
                                                            <SelectItem value="Evening">Evening</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.membershipShift && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.membershipShift.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Membership Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !membershipDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon />
                                                            {membershipDate ? format(membershipDate, "PPP") : <span>Membership Date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={membershipDate}
                                                            onSelect={setMembershipDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {errors.membershipDate && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.membershipDate.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Membership Renew Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !membershipRenewDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon />
                                                            {membershipRenewDate ? format(membershipRenewDate, "PPP") : <span>Membership Renew Date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={membershipRenewDate}
                                                            onSelect={setMembershipRenewDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {errors.membershipRenewDate && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.membershipRenewDate.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Membership Duration</Label>
                                                <Select onValueChange={(value) => {
                                                    handleMembershipSelection(value);
                                                    if (value) {
                                                        clearErrors('membershipDuration')
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Membership Duration" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Membership Duration</SelectLabel>
                                                            <SelectItem value="1 Month">1 Month</SelectItem>
                                                            <SelectItem value="3 Months">3 Months</SelectItem>
                                                            <SelectItem value="6 Months">6 Months</SelectItem>
                                                            <SelectItem value="12 Months">12 Months</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.membershipDuration && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.membershipDuration.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Membership Expire Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !membershipExpireDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon />
                                                            {membershipExpireDate ? format(membershipExpireDate, "PPP") : <span>Membership Expire Date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={membershipExpireDate}
                                                            onSelect={setMembershipExpireDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {errors.membershipExpireDate && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.membershipExpireDate.message}`}</p>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <div className='ease-in-out duration-700'></div>
                                )
                            }

                            <div className="bg-blue-50 border rounded-md py-2 my-2 w-full cursor-pointer" onClick={() => setRenderPaymentDetailForm(!renderPaymentDetailForm)}>
                                <h1 className="mx-4 text-blue-600 font-semibold">Payment Details</h1>
                            </div>
                            {
                                renderPaymentDetailForm ? (
                                    <div className="p-2 bg-white  ease-in-out duration-700">
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-4 gap-3 ease-in-out duration-700">
                                            <div>
                                                <Label>Payment Method</Label>
                                                <Select onValueChange={(value) => {
                                                    setPaymentMethod(value);
                                                    if (value) {
                                                        clearErrors('paymentMethod')
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Payment Method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Payment Method</SelectLabel>
                                                            <SelectItem value="Fonepay">Fonepay</SelectItem>
                                                            <SelectItem value="Cash">Cash</SelectItem>
                                                            <SelectItem value="Card">Card</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.paymentMethod && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.paymentMethod.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Discount Amount</Label>
                                                <Input
                                                    value={discountAmmount}
                                                    onChange={(e) => setDiscountAmmount(e.target.value)}
                                                    type='text'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Discount Ammount'
                                                />
                                            </div>

                                            <div>
                                                <Label>Discount Reason</Label>
                                                <Input
                                                    {
                                                    ...register('discountReason')
                                                    }
                                                    onChange={(e) => clearErrors("discountReason")}
                                                    type='text'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Discount Reason'
                                                />
                                                {errors.discountReason && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.discountReason.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Discount Code</Label>
                                                <Input
                                                    {
                                                    ...register('discountCode')
                                                    }
                                                    type='text'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Discount Code'
                                                />
                                            </div>

                                            <div>
                                                <Label>Admission Fee</Label>
                                                <Input
                                                    {
                                                    ...register('admissionFee')
                                                    }
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
                                                    {
                                                    ...register('finalAmmount')
                                                    }
                                                    type='text'
                                                    disabled
                                                    value={finalAmmount}
                                                    className='rounded-md disabled:bg-gray-300 text-black focus:outline-none'
                                                    placeholder='Final Ammount'
                                                />
                                            </div>

                                            <div>
                                                <Label>Paid Amount</Label>
                                                <Input
                                                    value={paidAmmount}
                                                    onChange={(e) => {
                                                        setPaidAmmount(e.target.value);
                                                        if (e.target.value) {
                                                            clearErrors('paidAmmount')
                                                        }
                                                    }}
                                                    type='text'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Paid Ammount'
                                                />
                                                {errors.paidAmmount && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.paidAmmount.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Due Amount</Label>
                                                <Input
                                                    {
                                                    ...register('dueAmmount')
                                                    }
                                                    value={dueAmmount}
                                                    type='text'
                                                    disabled
                                                    className='rounded-md disabled:bg-gray-300 text-black focus:outline-none'
                                                    placeholder='Due Ammount'
                                                />
                                            </div>

                                            <div>
                                                <Label>Receipt No</Label>
                                                <Input
                                                    {
                                                    ...register('receiptNo', {
                                                        required: {
                                                            value: true,
                                                            message: "Mention receipt no!"
                                                        }
                                                    })
                                                    }
                                                    type='text'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Receipt No'
                                                />
                                                {errors.receiptNo && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.receiptNo.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Reference Code</Label>
                                                <Input
                                                    {
                                                    ...register('referenceCode')
                                                    }
                                                    type='text'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Reference Code'
                                                />
                                            </div>

                                            <div>
                                                <Label>Remark</Label>
                                                <Input
                                                    {
                                                    ...register('remark')
                                                    }
                                                    type='text'
                                                    className='rounded-md focus:outline-none'
                                                    placeholder='Remark'
                                                />
                                            </div>

                                            <div>
                                                <Label>Action Taker</Label>
                                                <Select onValueChange={(value) => {
                                                    setActionTaker(value);
                                                    if (value) {
                                                        clearErrors('actionTaker')
                                                    }
                                                }}>
                                                    <SelectTrigger className="w-full rounded-md">
                                                        <SelectValue placeholder="Action Taker" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value={"Not Selected"}>
                                                                Select
                                                            </SelectItem>
                                                            {Array.isArray(actionTakersDB) && actionTakersDB.length >= 1 ? (
                                                                actionTakersDB.map((actionTaker) => (
                                                                    <div key={actionTaker._id}>
                                                                        <SelectItem value={actionTaker.fullName || "Not Selected"}>
                                                                            {actionTaker.fullName}
                                                                        </SelectItem>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <SelectItem value="Revive Fitness">No staffs registered</SelectItem>
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
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
                                <Button type='submit' className='rounded-md'>{isSubmitting ? 'Processing...' : 'Register'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewMemberRegistrationForm;
