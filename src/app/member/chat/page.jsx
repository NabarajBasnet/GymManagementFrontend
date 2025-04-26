'use client';

import { useState, useEffect, useRef } from 'react';

const ChatSection = () => {
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);
    const messagesEndRef = useRef(null);

    const trainers = [
        { id: 1, name: "Sarah Taylor", status: "online", avatar: "/api/placeholder/40/40", specialty: "Strength Training" },
        { id: 2, name: "Mike Richards", status: "offline", avatar: "/api/placeholder/40/40", specialty: "Cardio & Endurance" },
        { id: 3, name: "Elena Davis", status: "online", avatar: "/api/placeholder/40/40", specialty: "Yoga & Flexibility" }
    ];

    // Sample chat messages
    const sampleMessages = [
        { id: 1, sender: "trainer", text: "Hi Alex! How's your training going?", time: "10:32 AM" },
        { id: 2, sender: "member", text: "Going well! I've been following the routine you gave me.", time: "10:35 AM" },
        { id: 3, sender: "trainer", text: "Great to hear! Don't forget to log your measurements this week.", time: "10:37 AM" }
    ];

    useEffect(() => {
        // Set first trainer as default
        if (trainers.length > 0 && !selectedTrainer) {
            setSelectedTrainer(trainers[0]);
            setMessages(sampleMessages);
        }

        // Check for mobile view
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "member",
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setChatInput('');

        // Simulate trainer reply after 1-3 seconds
        if (Math.random() > 0.3) { // 70% chance of reply for demo
            setTimeout(() => {
                const replies = [
                    "Thanks for your message!",
                    "I'll get back to you shortly.",
                    "That's great to hear!",
                    "Have you been following your nutrition plan?",
                    "Let me check your progress and I'll respond properly."
                ];
                const replyMessage = {
                    id: messages.length + 2,
                    sender: "trainer",
                    text: replies[Math.floor(Math.random() * replies.length)],
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, replyMessage]);
            }, 1000 + Math.random() * 2000);
        }
    };

    const handleTrainerSelect = (trainer) => {
        setSelectedTrainer(trainer);
        // In a real app, you would fetch messages for this trainer
        setMessages(sampleMessages);
        if (isMobileView) {
            // Hide trainer list on mobile after selection
            document.getElementById('trainer-list').classList.add('hidden');
            document.getElementById('chat-area').classList.remove('hidden');
        }
    };

    const handleBackToTrainers = () => {
        document.getElementById('trainer-list').classList.remove('hidden');
        document.getElementById('chat-area').classList.add('hidden');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chat with Staff</h2>

            <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row h-[calc(100vh-180px)] md:h-[32rem]">
                {/* Trainers list - visible on mobile unless chat is open */}
                <div
                    id="trainer-list"
                    className={`w-full md:w-72 border-r border-gray-200 overflow-y-auto ${isMobileView ? 'block' : 'block'}`}
                >
                    <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-tl-xl">
                        <h3 className="font-semibold text-gray-700">Available Staff</h3>
                        <p className="text-xs text-gray-500 mt-1">Select a trainer to chat</p>
                    </div>
                    <div>
                        {trainers.map(trainer => (
                            <button
                                key={trainer.id}
                                onClick={() => handleTrainerSelect(trainer)}
                                className={`flex items-center w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${selectedTrainer?.id === trainer.id ? 'bg-indigo-50' : ''
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={trainer.avatar}
                                        alt={trainer.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.name)}&background=random`;
                                        }}
                                    />
                                    <span className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ${trainer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                        } border-2 border-white`}></span>
                                </div>
                                <div className="ml-3 text-left">
                                    <p className="font-medium text-gray-800">{trainer.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{trainer.specialty}</p>
                                    <span className={`text-xs ${trainer.status === 'online' ? 'text-green-600' : 'text-gray-400'
                                        }`}>
                                        {trainer.status === 'online' ? 'Available now' : 'Offline'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat area - hidden on mobile initially */}
                <div
                    id="chat-area"
                    className={`flex-1 flex flex-col ${isMobileView ? 'hidden' : 'flex'}`}
                >
                    {/* Chat header with back button for mobile */}
                    <div className="p-4 border-b border-gray-200 flex items-center bg-gray-50 rounded-tr-xl md:rounded-none">
                        {isMobileView && (
                            <button
                                onClick={handleBackToTrainers}
                                className="mr-2 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                        <div className="relative flex-shrink-0">
                            {selectedTrainer && (
                                <>
                                    <img
                                        src={selectedTrainer.avatar}
                                        alt={selectedTrainer.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTrainer.name)}&background=random`;
                                        }}
                                    />
                                    <span className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ${selectedTrainer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                        } border-2 border-white`}></span>
                                </>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="font-medium text-gray-800">
                                {selectedTrainer?.name || "Select a trainer"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {selectedTrainer?.status === 'online' ? 'Online' : 'Offline'}
                                {selectedTrainer?.specialty && ` • ${selectedTrainer.specialty}`}
                            </p>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {selectedTrainer ? (
                            <>
                                {messages.length > 0 ? (
                                    <div className="space-y-3">
                                        {messages.map(message => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === 'member' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${message.sender === 'member'
                                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                                        : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-200'
                                                        }`}
                                                >
                                                    <p>{message.text}</p>
                                                    <p className={`text-xs mt-1 ${message.sender === 'member' ? 'text-indigo-100' : 'text-gray-500'
                                                        }`}>
                                                        {message.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                        No messages yet. Start the conversation!
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Please select a trainer to start chatting
                            </div>
                        )}
                    </div>

                    {/* Message input */}
                    {selectedTrainer && (
                        <div className="p-4 border-t border-gray-200 bg-white rounded-br-xl">
                            <form onSubmit={handleSendMessage} className="flex items-center">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={selectedTrainer?.status !== 'online'}
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim() || selectedTrainer?.status !== 'online'}
                                    className={`px-4 py-2 rounded-r-lg ${selectedTrainer?.status === 'online'
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        } transition-colors duration-200`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </form>
                            {selectedTrainer?.status !== 'online' && (
                                <p className="text-xs text-gray-500 mt-2">
                                    {selectedTrainer.name} is currently offline. They'll see your message when they're back.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatSection;