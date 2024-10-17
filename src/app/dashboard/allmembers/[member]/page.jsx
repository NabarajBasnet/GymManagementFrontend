'use client'

import { IoMdClose } from "react-icons/io";
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

const Member = (props) => {

    const memberId = props.params.member
    console.log('Member Id: ', memberId);

    const [membershipExpireDate, setMembershipExpireDate] = useState('');

    const newExpireDate = new Date(membershipExpireDate === 'string' ? membershipExpireDate : new Date());
    const formattedMembershipDate = newExpireDate === "string" ? newExpireDate : newExpireDate.toISOString().split('T')[0]

    const handleMembershipSelection = (duration) => {

        switch (duration) {
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
                break;
        }
        setMembershipExpireDate(newExpireDate);
    };

    const formattedMembershipExpireDate =
        typeof membershipExpireDate === 'string'
            ? membershipExpireDate
            : membershipExpireDate.toISOString().split('T')[0];

    const [signUpAlert, setSignUpAlert] = useState(false);
    const [gender, setGender] = useState('')
    const [membershipOption, setMembershipOption] = useState('')
    const [membershipType, setMembershipType] = useState('')
    const [membershipDuration, setMembershipDuration] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [actionTaker, setActionTaker] = useState('')

    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit
    } = useForm();

    const onRegisterMember = async (data) => {
        try {
            const {
                firstName,
                lastName,
                address,
                phoneNumber,
                secondPhoneNumber,
                email,
                dob,
                membershipDate,
                membershipRenewDate,
                membershipExpireDate,
                discountAmmount,
                discountReason,
                discountCode,
                admissionFee,
                finalAmmount,
                paidAmmount,
                dueAmmount,
                receiptNo,
                referenceCode,
                remark,
            } = data;

            const membersFinalData = {
                firstName,
                lastName,
                address,
                phoneNumber,
                secondPhoneNumber,
                email,
                dob,
                gender,
                membershipOption,
                membershipType,
                membershipDate,
                membershipDuration,
                membershipRenewDate,
                membershipExpireDate,
                paymentMethod,
                discountAmmount,
                discountReason,
                discountCode,
                admissionFee,
                finalAmmount,
                paidAmmount,
                dueAmmount,
                receiptNo,
                referenceCode,
                remark,
                actionTaker
            };

            const response = await fetch('http://localhost:5000/api/members', {
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
                <h1 className="text-xl font-bold mt-3">Edit Member Details</h1>
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
                                        <Label>Gender</Label>
                                        <Select onValueChange={(value) => setGender(value)}>
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
                                        <Select onValueChange={(value) => setMembershipOption(value)}>
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
                                        <Select onValueChange={(value) => setMembershipType(value)}>
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
                                            {
                                            ...register('membershipDate', {
                                                required: {
                                                    value: true,
                                                    message: "Membership Date is required!"
                                                }
                                            })
                                            }
                                            value={formattedMembershipDate}
                                            onChange={(e) => setMembershipExpireDate(e.target.value)}
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
                                        <Select onValueChange={(value) => handleMembershipSelection(value)}>
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
                                            value={membershipExpireDate}
                                            onChange={(e) => setMembershipExpireDate(e.target.value)}
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
                                            {
                                            ...register('membershipExpireDate')
                                            }
                                            value={formattedMembershipExpireDate}
                                            type='date'
                                            disabled
                                            className='rounded-none focus:outline-none'
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
                                            {
                                            ...register('dueAmmount')
                                            }
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
                                            ...register('referenceCode', {
                                                required: {
                                                    value: true,
                                                    message: "Mention reference code!"
                                                }
                                            })
                                            }
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
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Remark'
                                        />
                                    </div>

                                    <div>
                                        <Label>Action Taker</Label>
                                        <Select onValueChange={(value) => setActionTaker(value)}>
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
                                <Button type='submit' className='rounded-none'>{isSubmitting ? 'Processing...' : 'Register'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Member;
