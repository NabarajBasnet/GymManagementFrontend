'use client';

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
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from 'react';
import { MdAutorenew } from "react-icons/md";
import { GiBiceps } from "react-icons/gi";
import { FaUsers } from "react-icons/fa6";
import { PiUsersFourFill } from "react-icons/pi";
import { RiUserShared2Fill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarChartMultiple } from "@/components/Charts/BarChart";
import { BarChartInterActive } from "@/components/Charts/barChartInteractive";
import { NewRadialChart } from "@/components/Charts/newRadialChart";
import { ShadSmallLineChart } from "@/components/Charts/ShadSmallLineChart";
import { RenewRadialChart } from "@/components/Charts/renewRadialChart";
import { usePagination } from "@/hooks/Pagination";
import Pagination from "@/components/ui/CustomPagination";

const AdminDashboard = () => {

  const router = useRouter();

  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;
  const [startDate, setStartDate] = useState(() => {
    let start = new Date();
    start.setDate(1);
    return start.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  const getTotalMembers = async () => {
    try {
      const response = await fetch(`http://88.198.112.156:3000/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`);
      const responseBody = await response.json();
      if (responseBody.redirect) {
        router.push(responseBody.redirect);
      };
      setData(responseBody);
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    };
  };

  React.useEffect(() => {
    getTotalMembers()
  }, []);

  React.useEffect(() => {
    getTotalMembers()
  }, [startDate, endDate]);

  const {
    members,
    totalMembers,
    totalPages,
    inactiveMembers,
    totalActiveMembers,
    totalInactiveMembers,
    dailyAverageActiveMembers,
    renewdMembers,
    renewdMembersLength,
    newAdmissions,
    newAdmissionsLength,
    totalRenewdMembersPages,
    totalNewMembersPages
  } = data || {};

  // console.log("Renewd Membership: ",renewdMembers);
  // console.log("New Membership: ",newAdmissions);

  const { range, setPage, active } = usePagination({
    total: totalPages ? totalPages : 1,
    siblings: 1,
    boundaries: 1,
    page: currentPage,
    onChange: (page) => {
      setCurrentPage(page);
    },
  });

  const gridContents = [
    {
      icon: FaUsers,
      text: "Total Membership",
      value: totalMembers,
      percentage: 1.1,
      color: 'text-blue-600',
      bg: 'bg-blue-200',
    },
    {
      icon: MdAutorenew,
      text: "Renew",
      value: renewdMembersLength,
      percentage: -1.5,
      color: 'text-green-600',
      bg: 'bg-green-200',
    },
    {
      icon: RiUserShared2Fill,
      text: "New Admission",
      value: newAdmissionsLength,
      percentage: +0.5,
      color: 'text-yellow-600',
      bg: 'bg-yellow-200',
    },
    {
      icon: GiBiceps,
      text: "Active",
      value: totalActiveMembers,
      percentage: -0.2,
      color: 'text-green-600',
      bg: 'bg-green-200',
    },
    {
      icon: FaUsers,
      text: "Average Active",
      value: dailyAverageActiveMembers,
      percentage: +3.9,
      color: 'text-blue-600',
      bg: 'bg-blue-200',
    },
    {
      icon: PiUsersFourFill,
      text: "Inactive",
      value: totalInactiveMembers,
      percentage: -4.5,
      color: 'text-red-600',
      bg: 'bg-red-200',
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full p-6">
        <div className="w-full">
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
                <BreadcrumbLink>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mt-4 mb-2 flex items-center space-x-4">
          <p className="font-semibold text-green-600">Note:</p>
          <p className="font-semibold text-red-600 text-sm mt-1">Default date will be starting of the currnet month, Change in field to override</p>
        </div>

        <form className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="font-bold">From</label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder='From'
              className="border px-3 py-1 rounded-none focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">To</label>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder='To'
              className="border px-3 py-1 rounded-none focus:outline-none cursor-pointer"
            />
          </div>
        </form>

        <div className="w-full py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {gridContents.map((grid) => (
              <div
                key={grid.text}
                className="bg-white py-3 px-5 cursor-pointer border-gray-50 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-md font-bold text-gray-800">{grid.text}</p>
                    <h1 className={`text-4xl my-1 font-bold ${grid.color}`}>
                      {grid.value}
                    </h1>
                  </div>
                  <div
                    className={`p-3 rounded-full flex items-center justify-center ${grid.bg}`}
                  >
                    <grid.icon className={`text-4xl ${grid.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full space-y-6">
          <div className="w-full bg-gray-50 items-center space-y-6">
            <BarChartMultiple />
            <ShadSmallLineChart />
          </div>
          <div className='bg-gray-50'>
            <BarChartInterActive />
            <RenewRadialChart />

            {/* <div className='bg-white rounded-md shadow-md mt-6'>
                <Table className='min-w-full'>
                    <TableHeader>
                        <TableRow className='text-white p-0'>
                            <TableHead className='text-pink-600'>Member Id</TableHead>
                            <TableHead className='text-pink-600'>Full Name</TableHead>
                            <TableHead className='text-pink-600'>Duration</TableHead>
                            <TableHead className='text-pink-600'>Option</TableHead>
                            <TableHead className='text-pink-600'>Renew</TableHead>
                            <TableHead className='text-pink-600'>Type</TableHead>
                            <TableHead className='text-pink-600'>Expire</TableHead>
                            <TableHead className='text-pink-600'>Contact No</TableHead>
                            <TableHead className='text-pink-600'>Shift</TableHead>
                            <TableHead className='text-pink-600'>Status</TableHead>
                            <TableHead className='text-pink-600'>Fee</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {newAdmissions && newAdmissions.length > 0 ? (
                            newAdmissions.map((member) => {
                                const textColor =
                                    member.status === 'Active' ? 'text-black' :
                                        member.status === 'OnHold' ? 'text-yellow-600' :
                                            'text-red-500';
                                return (
                                    <TableRow key={member._id} className={textColor}>
                                        <TableCell><p>{member._id}</p></TableCell>
                                        <TableCell>{member.fullName}</TableCell>
                                        <TableCell>{member.membershipDuration}</TableCell>
                                        <TableCell>{member.membershipOption}</TableCell>
                                        <TableCell>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell>{member.membershipType}</TableCell>
                                        <TableCell>{new Date(member.membershipExpireDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell>{member.contactNo}</TableCell>
                                        <TableCell>{member.membershipShift}</TableCell>
                                        <TableCell>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</TableCell>
                                        <TableCell>{member.paidAmmount}</TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow className='bg-pink-600 text-white'>
                                <TableCell colSpan={13} className="text-center">
                                    No new members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow className='bg-pink-600 text-white'>
                            <TableCell colSpan={3}>Total New Members</TableCell>
                            <TableCell className="text-right">{newAdmissionsLength}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

                <div className="py-3">
                    <Pagination
                        total={Math.ceil(newAdmissionsLength / 3)}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                    />
                </div>
            </div> */}

            <NewRadialChart />
{/* 
            <div className='bg-white rounded-md overflow-x-scroll shadow-md mt-6'>
                <Table className='min-w-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-emerald-600'>Member Id</TableHead>
                            <TableHead className='text-emerald-600'>Full Name</TableHead>
                            <TableHead className='text-emerald-600'>Duration</TableHead>
                            <TableHead className='text-emerald-600'>Option</TableHead>
                            <TableHead className='text-emerald-600'>Renew</TableHead>
                            <TableHead className='text-emerald-600'>Type</TableHead>
                            <TableHead className='text-emerald-600'>Expire</TableHead>
                            <TableHead className='text-emerald-600'>Contact No</TableHead>
                            <TableHead className='text-emerald-600'>Shift</TableHead>
                            <TableHead className='text-emerald-600'>Status</TableHead>
                            <TableHead className='text-emerald-600'>Fee</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renewdMembers && renewdMembers.length > 0 ? (
                            renewdMembers.map((member) => {
                                const textColor =
                                    member.status === 'Active' ? 'text-black' :
                                        member.status === 'OnHold' ? 'text-yellow-600' :
                                            'text-red-500';
                                return (
                                    <TableRow key={member._id} className={textColor}>
                                        <TableCell><p>{member._id}</p></TableCell>
                                        <TableCell>{member.fullName}</TableCell>
                                        <TableCell>{member.membershipDuration}</TableCell>
                                        <TableCell>{member.membershipOption}</TableCell>
                                        <TableCell>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell>{member.membershipType}</TableCell>
                                        <TableCell>{new Date(member.membershipExpireDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell>{member.contactNo}</TableCell>
                                        <TableCell>{member.membershipShift}</TableCell>
                                        <TableCell>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</TableCell>
                                        <TableCell>{member.paidAmmount}</TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow className='bg-emerald-600 text-white'>
                                <TableCell colSpan={13} className="text-center">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow className='bg-emerald-600 text-white'>
                            <TableCell colSpan={3}>Total Renewd Members</TableCell>
                            <TableCell className="text-right">{renewdMembersLength}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="py-3">
                    <Pagination
                        total={Math.ceil(renewdMembersLength / 3)}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                    />
                </div>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
