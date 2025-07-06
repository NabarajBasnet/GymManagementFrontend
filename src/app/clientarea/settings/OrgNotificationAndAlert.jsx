"use client";

import { MapPin, Globe, Settings2Icon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { Separator } from "@/components/ui/separator";

const OrganizationNotificationAndAlertSettings = () => {
    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant;

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            memberNotifications: {
                paymentReminders: true,
                invoiceAttachments: true,
                membershipRenewal: true,
                classReminders: true,
                bookingConfirmation: true,
            },
            staffNotifications: {
                newMemberSignup: true,
                paymentReceived: true,
                equipmentMaintenance: true,
                shiftReminders: true,
            },
            alertSettings: {
                lowAttendanceWarning: true,
                revenueTargetAlerts: true,
                inventoryAlerts: true,
                emergencyAlerts: true,
            },
            notificationPreferences: {
                email: true,
                sms: false,
                inApp: true,
            },
        },
    });

    const onSubmit = (data) => {
        console.log("Notification settings saved:", data);
        // Your logic here
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
                            Control what notifications are sent to your gym members
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

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="booking-confirmation">Booking Confirmations</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send confirmations when members book facilities or classes
                                </p>
                            </div>
                            <Controller
                                name="memberNotifications.bookingConfirmation"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="booking-confirmation"
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
                        <CardTitle>Staff Notifications</CardTitle>
                        <CardDescription>
                            Configure what alerts your staff receive about gym operations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="new-member-signup">New Member Signups</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notify staff when new members join the gym
                                </p>
                            </div>
                            <Controller
                                name="staffNotifications.newMemberSignup"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="new-member-signup"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="payment-received">Payment Received</Label>
                                <p className="text-sm text-muted-foreground">
                                    Alert staff when payments are successfully processed
                                </p>
                            </div>
                            <Controller
                                name="staffNotifications.paymentReceived"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="payment-received"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="equipment-maintenance">Equipment Maintenance Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notify staff when equipment requires maintenance
                                </p>
                            </div>
                            <Controller
                                name="staffNotifications.equipmentMaintenance"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="equipment-maintenance"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="shift-reminders">Shift Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Send reminders to staff about upcoming shifts
                                </p>
                            </div>
                            <Controller
                                name="staffNotifications.shiftReminders"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="shift-reminders"
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
                        <CardTitle>Alert Settings</CardTitle>
                        <CardDescription>
                            Configure critical alerts for gym management
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="low-attendance">Low Attendance Warnings</Label>
                                <p className="text-sm text-muted-foreground">
                                    Alert when class attendance falls below threshold
                                </p>
                            </div>
                            <Controller
                                name="alertSettings.lowAttendanceWarning"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="low-attendance"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="revenue-alerts">Revenue Target Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notify when revenue is below expected targets
                                </p>
                            </div>
                            <Controller
                                name="alertSettings.revenueTargetAlerts"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="revenue-alerts"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="inventory-alerts">Inventory Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Warn when supplement or merchandise stock is low
                                </p>
                            </div>
                            <Controller
                                name="alertSettings.inventoryAlerts"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="inventory-alerts"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                                <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Critical alerts for facility emergencies or closures
                                </p>
                            </div>
                            <Controller
                                name="alertSettings.emergencyAlerts"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="emergency-alerts"
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