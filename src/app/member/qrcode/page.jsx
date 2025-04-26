const QRCodePage = ({ memberData }) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Member QR Code</h2>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full flex flex-col items-center">
                <img
                    src={'memberData.qrCodeUrl'}
                    alt="Member QR Code"
                    className="w-64 h-64 mb-4"
                />
                <h3 className="text-xl font-medium">{'memberData.name'}</h3>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mt-2">
                    {'memberData.membershipStatus'} Member
                </div>
                <p className="text-gray-500 mt-2">ID: {'memberData.membershipId'}</p>
                <p className="text-sm text-gray-500 mt-6 text-center">
                    Show this QR code at the front desk to check in
                </p>
            </div>
        </div>
    );
}

export default QRCodePage;
