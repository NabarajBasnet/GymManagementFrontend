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
import { cn } from "@/lib/utils";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
                    option: "Day",
                    type: "Gym",
                    gymDayFees: {
                        "1 Month": 3000,
                        "3 Months": 7500,
                        "6 Months": 12000,
                        "12 Months": 18000
                    }
                },
                {
                    option: "Day",
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

    const { register, reset, handleSubmit, formState: { errors, isSubmitting }, setError, control } = useForm()

    // Hooks
    const { getSingleUserDetails } = useMember();

    const { data, isLoading } = useQuery({
        queryKey: ['member', memberId],
        queryFn: () => getSingleUserDetails(memberId),
        enabled: !!memberId,
    });

    const { member, message } = data || {};

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
                membershipRenewDate: member.membershipRenewDate ? new Date(member.membershipRenewDate).toISOString().split("T")[0] : '',
                membershipDuration: member.membershipDuration,
                membershipExpireDate: member.membershipExpireDate ? new Date(member.membershipExpireDate).toISOString().split("T")[0] : "",
                paymentMethod: member.paymentMethod,
                discountAmmount: member.discountAmmount,
                discountReason: member.discountReason,
                discountCode: member.discountCode,
                paidAmmount: member.paidAmmount,
                dueAmmount: member.dueAmmount,
                receiptNo: member.receiptNo,
                remark: member.remark,
            });
        }
    }, [data, reset]);

    // Functions
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
            } else if (membershipOption === "Day" && membershipType === "Gym") {
                selectedFee = selectedPlan.gymDayFees[membershipDuration];
            } else if (membershipOption === "Day" && membershipType === "Gym & Cardio") {
                selectedFee = selectedPlan.gymCardioDayFees[membershipDuration];
            }

            const admissionFee = membershipPlans.find(plan => plan.type === "Admission").admissionFee;
            setFinalAmmount(admissionFee + selectedFee - discountAmmount);
        } else {
            setFinalAmmount(0);
        }
    };

    const handleMembershipSelection = (duration) => {
        setMembershipDuration(duration);
        const newMembershipExpireDate = new Date(membershipRenewDate);
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

    const handleDurationChange = (duration) => {
        setMembershipDuration(duration);
        handleMembershipSelection(duration);
    };

    const holdMembership = async () => {

        const membershipHoldData = { membershipHoldDate, status: 'OnHold' };

        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members/hold-membership/${memberId}`, {
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
                setIsMemberDeleting(false);
                setConfirmDeleteMember(false);
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
                                <BreadcrumbLink href="/docs/components">Member</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {data ? `${member.fullName}` : `${''}`}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold my-3">Register New Member</h1>
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
                                    <h1 className="font-bold text-md text-red-600 mb-2">Note: "Stop/Start Date will be by default set to today's Date"</h1>
                                    <p className="font-medium text-sm mb-4">If you want to override the default Stop Date, please select a date below:</p>
                                    <div className="my-4">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={`w-full flex items-center justify-between text-left ${!new Date() ? "text-gray-500" : ""}`}
                                                >
                                                    <CalendarIcon />
                                                    <span>{new Date() ? format(new Date(), "PPP") : "Membership Hold Date"}</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    // selected={}
                                                    // onSelect={}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex justify-end space-x-2">
                                <AlertDialogCancel className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Hold Date:
                    </div>
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Paused Days:
                    </div>
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Minimum Days to Hold: 7
                    </div>
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Resumed Date:
                    </div>
                    <div className="bg-gray-100 text-sm font-semibold p-4 border rounded-lg">
                        Remaining Days:
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
                                            <form className="w-full">
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
                                                                    <Select {...field}>
                                                                        <SelectTrigger className="w-full rounded-md">
                                                                            <SelectValue placeholder="Select Gender" />
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
                                                                    <Select {...field}>
                                                                        <SelectTrigger className="w-full rounded-md">
                                                                            <SelectValue placeholder={''} />
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
                                                                    <Select {...field}>
                                                                        <SelectTrigger className="w-full rounded-md">
                                                                            <SelectValue placeholder={'Select Membership'} />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectLabel>Membership Option</SelectLabel>
                                                                                <SelectItem value="Regular">Regular</SelectItem>
                                                                                <SelectItem value="Daytime">Daytime</SelectItem>
                                                                                <SelectItem value="Temporary">Temporary</SelectItem>
                                                                                <SelectItem value="Guest">Guest</SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Membership Type</Label>
                                                            <Controller
                                                                name="membershipType"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select {...field}>
                                                                        <SelectTrigger className="w-full rounded-md">
                                                                            <SelectValue placeholder={''} />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectLabel>Membership Type</SelectLabel>
                                                                                <SelectItem value="Gym">Gym</SelectItem>
                                                                                <SelectItem value="Gym & Cardio">Gym & Cardio</SelectItem>
                                                                                <SelectItem value="Gym, Cardio & Jumba">Gym, Cardio & Jumba</SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Membership Shift</Label>
                                                            <Controller
                                                                name="membershipShift"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select {...field}>
                                                                        <SelectTrigger className="w-full rounded-md">
                                                                            <SelectValue placeholder={''} />
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
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Membership Start Date</Label>
                                                            <Controller
                                                                name="membershipDate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className={cn(
                                                                                    "w-full justify-start text-left font-normal",
                                                                                    !field.value && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <CalendarIcon />
                                                                                {field.value ? format(field.value, "PPP") : <span>Membership Date</span>}
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0">
                                                                            <Calendar
                                                                                mode="single"
                                                                                disabled
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                initialFocus
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Membership Renew Date</Label>
                                                            <Controller
                                                                name="membershipRenewDate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className={cn(
                                                                                    "w-full justify-start text-left font-normal",
                                                                                    !field.value && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <CalendarIcon />
                                                                                {field.value ? format(field.value, "PPP") : <span>Membership Renew Date</span>}
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0">
                                                                            <Calendar
                                                                                mode="single"
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                initialFocus
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Membership Duration</Label>
                                                            <Controller
                                                                name="membershipDuration"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select {...field}>
                                                                        <SelectTrigger className="w-full rounded-md">
                                                                            <SelectValue />
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
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Membership Expire Date</Label>
                                                            <Controller
                                                                name="membershipExpireDate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className={cn(
                                                                                    "w-full justify-start text-left font-normal",
                                                                                    !field.value && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <CalendarIcon />
                                                                                {field.value ? format(field.value, "PPP") : <span>Membership Renew Date</span>}
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0">
                                                                            <Calendar
                                                                                mode="single"
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                initialFocus
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
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
                                                                    <Select {...field}>
                                                                        <SelectTrigger className="w-full rounded-md">
                                                                            <SelectValue placeholder={'Select'} />
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
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Discount Ammount</Label>
                                                            <Input
                                                                {...register('discountAmmount')}
                                                                type='text'
                                                                className='rounded-md focus:outline-none'
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
                                                            <Label>Final Ammount</Label>
                                                            <Input
                                                                type='text'
                                                                disabled
                                                                className='rounded-md disabled:bg-gray-300 text-black focus:outline-none'
                                                                placeholder='Final Ammount'
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Paid Ammount</Label>
                                                            <Input
                                                                {...register("paidAmmount")}
                                                                type='text'
                                                                className='rounded-md focus:outline-none'
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Due Ammount</Label>
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
                                                            <Select>
                                                                <SelectTrigger className="w-full rounded-md">
                                                                    <SelectValue placeholder={'Reason for update'} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Update reason</SelectLabel>
                                                                        <SelectItem value="Normal Change">Normal Change</SelectItem>
                                                                        <SelectItem value="Renew">Renew</SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
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
                                                            <Select >
                                                                <SelectTrigger className="w-full rounded-md">
                                                                    <SelectValue placeholder={'Select'} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Action Taker</SelectLabel>
                                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                                        <SelectItem value="Author">Author</SelectItem>
                                                                        <SelectItem value="Member">Member</SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2 p-2">
                                                    <Button type='submit' className='rounded-md'>Submit</Button>
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
}

export default MemberDetails;


