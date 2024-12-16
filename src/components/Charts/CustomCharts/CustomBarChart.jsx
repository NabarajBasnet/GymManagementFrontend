'use client';

import { useEffect, useState } from 'react';
import data from './data.json'

const CustomBarChart = () => {

    return (
        <svg width="600" height="400">
            {data.datasets[0].data.map((value, index) => (
                <rect
                    key={index}
                    x={50 + index * 50}
                    y={400 - value / 2}
                    width="40"
                    height={value / 2}
                    fill={data.datasets[0].backgroundColor}
                />
            ))}
        </svg>
    );
};

export default CustomBarChart;
