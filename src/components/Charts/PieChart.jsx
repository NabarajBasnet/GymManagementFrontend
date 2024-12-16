'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const PieChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderColor: '#333',
                textStyle: {
                    color: '#fff',
                },
            },
            legend: {
                orient: 'horizontal',
                bottom: 10,
                textStyle: {
                    color: '#fff',
                },
                itemGap: 20,
                icon: 'circle',
            },
            series: [
                {
                    name: 'Membership flow',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#0f375f',
                        borderWidth: 2,
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 20,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(255, 255, 255, 0.7)',
                        },
                    },
                    data: [
                        {
                            value: 1048,
                            name: 'Active Members',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#42e9f5' },
                                    { offset: 1, color: '#147efb' },
                                ]),
                            },
                        },
                        {
                            value: 735,
                            name: 'On Hold Members',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#f39c12' },
                                    { offset: 1, color: '#e74c3c' },
                                ]),
                            },
                        },
                        {
                            value: 580,
                            name: 'Inactive Members',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#9b59b6' },
                                    { offset: 1, color: '#8e44ad' },
                                ]),
                            },
                        },
                    ],
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
                background: 'linear-gradient(120deg, #1e3c72, #2a5298)',
                borderRadius: '15px',
                padding: '20px',
            }}
        />
    );
};

export default PieChart;
