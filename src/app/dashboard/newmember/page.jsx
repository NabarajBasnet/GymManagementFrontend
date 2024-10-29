'use client'

import { MdDone } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

const newMemberRegistrationForm = () => {

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

    const [toast, setToast] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [signUpAlert, setSignUpAlert] = useState(false);
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
    const [membershipDate, setMembershipDate] = useState(new Date());
    const [membershipRenewDate, setMembershipRenewDate] = useState(new Date());
    const [membershipExpireDate, setMembershipExpireDate] = useState(null);

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
        setMembershipExpireDate(newMembershipExpireDate.toISOString().split('T')[0]);
    };

    useEffect(() => {
        handleMembershipSelection(membershipDuration);
    }, [membershipRenewDate])

    const onRegisterMember = async (data) => {

        // Clear any previous errors
        clearErrors();

        // Manual validation for state-managed fields
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

        // Stop the form submission if validation fails
        if (!isValid) {
            return;
        }


        try {
            const {
                // Personal Information from data
                fullName,
                contactNo,
                email,
                dob,
                secondaryContactNo,
                address,

                // Payment Details from data
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

            const response = await fetch('http://88.198.112.156:3000/api/members', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membersFinalData)
            })
            const responseBody = await response.json();
            if (response.status === 401) {
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
            }

            if (response.ok) {
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 7000);
                setResponseMessage(responseBody.message);
                reset();
                setTimeout(() => {
                    setSignUpAlert(false);
                }, 2500);
                setSignUpAlert(true);
            }

        } catch (error) {
            console.log('Error: ', error);
        }
    };

    return (
        <div className="w-full p-1">
            <div className='w-full p-6'>
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
                            <BreadcrumbLink>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>New Member</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Register New Member</h1>
            </div>

            {toast ? (
                <div className="w-full flex justify-center">
                    <div className="fixed top-5 bg-white border shadow-2xl flex z-50 items-center justify-between p-4">
                        <div>
                            <MdDone className="text-4xl mx-4 text-green-600" />
                        </div>
                        <div className="block">
                            <p className="text-sm font-semibold">{responseMessage}</p>
                        </div>
                        <div>
                            <IoMdClose
                                onClick={() => setToast(false)}
                                className="cursor-pointer ml-4" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                </>
            )}

            {signUpAlert && (
                <div className="fixed bottom-10 bg-white border shadow-2xl right-10 flex items-center justify-between p-4">
                    <div className="block">
                        <h1 className="font-bold">Successfull</h1>
                        <p className="text-sm font-semibold">New member registration successfull.</p>
                    </div>
                    <div>
                        <IoMdClose
                            onClick={() => setSignUpAlert(false)}
                            className="cursor-pointer ml-4" />
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                <div className="w-full">
                    <div className="w-full">
                        <form onSubmit={handleSubmit(onRegisterMember)} className="w-full">
                            <div className="bg-gray-300 py-2 my-2 w-full">
                                <h1 className="mx-4 font-semibold">Personal Information</h1>
                            </div>
                            <div className="p-2 bg-white">
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
                                            className='rounded-none focus:outline-none'
                                            placeholder='Full Name'
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.firstName.message}`}</p>
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
                                            className='rounded-none focus:outline-none'
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
                                            className='rounded-none focus:outline-none'
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
                                            ...register('dob', {
                                                required: {
                                                    value: true,
                                                    message: "Date of birth is required!"
                                                }
                                            })
                                            }
                                            type='date'
                                            className='rounded-none focus:outline-none cursor-pointer'
                                            placeholder='Date Of Birth'
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
                                            className='rounded-none focus:outline-none'
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
                                            <SelectTrigger className="w-full rounded-none">
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
                                            className='rounded-none focus:outline-none'
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
                                            <SelectTrigger className="w-full rounded-none">
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

                            <div className="bg-gray-300 py-2 my-2 w-full">
                                <h1 className="mx-4 font-semibold">Membership Information</h1>
                            </div>
                            <div className="p-2 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                                    <div>
                                        <Label>Membership Option</Label>
                                        <Select onValueChange={(value) => {
                                            setMembershipOption(value);
                                            if (value) {
                                                clearErrors('membershipOption')
                                            }
                                        }}>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Membership Option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Membership Option</SelectLabel>
                                                    <SelectItem value="Regular">Regular Membership</SelectItem>
                                                    <SelectItem value="Day">Daytime Membership</SelectItem>
                                                    <SelectItem value="Temporary">Temporary Membership</SelectItem>
                                                    <SelectItem value="Guest">Guest</SelectItem>
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
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Membership Type" />
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
                                            <SelectTrigger className="w-full rounded-none">
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
                                        <Input
                                            value={membershipDate.toISOString().split('T')[0]}
                                            onChange={(e) => setMembershipDate(new Date(e.target.value))}
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Date'
                                        />
                                    </div>

                                    <div>
                                        <Label>Membership Renew Date</Label>
                                        <Input
                                            value={new Date(membershipRenewDate).toISOString().split('T')[0]}
                                            onChange={(e) => setMembershipRenewDate(new Date(e.target.value))}
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Date'
                                        />
                                    </div>

                                    <div>
                                        <Label>Membership Duration</Label>
                                        <Select onValueChange={(value) => {
                                            handleMembershipSelection(value);
                                            if (value) {
                                                clearErrors('membershipDuration')
                                            }
                                        }}>
                                            <SelectTrigger className="w-full rounded-none">
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
                                        <Input
                                            {
                                            ...register('membershipExpireDate')
                                            }
                                            type='date'
                                            disabled
                                            value={new Date(membershipExpireDate).toISOString().split('T')[0]}
                                            className='rounded-none focus:outline-none disabled:text-red-600'
                                            placeholder='Membership Expire Date'
                                        />
                                        {errors.membershipExpireDate && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.membershipExpireDate.message}`}</p>
                                        )}
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
                                        <Select onValueChange={(value) => {
                                            setPaymentMethod(value);
                                            if (value) {
                                                clearErrors('paymentMethod')
                                            }
                                        }}>
                                            <SelectTrigger className="w-full rounded-none">
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
                                        <Label>Discount Ammount</Label>
                                        <Input
                                            value={discountAmmount}
                                            onChange={(e) => setDiscountAmmount(e.target.value)}
                                            type='text'
                                            className='rounded-none focus:outline-none'
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
                                            className='rounded-none focus:outline-none'
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
                                            className='rounded-none focus:outline-none'
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
                                            className='rounded-none disabled:bg-gray-300 text-black focus:outline-none'
                                            placeholder='Admission Fee'
                                        />
                                    </div>

                                    <div>
                                        <Label>Final Ammount</Label>
                                        <Input
                                            {
                                            ...register('finalAmmount')
                                            }
                                            type='text'
                                            disabled
                                            value={finalAmmount}
                                            className='rounded-none disabled:bg-gray-300 text-black focus:outline-none'
                                            placeholder='Final Ammount'
                                        />
                                    </div>

                                    <div>
                                        <Label>Paid Ammount</Label>
                                        <Input
                                            value={paidAmmount}
                                            onChange={(e) => {
                                                setPaidAmmount(e.target.value);
                                                if (e.target.value) {
                                                    clearErrors('paidAmmount')
                                                }
                                            }}
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Paid Ammount'
                                        />
                                        {errors.paidAmmount && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.paidAmmount.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Due Ammount</Label>
                                        <Input
                                            {
                                            ...register('dueAmmount')
                                            }
                                            value={dueAmmount}
                                            type='text'
                                            disabled
                                            className='rounded-none disabled:bg-gray-300 text-black focus:outline-none'
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
                                            className='rounded-none focus:outline-none'
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
                                            className='rounded-none focus:outline-none'
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
                                            className='rounded-none focus:outline-none'
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
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Action Taker" />
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
                                        {errors.actionTaker && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.actionTaker.message}`}</p>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className="flex items-center space-x-2 p-2">
                                <Button type='submit' className='rounded-none'>{isSubmitting ? 'Processing...' : 'Register'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default newMemberRegistrationForm;
