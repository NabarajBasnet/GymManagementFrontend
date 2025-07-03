const ResendingInvoiceToMember = () => {
  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-6 px-10 bg-white rounded-2xl shadow-lg">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
          <div className="relative flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v16h16M4 4l16 16"
              />
            </svg>
          </div>
        </div>
        <div className="ml-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Resending Invoice...
          </h1>
          <p className="text-sm font-medium text-gray-700">
            Please wait while we resend the invoice to the member
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendingInvoiceToMember;
