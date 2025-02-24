'use client'

import { Button } from '@/components/ui/button';
import React from 'react';

const Logs = () => {
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/averageactivemembers');
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
        <div>
            <h1>Logs</h1>
            <Button onClick={fetchData}>Fetch Data</Button>
        </div>
    );
}

export default Logs;
