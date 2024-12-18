'use client';

import { BiLoaderCircle } from "react-icons/bi";
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
import { MdDelete, MdEdit, MdError, MdDone, MdClose } from "react-icons/md";
import Pagination from "@/components/ui/CustomPagination";
import { Label } from "@/components/ui/label";
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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../allmembers/allmembertable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Loader from "@/components/Loader/Loader";
import { usePagination } from "@/hooks/Pagination";

const PaymentDetails = () => {

    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10;
    const queryClient = useQueryClient();

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];

    const { control, formState: { errors, isSubmitting } } = useForm();

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    const { members } = data || {};

    const getPaymentDetails = async ({ queryKey }) => {
        const [, page, memberId] = queryKey
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/paymentdetails/${memberId}?page=${page}&limit=${limit}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: paymentDetails, isLoading: isPaymentDetailLoading } = useQuery({
        queryKey: ['paymentDetails', currentPage, memberId],
        queryFn: getPaymentDetails,
        enabled: !!memberId
    });

    const { paginatedPaymentDetails, totalPages, totalPaymentDetails } = paymentDetails || {}
    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const searchRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setRenderDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchFocus = () => {
        setRenderDropdown(true);
    };

    const deletePaymentDetail = async (id) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/paymentdetails/${id}`,
                {
                    method: "DELETE",
                });
            const responseBody = await response.json();
            if (response.ok) {
                setIsDeleting(false);
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                });
                queryClient.invalidateQueries(['paymentDetails']);
            }
        } catch (error) {
            console.log("Error: ", error);
            setIsDeleting(true);
            setResponseType(responseResultType[1]);
            setToast(false);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || 'Unauthorized action'
            });
        };
    };

    return (
        <div className="w-full">
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
                            <BreadcrumbLink href="/dashboard">dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>paymentdetails</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Payment Details</h1>
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

            <div className="w-full bg-white p-4">
                <form className="w-full flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full">
                        <Label className="block text-sm font-medium text-gray-700">Member Name</Label>
                        <div ref={searchRef} className="relative md:flex items-center m-2">
                            <Controller
                                name="memberName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            field.onChange(e);
                                        }}
                                        onFocus={handleSearchFocus}
                                        className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 md:py-0 py-2"
                                        placeholder="Search members..."
                                    />
                                )}
                            />
                            {errors.memberName && (
                                <p className="mt-1 text-sm font-semibold text-red-600">
                                    {errors.memberName.message}
                                </p>
                            )}

                            {renderDropdown && (
                                <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-80 overflow-y-auto z-20 top-full left-0">
                                    {members
                                        ?.filter((member) => {
                                            const matchByName = member.fullName
                                                .toLowerCase()
                                                .includes(searchQuery.toLowerCase());
                                            return matchByName;
                                        })
                                        .map((member) => (
                                            <p
                                                onClick={() => {
                                                    setMemberName(member.fullName);
                                                    setSearchQuery(member.fullName);
                                                    setMemberId(member._id);
                                                    setRenderDropdown(false);
                                                }}
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                                                key={member._id}
                                                value={member._id}
                                            >
                                                {member.fullName}
                                            </p>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                <div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-gray-200 text-black'>
                                    <TableHead>MemberId</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Action Taker</TableHead>
                                    <TableHead>Receipt No</TableHead>
                                    <TableHead>Paid Amount</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Renew</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Expire</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Reference Code</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(paginatedPaymentDetails) && paginatedPaymentDetails.length >= 1 ? (
                                    <>
                                        {paginatedPaymentDetails.map((detail) => (
                                            <TableRow key={detail._id}>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? detail.member._id : ''}</TableCell>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? detail.member.fullName : ''}</TableCell>
                                                <TableCell>{detail.actionTaker}</TableCell>
                                                <TableCell>{detail.receiptNo}</TableCell>
                                                <TableCell>{detail.paidAmmount}</TableCell>
                                                <TableCell>{detail.paymentDate ? new Date(detail.paymentDate).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? new Date(detail.member.membershipRenewDate).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell>{detail.membershipDuration}</TableCell>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? new Date(detail.member.membershipExpireDate).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell>{detail.paymentMethod}</TableCell>
                                                <TableCell>{detail.discount ? detail.discount : 'Null'}</TableCell>
                                                <TableCell>{detail.referenceCode}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <MdEdit className='cursor-pointer text-lg' />
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
                                                                        This action cannot be undone. This will permanently delete this payment detail
                                                                        and remove data from servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deletePaymentDetail(detail._id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center">No payment details recorded.</TableCell>
                                    </TableRow>
                                )}

                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total Payments</TableCell>
                                    <TableCell className="text-right">{totalPaymentDetails ? totalPaymentDetails : ''}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </div>

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

export default PaymentDetails;
