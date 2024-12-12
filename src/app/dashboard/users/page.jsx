'use client';

import Pagination from "@/components/ui/CustomPagination";
import { MdDelete, MdClose, MdError, MdDone, MdEmail } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
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
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/Pagination";

const Users = () => {

    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState();
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState();
    const [toast, setToast] = useState(false);
    const [responseType, setResponseType] = useState('');
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const responseResultType = ['Success', 'Failure'];
    const [editForm, setEditForm] = useState(false);
    const [userId, setUserId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 8;
    const [confirmDeleteUser, setConfirmDeleteUser] = useState({ value: false, userId: '' });
    const [isUserDeleting, setIsUserDeleting] = useState(false);
    const [user, setUser] = useState();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = useForm();

    const [role, setUserRole] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchAllUsers = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data: allUsers, isLoading } = useQuery({
        queryKey: ['users', currentPage, debouncedSearchQuery],
        queryFn: fetchAllUsers
    });

    const { users, totalUsers, totalPages } = allUsers || {};

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const fetchSingleUser = async (id) => {
        reset();
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/users/${id}`);
            const responseBody = await response.json();
            setUser(responseBody.user);
            setUserId(responseBody.user._id)
            if (response.status !== 200) {
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
                setToast(true);
            };
            if (response.status === 200 && response.ok) {
                setEditForm(true);
                reset();
            }
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const editUser = async (data) => {
        try {
            const { firstName, lastName, email, phoneNumber, dob, address } = data;
            const finalData = { firstName, lastName, email, phoneNumber, dob, address, role };
            const response = await fetch(`http://88.198.112.156:3000/api/users/update/${userId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData),
                credentials: 'include'
            });
            const responseBody = await response.json();
            if (response.status === 200) {
                setToast(true);
                setResponseType(responseResultType[0]);
                setTimeout(() => {
                    setToast(false);
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                })
                setEditForm(false);
                queryClient.invalidateQueries(['users'])
            }

            if (response.status !== 200) {
                setToast(true);
                setResponseType(responseResultType[1]);
                setTimeout(() => {
                    setToast(false);
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                })
            }
        } catch (error) {
            console.log("Error: ", error);
            setToast(true);
            setResponseType(responseResultType[1]);
            setTimeout(() => {
                setToast(false);
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message
            })
        }
    };

    const deleteUser = async (id) => {
        setIsUserDeleting(true);
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/users/remove/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const responseBody = await response.json();
            if (response.status === 200) {
                setToast(true);
                setResponseType(responseResultType[0]);
                setConfirmDeleteUser({ value: false, userId: '' });
                setTimeout(() => {
                    setToast(false);
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                })
                queryClient.invalidateQueries(['users']);
                setIsUserDeleting(false);
            }

            if (response.status !== 200) {
                setToast(true);
                setResponseType(responseResultType[1]);
                setTimeout(() => {
                    setToast(false);
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                })
            }
        } catch (error) {
            console.log("Error: ", error);
            setToast(true);
            setResponseType(responseResultType[1]);
            setTimeout(() => {
                setToast(false);
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message
            })
        }
    };

    return (
        <div className="w-full">
            <div className="w-full">
                <div className="w-full p-4">
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
                    <h1 className="text-2xl font-bold py-4">Users</h1>
                </div>

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

                {
                    confirmDeleteUser.value ? (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className={`bg-white border shadow-2xl px-3 rounded-md py-2 relative`}>
                                <div>
                                    <p className="text-red-600 text-sm font-semibold px-6 text-center my-4">Are you sure want to delete? This action will remove all the data from the server and will not be recover.</p>
                                </div>
                                <div className="flex justify-center items-center space-x-4">
                                    <Button onClick={() => setConfirmDeleteUser({ value: false, userId: '' })}
                                        className='rounded-md'
                                    >Cancel</Button>
                                    <Button className='bg-red-600 rounded-md hover:bg-red-600' onClick={() => deleteUser(confirmDeleteUser.userId)}>{isUserDeleting ? 'Deleting...' : "Delete"}</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                        </>
                    )
                }

                {
                    editForm ? (
                        <div>
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ease-out opacity-100">
                                <div className="flex justify-center bg-transparent p-4 rounded-sm shadow-lg w-full">
                                    <div className="bg-white p-4 rounded-sm shadow-lg md:w-8/12 w-full transform transition-transform duration-500 ease-out scale-100">
                                        <form className="w-full" onSubmit={handleSubmit(editUser)}>
                                            <div className="w-full flex items-center space-x-4">
                                                <div className="w-full">
                                                    <Label>First Name</Label>
                                                    <Input
                                                        {
                                                        ...register('firstName')
                                                        }
                                                        defaultValue={user.firstName}
                                                        className="rounded-none"
                                                        placeholder="First Name"
                                                    />
                                                </div>

                                                <div className="w-full">
                                                    <Label>Last Name</Label>
                                                    <Input
                                                        {
                                                        ...register('lastName')
                                                        }
                                                        defaultValue={user.lastName}
                                                        className="rounded-none"
                                                        placeholder="Last Name"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label>User Role</Label>
                                                <Select onValueChange={(value) => setUserRole(value)}>
                                                    <SelectTrigger className="rounded-none">
                                                        <SelectValue placeholder={user.role} />
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
                                                    defaultValue={user.email}
                                                    className="rounded-none"
                                                    placeholder="Email"
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>Phone Number</Label>
                                                <Input
                                                    {
                                                    ...register('phoneNumber')
                                                    }
                                                    defaultValue={user.phoneNumber}
                                                    className="rounded-none"
                                                    placeholder="Phone Number"
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>Address</Label>
                                                <Input
                                                    {
                                                    ...register('address')
                                                    }
                                                    defaultValue={user.address}
                                                    className="rounded-none"
                                                    placeholder="Address"
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>DOB</Label>
                                                <Input
                                                    {
                                                    ...register('dob')
                                                    }
                                                    defaultValue={new Date(user.dob).toISOString().split("T")[0]}
                                                    type='date'
                                                    className="rounded-none"
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
                                                    onClick={() => setEditForm(false)}
                                                    className="rounded-none text-white font-bold py-2 px-4"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )
                }

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full px-4">
                        <div className="w-full">
                            <div className="w-full px-4 py-1 flex justify-between items-center border rounded-md bg-white shadow-md">
                                <Input
                                    placeholder='Search user'
                                    className='border-none outline-none focus:outline-none bg-none'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <CiSearch
                                    className="text-xl"
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="w-full rounded-md bg-white shadow-md my-4">
                                <Table>
                                    <TableCaption className='my-4'>A list of users.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Full Name</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Email address</TableHead>
                                            <TableHead>Phone Number</TableHead>
                                            <TableHead>DOB</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map((user) => (
                                                <TableRow key={user._id}>
                                                    <TableCell className="font-medium">{user.firstName + ' ' + user.lastName}</TableCell>
                                                    <TableCell>{user.role}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.phoneNumber}</TableCell>
                                                    <TableCell>{new Date(user.dob).toISOString().split("T")[0]}</TableCell>
                                                    <TableCell>{user.address}</TableCell>
                                                    <TableCell className="text-right flex items-center space-x-2">
                                                        <FaUserEdit
                                                            onClick={() => fetchSingleUser(user._id)}
                                                            className="text-xl cursor-pointer"
                                                        />

                                                        <MdEmail className="text-xl cursor-pointer" />

                                                        <MdDelete
                                                            onClick={() => setConfirmDeleteUser({ value: true, userId: user._id })}
                                                            className="text-xl text-red-600 cursor-pointer"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center font-bold text-sm">
                                                    No users found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3}>Total</TableCell>
                                            <TableCell className="text-right">{totalUsers}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}
                <div className="py-3">
                    <Pagination
                        total={totalPages || 1}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                    />
                </div>
            </div>
        </div>
    )
}

export default Users;
