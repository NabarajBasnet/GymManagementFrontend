"use client";

import { LuLoader } from "react-icons/lu";
import { Settings2Icon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const OrganizationNotificationAndAlertSettings = () => {
    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant;
    const organization = loggedInTenant?.organization;

    const [sendPortalLink, setSendPortalLink] = useState(true);
    const [paymentReminders, setPaymentReminders] = useState(false);
    const [invoiceAttachments, setInvoiceAttachments] = useState(false);
    const [membershipRenewal, setMembershipRenewal] = useState(false);
    const [classReminders, setClassReminders] = useState(false);
    const [saving, setSaving] = useState(false);

    const [email, setEmail] = useState(false);
    const [sms, setSMS] = useState(false);
    const [inApp, setInApp] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const finalData = {
            sendPortalLink, paymentReminders, invoiceAttachments, membershipRenewal, classReminders, email, sms, inApp
        };
        try {
            const response = await fetch(`https://fitbinary.com/api/organization/notification-alert-setting`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ finalData })
            });
            const resBody = await response.json();
            if (!response.ok) {
                setSaving(false);
                toast.error(resBody.message);
            } else {
                setSaving(false);
                toast.success(resBody.message);
            };
        } catch (error) {
            setSaving(false);
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    useEffect(() => {
        setSendPortalLink(organization?.sendPortalLink)
        setPaymentReminders(organization?.memberPaymentReminder)
        setInvoiceAttachments(organization?.sendInvoiceAttachments)
        setMembershipRenewal(organization?.membershipRenewalNotice)
        setClassReminders(organization?.classReminder)
        setEmail(organization?.emailNotification)
        setSMS(organization?.smsNotification)
        setInApp(organization?.inAppNotification)
    }, [organization, loggedInTenant])


    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
                <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Settings2Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Notification And Alert Settings
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Configure how and when your gym sends notifications to members and staff
                        </p>
                    </div>
                </div>
            </div>

            <form className="space-y-8 px-2 md:px-4 pb-4">
                <Card className='dark:bg-gray-900 dark:border-none rounded-xl'>
                    <CardHeader>
                        <CardTitle>Member Communications</CardTitle>
                        <CardDescription>
                            Control what notifications are sent to your organization members
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="portal-link">Portal Link</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send member portal link in their email
                                </p>
                            </div>
                            <Switch
                                id="sent-portallink"
                                checked={sendPortalLink}
                                onCheckedChange={() => setSendPortalLink(!sendPortalLink)}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="payment-reminders">Payment Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send automated reminders for upcoming or overdue payments
                                </p>
                            </div>
                            <Switch
                                id="payment-reminders"
                                checked={paymentReminders}
                                onCheckedChange={() => setPaymentReminders(!paymentReminders)}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="invoice-attachments">Invoice Attachments</Label>
                                <p className="text-sm text-muted-foreground">
                                    Include PDF invoices with payment notifications
                                </p>
                            </div>
                            <Switch
                                id="invoice-attachments"
                                checked={invoiceAttachments}
                                onCheckedChange={() => setInvoiceAttachments(!invoiceAttachments)}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="membership-renewal">Membership Renewal Notices</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notify members before their membership expires
                                </p>
                            </div>
                            <Switch
                                id="membership-renewal"
                                checked={membershipRenewal}
                                onCheckedChange={() => setMembershipRenewal(!membershipRenewal)}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="class-reminders">Class Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send reminders for scheduled classes or personal training
                                </p>
                            </div>
                            <Switch
                                id="class-reminders"
                                checked={classReminders}
                                onCheckedChange={() => setClassReminders(!classReminders)}
                            />
                        </div>

                        <div className="w-full flex justify-end py-4">
                            <Button
                                onClick={(e) => onSubmit(e)}
                                className='py-6 rounded-sm flex items-center space-x-1'
                            >
                                {saving ? <LuLoader className='animate-spin duration-500' /> : <Save />}
                                <span>
                                    {saving ? 'Saving...' : 'Save'}
                                </span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className='dark:bg-gray-900 dark:border-none rounded-xl'>
                    <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                            Choose how notifications should be delivered
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send notifications via email
                                </p>
                            </div>
                            <Switch
                                id="email-notifications"
                                checked={email}
                                onCheckedChange={() => setEmail(!email)}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send text message notifications (additional charges may apply)
                                </p>
                            </div>
                            <Switch
                                id="sms-notifications"
                                checked={sms}
                                onCheckedChange={() => setSMS(!sms)}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Show notifications within the gym management app
                                </p>
                            </div>
                            <Switch
                                id="in-app-notifications"
                                checked={inApp}
                                onCheckedChange={() => setInApp(!inApp)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default OrganizationNotificationAndAlertSettings;
