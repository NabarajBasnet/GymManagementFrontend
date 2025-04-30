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
            <div className="relative w-full max-w-2xl">
                {/* Network nodes */}
                <div className="flex justify-between mb-8">
                    {['Database', 'Server', 'Processor', 'Client'].map((label, i) => (
                        <div key={label} className="flex flex-col items-center">
                            <div className={`p-4 rounded-full mb-2 transition-all duration-300 ${activeNode === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-100 border border-gray-200'}`}>
                                {i === 0 ? <FiDatabase size={24} /> :
                                    i === 1 ? <FiServer size={24} /> :
                                        i === 2 ? <FiCpu size={24} /> :
                                            <FiWifi size={24} />}
                            </div>
                            <span className="text-xs text-gray-600">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Connection line */}
                <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 z-0">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>

                    {/* Data packets */}
                    {dataPackets.map(packet => (
                        <div
                            key={packet.id}
                            className="absolute top-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                            style={{ left: `${packet.x}%` }}
                        ></div>
                    ))}
                </div>

                {/* Binary code rain */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-blue-400 text-xs"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `fall ${Math.random() * 2 + 1}s linear infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        >
                            {Math.random() > 0.5 ? '1' : '0'}
                        </div>
                    ))}
                </div>
            </div>

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