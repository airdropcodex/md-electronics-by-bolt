import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-westar flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-cod-gray mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg text-sandstone mb-8">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-cod-gray text-white px-6 py-3 rounded-lg hover:bg-clay-creek transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
          
          <div>
            <Link
              to="/admin/login"
              className="text-clay-creek hover:text-cod-gray transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};