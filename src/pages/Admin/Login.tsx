import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in as admin/staff
    if (user && userProfile && ['admin', 'staff'].includes(userProfile.role)) {
      navigate('/admin');
    }
  }, [user, userProfile, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error.message);
      } else {
        // Wait a moment for userProfile to be fetched
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-westar py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-clay-creek rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-cod-gray">
            Admin Panel Login
          </h2>
          <p className="mt-2 text-sm text-sandstone">
            Sign in to access the administration panel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cod-gray">
              Email address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-sandstone" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-12 py-3 border border-clay-creek/30 placeholder-sandstone text-cod-gray rounded-md focus:outline-none focus:ring-clay-creek focus:border-clay-creek focus:z-10 sm:text-sm bg-white"
                placeholder="Enter your admin email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-cod-gray">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-sandstone" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-12 py-3 border border-clay-creek/30 placeholder-sandstone text-cod-gray rounded-md focus:outline-none focus:ring-clay-creek focus:border-clay-creek focus:z-10 sm:text-sm bg-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 h-5 w-5 text-sandstone hover:text-cod-gray transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cod-gray hover:bg-clay-creek focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-creek disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-clay-creek hover:text-cod-gray transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};