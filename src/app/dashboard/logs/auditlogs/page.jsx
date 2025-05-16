'use client';

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LearnAggregation = () => {

    const getAccessLogs = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/accesslogs');
            const resBody = await response.json();
            console.log('Res body: ', resBody);
            return resBody;

        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['accesslogs'],
        queryFn: getAccessLogs
    });

    console.log('Data: ', data);

    return (
        <div className="w-full flex h-100vh items-center justify-center">
            <h1 className="text-2xl text-center font-bold">Access Logs</h1>
        </div>
    );
}

export default LearnAggregation;
