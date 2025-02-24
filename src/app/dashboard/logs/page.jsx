'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import React from 'react';

const Logs = () => {
    const invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV002",
            paymentStatus: "Pending",
            totalAmount: "$150.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV003",
            paymentStatus: "Unpaid",
            totalAmount: "$350.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV004",
            paymentStatus: "Paid",
            totalAmount: "$450.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV005",
            paymentStatus: "Paid",
            totalAmount: "$550.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV006",
            paymentStatus: "Pending",
            totalAmount: "$200.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV007",
            paymentStatus: "Unpaid",
            totalAmount: "$300.00",
            paymentMethod: "Credit Card",
        },
    ]

    const fetchData = async () => {
        try {
            const response = await fetch('http://88.198.112.156:3000/api/averageactivemembers');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok. Status: ${response.status}, Message: ${errorText}`);
            }
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Failed to parse JSON response');
            }
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    return (
        <div className="w-full">
            <h1>Logs</h1>
            <Button onClick={fetchData}>Fetch Data</Button>
            <div className="w-full flex justify-center">
                <div className="w-[95%] overflow-x-auto">

                </div>
            </div>
        </div>
    );
}

export default Logs;
