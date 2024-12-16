'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const option = {
            backgroundColor: 'transparent', // Remove background color
            grid: {
                top: '10%',
                left: '3%',
                right: '3%',
                bottom: '5%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLine: {
                    lineStyle: { color: '#888' }, // Modern axis line
                },
                axisLabel: {
                    color: '#aaa', // Subtle axis labels
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: { color: '#888' },
                },
                axisLabel: {
                    color: '#aaa',
                },
                splitLine: {
                    show: false, // Remove grid lines
                },
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true,
                    symbol: 'circle', // Adds small dots for data points
                    symbolSize: 8,
                    lineStyle: {
                        color: 'rgba(255, 99, 132, 1)', // Line color
                        width: 3,
                    },
                    itemStyle: {
                        color: 'rgba(255, 99, 132, 1)', // Point color
                        borderWidth: 2,
                        borderColor: '#fff', // White border for points
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 99, 132, 0.5)' },
                            { offset: 1, color: 'rgba(255, 99, 132, 0)' },
                        ]), // Gradient under the line
                    },
                },
            ],
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(50, 50, 50, 0.9)', // Modern tooltip styling
                borderColor: '#333',
                textStyle: {
                    color: '#fff',
                },
            },
        };

        chartInstance.setOption(option);

        // Cleanup function to dispose of the chart instance on component unmount
        return () => {
            chartInstance.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{
                width: '100%',
                height: '400px',
                borderRadius: '10px', // Rounded container
                overflow: 'hidden',
            }}
        />
    );
};

export default LineChart;
