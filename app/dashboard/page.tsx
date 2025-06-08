"use client"

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatPrice";
import toast from 'react-hot-toast';
import Image from 'next/image';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type DashboardStats = {
  totalUsers: number;
  totalOrders: number;
  totalSales: number;
  monthlyRevenue: number[];
  topProducts: Array<{
    id: string;
    name: string;
    soldQuantity: number;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    image?: string;
    lastOrderAmount: number;
  }>;
};

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    monthlyRevenue: [],
    topProducts: [],
    recentUsers: []
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Có lỗi xảy ra');
        }

        setStats(data);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
        toast.error('Không thể tải thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const monthlyRevenueData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Doanh thu',
        data: stats.monthlyRevenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        fill: true
      }
    ],
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalSales)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu hàng tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <Line 
              data={monthlyRevenueData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => formatPrice(Number(value))
                    }
                  }
                }
              }} 
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topProducts.map((product, index) => {
              const percentage = stats.topProducts[0]?.soldQuantity 
                ? (product.soldQuantity / stats.topProducts[0].soldQuantity) * 100
                : 0;
              
              return (
                <div key={product.id} className="flex items-center">
                  <span className="w-8 text-gray-500">{`0${index + 1}`}</span>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="h-2.5 rounded-full bg-blue-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-gray-600">{product.soldQuantity} đã bán</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Người dùng hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xl">{user.name[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(user.lastOrderAmount)}</p>
                  <p className="text-xs text-gray-500">Đơn hàng gần nhất</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}