import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

export const Account: React.FC = () => {
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();

  if (!user) {
    return (
      <div className="bg-westar min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-cod-gray mb-4">Please log in to access your account</h1>
          <Link
            to="/login"
            className="inline-block bg-cod-gray text-white px-6 py-3 rounded-lg hover:bg-clay-creek transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-westar min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cod-gray mb-2">My Account</h1>
          <p className="text-sandstone">Welcome back, {user.user_metadata?.full_name || user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-clay-creek/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-clay-creek" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cod-gray">Profile</h2>
                <p className="text-sandstone">Manage your account</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-sandstone">Email</label>
                <p className="text-cod-gray">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-sandstone">Name</label>
                <p className="text-cod-gray">{user.user_metadata?.full_name || 'Not provided'}</p>
              </div>
            </div>
            <button className="mt-6 w-full bg-westar text-cod-gray py-2 px-4 rounded-lg hover:bg-clay-creek/20 transition-colors flex items-center justify-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Cart Summary */}
          <Link to="/cart" className="bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10 hover:shadow-lg transition-all group">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-clay-creek/20 rounded-full flex items-center justify-center group-hover:bg-clay-creek/30 transition-colors">
                <ShoppingBag className="w-8 h-8 text-clay-creek" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cod-gray group-hover:text-clay-creek transition-colors">Shopping Cart</h2>
                <p className="text-sandstone">View your cart items</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cod-gray mb-2">{getTotalItems()}</div>
              <p className="text-sandstone">Items in cart</p>
            </div>
          </Link>

          {/* Wishlist Summary */}
          <Link to="/wishlist" className="bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10 hover:shadow-lg transition-all group">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-clay-creek/20 rounded-full flex items-center justify-center group-hover:bg-clay-creek/30 transition-colors">
                <Heart className="w-8 h-8 text-clay-creek" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cod-gray group-hover:text-clay-creek transition-colors">Wishlist</h2>
                <p className="text-sandstone">Your favorite items</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cod-gray mb-2">{getTotalWishlistItems()}</div>
              <p className="text-sandstone">Saved items</p>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10">
          <h2 className="text-2xl font-bold text-cod-gray mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/categories"
              className="p-4 bg-westar rounded-lg hover:bg-clay-creek/20 transition-colors text-center"
            >
              <h3 className="font-semibold text-cod-gray mb-1">Browse Categories</h3>
              <p className="text-sm text-sandstone">Explore our product range</p>
            </Link>
            
            <Link
              to="/products"
              className="p-4 bg-westar rounded-lg hover:bg-clay-creek/20 transition-colors text-center"
            >
              <h3 className="font-semibold text-cod-gray mb-1">All Products</h3>
              <p className="text-sm text-sandstone">View all available items</p>
            </Link>
            
            <Link
              to="/contact"
              className="p-4 bg-westar rounded-lg hover:bg-clay-creek/20 transition-colors text-center"
            >
              <h3 className="font-semibold text-cod-gray mb-1">Contact Support</h3>
              <p className="text-sm text-sandstone">Get help with your orders</p>
            </Link>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={signOut}
            className="inline-flex items-center space-x-2 text-sandstone hover:text-cod-gray transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};