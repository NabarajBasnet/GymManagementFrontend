
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Documentation = () => {
    return (
        <div className="space-y-6 w-full">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📚 Locker Management Documentation
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                    <div className="space-y-6">

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Overview</h2>
                            <p className="text-slate-600 mb-4">
                                The Locker Management system allows gym administrators to efficiently manage lockers across multiple branches.
                                This includes creating, monitoring, and maintaining lockers with different types and statuses.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Locker Types</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="p-4 border rounded-lg bg-blue-50">
                                    <Badge className="bg-blue-100 text-blue-800 mb-2">Small</Badge>
                                    <p className="text-sm">Standard size lockers for basic storage needs. Ideal for gym clothes and small personal items.</p>
                                </div>
                                <div className="p-4 border rounded-lg bg-purple-50">
                                    <Badge className="bg-purple-100 text-purple-800 mb-2">Medium</Badge>
                                    <p className="text-sm">Medium-sized lockers with additional space for larger items like sports equipment.</p>
                                </div>
                                <div className="p-4 border rounded-lg bg-yellow-50">
                                    <Badge className="bg-yellow-100 text-yellow-800 mb-2">VIP</Badge>
                                    <p className="text-sm">Premium lockers with enhanced security features and maximum storage space.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Locker Statuses</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                                    <Badge className="bg-green-100 text-green-800">✅ Available</Badge>
                                    <span className="text-sm">Locker is ready for assignment to members</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200">
                                    <Badge className="bg-red-100 text-red-800">🔴 Occupied</Badge>
                                    <span className="text-sm">Locker is currently assigned to a member</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                                    <Badge className="bg-yellow-100 text-yellow-800">⚙️ Maintenance</Badge>
                                    <span className="text-sm">Locker requires maintenance or repair</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                                    <Badge className="bg-gray-100 text-gray-800">❌ Disabled</Badge>
                                    <span className="text-sm">Locker is temporarily out of service</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Quick Start Guide</h2>
                            <div className="space-y-4">
                                <div className="pl-4 border-l-4 border-blue-500">
                                    <h3 className="font-semibold text-blue-900">1. Register New Lockers</h3>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Use the "Register Lockers" tab to create new lockers. Select the branch, specify quantity,
                                        set starting numbers, and choose the locker type.
                                    </p>
                                </div>

                                <div className="pl-4 border-l-4 border-green-500">
                                    <h3 className="font-semibold text-green-900">2. Monitor Locker Status</h3>
                                    <p className="text-sm text-slate-600 mt-1">
                                        View all lockers in the "Lockers" tab. Filter by branch and switch between grid and table views
                                        for better organization.
                                    </p>
                                </div>

                                <div className="pl-4 border-l-4 border-purple-500">
                                    <h3 className="font-semibold text-purple-900">3. Track Activity</h3>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Use the "Logs" tab to monitor all locker-related activities including assignments, maintenance,
                                        and system events.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Best Practices</h2>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Use consistent naming patterns (e.g., A01, A02, B01, B02) for easy identification</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Regularly check maintenance logs to ensure all lockers are functioning properly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Monitor usage patterns to optimize locker placement and quantity per branch</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Keep disabled lockers to a minimum to maximize availability for members</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Support</h2>
                            <div className="p-4 bg-blue-50 rounded border border-blue-200">
                                <p className="text-sm text-blue-900">
                                    For technical support or questions about the locker management system,
                                    contact your system administrator or refer to the detailed user manual.
                                </p>
                            </div>
                        </section>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
};