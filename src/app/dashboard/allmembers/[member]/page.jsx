'use client'

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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const Member = (props) => {

    const memberId = props.params.member;

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
    const [membershipExpireDate, setMembershipExpireDate] = useState(null);

    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit
    } = useForm();

    const handleMembershipSelection = (duration) => {
        setMembershipDuration(duration);
        const newMembershipExpireDate = new Date(membershipDate)

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

    const getMemberDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/members/${memberId}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const { data, isLoading: isMemberFetching } = useQuery({
        queryKey: ['member'],
        queryFn: getMemberDetails
    });

    console.log('Data: ', data);

    const onEditMembersDetails = async (data) => {
        try {
            const {
                // Personal Information from data
                fullName,
                contactNo,
                email,
                dob,
                secondaryContactNo,
                address,

                // Membership Information from data

                // Payment Details from data
                discountAmmount,
                discountReason,
                discountCode,
                paidAmmount,
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
                membershipDuration,
                membershipExpireDate,
                paymentMethod,
                discountAmmount,
                discountReason,
                discountCode,
                admissionFee: 1000,
                finalAmmount: 5000,
                paidAmmount,
                receiptNo,
                dueAmmount: 0,
                referenceCode,
                remark,
                actionTaker
            };

            const response = await fetch(`http://localhost:5000/api/members/${memberId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membersFinalData)
            })
            if (response.ok) {
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
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>Documentation</DropdownMenuItem>
                                    <DropdownMenuItem>Themes</DropdownMenuItem>
                                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>

                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Register New Member</h1>
            </div>

            {signUpAlert && (
                <div className="fixed bottom-10 bg-white border shadow-2xl right-10 flex items-center justify-between p-4">
                    <div className="block">
                        <h1 className="font-bold">Successfull</h1>
                        <p className="text-sm font-semibold">Patch request successfull.</p>
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
                        {
                            data && (
                                <div className="w-full">
                                    {
                                        data.member ? (
                                            <form onSubmit={handleSubmit(onEditMembersDetails)} className="w-full">
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
                                                                defaultValue={data.member.fullName}
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='First Name'
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
                                                                defaultValue={data.member.contactNo}
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
                                                                defaultValue={data.member.email}
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Email Address'
                                                            />
                                                            {errors.email && (
                                                                <p className="text-sm font-semibold text-red-600">{`${errors.email.message}`}</p>
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
                                                                defaultValue={new Date(data.member.dob).toISOString().split('T')[0]}
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
                                                                defaultValue={data.member.secondaryContactNo}
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Secondary Contact Number'
                                                            />
                                                            {errors.secondaryContactNo && (
                                                                <p className="text-sm font-semibold text-red-600">{`${errors.secondaryContactNo.message}`}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Gender</Label>
                                                            <Select onValueChange={(value) => setGender(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.gender} />
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
                                                                defaultValue={data.member.address}
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Address'
                                                            />
                                                            {errors.address && (
                                                                <p className="text-sm font-semibold text-red-600">{`${errors.address.message}`}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Status</Label>
                                                            <Select onValueChange={(value) => setStatus(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.status} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Status</SelectLabel>
                                                                        <SelectItem value="Active">Active</SelectItem>
                                                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                                                        <SelectItem value="OnHold">Hold</SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
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
                                                            <Select onValueChange={(value) => setMembershipOption(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.membershipOption} />
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
                                                        </div>

                                                        <div>
                                                            <Label>Membership Type</Label>
                                                            <Select onValueChange={(value) => setMembershipType(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.membershipType} />
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
                                                        </div>

                                                        <div>
                                                            <Label>Membership Shift</Label>
                                                            <Select onValueChange={(value) => setMembershipShift(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.membershipShift} />
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
                                                        </div>

                                                        <div>
                                                            <Label>Membership Start Date</Label>
                                                            <Input
                                                                value={membershipDate.toISOString().split('T')[0]}
                                                                onChange={(e) => setMembershipDate(new Date(e.target.value))}
                                                                type='date'
                                                                defaultValue={new Date(data.member.membershipDate).toISOString().split('T')[0]}
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Membership Date'
                                                            />
                                                            {/* {errors.membershipDate && (
                                                        <p className="text-sm font-semibold text-red-600">{`${errors.membershipDate.message}`}</p>
                                                    )}*/}
                                                        </div>

                                                        <div>
                                                            <Label>Membership Duration</Label>
                                                            <Select onValueChange={(value) => handleMembershipSelection(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.membershipDuration} />
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
                                                        </div>

                                                        <div>
                                                            <Label>Membership Expire Date</Label>
                                                            <Input
                                                                {
                                                                ...register('membershipExpireDate')
                                                                }
                                                                type='date'
                                                                disabled
                                                                value={membershipExpireDate}
                                                                defaultValue={new Date(data.member.membershipExpireDate).toISOString().split('T')[0]}
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
                                                            <Select onValueChange={(value) => setPaymentMethod(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.paymentMethod} />
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
                                                        </div>

                                                        <div>
                                                            <Label>Discount Ammount</Label>
                                                            <Input
                                                                {
                                                                ...register('discountAmmount')
                                                                }
                                                                type='text'
                                                                defaultValue={data.member.discountAmmount}
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Discount Ammount'
                                                            />
                                                            {errors.discountAmmount && (
                                                                <p className="text-sm font-semibold text-red-600">{`${errors.discountAmmount.message}`}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Discount Reason</Label>
                                                            <Input
                                                                {
                                                                ...register('discountReason', {
                                                                    required: {
                                                                        value: true,
                                                                        message: "Mention discount reason!"
                                                                    }
                                                                })
                                                                }
                                                                defaultValue={data.member.discountReason}
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
                                                                defaultValue={data.member.discountCode}
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Discount Code'
                                                            />
                                                            {errors.discountCode && (
                                                                <p className="text-sm font-semibold text-red-600">{`${errors.discountCode.message}`}</p>
                                                            )}
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
                                                                defaultValue={data.member.paidAmmount}
                                                                className='rounded-none disabled:bg-gray-300 text-black focus:outline-none'
                                                                placeholder='Final Ammount'
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Paid Ammount</Label>
                                                            <Input
                                                                {
                                                                ...register('paidAmmount', {
                                                                    required: {
                                                                        value: true,
                                                                        message: "Mention paid ammount!"
                                                                    }
                                                                })
                                                                }
                                                                type='text'
                                                                defaultValue={data.member.paidAmmount}
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
                                                                type='text'
                                                                disabled
                                                                defaultValue={data.member.dueAmmount}
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
                                                                defaultValue={data.member.receiptNo}
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
                                                                ...register('referenceCode', {
                                                                    required: {
                                                                        value: true,
                                                                        message: "Mention reference code!"
                                                                    }
                                                                })
                                                                }
                                                                defaultValue={data.member.referenceCode}
                                                                type='text'
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Reference Code'
                                                            />
                                                            {errors.referenceCode && (
                                                                <p className="text-sm font-semibold text-red-600">{`${errors.referenceCode.message}`}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Remark</Label>
                                                            <Input
                                                                {
                                                                ...register('remark')
                                                                }
                                                                defaultValue={data.member.remark}
                                                                type='text'
                                                                className='rounded-none focus:outline-none'
                                                                placeholder='Remark'
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label>Action Taker</Label>
                                                            <Select onValueChange={(value) => setActionTaker(value)}>
                                                                <SelectTrigger className="w-full rounded-none">
                                                                    <SelectValue placeholder={data.member.actionTaker} />
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
                                                    <Button variant='destructive' className='rounded-none'>Finalize</Button>
                                                    <Button type='submit' className='rounded-none'>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
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
    );
}

export default Member;
