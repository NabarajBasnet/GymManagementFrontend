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
            const response = await fetch(`http://88.198.112.156:3000/api/member/member-qr/${memberId}`);
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
                    <p className="text-gray-600 mt-1">Use this to check in at our facility</p>
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
                    <div className="flex flex-col items-center">
                        <div className="border-4 border-blue-500 rounded-lg p-2 mb-6">
                            <img
                                src={memberData.url}
                                alt="Member QR Code"
                                className="w-64 h-64"
                            />
                        </div>

                        <div className="w-full bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold text-gray-800">{memberName}</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-center text-gray-600 mb-1">
                                <span className="font-medium mr-2">ID:</span>
                                <span>{membershipId}</span>
                            </div>

                            {memberData.expiryDate && (
                                <div className="flex items-center text-gray-600">
                                    <span className="font-medium mr-2">Valid until:</span>
                                    <span>{new Date(memberData.expiryDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center mt-8 p-4 bg-blue-50 rounded-lg text-blue-800 w-full">
                            <QrCode size={20} className="mr-2" />
                            <p className="text-sm">
                                Show this QR code at the front desk for quick check-in
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
