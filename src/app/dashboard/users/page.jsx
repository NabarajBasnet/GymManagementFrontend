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
import Loader from "@/components/Loader/Loader";
import { useForm } from "react-hook-form";


const Users = () => {

    const [fetchedUser, setFetchedUser] = useState(null);
    const [usersMessage, setUsersMessage] = useState('');
    const [userEditForm, setUserEditForm] = useState(false);
    const [toast, setToast] = useState(false);

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

    const getSingleUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`);
            const reponseBody = await response.json();
            if (response.ok) {
                setUserEditForm(true);
            };
            const { user, message } = reponseBody;
            setUsersMessage(message);
            setFetchedUser(user);
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: getSingleUser
    });

    const {
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting, errors },
        setError,
    } = useForm();


    const [role, setUserRole] = useState('');
    const editUserDetails = async (data) => {
        try {
            const { firstName, lastName, email, phoneNumber, address, dob } = data
            const finalData = { firstName, lastName, email, phoneNumber, address, dob, role }
            const response = await fetch(`http://localhost:5000/api/users/patch/${fetchedUser._id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ finalData })
            });

            const responseBody = await response.json();
            if (response.ok) {
                setUserEditForm(false);
            }
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 4000);
            setUsersMessage(responseBody.message);
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full">
                {toast ? (
                    <div className="fixed bottom-10 bg-white border shadow-2xl right-10 flex items-center justify-between p-4">
                        <div className="block">
                            <h1 className="font-bold">Patch request</h1>
                            <p className="text-sm font-semibold">{usersMessage}</p>
                        </div>
                        <div>
                            <IoMdClose
                                onClick={() => setToast(false)}
                                className="cursor-pointer ml-4" />
                        </div>
                    </div>
                ) : (
                    <>
                    </>
                )}

                {
                    userEditForm ? (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ease-out opacity-100">
                            <div className="flex justify-center bg-transparent p-4 rounded-sm shadow-lg w-full">
                                <div className="bg-white p-4 rounded-sm shadow-lg md:w-8/12 w-full transform transition-transform duration-500 ease-out scale-100">
                                    <div className="w-full flex justify-between items-center">
                                        <h2 className="text-lg font-bold mb-4">Edit User Details</h2>
                                        <IoMdClose
                                            className="text-lg cursor-pointer"
                                            onClick={() => setUserEditForm(false)}
                                        />
                                    </div>

                                    <form className="w-full" onSubmit={handleSubmit(editUserDetails)}>
                                        <div className="w-full flex items-center space-x-4">
                                            <div className="w-full">
                                                <Label>First Name</Label>
                                                <Input
                                                    {
                                                    ...register('firstName')
                                                    }
                                                    className="rounded-none"
                                                    placeholder="First Name"
                                                    defaultValue={fetchedUser.firstName}
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>Last Name</Label>
                                                <Input
                                                    {
                                                    ...register('lasstName')
                                                    }
                                                    className="rounded-none"
                                                    placeholder="Last Name"
                                                    defaultValue={fetchedUser.lastName}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>User Role</Label>
                                            <Select onValueChange={(value) => setUserRole(value)}>
                                                <SelectTrigger className="rounded-none">
                                                    <SelectValue placeholder={fetchedUser.role} />
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
                                                {
                                                ...register('email')
                                                }
                                                className="rounded-none"
                                                placeholder="Email"
                                                defaultValue={fetchedUser.email}
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label>Phone Number</Label>
                                            <Input
                                                {
                                                ...register('phoneNumber')
                                                }
                                                className="rounded-none"
                                                placeholder="Phone Number"
                                                defaultValue={fetchedUser.phoneNumber}
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label>Address</Label>
                                            <Input
                                                {
                                                ...register('address')
                                                }
                                                className="rounded-none"
                                                defaultValue={fetchedUser.address}
                                                placeholder="Address"
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label>DOB</Label>
                                            <Input
                                                {
                                                ...register('dob')
                                                }
                                                type='date'
                                                className="rounded-none"
                                                defaultValue={new Date(fetchedUser.dob).toISOString().split('T')[0]}
                                                placeholder="DOB"
                                            />
                                        </div>

                                        <div className="w-full flex mt-4 space-x-4 justify-center">
                                            <Button
                                                type='submit'
                                                className="rounded-none text-white font-bold py-2 px-4"
                                            >
                                                {isSubmitting ? 'Processing...' : "Submit"}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => setUserEditForm(false)}
                                                className="rounded-none text-white font-bold py-2 px-4"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
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
                                    </DropdownMenuTrigger>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/docs/components">Dashboard</BreadcrumbLink>
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
                    {
                        isLoading ? (
                            <Loader />
                        ) : (
                            <div>
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
                                                    <TableCell>{user.role}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.phoneNumber}</TableCell>
                                                    <TableCell>{user.address}</TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-center items-center">
                                                            <FaUserEdit
                                                                onClick={() => getSingleUser(user._id)}
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
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default Users;
