'use client'

import { Switch } from "@/components/ui/switch"
import { BiSolidUserDetail } from "react-icons/bi";
import { TiBusinessCard } from "react-icons/ti";
import { MdOutlinePayment } from "react-icons/md";
import { BiHomeAlt } from "react-icons/bi";
import { MdDone, MdError, MdClose } from "react-icons/md";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast as notify } from 'react-hot-toast';
import { cn } from "@/lib/utils";

// Import UI components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
    const [status, setStatus] = useState(false);

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
            const response = await fetch('http://localhost:3000/api/members', {
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
        <div className="w-full bg-gray-100 px-4 py-6">
            <div className="flex items-center gap-2 mb-3">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className='font-medium text-gray-600 flex items-center gap-1'>
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
                            <BreadcrumbLink className='font-medium text-gray-600'>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-medium text-gray-600'>New Member</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className='w-full'>
                <h1 className="text-xl font-bold text-gray-600 my-3">Register New Member</h1>
            </div>

            {signUpAlert && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in">
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
                </div>
            )}

            <form onSubmit={handleSubmit(onRegisterMember)} className="w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Member Registration</CardTitle>
                        <CardDescription>Fill in the member details below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="personal">
                                    <BiSolidUserDetail size={22} className="mr-2" /> Personal Information
                                </TabsTrigger>
                                <TabsTrigger value="membership">
                                    <TiBusinessCard size={22} className="mr-2" /> Membership Information
                                </TabsTrigger>
                                <TabsTrigger value="payment">
                                    <MdOutlinePayment size={22} className="mr-2" /> Payment Information
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal">
                                <div className="w-full md:flex items-center justify-between space-x-4">
                                    <Card className="w-full lg:w-4/12 py-4 h-full">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-center">
                                                <h1 className="text-4xl font-bold text-gray-600 rounded-full bg-gray-200 w-40 h-40"></h1>
                                            </div>
                                            <div className="w-full items-center justify-center">
                                                <div className="flex flex-col items-center justify-center my-3 space-y-1">
                                                    <Label>Status</Label>
                                                    <Switch id="airplane-mode" 
                                                    checked={status}
                                                    onCheckedChange={setStatus}
                                                    />
                                                    {errors.status && (
                                                        <p className="text-sm text-red-600">{errors.status.message}</p>
                                                    )}
                                                    <p className="text-sm text-gray-600">Select membership status</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="w-full lg:w-8/12">
                                        <CardContent className="pt-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Member Full Name</Label>
                                                    <Input
                                                        {...register('fullName', {
                                                            required: "Enter member's full name here!"
                                                        })}
                                                        placeholder='Full Name'
                                                        className="rounded-md py-6"
                                                    />
                                                    {errors.fullName && (
                                                        <p className="text-sm text-red-600">{errors.fullName.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Contact No</Label>
                                                    <Input
                                                        {...register('contactNo', {
                                                            required: "Enter contact number here!"
                                                        })}
                                                        placeholder='Contact Number'
                                                        className="rounded-md py-6"
                                                    />
                                                    {errors.contactNo && (
                                                        <p className="text-sm text-red-600">{errors.contactNo.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Email Address</Label>
                                                    <Input
                                                        {...register('email', {
                                                            required: "Email address is required!"
                                                        })}
                                                        onChange={() => clearErrors('userRegistered')}
                                                        placeholder='Email Address'
                                                        className="rounded-md py-6"
                                                    />
                                                    {errors.email && (
                                                        <p className="text-sm text-red-600">{errors.email.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Date Of Birth</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left py-6 rounded-md font-normal",
                                                                    !dob && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={dob}
                                                                onSelect={setDob}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Secondary Contact No</Label>
                                                    <Input
                                                        {...register('secondaryContactNo', {
                                                            required: "Enter secondary contact number here!"
                                                        })}
                                                        placeholder='Secondary Contact Number'
                                                        className="rounded-md py-6"
                                                    />
                                                    {errors.secondaryContactNo && (
                                                        <p className="text-sm text-red-600">{errors.secondaryContactNo.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Address</Label>
                                                    <Input
                                                        {...register('address', {
                                                            required: "Enter address!"
                                                        })}
                                                        className="rounded-md py-6"
                                                        placeholder='Address'
                                                    />
                                                    {errors.address && (
                                                        <p className="text-sm text-red-600">{errors.address.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Gender</Label>
                                                    <Select onValueChange={(value) => {
                                                        setGender(value);
                                                        if (value) clearErrors("gender");
                                                    }}>
                                                        <SelectTrigger className="w-full py-6 rounded-md">
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
                                                    {errors.gender && (
                                                        <p className="text-sm text-red-600">{errors.gender.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="membership">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Membership Option</Label>
                                                <Select onValueChange={(value) => {
                                                    setMembershipOption(value);
                                                    if (value) clearErrors('membershipOption')
                                                }}>
                                                    <SelectTrigger className='py-6 rounded-sm'>
                                                        <SelectValue placeholder="Select Option" />
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
                                                    <p className="text-sm text-red-600">{errors.membershipOption.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Membership Type</Label>
                                                <Select onValueChange={(value) => {
                                                    setMembershipType(value);
                                                    if (value) clearErrors('membershipType')
                                                }}>
                                                    <SelectTrigger className='py-6 rounded-sm'>
                                                        <SelectValue placeholder="Select Type" />
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
                                                    <p className="text-sm text-red-600">{errors.membershipType.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Membership Shift</Label>
                                                <Select onValueChange={(value) => {
                                                    setMembershipShift(value);
                                                    if (value) clearErrors('membershipShift')
                                                }}>
                                                    <SelectTrigger className='py-6 rounded-sm'>
                                                        <SelectValue placeholder="Select Shift" />
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
                                                    <p className="text-sm text-red-600">{errors.membershipShift.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Membership Duration</Label>
                                                <Select onValueChange={(value) => {
                                                    handleMembershipSelection(value);
                                                    if (value) clearErrors('membershipDuration')
                                                }}>
                                                    <SelectTrigger className='py-6 rounded-sm'>
                                                        <SelectValue placeholder="Select Duration" />
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
                                                    <p className="text-sm text-red-600">{errors.membershipDuration.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Membership Date</Label>
                                                <Popover>
                                                    <PopoverTrigger className='py-6' asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !membershipDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {membershipDate ? format(membershipDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-2">
                                                        <Calendar
                                                            mode="single"
                                                            selected={membershipDate}
                                                            onSelect={setMembershipDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Membership Renew Date</Label>
                                                <Popover>
                                                    <PopoverTrigger className='py-6' asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !membershipRenewDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {membershipRenewDate ? format(membershipRenewDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-2">
                                                        <Calendar
                                                            mode="single"
                                                            selected={membershipRenewDate}
                                                            onSelect={setMembershipRenewDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Membership Expire Date</Label>
                                                <Popover>
                                                    <PopoverTrigger className='py-6' asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !membershipExpireDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {membershipExpireDate ? format(membershipExpireDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-2">
                                                        <Calendar
                                                            mode="single"
                                                            selected={membershipExpireDate}
                                                            onSelect={setMembershipExpireDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="payment">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Payment Method</Label>
                                                <Select onValueChange={(value) => {
                                                    setPaymentMethod(value);
                                                    if (value) clearErrors('paymentMethod')
                                                }}>
                                                    <SelectTrigger className='py-6 rounded-sm'>
                                                        <SelectValue placeholder="Select Method" />
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
                                                    <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Discount Amount</Label>
                                                <Input
                                                    className='py-6 rounded-sm'
                                                    value={discountAmmount}
                                                    onChange={(e) => setDiscountAmmount(e.target.value)}
                                                    type='text'
                                                    placeholder='Discount Amount'
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Discount Reason</Label>
                                                <Input
                                                    className='py-6 rounded-sm'
                                                    {...register('discountReason')}
                                                    onChange={(e) => clearErrors("discountReason")}
                                                    type='text'
                                                    placeholder='Discount Reason'
                                                />
                                                {errors.discountReason && (
                                                    <p className="text-sm text-red-600">{errors.discountReason.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Discount Code</Label>
                                                <Input
                                                    className='py-6 rounded-sm'
                                                    {...register('discountCode')}
                                                    type='text'
                                                    placeholder='Discount Code'
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Admission Fee</Label>
                                                <Input
                                                    {...register('admissionFee')}
                                                    type='text'
                                                    defaultValue={'1000'}
                                                    disabled
                                                    className='py-6 rounded-sm disabled:bg-gray-300 text-black focus:outline-none'
                                                    placeholder='Admission Fee'
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Final Amount</Label>
                                                <Input
                                                    className='py-6 rounded-sm bg-gray-100'
                                                    value={finalAmmount}
                                                    disabled
                                                    placeholder="Final Amount"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Paid Amount</Label>
                                                <Input
                                                    className='py-6 rounded-sm'
                                                    value={paidAmmount}
                                                    onChange={(e) => {
                                                        setPaidAmmount(e.target.value);
                                                        if (e.target.value) clearErrors('paidAmmount')
                                                    }}
                                                    placeholder="Paid Amount"
                                                />
                                                {errors.paidAmmount && (
                                                    <p className="text-sm text-red-600">{errors.paidAmmount.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Due Amount</Label>
                                                <Input
                                                    className='py-6 rounded-sm bg-gray-100'
                                                    value={dueAmmount}
                                                    disabled
                                                    placeholder="Due Amount"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Receipt No</Label>
                                                <Input
                                                    className='py-6 rounded-sm'
                                                    {...register('receiptNo', {
                                                        required: "Mention receipt no!"
                                                    })}
                                                    type='text'
                                                    placeholder='Receipt No'
                                                />
                                                {errors.receiptNo && (
                                                    <p className="text-sm text-red-600">{errors.receiptNo.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Reference Code</Label>
                                                <Input
                                                    className='py-6 rounded-sm'
                                                    {...register('referenceCode')}
                                                    type='text'
                                                    placeholder='Reference Code'
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Remark</Label>
                                                <Input
                                                    className='py-6 rounded-sm'
                                                    {...register('remark')}
                                                    type='text'
                                                    placeholder='Remark'
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Action Taker</Label>
                                                <Select onValueChange={(value) => {
                                                    setActionTaker(value);
                                                    if (value) clearErrors('actionTaker')
                                                }}>
                                                    <SelectTrigger className='py-6 rounded-sm'>
                                                        <SelectValue placeholder="Select Action Taker" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="Not Selected">Select</SelectItem>
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
                                                    <p className="text-sm text-red-600">{errors.actionTaker.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                            {isSubmitting ? 'Processing...' : 'Register Member'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default NewMemberRegistrationForm;
