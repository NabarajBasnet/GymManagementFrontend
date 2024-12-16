'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const option = {
            backgroundColor: '#1f1f1f',
            textStyle: {
                fontFamily: 'Poppins, Arial, sans-serif',
            },
            legend: {
                textStyle: {
                    color: '#fff',
                },
                icon: 'circle',
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(50, 50, 50, 0.9)',
                borderColor: '#333',
                textStyle: {
                    color: '#fff',
                },
            },
            dataset: {
                source: [
                    ['product', '2015', '2016', '2017'],
                    ['Matcha Latte', 43.3, 85.8, 93.7],
                    ['Milk Tea', 83.1, 73.4, 55.1],
                    ['Cheese Cocoa', 86.4, 65.2, 82.5],
                    ['Walnut Brownie', 72.4, 53.9, 39.1],
                ],
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: { color: '#888' },
                },
                axisLabel: {
                    color: '#fff',
                },
            },
            yAxis: {
                axisLine: {
                    lineStyle: { color: '#888' },
                },
                axisLabel: {
                    color: '#fff',
                },
                splitLine: {
                    lineStyle: { color: 'rgba(255, 255, 255, 0.1)' },
                },
            },
            series: [
                {
                    type: 'bar',
                    barWidth: '20%',
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#ff7c7c' },
                            { offset: 1, color: '#ff3d3d' },
                        ]),
                        shadowColor: 'rgba(255, 0, 0, 0.5)',
                        shadowBlur: 10,
                    },
                },
                {
                    type: 'bar',
                    barWidth: '20%',
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#42e9f5' },
                            { offset: 1, color: '#147efb' },
                        ]),
                        shadowColor: 'rgba(0, 191, 255, 0.5)',
                        shadowBlur: 10,
                    },
                },
                {
                    type: 'bar',
                    barWidth: '20%',
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#f5df42' },
                            { offset: 1, color: '#d4a017' },
                        ]),
                        shadowColor: 'rgba(255, 215, 0, 0.5)',
                        shadowBlur: 10,
                    },
                },
            ],
        };

        chartInstance.setOption(option);

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
                borderRadius: '10px',
                overflow: 'hidden',
            }}
        />
    );
};

export default BarChart;
