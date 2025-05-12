'use client'

import { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiDatabase, FiServer, FiCpu, FiWifi } from "react-icons/fi";

const Loader = () => {
    const [progress, setProgress] = useState(0);
    const [activeNode, setActiveNode] = useState(0);
    const [dataPackets, setDataPackets] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + 1));
            setActiveNode(prev => (prev + 1) % 4);

            // Add random data packets
            if (Math.random() > 0.7) {
                setDataPackets(prev => [
                    ...prev.slice(-5),
                    {
                        id: Date.now(),
                        x: Math.random() * 80 + 10,
                        speed: Math.random() * 2 + 1
                    }
                ]);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update packet positions
        const movePackets = setInterval(() => {
            setDataPackets(prev =>
                prev.map(p => ({ ...p, x: p.x + p.speed })))
        }, 50);

        return () => clearInterval(movePackets);
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white text-blue-600 p-4">
          

            {/* Progress info */}
            <div className="mt-16 w-full max-w-md">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Extracting data...</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 border border-gray-200">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-4 text-center text-gray-600 text-sm">
                    {progress < 30 && 'Connecting to quantum database...'}
                    {progress >= 30 && progress < 60 && 'Decrypting data packets...'}
                    {progress >= 60 && progress < 90 && 'Verifying data integrity...'}
                    {progress >= 90 && 'Finalizing transfer...'}
                </div>
            </div>

            {/* Spinner */}
            <div className="mt-12">
                <AiOutlineLoading3Quarters className="text-3xl animate-spin text-blue-600" />
            </div>

            {/* CSS for binary rain */}
            <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default Loader;