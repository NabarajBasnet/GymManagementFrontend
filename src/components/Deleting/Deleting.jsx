const Deleteing = () => {

    return (
        <div className="fixed inset-0 flex items-center z-50 justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-6 px-10 bg-white rounded-2xl shadow-lg">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                    <div className="relative flex items-center justify-center w-12 h-12 bg-red-600 rounded-full">
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
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </div>
                </div>
                <div className="ml-6">
                    <h1 className="text-xl font-semibold text-gray-800">Deleting...</h1>
                    <p className="text-sm font-semibold text-gray-700">This may take a moment</p>
                </div>
            </div>
        </div>
    )
}

export default Deleteing;
