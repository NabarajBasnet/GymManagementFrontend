'use client'

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
import { Lock, Wrench, CircleOff } from "lucide-react";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { useForm } from "react-hook-form";
import { useQuery } from '@tanstack/react-query';

const lockerSizes = [
    { id: "Small", name: "Small" },
    { id: "Medium", name: "Medium" },
    { id: "Large", name: "Large" },
    { id: "Extra Large", name: "Extra Large" },
];

const statusOptions = [
    { id: "Available", name: "Available", icon: Lock, color: "bg-green-100 text-green-800" },
    { id: "Maintenance", name: "Maintenance", icon: Wrench, color: "bg-yellow-100 text-yellow-800" },
    { id: "Disabled", name: "Disabled", icon: CircleOff, color: "bg-red-100 text-red-800" },
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
    const multiBranchSupport = loggedInTenant?.subscription?.subscriptionFeatures?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    });

    // States
    const [selectedBranch, setSelectedBranch] = useState();
    const [lockerStatus, setLockerStatus] = useState("available");
    const noOfLockers = watch('numberOfLockers') || 1;
    const lockerSize = watch('lockerSize');

    // Get Organization Branches If Applicable
    const getBranches = async () => {
        try {
            const request = await fetch(`https://fitbinary.com/api/organizationbranch/tenant`);
            const resBody = await request.json();
            return resBody;
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message);
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: getBranches,
        enabled: !!(onTrail || multiBranchSupport)
    });

    const { branches: orgBranches } = data || {};

    const onSubmitLockers = async (data) => {
        try {
            const request = await fetch(`https://fitbinary.com/api/lockers`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const responseBody = await request.json();

            if (request.ok) {
                sonnerToast.success(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message);
        };
    };

    const generatePreviewNumbers = () => {
        const count = Math.min(noOfLockers, 5);
        return Array.from({ length: count }, (_, i) => {
            return `LKR-${i + 1}`;
        });
    };

    const selectedStatus = statusOptions.find(s => s.id === lockerStatus) || statusOptions[0];
    const StatusIcon = selectedStatus.icon;

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Form Section */}
            <Card className='dark:bg-gray-900 dark:border-none'>
                <CardHeader>
                    <CardTitle className="text-2xl">Register New Lockers</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmitLockers)} className="space-y-6">
                        {(onTrail || multiBranchSupport) && (
                            <div className="space-y-2">
                                <Label htmlFor="branch">Select Branch</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedBranch(value);
                                        setValue('branch', value);
                                    }}
                                >
                                    <SelectTrigger className="py-6 rounded-sm dark:border-none dark:bg-gray-700">
                                        <SelectValue placeholder="Select a branch" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-800 dark:border-none">
                                        <SelectGroup>
                                            <SelectLabel>Select</SelectLabel>
                                            {orgBranches?.map((branch) => (
                                                <SelectItem
                                                    className="cursor-pointer hover:bg-blue-500 hover:text-white"
                                                    key={branch._id}
                                                    value={branch._id}
                                                >
                                                    {branch.orgBranchName}
                                                </SelectItem>
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
                                className='py-6 bg-transparent rounded-sm dark:bg-gray-700 dark:text-white dark:border-none'
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

                        <Button
                            type="submit"
                            className="w-full py-6 rounded-sm dark:bg-blue-500 dark:text-white disabled:opacity-50"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Creating...
                                </div>
                            ) : (
                                `Create ${noOfLockers} Lockers`
                            )}
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
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {generatePreviewNumbers().map((lockerNumber, index) => (
                                <Card key={index} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-none">
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

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-blue-700 dark:border-blue-800">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Creation Summary</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-muted-foreground dark:text-gray-200">Branch:</div>
                                <div>{selectedBranch ? orgBranches?.find(b => b._id === selectedBranch)?.orgBranchName : "Not selected"}</div>

                                <div className="text-muted-foreground dark:text-gray-200">Total Lockers:</div>
                                <div>{noOfLockers}</div>

                                <div className="text-muted-foreground dark:text-gray-200">Locker Size:</div>
                                <div>{lockerSize || "Not selected"}</div>

                                <div className="text-muted-foreground dark:text-gray-200">Initial Status:</div>
                                <div>{selectedStatus.name}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateLocker;