'use client';

// MembershipDashboard.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CreditCard, Clock, Award, PauseCircle } from 'lucide-react';

export default function MembershipDashboard() {
    const [membershipData, setMembershipData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [showHoldModal, setShowHoldModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [holdDuration, setHoldDuration] = useState(7);
    const [holdReason, setHoldReason] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const router = useRouter();

    // Fetch membership data when component mounts
    useEffect(() => {
        const fetchMembershipData = async () => {
            try {
                setIsLoading(true);
                // Replace with your actual API endpoint
                // const response = await fetch('/api/membership/details');

                // if (!response.ok) {
                //     throw new Error('Failed to fetch membership data');
                // }

                // const data = await response.json();
                setMembershipData('data');
            } catch (err) {
                console.error('Error fetching membership data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembershipData();
    }, []);

    // Mock data for development/demo purposes
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && !membershipData) {
            const mockData = {
                name: "John Doe",
                memberId: "MEM12345",
                type: "Premium",
                shift: "Morning (6AM - 12PM)",
                joinDate: "2023-05-15",
                expireDate: "2025-05-15",
                renewDate: "2025-05-15",
                remainingDays: 384,
                status: "Active",
                monthlyFee: 49.99,
                paymentMethod: "Credit Card (••••4567)"
            };

            setMembershipData(mockData);
            setIsLoading(false);
        }
    }, [membershipData]);

    const handleRenewMembership = async (e) => {
        e.preventDefault();

        try {
            // API call to renew membership
            const response = await fetch('/api/membership/renew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: membershipData.memberId,
                    paymentMethod
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to renew membership');
            }

            const updatedData = await response.json();
            setMembershipData(updatedData);
            setShowRenewModal(false);
            alert('Membership renewed successfully!');
        } catch (err) {
            console.error('Error renewing membership:', err);
            alert(`Failed to renew membership: ${err.message}`);
        }
    };

    const handleRequestHold = async (e) => {
        e.preventDefault();

        try {
            // API call to request hold
            const response = await fetch('/api/membership/hold', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: membershipData.memberId,
                    duration: holdDuration,
                    reason: holdReason
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to request hold');
            }

            const updatedData = await response.json();
            setMembershipData(updatedData);
            setShowHoldModal(false);
            alert('Hold request submitted successfully!');
        } catch (err) {
            console.error('Error requesting hold:', err);
            alert(`Failed to request hold: ${err.message}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading membership details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-red-600 font-medium">Error: {error}</p>
                <button
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
            {/* Membership Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Membership Details</h1>
                    <p className="text-gray-500">Member ID: {membershipData.memberId}</p>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                    <p className="text-green-600 font-medium">{membershipData.status}</p>
                </div>
            </div>

            {/* Membership Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <div className="flex items-start">
                        <Award className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                        <div>
                            <p className="text-gray-500 text-sm">Membership Type</p>
                            <p className="font-medium">{membershipData.type}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Clock className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                        <div>
                            <p className="text-gray-500 text-sm">Membership Shift</p>
                            <p className="font-medium">{membershipData.shift}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                        <div>
                            <p className="text-gray-500 text-sm">Joined Date</p>
                            <p className="font-medium">{new Date(membershipData.joinDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                        <div>
                            <p className="text-gray-500 text-sm">Expiration Date</p>
                            <p className="font-medium">{new Date(membershipData.expireDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                        <div>
                            <p className="text-gray-500 text-sm">Renewal Date</p>
                            <p className="font-medium">{new Date(membershipData.renewDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Clock className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                        <div>
                            <p className="text-gray-500 text-sm">Remaining Days</p>
                            <p className="font-medium">{membershipData.remainingDays} days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
                        <div>
                            <p className="text-gray-500 text-sm">Payment Method</p>
                            <p className="font-medium">{membershipData.paymentMethod}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition duration-200"
                    >
                        Change
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => setShowRenewModal(true)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex justify-center items-center"
                >
                    Renew Membership
                </button>
                <button
                    onClick={() => setShowHoldModal(true)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition duration-200 flex justify-center items-center"
                >
                    Request Hold
                </button>
            </div>

            {/* Renew Modal */}
            {showRenewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Renew Membership</h2>
                        <form onSubmit={handleRenewMembership}>
                            <div className="mb-4">
                                <p className="text-gray-600 mb-2">Your current plan: <span className="font-medium">{membershipData.type}</span></p>
                                <p className="text-gray-600">Monthly fee: <span className="font-medium">${membershipData.monthlyFee}</span></p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Select Payment Method</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit_card"
                                            checked={paymentMethod === 'credit_card'}
                                            onChange={() => setPaymentMethod('credit_card')}
                                            className="mr-2"
                                        />
                                        Use existing card ({membershipData.paymentMethod})
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="new_card"
                                            checked={paymentMethod === 'new_card'}
                                            onChange={() => setPaymentMethod('new_card')}
                                            className="mr-2"
                                        />
                                        Use a new payment method
                                    </label>
                                </div>
                            </div>

                            {paymentMethod === 'new_card' && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <p className="text-sm text-gray-500 mb-2">You'll be redirected to our secure payment page after clicking "Renew"</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRenewModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Renew
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hold Request Modal */}
            {showHoldModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-2">Request Membership Hold</h2>
                        <p className="text-gray-500 mb-4">Temporarily pause your membership for a specific period</p>

                        <form onSubmit={handleRequestHold}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Hold Duration (days)</label>
                                <select
                                    value={holdDuration}
                                    onChange={(e) => setHoldDuration(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value={7}>1 week (7 days)</option>
                                    <option value={14}>2 weeks (14 days)</option>
                                    <option value={30}>1 month (30 days)</option>
                                    <option value={60}>2 months (60 days)</option>
                                    <option value={90}>3 months (90 days)</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Reason for Hold (optional)</label>
                                <textarea
                                    value={holdReason}
                                    onChange={(e) => setHoldReason(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                                    placeholder="Please provide a reason for your membership hold request"
                                ></textarea>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                                <div className="flex items-start">
                                    <PauseCircle className="w-5 h-5 text-yellow-500 mt-1 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-700">Hold Policy Note</p>
                                        <p className="text-sm text-yellow-600">
                                            Your membership expiration date will be extended by the hold duration. Your account access will be limited during the hold period.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowHoldModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Method Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Update Payment Method</h2>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">Current payment method: <span className="font-medium">{membershipData.paymentMethod}</span></p>

                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                    <h3 className="font-medium">Credit/Debit Card</h3>
                                    <p className="text-sm text-gray-500">Add a new card or use an existing one</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                    <h3 className="font-medium">PayPal</h3>
                                    <p className="text-sm text-gray-500">Pay using your PayPal account</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                    <h3 className="font-medium">Bank Transfer</h3>
                                    <p className="text-sm text-gray-500">Pay directly from your bank account</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Note: When you update your payment method, it will be used for all future payments including automatic renewals.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={() => {
                                    // Here you would typically redirect to a payment processor
                                    alert("This would redirect to a payment processor in a real application");
                                    setShowPaymentModal(false);
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}