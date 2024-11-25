'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"

const MyProfile = () => {

    const [currentTime, setCurrentTime] = useState(null);
    const [staffDetails, setStaffDetails] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const fetchedLoggedStaffDetails = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/loggedin-staff`);
            const responseBody = await response.json();
            if (response.ok) {
                setStaffDetails(responseBody.loggedInStaff)
            }
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data: loggedinStaff, isLoading: isLoggedinStaffLoading } = useQuery({
        queryKey: ['loggedstaff'],
        queryFn: fetchedLoggedStaffDetails
    });

    const fetchStaffQr = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/staffqr/${staffDetails._id}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['qrcode'],
        queryFn: fetchStaffQr,
        enabled: !!staffDetails?._id
    });

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
    ]

    return (
        <div className="w-full">
            <h1 className="text-center text-4xl font-bold my-4">My Profile</h1>
            {isLoading || !data ? (
                <h1 className="text-center font-semibold">Loading...</h1>
            ) : (
                <div className="w-full flex items-center justify-center p-1">
                    <img src={data.qrCode} alt="QR Code" />
                </div>
            )}
            <div className="w-full">
                {currentTime ? (
                    <h1 className="text-center my-4">
                        Current Time: {currentTime.toISOString().split("T")[0]},{" "}
                        {currentTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        })}
                    </h1>
                ) : (
                    <h1 className="text-center font-semibold my-4">Loading current time...</h1>
                )}
            </div>
            <div className="w-full flex justify-center bg-black p-6 text-white">
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : (
                    <div className="w-full md:w-9/12">
                        <h1 className="text-3xl text-yellow-400 font-bold">{staffDetails.fullName} - {staffDetails.role}</h1>
                        <p>Shift: {staffDetails.shift}</p>
                    </div>
                )}

            </div>
            <div className="w-full max-w-md mx-auto bg-white shadow-xl my-4 rounded-lg p-6">
                {isLoading ? (
                    <h1 className="text-center items-center font-semibold">Loading...</h1>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Phone No:</span>
                            <span className="text-gray-600">{staffDetails.contactNo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-600">{staffDetails.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Date of Birth:</span>
                            <span className="text-gray-600">{new Date(staffDetails.dob).toISOString().split("T")[0]}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Address:</span>
                            <span className="text-gray-600">{staffDetails.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Role:</span>
                            <span className="text-gray-600">{staffDetails.role}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Joined Date:</span>
                            <span className="text-gray-600">{new Date(staffDetails.joinedDate).toISOString().split("T")[0]}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Gender:</span>
                            <span className="text-gray-600">{staffDetails.gender}</span>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h1>My Attendance History</h1>

                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Staff Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Remark</TableHead>
                            <TableHead>Late Flag</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

                <div className="my-4">
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
    )
}

export default MyProfile;
