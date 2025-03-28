'use client';

import { IoSearch } from "react-icons/io5";
import { BiLoaderCircle } from "react-icons/bi";
import Pagination from "@/components/ui/CustomPagination";
import { MdDelete, MdClose, MdError, MdDone, MdEmail } from "react-icons/md";
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
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/Pagination";

const Users = () => {

    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [toast, setToast] = useState(false);
    const [responseType, setResponseType] = useState('');
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const responseResultType = ['Success', 'Failure'];
    const [editForm, setEditForm] = useState(false);
    const [userId, setUserId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [confirmDeleteUser, setConfirmDeleteUser] = useState({ value: false, userId: '' });
    const [isUserDeleting, setIsUserDeleting] = useState(false);
    const [user, setUser] = useState();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
        control
    } = useForm();

    const [role, setUserRole] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery, limit]);

    const fetchAllUsers = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data: allUsers, isLoading } = useQuery({
        queryKey: ['users', currentPage, debouncedSearchQuery, limit],
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

    useEffect(() => {
        fetchAllUsers();
    }, [limit]);

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalUsers);

    const fetchSingleUser = async (id) => {
        reset();
        try {
            const response = await fetch(`http://localhost:3000/api/users/${id}`);
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
                reset({
                    firstName: responseBody.user.firstName,
                    lastName: responseBody.user.lastName,
                    role: responseBody.user.role,
                    email: responseBody.user.email,
                    phoneNumber: responseBody.user.phoneNumber,
                    address: responseBody.user.address,
                    dob: responseBody.user.dob ? new Date(responseBody.user.dob).toISOString().split('T')[0] : ''
                });
                setEditForm(true);
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
            const response = await fetch(`http://localhost:3000/api/users/update/${userId}`, {
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
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/users/remove/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const responseBody = await response.json();
            if (response.status === 200) {
                setIsDeleting(false);
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
            setIsDeleting(false);
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
            <div className="w-full"
                onClick={() => setToast(false)}>
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
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Users</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl font-bold py-4">Users</h1>
                </div>

                {toast && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
                            onClick={() => setToast(false)}
                        ></div>

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
                                        {responseType === 'Success'
                                            ? "Your request has been successful. Please check the email inbox."
                                            : "Couldn't process your request. Check your network or try different credentials."}
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        {responseType === 'Success' ? (
                                            <button className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline">
                                                Resend Email
                                            </button>
                                        ) : (
                                            <button className="text-xs font-medium text-rose-700 hover:text-rose-900 underline">
                                                Retry Now
                                            </button>
                                        )}
                                        <span className="text-gray-400">|</span>
                                        <button
                                            className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
                                            onClick={() => setToast(false)}>
                                            Dismiss
                                        </button>
                                    </div>
                                </div>

                                <MdClose
                                    onClick={() => setToast(false)}
                                    className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition mt-0.5"
                                />
                            </div>
                        </div>
                    </>
                )}

                {isDeleting ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                            <div className="w-full flex items-center">
                                <BiLoaderCircle className="text-xl animate-spin duration-500 transition-all mx-6" />
                                <h1>Deleting <span className="animate-pulse duration-500 transition-all">...</span></h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {
                    editForm ? (
                        <div>
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ease-out opacity-100">
                                <div className="flex justify-center bg-transparent p-4 rounded-sm shadow-lg w-full">
                                    <div className="bg-white p-8 rounded-lg shadow-lg md:w-6/12 w-full transform transition-transform duration-500 ease-out scale-100">
                                        <form className="w-full" onSubmit={handleSubmit(editUser)}>
                                            <div className="w-full flex items-center space-x-4">
                                                <div className="w-full">
                                                    <Label>First Name</Label>
                                                    <Controller
                                                        name="firstName"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                value={field.value}
                                                                onChange={(e) => field.onChange(e)}
                                                                {
                                                                ...register('firstName')
                                                                }
                                                                className="rounded-md"
                                                                placeholder="First Name"
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="w-full">
                                                    <Label>Last Name</Label>
                                                    <Controller
                                                        name="lastName"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                value={field.value}
                                                                onChange={(e) => field.onChange(e)}
                                                                {
                                                                ...register('lastName')
                                                                }
                                                                className="rounded-md"
                                                                placeholder="Last Name"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label>User Role</Label>
                                                <Controller
                                                    name="role"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <select
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => {
                                                                setUserRole(e.target.value)
                                                                field.onChange(e)
                                                            }}
                                                            className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                        >
                                                            <option>Select</option>
                                                            <option value="Super Admin">Super Admin</option>
                                                            <option value="Gym Admin">Gym Admin</option>
                                                            <option value="Operation Manager">Operation Manager</option>
                                                            <option value="Developer">Developer</option>
                                                            <option value="CEO">CEO</option>
                                                            <option value="HR Manager">HR Manager</option>
                                                        </select>
                                                    )}
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>Email</Label>
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e)}
                                                            {
                                                            ...register('email')
                                                            }
                                                            className="rounded-md"
                                                            placeholder="Email"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>Phone Number</Label>
                                                <Controller
                                                    name="phoneNumber"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e)}
                                                            {
                                                            ...register('phoneNumber')
                                                            }
                                                            className="rounded-md"
                                                            placeholder="Phone Number"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>Address</Label>
                                                <Controller
                                                    name="address"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e)}
                                                            {
                                                            ...register('address')
                                                            }
                                                            className="rounded-md"
                                                            placeholder="Address"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label>DOB</Label>
                                                <Controller
                                                    name="dob"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e)}
                                                            {
                                                            ...register('dob')
                                                            }
                                                            type='date'
                                                            className="rounded-md"
                                                            placeholder="DOB"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="w-full flex mt-4 space-x-4 justify-center">
                                                <Button
                                                    type='submit'
                                                    className="rounded-md text-white font-bold py-2 px-4"
                                                >
                                                    {isSubmitting ? 'Processing...' : "Submit"}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => setEditForm(false)}
                                                    className="rounded-md text-white font-bold py-2 px-4"
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
                <div className="w-full md:flex justify-between items-center bg-gray-100 px-4">
                    <div className="w-full md:w-6/12 flex items-center gap-3 px-4 rounded-lg">
                        <h1 className="text-sm font-semibold text-gray-700">Show</h1>
                        <select
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value={totalUsers}>All</option>
                        </select>
                        <h1 className="text-sm font-semibold text-gray-700">users</h1>
                        <p className="text-sm text-gray-500 italic">Selected Limit: {limit}</p>
                    </div>
                    <div className="w-full md:w-6/12 flex bg-white items-center border-b px-4 my-2">
                        <IoSearch />
                        <Input
                            className='rounded-none border-none bg-transparent'
                            placeholder='Search users...'
                            value={searchQuery}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setSearchQuery(e.target.value);
                            }
                            }
                        />
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full">
                        <div className="w-full">
                            <div className="w-full bg-white my-4">
                                <Table>
                                    <TableCaption className='my-4'>A list of users.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Full Name</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Email address</TableHead>
                                            <TableHead>Phone Number</TableHead>
                                            <TableHead>DOB</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map((user) => (
                                                <TableRow key={user._id}>
                                                    <TableCell className="font-medium">
                                                        <span>{user.firstName}</span>
                                                        <span>{' '}</span>
                                                        <span>{user.lastName}</span>
                                                    </TableCell>
                                                    <TableCell>{user.role}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.phoneNumber}</TableCell>
                                                    <TableCell>{new Date(user.dob).toISOString().split("T")[0]}</TableCell>
                                                    <TableCell>{user.address}</TableCell>
                                                    <TableCell className="text-right flex items-center">
                                                        <FaUserEdit
                                                            onClick={() => fetchSingleUser(user._id)}
                                                            className="text-lg cursor-pointer"
                                                        />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <MdEmail
                                                                    className='cursor-pointer text-lg'
                                                                />
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action will send QR attached to {user.firstName}, Are you sure about that?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <MdDelete
                                                                    className="cursor-pointer text-red-600 text-lg"
                                                                />
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete user detail
                                                                        and remove data from servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deleteUser(user._id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={0} className="text-center font-bold text-sm">
                                                    No users found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell className="text-left" colSpan={0}>Total Users</TableCell>
                                            <TableCell className="text-left">{totalUsers || 'Total Users'}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}
                <div className='border-t border-gray-600'>
                    <div className="mt-4 px-4 md:flex justify-between items-center">
                        <p className="font-medium text-center text-sm font-gray-700">
                            Showing <span className="font-semibold text-sm font-gray-700">{startEntry}</span> to <span className="font-semibold text-sm font-gray-700">{endEntry}</span> of <span className="font-semibold">{totalUsers}</span> entries
                        </p>
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
        </div>
    )
}

export default Users;
