// import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, DollarSign, SquareActivity, Users } from 'lucide-react';
import PieChart from '@/components/PieChart';
import BarChart from '@/components/BarChart';
import { pieChartSampleData, barChartSampleData } from '@/utils/data';

// import { Overview } from '@/components/dashboard/Overview'
// import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
// import { SubscriptionsList } from '@/components/dashboard/SubscriptionsList'
// import { ContentList } from '@/components/dashboard/ContentList'
// import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'

const DashboardPage = () => {
  return (
    <div className="flex-1 w-full h-screen space-y-4 p-8 pt-[80px] bg-gradient-to-b from-blue-50 to-violet-50">
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="overview" className="space-y-4 w-full">
            <div className='flex items-center justify-between'>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Dashboard
                </h2>
                <TabsList className='bg-gradient-to-r from-blue-200 to-violet-200'>
                    <TabsTrigger value="overview" >Overview</TabsTrigger>
                    <TabsTrigger value="analytics" >Analytics</TabsTrigger>
                    <TabsTrigger value="subscriptions" >Subscriptions</TabsTrigger>
                    <TabsTrigger value="content" >Content</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Total Revenue
                    </CardTitle>
                    <div className='rounded-full p-5 bg-violet-200'>
                        <DollarSign  className='w-6 h-6 text-violet-600'/>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$5,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Active Subscribers
                    </CardTitle>
                    <div className='rounded-full p-5 bg-blue-200'>
                        <Users  className='w-6 h-6 text-blue-600'/>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,249</div>
                    <p className="text-xs text-muted-foreground">
                      +180 since last week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Conversion Rate
                    </CardTitle>
                    <div className='rounded-full p-5 bg-red-200'>
                        <SquareActivity  className='w-6 h-6 text-red-600'/>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.2%</div>
                    <p className="text-xs text-muted-foreground">
                      +1.2% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Active Subscriptions
                    </CardTitle>
                    <div className='rounded-full p-5 bg-green-200'>
                        <Activity  className='w-6 h-6 text-green-600'/>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      +2 since last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  {/* <CardContent className="pl-2">
                    <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
                      <Overview />
                    </Suspense>
                  </CardContent> */}
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      You made 12 transactions this month.
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent>
                    <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading transactions...</div>}>
                      <RecentTransactions />
                    </Suspense>
                  </CardContent> */}
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View detailed analytics of your content and subscriptions.
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col md:flex-row gap-4'>
                  {/* <Suspense fallback={<DashboardSkeleton />}>
                    <SubscriptionsList />
                  </Suspense> */}
                  <PieChart pieChartData={pieChartSampleData.pieChartData}/>
                  <BarChart barChartLabel={barChartSampleData.barChartLabel} barChartAverage={barChartSampleData.barChartAverage}/>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="subscriptions" className="space-y-4">
              <Card className='animate-fade-in'>
                <CardHeader>
                  <CardTitle>Your Subscriptions</CardTitle>
                  <CardDescription>
                    Manage your active and past subscriptions.
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <SubscriptionsList />
                  </Suspense>
                </CardContent> */}
              </Card>
            </TabsContent>
            <TabsContent value="content" className="space-y-4">
              <Card className='animate-fade-in'>
                <CardHeader>
                  <CardTitle>Your Content</CardTitle>
                  <CardDescription>
                    Manage and monetize your content.
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <ContentList />
                  </Suspense>
                </CardContent> */}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}

export default DashboardPage;