'use client';

import { useState } from 'react';
import {
    Home,
    MessageSquare,
    Star,
    LineChart,
    Settings,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react';


// Sample body measurements
const bodyMeasurements = [
    { date: "2025-04-01", weight: 78.2, bodyFat: 18.5, chest: 42, waist: 34, arms: 14.5 },
    { date: "2025-03-15", weight: 79.4, bodyFat: 19.1, chest: 41.5, waist: 34.5, arms: 14.2 },
    { date: "2025-03-01", weight: 80.6, bodyFat: 19.8, chest: 41, waist: 35, arms: 14 }
];

function MemberPortal() {
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(memberData.trainers[0]);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState(sampleMessages);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (chatInput.trim()) {
            const newMessage = {
                id: messages.length + 1,
                sender: "member",
                text: chatInput,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setChatInput('');

            // Simulate trainer response
            setTimeout(() => {
                const trainerResponse = {
                    id: messages.length + 2,
                    sender: "trainer",
                    text: "Thanks for your message. I'll check in with you later about this.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, trainerResponse]);
            }, 2000);
        }
    };



    return (
        <>
            {/* Mobile header */}
            <div className="md:hidden flex justify-between items-center px-4 py-3 bg-indigo-600 text-white">
                <h1 className="font-bold text-xl">FitHub</h1>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="hidden md:flex justify-end p-4 bg-white border-b border-gray-200">
                    <LogoutButton />
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}






export default MemberPortal;

