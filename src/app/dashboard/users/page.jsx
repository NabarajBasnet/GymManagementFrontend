'use client';

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IoIosMail } from "react-icons/io";
import { TiUserDelete } from "react-icons/ti";
import { FaUserEdit } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
import { useQuery } from '@tanstack/react-query';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


const Users = () => {

    const [usersMessage, setUsersMessage] = useState('');
    const [userEditForm, setUserEditForm] = useState(false);

    const getAllUsers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users`);
            const responseBody = await response.json();
            if (response.ok) {
                setUsersMessage(responseBody.message);
            }
            return responseBody;
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: (['users']),
        queryFn: getAllUsers
    });

    const { users, message } = data || {};

    console.log('Users: ', users);
    console.log('Users: ', usersMessage);


    const invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV002",
            paymentStatus: "Pending",
            totalAmount: "$150.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV003",
            paymentStatus: "Unpaid",
            totalAmount: "$350.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV004",
            paymentStatus: "Paid",
            totalAmount: "$450.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV005",
            paymentStatus: "Paid",
            totalAmount: "$550.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV006",
            paymentStatus: "Pending",
            totalAmount: "$200.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV007",
            paymentStatus: "Unpaid",
            totalAmount: "$300.00",
            paymentMethod: "Credit Card",
        },
    ];

    return (
        <div className="w-full">
            <div className="w-full">
                {
                    userEditForm ? (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                            <div className="flex justify-center bg-transparent p-4 rounded-sm shadow-lg w-full">
                                <div className="bg-white p-4 rounded-sm shadow-lg md:w-8/12 w-full">
                                    <div className="w-full flex justify-between items-center">
                                        <h2 className="text-lg font-bold mb-4">Edit User Details</h2>
                                        <IoMdClose
                                            className="text-lg cursor-pointer"
                                            onClick={() => setUserEditForm(false)}
                                        />
                                    </div>

                                    <form className="w-full">
                                        <div className="w-full flex items-center space-x-4">
                                            <div className="w-full">
                                                <Label>First Name</Label>
                                                <Input
                                                    className='rounded-none'
                                                    placeholder='First Name'
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>First Name</Label>
                                                <Input
                                                    className='rounded-none'
                                                    placeholder='First Name'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>User Role</Label>
                                            <Select>
                                                <SelectTrigger className="rounded-none">
                                                    <SelectValue placeholder="Assign role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Moderator">Moderator</SelectItem>
                                                        <SelectItem value="User">User</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-full">
                                            <Label>Email</Label>
                                            <Input
                                                className='rounded-none'
                                                placeholder='Email'
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label>Phone Number</Label>
                                            <Input
                                                className='rounded-none'
                                                placeholder='Phone Number'
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label>Address</Label>
                                            <Input
                                                className='rounded-none'
                                                placeholder='Address'
                                            />
                                        </div>

                                    </form>

                                    <div className="w-full flex mt-4 space-x-4 justify-center">
                                        <Button
                                            onClick={() => setUserEditForm(false)}
                                            className="rounded-none text-white font-bold py-2 px-4"
                                        >
                                            Submit
                                        </Button>
                                        <Button
                                            variant='destructive'
                                            onClick={() => setUserEditForm(false)}
                                            className="rounded-none text-white font-bold py-2 px-4"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )
                }
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
                                <BreadcrumbPage>Users</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-xl font-bold mt-3">Users</h1>
                </div>

                <div className="bg-white">
                    <Table>
                        <TableCaption>A list of users.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{user.firstName + user.lastName}</TableCell>
                                        <TableCell>{'Role'}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center">
                                                <FaUserEdit
                                                    onClick={() => setUserEditForm(true)}
                                                    className="text-lg cursor-pointer"
                                                />
                                                <TiUserDelete className="text-lg mx-2 cursor-pointer" />
                                                <IoIosMail className="text-lg cursor-pointer" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan='12' className="text-center">Users not found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">$2,500.00</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                    <div className="py-3">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        2
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Users;
