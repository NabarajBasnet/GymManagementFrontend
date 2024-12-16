'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const GradientBarChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        let category = [];
        let dottedBase = +new Date();
        let barData = [];
        for (let i = 0; i < 20; i++) {
            let date = new Date((dottedBase += 3600 * 24 * 1000));
            category.push(
                [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
            );
            let b = Math.random() * 200;
            barData.push(b);
        }

        const option = {
            backgroundColor: '#0f375f',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#333',
                textStyle: {
                    color: '#fff',
                },
            },
            legend: {
                data: ['Bar Data'],
                textStyle: {
                    color: '#fff',
                    fontSize: 14,
                },
                icon: 'circle',
                itemGap: 20,
            },
            xAxis: {
                data: category,
                axisLine: {
                    lineStyle: {
                        color: '#aaa',
                    },
                },
                axisLabel: {
                    color: '#fff',
                },
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#aaa',
                    },
                },
                axisLabel: {
                    color: '#fff',
                },
            },
            series: [
                {
                    name: 'Bar Data',
                    type: 'bar',
                    barWidth: 12,
                    itemStyle: {
                        borderRadius: 5,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#42e9f5' },
                            { offset: 1, color: '#147efb' },
                        ]),
                        shadowColor: 'rgba(0, 191, 255, 0.6)',
                        shadowBlur: 10,
                    },
                    data: barData,
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

export default GradientBarChart;
