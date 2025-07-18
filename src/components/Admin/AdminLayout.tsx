import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    ...(userProfile?.role === 'admin' ? [
      { name: 'Staff', href: '/admin/staff', icon: Users }
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-westar">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-cod-gray/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-cod-gray">Admin Panel</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive 
                      ? 'bg-clay-creek text-white' 
                      : 'text-cod-gray hover:bg-westar'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-sm border-r border-clay-creek/10">
          <div className="flex items-center px-6 py-6 border-b border-clay-creek/10">
            <h2 className="text-xl font-bold text-cod-gray">Admin Panel</h2>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-clay-creek text-white' 
                      : 'text-cod-gray hover:bg-westar'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-clay-creek/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-clay-creek rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-cod-gray">
                  {userProfile?.full_name || user?.email}
                </p>
                <p className="text-xs text-sandstone capitalize">
                  {userProfile?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-cod-gray hover:bg-westar rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-clay-creek/10 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-cod-gray hover:bg-westar rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-clay-creek hover:text-cod-gray transition-colors"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};