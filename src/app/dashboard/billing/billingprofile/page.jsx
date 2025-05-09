'use client';

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import Loader from "@/components/Loader/Loader";

export default function GymBillingProfileForm() {

    // Vat registered
    const [vatRegistered, setVatRegistered] = useState(false);

    // States
    const queryClient = useQueryClient();
    const { user } = useUser();
    const loggedInUser = user?.user;
    const userId = loggedInUser?._id
    const [openForm, setOpenForm] = useState(false);

    const getBillingProfileDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/billingprofile`);
            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                setVatRegistered(responseBody.billingProfile.vatRegistered);
                reset({
                    gymName: responseBody.billingProfile.gymName,
                    ownerName: responseBody.billingProfile.ownerName,
                    registrationDate: new Date(responseBody.billingProfile.registrationDate),
                    fiscalMonth: responseBody.billingProfile.fiscalMonth,
                    panNo: responseBody.billingProfile.panNo,

                    irdNo: responseBody.billingProfile.irdNo,
                    businessResigtrationNo: responseBody.billingProfile.businessResigtrationNo,
                    address: responseBody.billingProfile.address,
                    district: responseBody.billingProfile.district,
                    wardNo: responseBody.billingProfile.wardNo,
                    phoneNo: responseBody.billingProfile.phoneNo,
                    email: responseBody.billingProfile.email,
                    bankDetails: responseBody.billingProfile.bankDetails,

                    footerNote: responseBody.billingProfile.footerNote,
                    additionalNote: responseBody.billingProfile.additionalNote
                });
            };
            return responseBody;

        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.stack || '');
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['billingprofile'],
        queryFn: getBillingProfileDetails
    });

    const { billingProfile, billingProfileLength } = data || {};

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const {
                gymName,
                ownerName,
                registrationDate,
                fiscalMonth,
                panNo,
                irdNo,
                businessResigtrationNo,

                address,
                district,
                wardNo,
                phoneNo,
                email,

                bankDetails,

                footerNote,
                additionalNote,
            } = data;

            const finalObject = {
                gymName,
                ownerName,
                registrationDate,
                fiscalMonth,

                panNo,
                vatRegistered,
                irdNo,
                businessResigtrationNo,

                address,
                district,
                wardNo,
                phoneNo,
                email,

                bankDetails,

                footerNote,
                additionalNote,
                userId
            };

            const response = await fetch(`http://localhost:3000/api/accounting/billingprofile`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalObject),
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                reset();
                toast.success(responseBody.message || '');
                queryClient.invalidateQueries(['billingprofile']);
            };

        } catch (error) {
            toast.error('Internal server error');
        };
    };

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

            {billingProfileLength >= 1 ? (
                <div className='p-6 bg-white shadow-md mb-6 rounded-lg border'>
                    <div className="flex justify-between items-center">
                        <h1 className="text-sm font-semibold">View and edit you billing details</h1>

                        <MdOutlineRemoveRedEye className='cursor-pointer' onClick={() => setOpenForm(!openForm)} />
                    </div>
                </div>
            ) : (
                <div>
                </div>
            )}

            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    {openForm ? (
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                                        <div>
                                            <Label>Gym Name*</Label>
                                            <Input
                                                type='text'
                                                {...register('gymName', { required: 'Gym name is required' })}
                                                placeholder='Enter gym name'
                                            />
                                            {errors.gymName && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.gymName.message}`}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Owner Name</Label>
                                            <Input
                                                type='text'
                                                {...register('ownerName', { required: 'Gym owner name is required' })}
                                                placeholder='Gym Owner Name'
                                            />
                                            {errors.ownerName && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.ownerName.message}`}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Registration Date*</Label>
                                            <Input
                                                {...register('registrationDate', { required: 'Business registration is required' })}
                                                type='date'
                                            />
                                            {errors.registrationDate && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.registrationDate.message}`}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Fiscal Start Month</Label>
                                            <Input
                                                type='text'
                                                {...register('fiscalMonth', { required: 'Fiscal month is required' })}
                                                placeholder='Eg:- Shrawan, April'
                                            />
                                            {errors.fiscalMonth && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.fiscalMonth.message}`}</p>
                                            )}
                                        </div>
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
                                        <div>
                                            <Label>PAN Number*</Label>
                                            <Input
                                                type='text'
                                                {...register('panNo', { required: 'PAN no is required' })}
                                                placeholder='Enter PAN number'
                                            />
                                            {errors.panNo && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.panNo.message}`}</p>
                                            )}
                                        </div>

                                        <div className='flex flex-col items-start justify-start space-y-2'>
                                            <Label>VAT Registered</Label>
                                            <Switch
                                                checked={vatRegistered}
                                                onCheckedChange={(value) => setVatRegistered(value)}
                                            />
                                        </div>

                                        <div>
                                            <Label>IRD Number</Label>
                                            <Input
                                                type='text'
                                                {...register('irdNo', { required: 'IRD no is required' })}
                                                placeholder='Enter IRD number'
                                            />
                                            {errors.irdNo && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.irdNo.message}`}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Business Registration No.</Label>
                                            <Input
                                                type='text'
                                                {...register('businessResigtrationNo', { required: 'Business registration no is required' })}
                                                placeholder='Enter business registration number'
                                            />
                                            {errors.businessResigtrationNo && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.businessResigtrationNo.message}`}</p>
                                            )}
                                        </div>

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
                                        <div>
                                            <Label>Address</Label>
                                            <Input
                                                type='text'
                                                {...register('address', { required: 'Business address no is required' })}
                                                placeholder='Enter full address'
                                            />
                                            {errors.address && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.address.message}`}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Disctrict</Label>
                                            <Input
                                                type='text'
                                                {...register('district', { required: 'Business district no is required' })}
                                                placeholder='Disctrict'
                                            />
                                            {errors.district && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.district.message}`}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Ward No.</Label>
                                            <Input
                                                type='text'
                                                {...register('wardNo', { required: 'Ward no is required' })}
                                                placeholder='Enter ward number'
                                            />
                                            {errors.wardNo && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.wardNo.message}`}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Contact Number</Label>
                                                <Input
                                                    type='text'
                                                    {...register('phoneNo', { required: 'Phone no is required' })}
                                                    placeholder='Enter contact number'
                                                />
                                                {errors.phoneNo && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.phoneNo.message}`}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Email</Label>
                                                <Input
                                                    type='email'
                                                    {...register('email', { required: 'Email is required' })}
                                                    placeholder='Enter email address'
                                                />
                                                {errors.email && (
                                                    <p className="text-sm font-semibold text-red-600">{`${errors.email.message}`}</p>
                                                )}
                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>

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
                                        <div>
                                            <Label>Back Account Details</Label>
                                            <Input
                                                type='text'
                                                {...register('bankDetails', { required: 'Enter bank details' })}
                                                placeholder='Enter bank name, account number, branch,'
                                            />
                                            {errors.bankDetails && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.bankDetails.message}`}</p>
                                            )}
                                        </div>
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
                                        <div>
                                            <Label>Invoice Footer Note</Label>
                                            <Input
                                                type='text'
                                                {...register('footerNote', { required: 'Enter footer note' })}
                                                placeholder='Enter text to appear at the bottom of invoice'
                                            />
                                            {errors.footerNote && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.footerNote.message}`}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Additional Notes</Label>
                                            <Input
                                                type='text'
                                                {...register('additionalNote')}
                                                placeholder='Any additional information or instructions'
                                            />
                                            {errors.additionalNote && (
                                                <p className="text-sm font-semibold text-red-600">{`${errors.additionalNote.message}`}</p>
                                            )}
                                        </div>
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
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save & Edit Billing Profile
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};
