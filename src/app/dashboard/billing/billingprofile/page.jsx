'use client';

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
    CreditCard,
    FileStack,
    Edit,
    Eye,
    EyeOff
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Breadcrumb,
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
    const [openForm, setOpenForm] = useState(true);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const getBillingProfileDetails = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/accounting/billingprofile`);
            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                if (responseBody.billingProfile) {
                    // Set VAT registration status
                    setVatRegistered(responseBody.billingProfile.vatRegistered || false);

                    // Format the date properly for the input field
                    const registrationDate = responseBody.billingProfile.registrationDate
                        ? new Date(responseBody.billingProfile.registrationDate).toISOString().split('T')[0]
                        : '';

                    // Reset form with the fetched data
                    reset({
                        gymName: responseBody.billingProfile.gymName || '',
                        ownerName: responseBody.billingProfile.ownerName || '',
                        registrationDate: registrationDate,
                        fiscalMonth: responseBody.billingProfile.fiscalMonth || '',
                        panNo: responseBody.billingProfile.panNo || '',
                        irdNo: responseBody.billingProfile.irdNo || '',
                        businessResigtrationNo: responseBody.billingProfile.businessResigtrationNo || '',
                        address: responseBody.billingProfile.address || '',
                        district: responseBody.billingProfile.district || '',
                        wardNo: responseBody.billingProfile.wardNo || '',
                        phoneNo: responseBody.billingProfile.phoneNo || '',
                        email: responseBody.billingProfile.email || '',
                        bankDetails: responseBody.billingProfile.bankDetails || '',
                        footerNote: responseBody.billingProfile.footerNote || '',
                        additionalNote: responseBody.billingProfile.additionalNote || ''
                    });
                }
            }
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message || 'Failed to fetch billing profile');
            return { billingProfile: null, billingProfileLength: 0 };
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['billingprofile'],
        queryFn: getBillingProfileDetails
    });

    const { billingProfile, billingProfileLength } = data || {};

    // Control form visibility based on whether billing profile exists
    useEffect(() => {
        if (billingProfileLength >= 1) {
            setOpenForm(false); // Initially hide the form if profile exists
        }
    }, [billingProfileLength]);

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

            const response = await fetch(`http://88.198.112.156:3000/api/accounting/billingprofile`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalObject),
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                toast.success(responseBody.message || 'Profile updated successfully');
                queryClient.invalidateQueries(['billingprofile']);
                setOpenForm(false);
            } else {
                toast.error(responseBody.message || 'Failed to update profile');
            }

        } catch (error) {
            toast.error('Internal server error');
        }
    };

    const toggleForm = () => {
        setOpenForm(!openForm);
    };

    const getProfileDisplayData = () => {
        if (!billingProfile) return null;

        return {
            businessInfo: [
                { label: "Gym Name", value: billingProfile.gymName },
                { label: "Owner", value: billingProfile.ownerName },
                { label: "Registration Date", value: billingProfile.registrationDate ? new Date(billingProfile.registrationDate).toLocaleDateString() : '' },
                { label: "Fiscal Start Month", value: billingProfile.fiscalMonth }
            ],
            taxInfo: [
                { label: "PAN Number", value: billingProfile.panNo },
                { label: "VAT Registered", value: billingProfile.vatRegistered ? "Yes" : "No" },
                { label: "IRD Number", value: billingProfile.irdNo },
                { label: "Business Registration", value: billingProfile.businessResigtrationNo }
            ],
            contactInfo: [
                { label: "Address", value: billingProfile.address },
                { label: "District", value: billingProfile.district },
                { label: "Ward No.", value: billingProfile.wardNo },
                { label: "Phone", value: billingProfile.phoneNo },
                { label: "Email", value: billingProfile.email }
            ],
            bankingInfo: [
                { label: "Bank Details", value: billingProfile.bankDetails }
            ],
            additionalInfo: [
                { label: "Invoice Footer", value: billingProfile.footerNote },
                { label: "Additional Notes", value: billingProfile.additionalNote }
            ]
        };
    };

    return (
        <div className="w-full bg-gray-50 mx-auto py-6 px-4 md:px-6">
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-sm font-medium text-gray-600 hover:text-primary flex items-center">
                                <Home className="h-4 w-4 mr-1" /> Home
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

            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gym Billing Profile</h1>
                <p className="text-gray-500 text-sm mt-2">
                    Manage your gym's billing information and settings for invoices and receipts.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center p-12">
                    <Loader />
                </div>
            ) : (
                <>
                    {billingProfileLength >= 1 && (
                        <div className="mb-6 bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-900">Billing Profile Details</h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleForm}
                                        className="flex items-center gap-2"
                                    >
                                        {openForm ? (
                                            <>
                                                <EyeOff className="h-4 w-4" />
                                                Hide Form
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="h-4 w-4" />
                                                Edit Profile
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {!openForm && (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Profile Summary Display */}
                                        {getProfileDisplayData() && (
                                            <>
                                                <ProfileSection
                                                    title="Business Information"
                                                    icon={<Building className="h-5 w-5 text-blue-500" />}
                                                    items={getProfileDisplayData().businessInfo}
                                                />

                                                <ProfileSection
                                                    title="Tax Information"
                                                    icon={<FileText className="h-5 w-5 text-emerald-500" />}
                                                    items={getProfileDisplayData().taxInfo}
                                                />

                                                <ProfileSection
                                                    title="Contact Information"
                                                    icon={<Phone className="h-5 w-5 text-orange-500" />}
                                                    items={getProfileDisplayData().contactInfo}
                                                />

                                                <ProfileSection
                                                    title="Banking Information"
                                                    icon={<CreditCard className="h-5 w-5 text-purple-500" />}
                                                    items={getProfileDisplayData().bankingInfo}
                                                />

                                                <ProfileSection
                                                    title="Additional Information"
                                                    icon={<FileStack className="h-5 w-5 text-rose-500" />}
                                                    items={getProfileDisplayData().additionalInfo}
                                                    className="md:col-span-2"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(openForm || billingProfileLength === 0) && (
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gym Information */}
                                <Card className="border border-gray-200 shadow-md">
                                    <CardHeader className="bg-gray-100 border-b">
                                        <CardTitle className="flex items-center text-gray-900">
                                            <Building className="mr-2 h-5 w-5 text-blue-500" />
                                            Gym Information
                                        </CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Basic information about your gym business
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-6">
                                        <div>
                                            <Label className="font-medium text-gray-700">Gym Name*</Label>
                                            <Input
                                                type='text'
                                                {...register('gymName', { required: 'Gym name is required' })}
                                                placeholder='Enter gym name'
                                                className="mt-1"
                                            />
                                            {errors.gymName && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.gymName.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">Owner Name</Label>
                                            <Input
                                                type='text'
                                                {...register('ownerName', { required: 'Gym owner name is required' })}
                                                placeholder='Gym Owner Name'
                                                className="mt-1"
                                            />
                                            {errors.ownerName && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.ownerName.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">Registration Date*</Label>
                                            <Input
                                                {...register('registrationDate', { required: 'Business registration is required' })}
                                                type='date'
                                                className="mt-1"
                                            />
                                            {errors.registrationDate && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.registrationDate.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">Fiscal Start Month</Label>
                                            <Input
                                                type='text'
                                                {...register('fiscalMonth', { required: 'Fiscal month is required' })}
                                                placeholder='Eg:- Shrawan, April'
                                                className="mt-1"
                                            />
                                            {errors.fiscalMonth && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.fiscalMonth.message}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tax Information */}
                                <Card className="border border-gray-200 shadow-md">
                                    <CardHeader className="bg-gray-100 border-b">
                                        <CardTitle className="flex items-center text-gray-900">
                                            <FileText className="mr-2 h-5 w-5 text-emerald-500" />
                                            Tax Information
                                        </CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Details required for tax compliance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-6">
                                        <div>
                                            <Label className="font-medium text-gray-700">PAN Number*</Label>
                                            <Input
                                                type='text'
                                                {...register('panNo', { required: 'PAN no is required' })}
                                                placeholder='Enter PAN number'
                                                className="mt-1"
                                            />
                                            {errors.panNo && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.panNo.message}</p>
                                            )}
                                        </div>

                                        <div className='flex items-center justify-between space-x-2 bg-gray-50 p-3 rounded-md'>
                                            <Label className="font-medium text-gray-700">VAT Registered</Label>
                                            <Switch
                                                checked={vatRegistered}
                                                onCheckedChange={(value) => setVatRegistered(value)}
                                            />
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">IRD Number</Label>
                                            <Input
                                                type='text'
                                                {...register('irdNo', { required: 'IRD no is required' })}
                                                placeholder='Enter IRD number'
                                                className="mt-1"
                                            />
                                            {errors.irdNo && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.irdNo.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">Business Registration No.</Label>
                                            <Input
                                                type='text'
                                                {...register('businessResigtrationNo', { required: 'Business registration no is required' })}
                                                placeholder='Enter business registration number'
                                                className="mt-1"
                                            />
                                            {errors.businessResigtrationNo && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.businessResigtrationNo.message}</p>
                                            )}
                                        </div>

                                    </CardContent>
                                </Card>

                                {/* Contact Information */}
                                <Card className="border border-gray-200 shadow-md">
                                    <CardHeader className="bg-gray-100 border-b">
                                        <CardTitle className="flex items-center text-gray-900">
                                            <Phone className="mr-2 h-5 w-5 text-orange-500" />
                                            Contact Information
                                        </CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Address and contact details for your gym
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-6">
                                        <div>
                                            <Label className="font-medium text-gray-700">Address</Label>
                                            <Input
                                                type='text'
                                                {...register('address', { required: 'Business address no is required' })}
                                                placeholder='Enter full address'
                                                className="mt-1"
                                            />
                                            {errors.address && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.address.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">District</Label>
                                            <Input
                                                type='text'
                                                {...register('district', { required: 'Business district no is required' })}
                                                placeholder='District'
                                                className="mt-1"
                                            />
                                            {errors.district && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.district.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">Ward No.</Label>
                                            <Input
                                                type='text'
                                                {...register('wardNo', { required: 'Ward no is required' })}
                                                placeholder='Enter ward number'
                                                className="mt-1"
                                            />
                                            {errors.wardNo && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.wardNo.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="font-medium text-gray-700">Contact Number</Label>
                                                <Input
                                                    type='text'
                                                    {...register('phoneNo', { required: 'Phone no is required' })}
                                                    placeholder='Enter contact number'
                                                    className="mt-1"
                                                />
                                                {errors.phoneNo && (
                                                    <p className="text-sm font-medium text-red-600 mt-1">{errors.phoneNo.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="font-medium text-gray-700">Email</Label>
                                                <Input
                                                    type='email'
                                                    {...register('email', { required: 'Email is required' })}
                                                    placeholder='Enter email address'
                                                    className="mt-1"
                                                />
                                                {errors.email && (
                                                    <p className="text-sm font-medium text-red-600 mt-1">{errors.email.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Banking & Payment */}
                                <Card className="border border-gray-200 shadow-md">
                                    <CardHeader className="bg-gray-100 border-b">
                                        <CardTitle className="flex items-center text-gray-900">
                                            <CreditCard className="mr-2 h-5 w-5 text-purple-500" />
                                            Banking & Payment
                                        </CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Banking details for payments
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div>
                                            <Label className="font-medium text-gray-700">Back Account Details</Label>
                                            <Input
                                                type='text'
                                                {...register('bankDetails', { required: 'Enter bank details' })}
                                                placeholder='Enter bank name, account number, branch'
                                                className="mt-1"
                                            />
                                            {errors.bankDetails && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.bankDetails.message}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Additional Settings */}
                                <Card className="border border-gray-200 shadow-md md:col-span-2">
                                    <CardHeader className="bg-gray-100 border-b">
                                        <CardTitle className="flex items-center text-gray-900">
                                            <FileStack className="mr-2 h-5 w-5 text-rose-500" />
                                            Additional Settings
                                        </CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Custom notes and footer text
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-6">
                                        <div>
                                            <Label className="font-medium text-gray-700">Invoice Footer Note</Label>
                                            <Input
                                                type='text'
                                                {...register('footerNote', { required: 'Enter footer note' })}
                                                placeholder='Enter text to appear at the bottom of invoice'
                                                className="mt-1"
                                            />
                                            {errors.footerNote && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.footerNote.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="font-medium text-gray-700">Additional Notes</Label>
                                            <Input
                                                type='text'
                                                {...register('additionalNote')}
                                                placeholder='Any additional information or instructions'
                                                className="mt-1"
                                            />
                                            {errors.additionalNote && (
                                                <p className="text-sm font-medium text-red-600 mt-1">{errors.additionalNote.message}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Submit Button - Sticky at bottom */}
                            <div className="sticky bottom-0 bg-white pt-6 pb-6 shadow-md rounded-md z-10 border-t border-gray-200">
                                <div className="container mx-auto px-4 md:px-6">
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="animate-spin mr-2">⟳</span>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {billingProfileLength >= 1 ? 'Update Profile' : 'Save Profile'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </>
            )}
        </div>
    );
}

// Helper component to display profile sections
function ProfileSection({ title, icon, items, className = "" }) {
    return (
        <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
            <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
                {icon}
                <h3 className="font-medium ml-2 text-gray-800">{title}</h3>
            </div>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">{item.label}</span>
                        <span className="text-sm">{item.value || '—'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}