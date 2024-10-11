import Loader from '@/components/Loader/Loader'
import React from 'react'

const MembershipPlans = () => {
    return (
        <div>
            <div className="container mx-auto p-6">
                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-6">Revive Fitness Price List</h2>

                {/* Admission Fee */}
                <div className="bg-black text-white text-center py-2 mb-4">
                    <p>ADMISSION FEE: 1000</p>
                </div>

                {/* Regular Membership */}
                <div className="bg-black text-white text-center py-2 mb-2">
                    <p>REGULAR MEMBERSHIP</p>
                </div>
                <div className="grid grid-cols-5 text-center bg-gray-100 py-2 mb-6">
                    <div></div>
                    <div>1 Month</div>
                    <div>3 Month</div>
                    <div>6 Month</div>
                    <div>1 Year</div>

                    <div className="bg-yellow-500">GYM</div>
                    <div>4000</div>
                    <div>10500</div>
                    <div>18000</div>
                    <div>30000</div>

                    <div className="bg-yellow-500">GYM & CARDIO</div>
                    <div>5000</div>
                    <div>12000</div>
                    <div>21000</div>
                    <div>36000</div>
                </div>

                {/* Daytime Membership */}
                <div className="bg-black text-white text-center py-2 mb-2">
                    <p>DAYTIME MEMBERSHIP (10 AM - 4 PM)</p>
                </div>
                <div className="grid grid-cols-5 text-center bg-gray-100 py-2 mb-6">
                    <div></div>
                    <div>1 Month</div>
                    <div>3 Month</div>
                    <div>6 Month</div>
                    <div>1 Year</div>

                    <div className="bg-yellow-500">GYM</div>
                    <div>3000</div>
                    <div>7500</div>
                    <div>12000</div>
                    <div>18000</div>

                    <div className="bg-yellow-500">GYM & CARDIO</div>
                    <div>4000</div>
                    <div>10500</div>
                    <div>18000</div>
                    <div>30000</div>
                </div>

                {/* Personal Training */}
                <div className="bg-black text-white text-center py-2 mb-2">
                    <p>PERSONAL TRAINING</p>
                </div>
                <div className="grid grid-cols-5 text-center bg-gray-100 py-2 mb-6">
                    <div></div>
                    <div>1 Session</div>
                    <div>12 Sessions</div>
                    <div>16 Sessions</div>
                    <div>20 Sessions</div>

                    <div className="bg-yellow-500">Rates</div>
                    <div>2500</div>
                    <div>15000</div>
                    <div>20000</div>
                    <div>25000</div>
                </div>

                {/* Locker Charge */}
                <div className="bg-black text-white text-center py-2 mb-2">
                    <p>LOCKER CHARGE</p>
                </div>
                <div className="grid grid-cols-5 text-center bg-gray-100 py-2 mb-6">
                    <div></div>
                    <div>1 Month</div>
                    <div>3 Month</div>
                    <div>6 Month</div>
                    <div>1 Year</div>

                    <div className="bg-yellow-500">Rates</div>
                    <div>500</div>
                    <div>1200</div>
                    <div>1800</div>
                    <div>2500</div>
                </div>

                {/* One Day Pass */}
                <div className="bg-black text-white text-center py-2 mb-2">
                    <p>ONE DAY PASS</p>
                </div>
                <div className="text-center bg-gray-100 py-2">
                    <p>500</p>
                </div>
            </div>
        </div>
    )
}

export default MembershipPlans
