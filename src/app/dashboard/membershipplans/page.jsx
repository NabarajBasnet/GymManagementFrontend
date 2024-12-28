import React from 'react'

const MembershipPlans = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="container mx-auto px-6">
                {/* Title */}
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
                    Price List
                </h2>

                {/* Admission Fee */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center py-4 rounded-lg shadow-md mb-8">
                    <p className="text-2xl font-semibold tracking-wider">
                        ADMISSION FEE: NPR 1000
                    </p>
                </div>

                {/* Membership Plans */}
                <div className="space-y-12">
                    <MembershipSection
                        title="Regular Membership"
                        data={[
                            { plan: 'GYM', rates: [4000, 10500, 18000, 30000] },
                            { plan: 'GYM & CARDIO', rates: [5000, 12000, 21000, 36000] },
                        ]}
                    />

                    <MembershipSection
                        title="Daytime Membership (10 AM - 4 PM)"
                        data={[
                            { plan: 'GYM', rates: [3000, 7500, 12000, 18000] },
                            { plan: 'GYM & CARDIO', rates: [4000, 10500, 18000, 30000] },
                        ]}
                    />

                    <MembershipSection
                        title="Personal Training"
                        data={[
                            { plan: 'Rates', rates: [2500, 15000, 20000, 25000] },
                        ]}
                        headers={['1 Session', '12 Sessions', '16 Sessions', '20 Sessions']}
                    />

                    <MembershipSection
                        title="Locker Charge"
                        data={[
                            { plan: 'Rates', rates: [500, 1200, 1800, 2500] },
                        ]}
                    />
                </div>

                {/* One Day Pass */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                        One Day Pass
                    </h3>
                    <div className="bg-white rounded-lg shadow-md py-6 text-center">
                        <p className="text-3xl font-bold text-blue-600">NPR 500</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const MembershipSection = ({ title, data, headers = ['1 Month', '3 Month', '6 Month', '1 Year'] }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Section Title */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center py-4">
                <h3 className="text-2xl font-semibold">{title}</h3>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 text-center font-semibold text-gray-600 py-3 bg-gray-50 border-b">
                <div></div>
                {headers.map((header, idx) => (
                    <div key={idx} className="text-lg">{header}</div>
                ))}
            </div>

            {/* Table Content */}
            {data.map((item, idx) => (
                <div
                    key={idx}
                    className="grid grid-cols-5 text-center py-3 hover:bg-gray-100 transition-all duration-200"
                >
                    <div className="font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md py-2">
                        {item.plan}
                    </div>
                    {item.rates.map((rate, rateIdx) => (
                        <div key={rateIdx} className="text-gray-800 text-lg font-medium">
                            NPR {rate}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MembershipPlans
