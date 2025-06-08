"use client";

import { Building2, CreditCard, Mail, MapPin, Phone, User, Calendar, Globe, Bell, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TenantDetailsCard = ({ tenantData }) => {
    const {
        fullName,
        email,
        phone,
        address,
        status,
        freeTrailStatus,
        freeTrailEndsAt,
        appNotification,
        emailNotification,
        smsNotification,
        organization
    } = tenantData;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tenant Personal Details Card */}
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Personal Details</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Full Name</h3>
                            <p className="text-gray-600 dark:text-gray-400">{fullName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Email</h3>
                            <p className="text-gray-600 dark:text-gray-400">{email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Phone</h3>
                            <p className="text-gray-600 dark:text-gray-400">{phone}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Address</h3>
                            <p className="text-gray-600 dark:text-gray-400">{address}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Status</h3>
                            <div className="flex gap-2 mt-1">
                                <Badge variant={status === 'OnTrail' ? 'success' : 'outline'} className={'p-2 px-3'}>
                                    {status}
                                </Badge>
                                <Badge variant={freeTrailStatus === 'Active' ? 'secondary' : 'outline'} className={'p-2 px-3'}>
                                    {freeTrailStatus} Trial
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Trial Ends</h3>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(freeTrailEndsAt)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Organization Details Card */}
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Organization Details</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Building2 className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Business Name</h3>
                            <p className="text-gray-600 dark:text-gray-400">{organization?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Business Email</h3>
                            <p className="text-gray-600 dark:text-gray-400">{organization?.businessEmail}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Website</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                <a href={organization?.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    {organization?.websiteUrl}
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Location</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {organization?.city}, {organization?.state}, {organization?.country}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Payment Provider</h3>
                            <p className="text-gray-600 dark:text-gray-400">{organization?.paymentProvider}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Last Updated</h3>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(organization?.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Notification Settings Card */}
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Notification Settings</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</span>
                        </div>
                        <Badge variant={emailNotification ? 'success' : 'destructive'} className={'p-2 px-3'}>
                            {emailNotification ? 'Enabled' : 'Disabled'}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">SMS Notifications</span>
                        </div>
                        <Badge variant={smsNotification ? 'success' : 'destructive'} className={'p-2 px-3'}>
                            {smsNotification ? 'Enabled' : 'Disabled'}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">App Notifications</span>
                        </div>
                        <Badge variant={appNotification ? 'success' : 'destructive'} className={'p-2 px-3'}>
                            {appNotification ? 'Enabled' : 'Disabled'}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Billing Information Card */}
            {organization?.billingAddress && (
                <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                            <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Billing Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Billing Address</h3>
                            <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                <p>{organization.billingAddress.addressLine1}</p>
                                {organization.billingAddress.addressLine2 && (
                                    <p>{organization.billingAddress.addressLine2}</p>
                                )}
                                <p>{organization.billingAddress.city}, {organization.billingAddress.state}</p>
                                <p>{organization.billingAddress.zipCode}, {organization.billingAddress.country}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">Tax ID</h3>
                                <p className="text-gray-600 dark:text-gray-400">{organization.taxId || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">Invoice Email</h3>
                                <p className="text-gray-600 dark:text-gray-400">{organization.invoiceEmail}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">Payment Account</h3>
                                <p className="text-gray-600 dark:text-gray-400">{organization.paymentAccountId}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TenantDetailsCard;