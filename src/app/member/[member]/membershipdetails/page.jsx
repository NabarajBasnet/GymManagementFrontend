'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    CreditCard,
    Clock,
    Award,
    PauseCircle,
    User,
    Phone,
    Mail,
    MapPin,
    Receipt,
    AlertCircle,
    CheckCircle,
    Building,
    Zap,
    TrendingUp,
    Shield,
    Star,
    Timer,
    Wallet,
    RefreshCw,
    X
} from 'lucide-react';
import { useMember } from '@/components/Providers/LoggedInMemberProvider';
import Loader from '@/components/Loader/Loader';

export default function MembershipDashboard() {
    const { member } = useMember();
    const loggedInMember = member?.loggedInMember;

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

    // Set membership data from the hook
    useEffect(() => {
        if (loggedInMember) {
            setMembershipData(loggedInMember);
            setIsLoading(false);
        }
    }, [loggedInMember]);

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to calculate days until expiry
    const getDaysUntilExpiry = (expiryDate) => {
        if (!expiryDate) return 0;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Helper function to get membership status
    const getMembershipStatus = (expiryDate) => {
        const daysLeft = getDaysUntilExpiry(expiryDate);
        if (daysLeft < 0) return { status: 'Expired', color: 'red', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-400', iconColor: 'text-red-500' };
        if (daysLeft <= 7) return { status: 'Expiring Soon', color: 'yellow', bgColor: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-700 dark:text-amber-400', iconColor: 'text-amber-500' };
        return { status: 'Active', color: 'green', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', textColor: 'text-emerald-700 dark:text-emerald-400', iconColor: 'text-emerald-500' };
    };

    const handleRenewMembership = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/membership/renew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: membershipData?._id,
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
            const response = await fetch('/api/membership/hold', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: membershipData?._id,
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
        return <Loader />;
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-red-700 dark:text-red-400 font-medium text-lg mb-3">Something went wrong</p>
                <p className="text-red-600 dark:text-red-500 mb-4">{error}</p>
                <button
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!membershipData) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-xl text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No membership data available.</p>
            </div>
        );
    }

    const membershipStatus = getMembershipStatus(membershipData?.membershipExpireDate);
    const daysLeft = getDaysUntilExpiry(membershipData?.membershipExpireDate);

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="w-full mx-auto">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    {membershipData?.fullName}
                                </h1>
                                <p className="text-blue-100 text-lg mb-1">Member ID: {membershipData?._id || 'N/A'}</p>
                                <p className="text-blue-200 text-sm">
                                    {membershipData?.organization?.name} • {membershipData?.organizationBranch?.orgBranchName}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 lg:mt-0">
                            <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${membershipStatus?.bgColor} ${membershipStatus?.textColor} border border-white/20`}>
                                {membershipStatus?.color === 'green' ?
                                    <CheckCircle className="w-4 h-4 mr-2" /> :
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                }
                                {membershipStatus?.status}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Days Remaining</p>
                                <p className={`text-2xl font-bold ${daysLeft <= 7 ? 'text-red-600 dark:text-red-400' :
                                    daysLeft <= 30 ? 'text-amber-600 dark:text-amber-400' :
                                        'text-emerald-600 dark:text-emerald-400'
                                    }`}>
                                    {daysLeft > 0 ? daysLeft : 0}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${daysLeft <= 7 ? 'bg-red-50 dark:bg-red-900/20' :
                                daysLeft <= 30 ? 'bg-amber-50 dark:bg-amber-900/20' :
                                    'bg-emerald-50 dark:bg-emerald-900/20'
                                }`}>
                                <Timer className={`w-6 h-6 ${daysLeft <= 7 ? 'text-red-500' :
                                    daysLeft <= 30 ? 'text-amber-500' :
                                        'text-emerald-500'
                                    }`} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paid</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {membershipData?.organization?.currency} {membershipData?.paidAmmount}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                <Wallet className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan Type</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {membershipData?.membership?.planName?.split(' ')[0]}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                                <Star className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Amount</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {membershipData?.organization?.currency} {membershipData?.dueAmmount}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                                <TrendingUp className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Membership Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-3">
                                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Membership Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <div className="flex items-center mb-2">
                                        <Star className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan Name</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.membership?.planName}</p>
                                </div>
                                <div className="group">
                                    <div className="flex items-center mb-2">
                                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Membership Type</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.membershipType}</p>
                                </div>
                                <div className="group">
                                    <div className="flex items-center mb-2">
                                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.membershipDuration}</p>
                                </div>
                                <div className="group">
                                    <div className="flex items-center mb-2">
                                        <Timer className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Shift</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.membershipShift}</p>
                                </div>
                                <div className="group md:col-span-2">
                                    <div className="flex items-center mb-2">
                                        <Zap className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Services Included</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {membershipData?.membership?.servicesIncluded?.map((service, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mr-3">
                                    <Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="flex items-center mb-2">
                                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {membershipData?.organization?.currency} {membershipData?.finalAmmount}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                    <div className="flex items-center mb-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {membershipData?.organization?.currency} {membershipData?.paidAmmount}
                                    </p>
                                </div>
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                    <div className="flex items-center mb-2">
                                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {membershipData?.organization?.currency} {membershipData?.dueAmmount}
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <div className="flex items-center mb-2">
                                        <Wallet className="w-4 h-4 text-blue-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</span>
                                    </div>
                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                        {membershipData?.paymentMethod}
                                    </p>
                                </div>
                            </div>
                            {membershipData?.discountAmmount > 0 && (
                                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                    <div className="flex items-center mb-2">
                                        <Star className="w-4 h-4 text-amber-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount Applied</span>
                                    </div>
                                    <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                                        {membershipData?.organization?.currency} {membershipData?.discountAmmount}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{membershipData?.discountReason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Membership Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Membership Timeline</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(membershipData?.membershipRenewDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(membershipData?.membershipExpireDate)}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center p-4 rounded-xl ${membershipStatus?.bgColor}`}>
                                    <Timer className={`w-5 h-5 mr-3 ${membershipStatus?.iconColor}`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Remaining</p>
                                        <p className={`text-2xl font-bold ${membershipStatus?.textColor}`}>
                                            {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gym Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-3">
                                    <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gym Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gym Name</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.organization?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Branch</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.organizationBranch?.orgBranchName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.organization?.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{membershipData?.organizationBranch?.orgBranchAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mr-3">
                                    <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
                            </div>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowRenewModal(true)}
                                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
                                >
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Renew Membership
                                </button>
                                <button
                                    onClick={() => setShowHoldModal(true)}
                                    className="w-full flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors duration-200"
                                >
                                    <PauseCircle className="w-5 h-5 mr-2" />
                                    Request Hold
                                </button>
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors duration-200"
                                >
                                    <Wallet className="w-5 h-5 mr-2" />
                                    Make Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Renew Membership Modal */}
            {showRenewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Renew Membership</h3>
                            <button onClick={() => setShowRenewModal(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleRenewMembership}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="digital_wallet">Digital Wallet</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRenewModal(false)}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                                >
                                    Confirm Renewal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hold Membership Modal */}
            {showHoldModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Request Membership Hold</h3>
                            <button onClick={() => setShowHoldModal(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleRequestHold}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hold Duration (Days)</label>
                                <select
                                    value={holdDuration}
                                    onChange={(e) => setHoldDuration(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="7">7 Days</option>
                                    <option value="14">14 Days</option>
                                    <option value="30">30 Days</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Hold</label>
                                <textarea
                                    value={holdReason}
                                    onChange={(e) => setHoldReason(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Briefly explain why you need to put your membership on hold"
                                    required
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowHoldModal(false)}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors duration-200"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Make Payment</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="mb-6">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Due Amount</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {membershipData?.organization?.currency} {membershipData?.dueAmmount}
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="digital_wallet">Digital Wallet</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount to Pay</label>
                                <input
                                    type="number"
                                    defaultValue={membershipData?.dueAmmount}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    min="1"
                                    max={membershipData?.dueAmmount}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                            >
                                Process Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
