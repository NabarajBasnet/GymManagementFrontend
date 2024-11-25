'use client';

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const MyProfile = () => {
    const [currentTime, setCurrentTime] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchStaffDetails = async () => {
        const res = await fetch(`http://88.198.112.156:3000/api/loggedin-staff`);
        if (!res.ok) throw new Error("Failed to fetch staff details");
        const data = await res.json();
        return data.loggedInStaff;
    };

    const {
        data: staffDetails,
        isLoading: isStaffLoading,
        error: staffError,
    } = useQuery({
        queryKey: ['staffDetails'],
        queryFn: fetchStaffDetails,
    });

    const fetchStaffQr = async () => {
        if (!staffDetails?.id) return null;
        const res = await fetch(`http://88.198.112.156:3000/api/staffqr/${staffDetails.id}`);
        if (!res.ok) throw new Error("Failed to fetch QR code");
        const data = await res.json();
        return data;
    };

    const {
        data: qrData,
        isLoading: isQrLoading,
        error: qrError,
    } = useQuery({
        queryKey: ['staffQr'],
        queryFn: fetchStaffQr,
        enabled: !!staffDetails?.id,
    });

    const attendanceData = [
        {
            id: "ST001",
            name: "John Doe",
            email: "john.doe@example.com",
            checkIn: "2024-11-24 08:00 AM",
            checkOut: "2024-11-24 05:00 PM",
            remark: "On Time",
            lateFlag: "No",
        },
        {
            id: "ST002",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            checkIn: "2024-11-24 08:30 AM",
            checkOut: "2024-11-24 05:30 PM",
            remark: "Late by 30 min",
            lateFlag: "Yes",
        },
    ];

    return (
        <div className="w-full p-4">
            <h1 className="text-center text-4xl font-bold my-4">My Profile</h1>

            {isQrLoading ? (
                <h2 className="text-center">Loading QR Code...</h2>
            ) : qrError ? (
                <h2 className="text-center text-red-500">Failed to load QR Code</h2>
            ) : (
                qrData?.qrCode && (
                    <div className="flex justify-center">
                        <img src={qrData.qrCode} alt="QR Code" className="w-32 h-32" />
                    </div>
                )
            )}

            <div className="my-4">
                {currentTime && (
                    <h2 className="text-center">
                        Current Time: {currentTime.toLocaleDateString()}{" "}
                        {currentTime.toLocaleTimeString()}
                    </h2>
                )}
            </div>

            {isStaffLoading ? (
                <h2 className="text-center">Loading staff details...</h2>
            ) : staffError ? (
                <h2 className="text-center text-red-500">Failed to load staff details</h2>
            ) : staffDetails ? (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {staffDetails.fullName} - {staffDetails.role}
                    </h2>
                    <ul className="space-y-2">
                        <li>
                            <strong>Email:</strong> {staffDetails.email}
                        </li>
                        <li>
                            <strong>Phone:</strong> {staffDetails.contactNo}
                        </li>
                        <li>
                            <strong>Address:</strong> {staffDetails.address}
                        </li>
                        <li>
                            <strong>Date of Birth:</strong>{" "}
                            {new Date(staffDetails.dob).toLocaleDateString()}
                        </li>
                        <li>
                            <strong>Gender:</strong> {staffDetails.gender}
                        </li>
                        <li>
                            <strong>Shift:</strong> {staffDetails.shift}
                        </li>
                        <li>
                            <strong>Joined Date:</strong>{" "}
                            {new Date(staffDetails.joinedDate).toLocaleDateString()}
                        </li>
                    </ul>
                </div>
            ) : (
                <h2 className="text-center">No staff details available</h2>
            )}

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">My Attendance History</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Remark</TableHead>
                            <TableHead>Late Flag</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceData.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.id}</TableCell>
                                <TableCell>{record.name}</TableCell>
                                <TableCell>{record.email}</TableCell>
                                <TableCell>{record.checkIn}</TableCell>
                                <TableCell>{record.checkOut}</TableCell>
                                <TableCell>{record.remark}</TableCell>
                                <TableCell>{record.lateFlag}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
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
    );
};

export default MyProfile;
