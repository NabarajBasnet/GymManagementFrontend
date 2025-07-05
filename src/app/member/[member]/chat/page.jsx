'use client';

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const MemberChatSection = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = () => {
        socket.emit('chat message', (message))
        setMessage('')
    }

    useEffect(() => {
        socket.on('to-member', (message) => {
            setMessages((prev) => [...prev, message])
        })

        return () => {
            socket.off('to-member')
        }
    }, []);

    return (
        <div className="w-full min-h-screen dark:bg-gray-900 p-4">
            <div>
                <div className="mb-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className="text-primary">{msg}</div>
                    ))}
                </div>
                <div className='flex items-center'>
                    <Input
                        className='rounded-none bg-white border dark:border-none dark:bg-gray-800 text-primary'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Type your message'
                    />
                    <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-none"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberChatSection;
