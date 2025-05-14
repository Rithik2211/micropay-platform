import { BarchartDataProps, PiechartDataProps } from "@/types";

export const pieChartSampleData: PiechartDataProps = {
    pieChartData: [
      { name: 'Marketing', value: 30 },
      { name: 'Sales', value: 25 },
      { name: 'Development', value: 20 },
      { name: 'Customer Support', value: 15 },
      { name: 'Operations', value: 10 },
    ],
  };

export const barChartSampleData: BarchartDataProps = {
barChartLabel: ['January', 'February', 'March', 'April', 'May', 'June'],
barChartAverage: [45, 60, 52, 70, 55, 65],
};