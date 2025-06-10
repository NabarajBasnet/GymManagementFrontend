'use client'

import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Box, Lock, Wrench, CircleOff } from "lucide-react";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { useForm } from "react-hook-form";
import { useQuery } from '@tanstack/react-query';

const branches = [
    { id: "westside", name: "Westside Branch" },
    { id: "downtown", name: "Downtown Branch" },
    { id: "uptown", name: "Uptown Branch" },
    { id: "eastside", name: "Eastside Branch" },
];

const lockerSizes = [
    { id: "Small", name: "Small" },
    { id: "Medium", name: "Medium" },
    { id: "Large", name: "Large" },
    { id: "Extra Large", name: "Extra Large" },
];

const statusOptions = [
    { id: "available", name: "Available", icon: Lock, color: "bg-green-100 text-green-800" },
    { id: "maintenance", name: "Maintenance", icon: Wrench, color: "bg-yellow-100 text-yellow-800" },
    { id: "disabled", name: "Disabled", icon: CircleOff, color: "bg-red-100 text-red-800" },
];

const CreateLocker = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm();

    const { tenant } = useTenant()
    const loggedInTenant = tenant?.tenant;
    const onTrail = loggedInTenant?.freeTrailStatus === 'Active';

    // States
    const [selectedBranch, setSelectedBranch] = useState();
    const [lockerStatus, setLockerStatus] = useState("available");
    const noOfLockers = watch('numberOfLockers') || 1;
    const startingNumber = watch('startingNumber');
    const numberPattern = watch('numberPattern') || "LKR-{num}";
    const lockerSize = watch('lockerSize');

    // Get Organization Branches If Applicable
    const getBranches = async () => {
        try {
            const request = await fetch(`http://localhost:3000/api/organizationbranch/tenant`);
            const resBody = await request.json();
            return resBody;
        } catch (error) {
            console.log("Error: ", error);
            hotToast.error(error.message);
            sonnerToast.error(error.message);
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: getBranches,
        enabled: !!onTrail
    });

    const { branches: orgBranches } = data || {};

    const onSubmitLockers = async (data) => {
        try {
            const request = await fetch(`http://localhost:3000/api/lockers`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const responseBody = await request.json();

            if (request.ok) {
                hotToast.success(responseBody.message);
                sonnerToast.success(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            hotToast.error(error.message);
            sonnerToast.error(error.message);
        };
    };

    const generatePreviewNumbers = () => {
        const startNum = parseInt(startingNumber) || 100;
        const count = Math.min(noOfLockers, 5);

        return Array.from({ length: count }, (_, i) => {
            const num = startNum + i;
            return numberPattern.replace("{num}", num.toString());
        });
    };

    const selectedStatus = statusOptions.find(s => s.id === lockerStatus) || statusOptions[0];
    const StatusIcon = selectedStatus.icon;

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card className='dark:bg-gray-900 dark:border-none'>
                <CardHeader>
                    <CardTitle className="text-2xl">Register New Lockers</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmitLockers)} className="space-y-6">
                        {onTrail && (
                            <div className="space-y-2">
                                <Label htmlFor="branch">Select Branch</Label>
                                <Select onValueChange={(value) => {
                                    setSelectedBranch(value);
                                    setValue('branch', value);
                                }}>
                                    <SelectTrigger className='py-6 rounded-sm dark:border-none dark:bg-gray-700'>
                                        <SelectValue placeholder="Select a branch" />
                                    </SelectTrigger>
                                    <SelectContent className='dark:bg-gray-800 dark:border-none'>
                                        <SelectGroup>
                                            <SelectLabel>Select</SelectLabel>
                                            {orgBranches?.map((branch) =>
                                            (<SelectItem className='cursor-pointer hover:bg-blue-500 hover:text-white' key={branch._id} value={branch._id}>{branch.orgBranchName}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="numberOfLockers">Number of Lockers</Label>
                            <Input
                                {...register('numberOfLockers')}
                                className='py-6 rounded-sm dark:bg-gray-700 dark:text-white dark:border-none'
                                type="number"
                                defaultValue={1}
                                id="numberOfLockers"
                                name="numberOfLockers"
                                min="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lockerType">Locker Size</Label>
                            <Select onValueChange={(value) => setValue('lockerSize', value)}>
                                <SelectTrigger className='py-6 rounded-sm dark:border-none dark:bg-gray-700'>
                                    <SelectValue placeholder="Select locker size" />
                                </SelectTrigger>
                                <SelectContent className='dark:bg-gray-800 dark:border-none'>
                                    <SelectGroup>
                                        {lockerSizes.map((type) => (
                                            <SelectItem className='cursor-pointer hover:bg-blue-500 hover:text-white' key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <Label htmlFor="status">Initial Status</Label>
                                <p className="text-sm dark:text-gray-200">
                                    Set the initial status for all new lockers
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={selectedStatus.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {selectedStatus.name}
                                </Badge>
                                <Switch
                                    checked={lockerStatus === "available"}
                                    onCheckedChange={(checked) => {
                                        const newStatus = checked ? "available" : "disabled";
                                        setLockerStatus(newStatus);
                                        setValue('status', newStatus);
                                    }}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full py-6 rounded-sm dark:bg-blue-500 dark:text-white" size="lg">
                            Create {noOfLockers} Lockers
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className='dark:bg-gray-900 dark:border-none'>
                <CardHeader>
                    <CardTitle className="text-2xl">Locker Preview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Preview of the first {Math.min(noOfLockers, 5)} lockers to be created
                    </p>
                </CardHeader>
                <CardContent>
                    {!startingNumber ? (
                        <div className="flex flex-col items-center justify-center h-64 dark:bg-blue-500 bg-gray-50 rounded-lg">
                            <Box className="h-10 w-10 text-gray-400 dark:text-white mb-4" />
                            <p className="text-gray-500 dark:text-white">Enter starting number to see locker preview</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {generatePreviewNumbers().map((lockerNumber, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{lockerNumber}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {lockerSize || "No size specified"}
                                                    </p>
                                                </div>
                                                <Badge className={selectedStatus.color}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {selectedStatus.name}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-blue-900 dark:border-blue-800">
                                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Creation Summary</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">Branch:</div>
                                    <div>{selectedBranch ? orgBranches?.find(b => b._id === selectedBranch)?.orgBranchName : "Not selected"}</div>

                                    <div className="text-muted-foreground">Total Lockers:</div>
                                    <div>{noOfLockers}</div>

                                    <div className="text-muted-foreground">Number Pattern:</div>
                                    <div>{numberPattern}</div>

                                    <div className="text-muted-foreground">Locker Size:</div>
                                    <div>{lockerSize || "Not selected"}</div>

                                    <div className="text-muted-foreground">Initial Status:</div>
                                    <div>{selectedStatus.name}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateLocker;