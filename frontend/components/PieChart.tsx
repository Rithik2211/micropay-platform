'use client'
import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { PiechartDataProps } from '@/types';

const PieChart: React.FC<PiechartDataProps> = ({pieChartData}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Book Category',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: pieChartData ?? []
          }
        ]
      };

      myChart.setOption(option);

      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        myChart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} className='bg-gray-100 rounded-md' />;
};

export default PieChart;