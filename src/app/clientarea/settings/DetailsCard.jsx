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
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Personal Details Card */}
            <Card className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personal Details</h2>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Full Name</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{fullName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Phone</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{phone}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Address</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{address}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
                            <div className="flex gap-2">
                                <Badge variant={status === 'OnTrail' ? 'default' : 'outline'} className="text-xs px-2 py-0.5">
                                    {status}
                                </Badge>
                                <Badge variant={freeTrailStatus === 'Active' ? 'secondary' : 'outline'} className="text-xs px-2 py-0.5">
                                    {freeTrailStatus} Trial
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Trial Ends</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{formatDate(freeTrailEndsAt)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Organization Details Card */}
            <Card className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Organization</h2>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Business Name</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{organization?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Business Email</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{organization?.businessEmail}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Website</p>
                            <a href={organization?.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                {organization?.websiteUrl}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Location</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                {organization?.city}, {organization?.state}, {organization?.country}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Payment Provider</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{organization?.paymentProvider}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Last Updated</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{formatDate(organization?.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Notification Settings Card */}
            <Card className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                        <Bell className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h2>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                        </div>
                        <Badge variant={emailNotification ? 'default' : 'destructive'} className="text-xs px-2 py-0.5">
                            {emailNotification ? 'ON' : 'OFF'}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">SMS</span>
                        </div>
                        <Badge variant={smsNotification ? 'default' : 'destructive'} className="text-xs px-2 py-0.5">
                            {smsNotification ? 'ON' : 'OFF'}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">App</span>
                        </div>
                        <Badge variant={appNotification ? 'default' : 'destructive'} className="text-xs px-2 py-0.5">
                            {appNotification ? 'ON' : 'OFF'}
                        </Badge>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TenantDetailsCard;
