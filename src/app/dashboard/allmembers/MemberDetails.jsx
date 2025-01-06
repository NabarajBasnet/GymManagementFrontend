'use client';

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
    const { member, message } = data || {};
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
        <div className="w-full p-1">
            <div className='w-full p-6'>
                {toast ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                            <div>
                                {
                                    responseType === 'Success' ? (
                                        <MdDone className="text-3xl mx-4 text-green-600" />
                                    ) : (
                                        <MdError className="text-3xl mx-4 text-red-600" />
                                    )
                                }
                            </div>
                            <div className="block">
                                {
                                    responseType === 'Success' ? (
                                        <p className="text-sm font-semibold text-green-600">{successMessage.message}</p>
                                    ) : (
                                        <p className="text-sm font-semibold text-red-600">{errorMessage.message}</p>
                                    )
                                }
                            </div>
                            <div>
                                <MdClose
                                    onClick={() => setToast(false)}
                                    className="cursor-pointer text-3xl ml-4" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
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
                        <h1 className="text-xl font-bold my-3">Update Member Details</h1>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-start space-x-4 mb-4">
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Start</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Hold</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-lg p-6 rounded-lg shadow-lg">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-4">
                                    <span className="font-bold text-md text-red-600 mb-2">Note: "Stop/Start Date will be by default set to today's Date"</span>
                                    <span className="font-medium text-sm mb-4">If you want to override the default Stop Date, please select a date below:</span>
                                    <span className="my-4">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={`w-full flex items-center justify-between text-left ${!new Date() ? "text-gray-500" : ""}`}
                                                >
                                                    <CalendarIcon />
                                                    <span>{membershipHoldDate ? format(membershipHoldDate, "PPP") : "Membership Hold Date"}</span>
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
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex justify-end space-x-2">
                                <AlertDialogCancel className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => holdMembership()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Hold Date: {data && data.member && data.member.membershipHoldDate ? new Date(data.member.membershipHoldDate).toISOString().split("T")[0] : 'N/A'}
                    </div>
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Paused Days: {data ? member.pausedDays : ''}
                    </div>
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Remaining Days: {data ? member.remainingDaysOfMembership : ''}
                    </div>
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Resumed Date: {data && data.member && data.member.resumedDate ? new Date(data.member.resumedDate).toISOString().split("T")[0] : 'N/A'}
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full">
                    <div className="w-full">
                        {
                            data && (
                                <div className="w-full">
                                    {
                                        data ? (
                                            <form className="w-full" onSubmit={handleSubmit(updateMemberDetails)}>
                                                <div className="bg-gray-300 py-2 my-2 w-full">
                                                    <h1 className="mx-4 font-semibold">Personal Information</h1>
                                                </div>
                                                <div className="p-2 bg-white">
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                        <div>
                                                            <Label>Member Full Name</Label>
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

                                                <div className="bg-gray-300 py-2 my-2 w-full">
                                                    <h1 className="mx-4 font-semibold">Membership Information</h1>
                                                </div>
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

                                                <div className="bg-gray-300 py-2 my-2 w-full">
                                                    <h1 className="mx-4 font-semibold">Payment Details</h1>
                                                </div>
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
