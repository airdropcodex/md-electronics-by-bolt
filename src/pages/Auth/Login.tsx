import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Toast } from '../../components/ui/Toast';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle navigation after successful authentication
  React.useEffect(() => {
    if (user && !authLoading && !loading) {
      setToastMessage('Login successful! Welcome back.');
      setShowToast(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [user, authLoading, loading, navigate]);

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
        setLoading(false);
      }
      // Don't set loading to false here if login was successful
      // Let the useEffect handle navigation after auth state updates
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    } finally {
      // Only set loading to false if there was an error
      // Success case is handled by useEffect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-westar via-westar to-clay-creek/10 py-12 px-4 sm:px-6 lg:px-8">
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-clay-creek/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-cod-gray">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-sandstone">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-clay-creek hover:text-cod-gray transition-colors"
            >
              create a new account
            </Link>
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
                placeholder="Enter your email"
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

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-clay-creek hover:text-cod-gray transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cod-gray hover:bg-clay-creek focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-creek disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};