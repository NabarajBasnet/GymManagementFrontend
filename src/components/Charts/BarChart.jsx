'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const option = {
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '2015', '2016', '2017'],
                    ['Matcha Latte', 43.3, 85.8, 93.7],
                    ['Milk Tea', 83.1, 73.4, 55.1],
                    ['Cheese Cocoa', 86.4, 65.2, 82.5],
                    ['Walnut Brownie', 72.4, 53.9, 39.1]
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
        };

        chartInstance.setOption(option);

        // Cleanup function to dispose of the chart instance on component unmount
        return () => {
            chartInstance.dispose();
        };
    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default BarChart;
