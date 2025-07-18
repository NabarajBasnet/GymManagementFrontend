'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

const StaffChatSection = () => {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Receive Message
    useEffect(() => {
        socket.on('chat message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('chat message')
        };
    })

    // Send message
    const sendMessage = () => {
        socket.emit('send-message', message)
        setMessage('')
    }

    return (
        <div className="w-full min-h-screen p-4">
            {messages?.map((message, index) => (
                <div key={index}>
                    <h1 className="text-primary">
                        {message}
                    </h1>
                </div>
            ))}
            <div className="flex items-center">
                <Input
                    className='rounded-none bg-white border dark:border-none dark:bg-gray-800 text-primary'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Type your message'
                />
                <Button
                    className='rounded-none'
                    onClick={sendMessage}
                >
                    Send</Button>
            </div>
        </div>
    );
};

export default StaffChatSection;