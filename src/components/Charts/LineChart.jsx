'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true
                }
            ]
        };

        chartInstance.setOption(option);

        // Cleanup function to dispose of the chart instance on component unmount
        return () => {
            chartInstance.dispose();
        };
    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default LineChart;
