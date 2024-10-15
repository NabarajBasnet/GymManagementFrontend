'use client'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { usePathname } from "next/navigation";
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


const newMemberRegistrationForm = () => {

    const [dob, setDob] = useState()
    const [membershipDate, setMembershipDate] = useState();
    const [membershipRenewDate, setMembershipRenewDate] = useState();
    const [membershipExpireDate, setMembershipExpireDate] = useState();

    const dates = { dob, membershipDate, membershipRenewDate, membershipExpireDate };
    console.log('Dates: ', dates);

    const [gender, setGender] = useState('')
    const [membershipOption, setMembershipOption] = useState('')
    const [membershipType, setMembershipType] = useState('')
    const [membershipDuration, setMembershipDuration] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [actionTaker, setActionTaker] = useState('')

    const selectedOptions = { gender, membershipOption, membershipType, membershipDuration, paymentMethod, actionTaker };

    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError
    } = useForm();

    console.log('Form Errors: ', errors);

    if (!dob) {
        setError('dob', {
            type: 'manual',
            message: 'Date Of Birth is required',
        });
    };

    if (!membershipDate) {
        setError('membershipDate', {
            type: 'manual',
            message: 'Membership date is required',
        });
    };

    if (!membershipRenewDate) {
        setError('membershipRenewDate', {
            type: 'manual',
            message: 'Membership renew date is required',
        });
    };

    const onRegisterMember = async (data) => {
        try {
            const {
                firstName,
                lastName,
                address,
                phoneNumber,
                secondPhoneNumber,
                email,

                discountAmmount,
                discountReason,
                discountCode,

                paidAmmount,
                receiptNo,
                remark,
            } = data;
            const date = new Date();
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
                                        <Label>First Name</Label>
                                        <Input
                                            {
                                            ...register('firstName', {
                                                required: {
                                                    value: true,
                                                    message: "First Name is required!"
                                                }
                                            })
                                            }
                                            className='rounded-none focus:outline-none'
                                            placeholder='First Name'
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.firstName.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Last Name</Label>
                                        <Input
                                            {
                                            ...register('lastName', {
                                                required: {
                                                    value: true,
                                                    message: "Last Name is required!"
                                                }
                                            })
                                            }
                                            className='rounded-none focus:outline-none'
                                            placeholder='Last Name'
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.lastName.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Address</Label>
                                        <Input
                                            {
                                            ...register('address', {
                                                required: {
                                                    value: true,
                                                    message: "Address is required!"
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
                                        <Label>Phone Number</Label>
                                        <Input
                                            {
                                            ...register('phoneNumber', {
                                                required: {
                                                    value: true,
                                                    message: "Phone Number is required!"
                                                }
                                            })
                                            }
                                            className='rounded-none focus:outline-none'
                                            placeholder='Phone Number'
                                        />
                                        {errors.phoneNumber && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.phoneNumber.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Secondary Phone Number</Label>
                                        <Input
                                            {
                                            ...register('secondPhoneNumber', {
                                                required: {
                                                    value: true,
                                                    message: "Secondary Phone Number is required!"
                                                }
                                            })
                                            }
                                            className='rounded-none focus:outline-none'
                                            placeholder='Secondary Phone Number'
                                        />
                                        {errors.secondPhoneNumber && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.secondPhoneNumber.message}`}</p>
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
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Date Of Birth'
                                        />
                                        {errors.dob && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.dob.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Gender</Label>
                                        <Select onOpenChange={(value) => setGender(value)}>
                                            <SelectTrigger className="w-full rounded-none">
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
                                        <Select onOpenChange={(value) => setMembershipOption(value)}>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Membership Option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Membership Option</SelectLabel>
                                                    <SelectItem value="Regular">Regular</SelectItem>
                                                    <SelectItem value="Day Time">Day Time</SelectItem>
                                                    <SelectItem value="Temporary">Temporary</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Membership Type</Label>
                                        <Select onOpenChange={(value) => setMembershipType(value)}>
                                            <SelectTrigger className="w-full rounded-none">
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
                                    </div>

                                    <div>
                                        <Label>Membership Date</Label>
                                        <Input
                                            value={membershipDate}
                                            onChange={(e) => setMembershipDate(e.target.value)}
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Date'
                                        />
                                        {errors.membershipDate && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.membershipDate.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Membership Duration</Label>
                                        <Select onOpenChange={(value) => setMembershipDuration(value)}>
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
                                    </div>

                                    <div>
                                        <Label>Membership Renew Date</Label>
                                        <Input
                                            value={membershipRenewDate}
                                            onChange={(e) => setMembershipRenewDate(e.target.value)}
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Renew Date'
                                        />
                                        {errors.membershipRenewDate && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.membershipRenewDate.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Membership Expire Date</Label>
                                        <Input
                                            value={membershipExpireDate}
                                            onChange={(e) => setMembershipExpireDate(e.target.value)}
                                            type='date'
                                            disabled
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Expire Date'
                                        />
                                        {/* {errors.membershipExpireDate && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.membershipExpireDate.message}`}</p>
                                        )} */}
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
                                        <Select onOpenChange={(value) => setPaymentMethod(value)}>
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
                                    </div>

                                    <div>
                                        <Label>Discount Ammount</Label>
                                        <Input
                                            {
                                            ...register('discountAmmount')
                                            }
                                            type='text'
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
                                        {errors.discountCode && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.discountCode.message}`}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Admission Fee</Label>
                                        <Input
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
                                            type='text'
                                            disabled
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
                                        <Select onOpenChange={(value) => setActionTaker(value)}>
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
                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center space-x-2 p-2">
                                <Button variant='destructive' className='rounded-none'>Finalize</Button>
                                <Button type='submit' className='rounded-none'>Register</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default newMemberRegistrationForm;
