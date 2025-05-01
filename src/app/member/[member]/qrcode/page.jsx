'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { QrCode } from 'lucide-react';
import { useMember } from '@/components/Providers/LoggedInMemberProvider';
import Loader from '@/components/Loader/Loader';

const QRCodePage = () => {
    const member = useMember();
    const [loading, setLoading] = useState(false);
    const [memberData, setMemberData] = useState(null);
    const [error, setError] = useState(null);

    const memberId = member?.member?.loggedInMember?._id || '';
    const memberName = member?.member?.loggedInMember?.fullName || 'Member';
    const membershipId = member?.member?.loggedInMember?._id || '';

    const getMemberQr = async () => {
        if (!memberId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://7232397b19d1ad937691d5b90ab2d795.serveo.net/api/member/member-qr/${memberId}`);
            const responseBody = await response.json();

            if (response.ok) {
                setMemberData(responseBody);
                toast.success(responseBody.message);
            } else {
                setError(responseBody.message || 'Failed to load QR code');
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.error("Error fetching QR code:", error);
            setError('Network error. Please try again later.');
            toast.error('Failed to load QR code');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMemberQr();
    }, [memberId]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Membership QR</h2>
                    <p className="text-gray-600 mt-1">Use this QR code to check in</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader />
                        <p className="text-gray-500 mt-4">Loading your QR code...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="bg-red-50 rounded-lg p-4 mb-4">
                            <p className="text-red-600">{error}</p>
                        </div>
                        <button
                            onClick={getMemberQr}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : memberData ? (
                    <div className="flex flex-col items-center max-w-md mx-auto">
                        {/* QR Code with floating/pop effect */}
                        <div className="relative mb-8 group">
                            {/* Shadow for depth */}
                            <div className="absolute -inset-2 bg-blue-200 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* QR Container with 3D effect */}
                            <div className="relative border-2 border-blue-500 cursor-pointer rounded-xl p-4 bg-white transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                                <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    SCAN ME
                                </div>
                                <img
                                    src={memberData.url}
                                    alt="Member QR Code"
                                    className="w-64 h-64"
                                />
                                <div className="absolute -bottom-3 -left-3 h-3 w-3 bg-blue-700 rounded-full opacity-70"></div>
                            </div>
                        </div>

                        {/* Member Info Card */}
                        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">{memberName}</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200">
                                    Active
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    <span className="text-gray-700">
                                        <span className="font-semibold">ID:</span> {membershipId}
                                    </span>
                                </div>

                                {memberData.expiryDate && (
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-gray-700">
                                            <span className="font-semibold">Valid until:</span> {new Date(memberData.expiryDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notification Banner */}
                        <div className="flex items-center mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl text-blue-800 w-full border border-blue-200 animate-pulse hover:animate-none">
                            <div className="bg-blue-500 p-2 rounded-lg mr-3">
                                <QrCode size={20} className="text-white" />
                            </div>
                            <p className="text-sm font-medium">
                                Show this QR code at the front desk for <span className="font-bold">quick check-in</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No QR code available</p>
                        <button
                            onClick={getMemberQr}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Load QR Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRCodePage;
