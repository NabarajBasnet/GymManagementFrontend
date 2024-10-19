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

const newMemberRegistrationForm = () => {

    const [signUpAlert, setSignUpAlert] = useState(false);
    const [membershipDuration, setMembershipDuration] = useState('')

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


    const onRegisterMember = async (data) => {
        try {
            const {
                fullName,
                email,
                dob,
                membershipDate,
                membershipExpireDate,
            } = data;

            const membersFinalData = {
                fullName,
                email,
                dob,
                membershipDate,
                membershipDuration,
                membershipExpireDate,
            };

            console.log('Final member date: ', membersFinalData);

            const response = await fetch('http://localhost:5000/api/members', {
                method: "POST",
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
                                            placeholder='First Name'
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.firstName.message}`}</p>
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

                                </div>
                            </div>

                            <div className="bg-gray-300 py-2 my-2 w-full">
                                <h1 className="mx-4 font-semibold">Membership Information</h1>
                            </div>
                            <div className="p-2 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                                    <div>
                                        <Label>Membership Start Date</Label>
                                        <Input
                                            value={membershipDate.toISOString().split('T')[0]}
                                            onChange={(e) => setMembershipDate(new Date(e.target.value))}
                                            type='date'
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
                                        <Label>Membership Expire Date</Label>
                                        <Input
                                            {
                                            ...register('membershipExpireDate')
                                            }
                                            type='date'
                                            disabled
                                            value={membershipExpireDate}
                                            className='rounded-none focus:outline-none disabled:text-red-600'
                                            placeholder='Membership Expire Date'
                                        />
                                        {errors.membershipExpireDate && (
                                            <p className="text-sm font-semibold text-red-600">{`${errors.membershipExpireDate.message}`}</p>
                                        )}
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

export default newMemberRegistrationForm;
