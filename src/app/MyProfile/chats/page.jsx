'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";

const ChatSection = () => {
    const [showMembers, setShowMembers] = useState(false);
    const members = [
        { name: 'John Doe' },
        { name: 'Sara Ali' },
        { name: 'Ronie Colemon' },
        { name: 'Jay Cutlar' },
        { name: 'Jay Cutlar' },
        // ... (rest of your members array)
        { name: 'Nabaraj Basnet' },
    ];

    const membersRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (membersRef.current && !membersRef.current.contains(event.target)) {
                setShowMembers(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 fixed top-16">
            {/* Mobile toggle button */}
            <Button 
                variant="outline" 
                className="md:hidden fixed top-20 left-2 z-50"
                onClick={() => setShowMembers(!showMembers)}
            >
                <Menu className="h-4 w-4" />
            </Button>

            <div className='w-full flex flex-col md:flex-row'>
                {/* Members list */}
                <div 
                    ref={membersRef}
                    className={`fixed md:relative z-40 w-3/4 md:w-3/12 h-full md:h-auto transition-transform duration-300 ease-in-out 
                    ${showMembers ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                >
                    <Card className="min-h-screen md:h-[calc(100vh-4rem)] overflow-y-auto dark:bg-gray-800 dark:border-none rounded-none w-full">
                        <ScrollArea className="h-[calc(100vh-4rem-10vh)] w-full rounded-none border-none">
                            <ul>
                                {members.map((member, index) => (
                                    <li 
                                        className='text-primary py-4 bg-gray-900 my-2 cursor-pointer hover:bg-gray-800 px-4 rounded' 
                                        key={index}
                                    >
                                        {member.name}
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                        <div className="h-[10vh] bg-gray-800 p-4 border-t border-gray-700">
                            <h1 className="text-primary">User Controls</h1>
                        </div>
                    </Card>
                </div>

                {/* Chat area */}
                <Card className="w-full md:w-9/12 min-h-[calc(100vh-4rem)] dark:bg-gray-950 dark:border-none rounded-none ml-0 md:ml-auto">
                    <div className="h-[calc(100vh-4rem-10vh)] p-4">
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500">Select a conversation to start chatting</p>
                        </div>
                    </div>
                    <div className="h-[10vh] bg-gray-900 p-4 border-t border-gray-800">
                        <div className="flex items-center gap-2">
                            <Input 
                                placeholder="Type a message..." 
                                className="flex-1 bg-gray-800 border-gray-700 text-white"
                            />
                            <Button>Send</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ChatSection;