export interface PiechartDataProps{
    pieChartData : {
        name : string;
        value : number;
    }[]
}

export interface BarchartDataProps{
    barChartLabel : string[];
    barChartAverage: number[];
}

export interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: number;
    date: string;
    status: 'pending' | 'confirmed' | 'failed';
    txHash?: string;
    expenseId: string;
    groupId: string;
}