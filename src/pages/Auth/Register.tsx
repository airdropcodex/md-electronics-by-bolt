import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Toast } from '../../components/ui/Toast';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle navigation after successful authentication
  React.useEffect(() => {
    if (user && !authLoading && !loading) {
      setToastMessage('Account created successfully! Welcome to MD Electronics.');
      setShowToast(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // Don't set loading to false here if signup was successful
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
    <div className="min-h-screen flex items-center justify-center bg-westar py-12 px-4 sm:px-6 lg:px-8">
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-cod-gray">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-sandstone">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-clay-creek hover:text-cod-gray transition-colors"
            >
              sign in to your existing account
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
            <label htmlFor="fullName" className="block text-sm font-medium text-cod-gray">
              Full Name
            </label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-sandstone" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none relative block w-full px-12 py-3 border border-clay-creek/30 placeholder-sandstone text-cod-gray rounded-md focus:outline-none focus:ring-clay-creek focus:border-clay-creek focus:z-10 sm:text-sm bg-white"
                placeholder="Enter your full name"
              />
            </div>
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-cod-gray">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-sandstone" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-12 py-3 border border-clay-creek/30 placeholder-sandstone text-cod-gray rounded-md focus:outline-none focus:ring-clay-creek focus:border-clay-creek focus:z-10 sm:text-sm bg-white"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 h-5 w-5 text-sandstone hover:text-cod-gray transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cod-gray hover:bg-clay-creek focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-creek disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};