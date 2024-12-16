'use client';

import data from './data.json'

const CustomBarChart = () => {

    return (
        <svg className='w-full h-72'>
            {data.datasets[0].data.map((value, index) => (
                <rect
                className='w-2 rounded-xl bg-white'
                    key={index}
                    x={50 + index * 50}
                    y={400 - value / 2}
                    height={value / 2}
                    fill='rgba(153, 0, 219, 0.8)'
                />
            ))}
        </svg>
    );
};

export default CustomBarChart;
