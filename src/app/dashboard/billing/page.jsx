'use client';

import React from 'react';
import { Dumbbell, User, Calendar, CreditCard } from 'lucide-react';

const Billing = () => {
    const billDetails = {
        memberName: "John Doe",
        memberId: "GYM2024031",
        membershipType: "Premium",
        billingPeriod: "March 1, 2024 - March 31, 2024",
        charges: {
            membershipFee: 79.99,
            personalTraining: 150.00,
            supplements: 45.50,
        },
        paymentMethod: "**** **** **** 4532",
        dueDate: "March 25, 2024"
    };

    const totalAmount = Object.values(billDetails.charges).reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">FitLife Gym</h1>
                            <p className="text-gray-500">Membership Bill</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Bill #INV-2024-001</p>
                        <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Member Info */}
                <div className="mt-6 grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-5 w-5" />
                            <span className="font-medium">Member Details</span>
                        </div>
                        <p className="text-gray-800 font-medium">{billDetails.memberName}</p>
                        <p className="text-gray-600 text-sm">Member ID: {billDetails.memberId}</p>
                        <p className="text-gray-600 text-sm">Type: {billDetails.membershipType}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-5 w-5" />
                            <span className="font-medium">Billing Period</span>
                        </div>
                        <p className="text-gray-800">{billDetails.billingPeriod}</p>
                        <p className="text-gray-600 text-sm">Due Date: {billDetails.dueDate}</p>
                    </div>
                </div>

                {/* Charges */}
                <div className="mt-8">
                    <h2 className="font-medium text-gray-700 mb-4">Charges Breakdown</h2>
                    <div className="space-y-3">
                        {Object.entries(billDetails.charges).map(([item, amount]) => (
                            <div key={item} className="flex justify-between items-center text-gray-700">
                                <span className="capitalize">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>${amount.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center font-medium text-gray-900">
                                <span>Total Amount</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="mt-8 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Payment Method</span>
                    </div>
                    <p className="text-gray-700">Card ending in {billDetails.paymentMethod.slice(-4)}</p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Thank you for being a valued member of FitLife Gym!</p>
                    <p className="mt-1">For any queries, please contact us at support@fitlifegym.com</p>
                </div>
            </div>
        </div>
    );
}

export default Billing;