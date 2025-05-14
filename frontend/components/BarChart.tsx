'use client'
import React, { FC, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { BarchartDataProps } from '@/types';


const BarChart:FC<BarchartDataProps> = ({barChartLabel, barChartAverage}) => {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (barRef.current) {
            const myBarChart = echarts.init(barRef.current);

            const option : echarts.EChartsOption = {
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: barChartLabel,
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: barChartAverage
                  }
                ]
            };
            myBarChart.setOption(option);

            const handleResize = () => {
                myBarChart.resize();
            }

            window.addEventListener('resize', handleResize);

            return () => {
                myBarChart.dispose();
                window.removeEventListener('resize', handleResize);
            }
        }
    }, []);

  return <div ref={barRef} style={{ width: '100%', height: '400px' }} className='bg-gray-100 rounded-md'/>
}

export default BarChart;