import React from 'react';
import { Card } from "@/components/ui/card";
import Badge from '@mui/material/Badge';
import { Dumbbell, Clock, Users, Key, Zap } from 'lucide-react';

const MembershipPlans = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Membership <span className="text-blue-600">Plans</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Choose the perfect plan for your fitness journey
          </p>
        </div>

        {/* Admission Fee Card */}
        <Card className="mb-16 overflow-hidden bg-gradient-to-r from-yellow-400 to-amber-500">
          <div className="px-8 py-12 text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 transition-colors">
              New Members
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-2">
              Admission Fee
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Key className="h-5 w-5" />
              <p className="text-4xl font-bold">NPR 1,000</p>
            </div>
          </div>
        </Card>

        {/* Membership Sections */}
        <div className="space-y-16">
          <MembershipSection
            icon={<Dumbbell className="h-6 w-6" />}
            title="Regular Membership"
            subtitle="Full access to gym facilities"
            data={[
              { plan: 'GYM', rates: [4000, 10500, 18000, 30000] },
              { plan: 'GYM & CARDIO', rates: [5000, 12000, 21000, 36000] },
            ]}
            gradient="from-blue-600 to-blue-800"
          />

          <MembershipSection
            icon={<Clock className="h-6 w-6" />}
            title="Daytime Membership"
            subtitle="Access between 10 AM - 4 PM"
            data={[
              { plan: 'GYM', rates: [3000, 7500, 12000, 18000] },
              { plan: 'GYM & CARDIO', rates: [4000, 10500, 18000, 30000] },
            ]}
            gradient="from-purple-600 to-purple-800"
          />

          <MembershipSection
            icon={<Users className="h-6 w-6" />}
            title="Personal Training"
            subtitle="One-on-one training sessions"
            data={[
              { plan: 'Rates', rates: [2500, 15000, 20000, 25000] },
            ]}
            headers={['1 Session', '12 Sessions', '16 Sessions', '20 Sessions']}
            gradient="from-green-600 to-green-800"
          />

          <MembershipSection
            icon={<Key className="h-6 w-6" />}
            title="Locker Service"
            subtitle="Secure storage for your belongings"
            data={[
              { plan: 'Rates', rates: [500, 1200, 1800, 2500] },
            ]}
            gradient="from-orange-600 to-orange-800"
          />
        </div>

        {/* Day Pass Card */}
        <Card className="mt-16 overflow-hidden">
          <div className="px-8 py-12 text-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              Try Us Out
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-4">
              One Day Pass
            </h2>
            <div className="flex items-center justify-center gap-2 text-white">
              <Zap className="h-5 w-5" />
              <p className="text-4xl font-bold">NPR 500</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const MembershipSection = ({ 
  title, 
  subtitle,
  data, 
  headers = ['1 Month', '3 Month', '6 Month', '1 Year'],
  gradient,
  icon
}) => {
  return (
    <Card className="overflow-hidden shadow-lg">
      {/* Section Header */}
      <div className={`bg-gradient-to-r ${gradient} px-8 py-6 text-white`}>
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-white/80">{subtitle}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-5 text-center bg-gray-50 border-b">
            <div className="py-4 px-6"></div>
            {headers.map((header, idx) => (
              <div key={idx} className="py-4 px-6 font-semibold text-gray-700">
                {header}
              </div>
            ))}
          </div>

          {/* Table Content */}
          {data.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-5 text-center border-b last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="py-4 px-6">
                <Badge variant="outline" className="bg-white">
                  {item.plan}
                </Badge>
              </div>
              {item.rates.map((rate, rateIdx) => (
                <div key={rateIdx} className="py-4 px-6">
                  <span className="font-semibold text-gray-900">
                    NPR {rate.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MembershipPlans;
