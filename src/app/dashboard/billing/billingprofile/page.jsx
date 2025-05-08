'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Home,
    Settings,
    ChevronRight,
    Save,
    Building,
    FileText,
    Phone,
    Mail,
    Calendar,
    Image,
    PenTool,
    CreditCard,
    FileStack,
    AlertTriangle
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";

export default function GymBillingProfileForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            gymName: "",
            gymCode: "",
            panNumber: "",
            vatRegistered: false,
            irdNumber: "",
            businessRegNo: "",
            registeredDate: null,
            ownerName: "",
            address: "",
            locationDistrict: "",
            wardNo: "",
            contactNumber: "",
            email: "",
            logoUrl: "",
            signatureUrl: "",
            bankDetails: "",
            fiscalStartMonth: "Shrawan",
            billPrefix: "",
            printFooterNote: "",
            customNotes: ""
        }
    });

    const { handleSubmit, formState: { errors } } = form;

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Here you would typically send the data to your API
            console.log("Form data:", data);

            // Simulate API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('Your gym billing profile has been successfully updated.')
        } catch (error) {
            toast.error('There was an error updating your gym billing profile. Please try again.')
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nepalDistricts = [
        "Kathmandu", "Lalitpur", "Bhaktapur", "Kaski", "Chitwan",
        "Morang", "Sunsari", "Jhapa", "Rupandehi", "Kavre",
        "Dang", "Banke", "Makwanpur", "Parsa", "Kailali",
        "Dhanusha", "Nawalparasi", "Siraha", "Palpa", "Bardiya"
    ];

    const nepaliMonths = [
        "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra",
        "Ashwin", "Kartik", "Mangsir", "Poush", "Magh",
        "Falgun", "Chaitra"
    ];

    return (
        <div className="w-full bg-gray-100 mx-auto py-6 px-4 md:px-6">
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-sm font-medium text-gray-600 hover:text-primary">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-gray-400" />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-gray-400" />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/billing" className="text-sm font-medium text-gray-600 hover:text-primary">
                                Billing
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-gray-400" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-sm font-medium text-primary">
                                Billing Profile
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="mb-6 bg-white p-4 rounded-md shadow-sm">
                <h1 className="text-2xl font-bold tracking-tight">Gym Billing Profile</h1>
                <p className="text-muted-foreground text-sm mt-2">
                    Manage your gym's billing information and settings for invoices and receipts.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gym Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Building className="mr-2 h-5 w-5" />
                                    Gym Information
                                </CardTitle>
                                <CardDescription>
                                    Basic information about your gym business
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="gymName"
                                    rules={{ required: "Gym name is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gym Name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter gym name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gymCode"
                                    rules={{
                                        required: "Gym code is required",
                                        maxLength: { value: 4, message: "Maximum 4 characters" },
                                        pattern: { value: /^[A-Z]*$/, message: "Only uppercase letters allowed" }
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gym Code*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. RF"
                                                    maxLength={4}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Max 4 uppercase characters (e.g., "NB", "RF")
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ownerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Owner Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter owner name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="registeredDate"
                                    rules={{ required: "Registration date is required" }}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Registration Date*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='date'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fiscalStartMonth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fiscal Start Month</FormLabel>
                                            <Select
                                                defaultValue="Shrawan"
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select month" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {nepaliMonths.map((month) => (
                                                        <SelectItem key={month} value={month}>
                                                            {month}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Fiscal year starting month</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Tax Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5" />
                                    Tax Information
                                </CardTitle>
                                <CardDescription>
                                    Details required for tax compliance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="panNumber"
                                    rules={{ required: "PAN number is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PAN Number*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter PAN number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="vatRegistered"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>VAT Registered</FormLabel>
                                                <FormDescription>
                                                    Toggle if your gym is registered for VAT
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="irdNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>IRD Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter IRD number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="businessRegNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Registration No.</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter business registration number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="billPrefix"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bill Prefix</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. GYM-" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Optional prefix for invoice numbering
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription>
                                    Address and contact details for your gym
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="address"
                                    rules={{ required: "Address is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address*</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter full address"
                                                    className="min-h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="locationDistrict"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>District</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select district" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {nepalDistricts.map((district) => (
                                                        <SelectItem key={district} value={district}>
                                                            {district}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="wardNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ward No.</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter ward number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="contactNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter contact number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        rules={{
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter email address"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Branding & Media */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Image className="mr-2 h-5 w-5" />
                                    Branding & Media
                                </CardTitle>
                                <CardDescription>
                                    Upload your gym logo and signature
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="logoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logo</FormLabel>
                                            <FormControl>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Input
                                                        id="logo"
                                                        type="file"
                                                        accept="image/*"
                                                        className="cursor-pointer"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                // In a real app, you would upload this file and set the URL
                                                                // For now, we'll use a placeholder or the existing value
                                                                field.onChange(file.name); // In real app: uploaded URL
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Or enter logo URL:
                                                    </p>
                                                    <Input
                                                        placeholder="https://example.com/logo.png"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Upload your gym logo for invoices and receipts
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="signatureUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Signature</FormLabel>
                                            <FormControl>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Input
                                                        id="signature"
                                                        type="file"
                                                        accept="image/*"
                                                        className="cursor-pointer"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                // In a real app, you would upload this file and set the URL
                                                                field.onChange(file.name); // In real app: uploaded URL
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Or enter signature URL:
                                                    </p>
                                                    <Input
                                                        placeholder="https://example.com/signature.png"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Upload your signature for invoices and official documents
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card> */}

                        {/* Banking & Payment */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Banking & Payment
                                </CardTitle>
                                <CardDescription>
                                    Banking details for payments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="bankDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Account Details</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter bank name, account number, branch, etc."
                                                    className="min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Include account number, bank name, branch and other payment information
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Additional Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileStack className="mr-2 h-5 w-5" />
                                    Additional Settings
                                </CardTitle>
                                <CardDescription>
                                    Custom notes and footer text
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="printFooterNote"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Invoice Footer Note</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter text to appear at the bottom of invoices"
                                                    className="min-h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Text to appear at the bottom of all invoices and receipts
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customNotes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Any additional information or instructions"
                                                    className="min-h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit Button - Sticky at bottom */}
                    <div className="sticky bottom-0 bg-background pt-6 pb-6 shadow-md rounded-md z-10">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin mr-2">⟳</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Billing Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};
