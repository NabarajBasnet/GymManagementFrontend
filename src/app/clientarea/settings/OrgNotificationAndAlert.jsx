"use client";

import { MapPin, Globe, Settings2Icon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { toast } from "sonner";

const OrganizationNotificationAndAlertSettings = () => {
    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant;

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            memberNotifications: {
                paymentReminders: false,
                invoiceAttachments: false,
                membershipRenewal: false,
                classReminders: false,
            },
            notificationPreferences: {
                email: false,
                sms: false,
                inApp: false,
            },
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/api/organization/notification-alert-setting`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data })
            });
            const resBody = await response.json();
            if (response.ok) {
                toast.success(resBody.message);
            } else {
                toast.error(resBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-2 md:px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Member Communications</CardTitle>
                        <CardDescription>
                            Control what notifications are sent to your organization members
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="payment-reminders">Payment Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send automated reminders for upcoming or overdue payments
                                </p>
                            </div>
                            <Controller
                                name="memberNotifications.paymentReminders"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="payment-reminders"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="invoice-attachments">Invoice Attachments</Label>
                                <p className="text-sm text-muted-foreground">
                                    Include PDF invoices with payment notifications
                                </p>
                            </div>
                            <Controller
                                name="memberNotifications.invoiceAttachments"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="invoice-attachments"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="membership-renewal">Membership Renewal Notices</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notify members before their membership expires
                                </p>
                            </div>
                            <Controller
                                name="memberNotifications.membershipRenewal"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="membership-renewal"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="class-reminders">Class Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send reminders for scheduled classes or personal training
                                </p>
                            </div>
                            <Controller
                                name="memberNotifications.classReminders"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="class-reminders"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                    </CardContent>
                </Card>

                <Card>
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
                            <Controller
                                name="notificationPreferences.email"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="email-notifications"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send text message notifications (additional charges may apply)
                                </p>
                            </div>
                            <Controller
                                name="notificationPreferences.sms"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="sms-notifications"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Show notifications within the gym management app
                                </p>
                            </div>
                            <Controller
                                name="notificationPreferences.inApp"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="in-app-notifications"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                    >
                        Reset
                    </Button>
                    <Button type="submit">Save Settings</Button>
                </div>
            </form>
        </div>
    );
};

export default OrganizationNotificationAndAlertSettings;