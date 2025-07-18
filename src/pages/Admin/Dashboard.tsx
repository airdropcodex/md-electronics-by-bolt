import React, { useState, useEffect } from 'react';
import { Package, FolderOpen, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch categories count
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Fetch orders count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status');

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalCategories: categoriesCount || 0,
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalUsers: usersCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      isRevenue: true,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cod-gray">Dashboard</h1>
        <p className="text-sandstone mt-2">Welcome to the MD Electronics admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-clay-creek/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sandstone">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor} mt-1`}>
                    {card.isRevenue ? card.value : card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-clay-creek/10">
          <h3 className="text-lg font-bold text-cod-gray mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-westar transition-colors">
              <div className="font-medium text-cod-gray">Add New Product</div>
              <div className="text-sm text-sandstone">Create a new product listing</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-westar transition-colors">
              <div className="font-medium text-cod-gray">Manage Orders</div>
              <div className="text-sm text-sandstone">View and update order status</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-westar transition-colors">
              <div className="font-medium text-cod-gray">Add Category</div>
              <div className="text-sm text-sandstone">Create a new product category</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-clay-creek/10">
          <h3 className="text-lg font-bold text-cod-gray mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-westar/50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-cod-gray">New order received</div>
                <div className="text-xs text-sandstone">2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-westar/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-cod-gray">Product updated</div>
                <div className="text-xs text-sandstone">1 hour ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-westar/50">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-cod-gray">New user registered</div>
                <div className="text-xs text-sandstone">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};