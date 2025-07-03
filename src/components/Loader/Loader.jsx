'use client'

import { IoSettingsSharp } from "react-icons/io5";


const Loader = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center dark:bg-gray-900 bg-white">
            {/* Gear Animation Container - made slightly larger */}
            <div className="relative w-40 h-40">
                {/* Center gear - Blue - made larger */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 animate-spin text-blue-500" style={{ animationDuration: '2s' }}>
                        <IoSettingsSharp className="w-full h-full" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Top gear - Red - made larger */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 animate-spin text-red-500" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}>
                        <IoSettingsSharp className="w-full h-full" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Right gear - Green - made larger */}
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                    <div className="w-14 h-14 animate-spin text-green-500" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}>
                        <IoSettingsSharp className="w-full h-full" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Left gear - Yellow - made larger */}
                <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                    <div className="w-12 h-12 animate-spin text-yellow-500" style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}>
                        <IoSettingsSharp className="w-full h-full" strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
