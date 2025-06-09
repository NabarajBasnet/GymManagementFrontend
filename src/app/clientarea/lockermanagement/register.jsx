'use client'

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Box, Lock, Wrench, CircleOff } from "lucide-react";

const branches = [
    { id: "westside", name: "Westside Branch" },
    { id: "downtown", name: "Downtown Branch" },
    { id: "uptown", name: "Uptown Branch" },
    { id: "eastside", name: "Eastside Branch" },
];

const lockerTypes = [
    { id: "small", name: "Small (12x12x18 in)" },
    { id: "medium", name: "Medium (18x18x24 in)" },
    { id: "large", name: "Large (24x24x36 in)" },
    { id: "xlarge", name: "Extra Large (36x36x48 in)" },
];

const statusOptions = [
    { id: "available", name: "Available", icon: Lock, color: "bg-green-100 text-green-800" },
    { id: "maintenance", name: "Maintenance", icon: Wrench, color: "bg-yellow-100 text-yellow-800" },
    { id: "disabled", name: "Disabled", icon: CircleOff, color: "bg-red-100 text-red-800" },
];

const CreateLocker = () => {
    const [formData, setFormData] = useState({
        branch: "",
        numberOfLockers: 1,
        startingNumber: "",
        numberPattern: "LKR-{num}",
        lockerType: "",
        status: "available",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "numberOfLockers" ? Math.max(1, parseInt(value) || 1) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
        console.log("Form submitted:", formData);
        alert(`${formData.numberOfLockers} lockers created successfully!`);
    };

    const generatePreviewNumbers = () => {
        if (!formData.startingNumber) return [];

        const startNum = parseInt(formData.startingNumber) || 100;
        const count = Math.min(formData.numberOfLockers, 5); // Show max 5 in preview

        return Array.from({ length: count }, (_, i) => {
            const num = startNum + i;
            return formData.numberPattern.replace("{num}", num.toString());
        });
    };

    const selectedStatus = statusOptions.find(s => s.id === formData.status) || statusOptions[0];
    const StatusIcon = selectedStatus.icon;

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Register New Lockers</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="branch">Select Branch</Label>
                            <Select
                                value={formData.branch}
                                onValueChange={(value) => setFormData({ ...formData, branch: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numberOfLockers">Number of Lockers</Label>
                            <Input
                                type="number"
                                id="numberOfLockers"
                                name="numberOfLockers"
                                min="1"
                                value={formData.numberOfLockers}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startingNumber">Starting Number</Label>
                                <Input
                                    type="text"
                                    id="startingNumber"
                                    name="startingNumber"
                                    placeholder="e.g. 100"
                                    value={formData.startingNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="numberPattern">Number Pattern</Label>
                                <Input
                                    type="text"
                                    id="numberPattern"
                                    name="numberPattern"
                                    placeholder="e.g. LKR-{num}"
                                    value={formData.numberPattern}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lockerType">Locker Type</Label>
                            <Select
                                value={formData.lockerType}
                                onValueChange={(value) => setFormData({ ...formData, lockerType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select locker type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {lockerTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between space-y-2 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <Label htmlFor="status">Initial Status</Label>
                                <p className="text-sm text-muted-foreground">
                                    Set the initial status for all new lockers
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={selectedStatus.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {selectedStatus.name}
                                </Badge>
                                <Switch
                                    checked={formData.status === "available"}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, status: checked ? "available" : "maintenance" })
                                    }
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Create {formData.numberOfLockers} Lockers
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Locker Preview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Preview of the first {Math.min(formData.numberOfLockers, 5)} lockers to be created
                    </p>
                </CardHeader>
                <CardContent>
                    {!formData.startingNumber ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <Box className="h-10 w-10 text-gray-400 mb-4" />
                            <p className="text-gray-500">Enter details to see locker preview</p>
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
                                                        {formData.lockerType
                                                            ? lockerTypes.find(t => t.id === formData.lockerType)?.name.split(" ")[0]
                                                            : "No type"}
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

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2">Creation Summary</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">Branch:</div>
                                    <div>{formData.branch ? branches.find(b => b.id === formData.branch)?.name : "Not selected"}</div>

                                    <div className="text-muted-foreground">Total Lockers:</div>
                                    <div>{formData.numberOfLockers}</div>

                                    <div className="text-muted-foreground">Number Pattern:</div>
                                    <div>{formData.numberPattern}</div>

                                    <div className="text-muted-foreground">Locker Type:</div>
                                    <div>{formData.lockerType ? lockerTypes.find(t => t.id === formData.lockerType)?.name : "Not selected"}</div>

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