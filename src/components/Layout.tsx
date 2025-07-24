import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, signOut, loading: authLoading } = useAuth();
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*');
      
      if (data) {
        setCategories(data);
      } else {
        // Fallback to sample data
        setCategories([
          { id: '1', name: 'Air Conditioners', slug: 'air-conditioners', description: '', image_url: '', created_at: '' },
          { id: '2', name: 'Televisions', slug: 'televisions', description: '', image_url: '', created_at: '' },
          { id: '3', name: 'Ovens', slug: 'ovens', description: '', image_url: '', created_at: '' },
          { id: '4', name: 'Washing Machines', slug: 'washing-machines', description: '', image_url: '', created_at: '' },
          { id: '5', name: 'Refrigerators', slug: 'refrigerators', description: '', image_url: '', created_at: '' },
          { id: '6', name: 'Deep Freezers', slug: 'deep-freezers', description: '', image_url: '', created_at: '' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <div className="min-h-screen bg-westar font-inter">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-clay-creek/10">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          {/* Main header */}
          <div className="flex items-center justify-between py-6">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-cod-gray font-pacifico hover:text-clay-creek transition-colors">
              MD Electronics
            </Link>

            {/* Search bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-12">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 border border-clay-creek/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-creek/50 focus:border-clay-creek bg-westar/50 text-cod-gray placeholder-sandstone font-medium"
                />
                <button 
                  type="submit"
                  className="absolute right-4 top-3.5 w-5 h-5 text-sandstone hover:text-clay-creek transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Link to="/wishlist" className="hidden md:block p-3 hover:bg-westar rounded-xl transition-colors group relative">
                <Heart className="w-5 h-5 text-cod-gray group-hover:text-clay-creek transition-colors" />
                {getTotalWishlistItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-clay-creek text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {getTotalWishlistItems()}
                  </motion.span>
                )}
              </Link>
              
              <Link to="/cart" className="relative p-3 hover:bg-westar rounded-xl transition-colors group">
                <ShoppingCart className="w-5 h-5 text-cod-gray group-hover:text-clay-creek transition-colors" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-clay-creek text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </Link>
              
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-3 hover:bg-westar rounded-xl transition-colors group"
                >
                  <User className="w-5 h-5 text-cod-gray group-hover:text-clay-creek transition-colors" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-xl border border-clay-creek/10 py-2 z-50">
                    {authLoading ? (
                      <div className="px-4 py-2 text-sm text-sandstone">
                        Loading... (Check console for details)
                      </div>
                    ) : user ? (
                      <>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm font-medium text-cod-gray hover:bg-westar hover:text-clay-creek transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2 text-sm font-medium text-cod-gray hover:bg-westar hover:text-clay-creek transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        <hr className="my-2 border-clay-creek/10" />
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-cod-gray hover:bg-westar hover:text-clay-creek transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm font-medium text-cod-gray hover:bg-westar hover:text-clay-creek transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm font-medium text-cod-gray hover:bg-westar hover:text-clay-creek transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <Link to={user ? "/account" : "/login"} className="md:hidden p-3 hover:bg-westar rounded-xl transition-colors group">
                <User className="w-5 h-5 text-cod-gray group-hover:text-clay-creek transition-colors" />
              </Link>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 hover:bg-westar rounded-xl transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-12 py-4 border-t border-clay-creek/5">
            <Link 
              to="/" 
              className={`font-bold uppercase tracking-wide text-sm hover:text-clay-creek transition-colors ${isActiveLink('/') ? 'text-clay-creek' : 'text-cod-gray'}`}
            >
              Home
            </Link>
            <div className="relative group">
              <button className="font-bold uppercase tracking-wide text-sm text-cod-gray hover:text-clay-creek transition-colors flex items-center">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-3 w-56 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-clay-creek/10">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/categories/${category.slug}`}
                    className="block px-6 py-3 text-sm font-medium text-cod-gray hover:bg-westar hover:text-clay-creek transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link 
              to="/about" 
              className={`font-bold uppercase tracking-wide text-sm hover:text-clay-creek transition-colors ${isActiveLink('/about') ? 'text-clay-creek' : 'text-cod-gray'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-bold uppercase tracking-wide text-sm hover:text-clay-creek transition-colors ${isActiveLink('/contact') ? 'text-clay-creek' : 'text-cod-gray'}`}
            >
              Contact
            </Link>
            <Link 
              to="/products" 
              className={`font-bold uppercase tracking-wide text-sm hover:text-clay-creek transition-colors ${isActiveLink('/products') ? 'text-clay-creek' : 'text-cod-gray'}`}
            >
              All Products
            </Link>
          </nav>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-6 border-t border-clay-creek/10"
            >
              <div className="flex flex-col space-y-2">
                <form onSubmit={handleSearch} className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-3 border border-clay-creek/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-creek/50 focus:border-clay-creek bg-westar/50 text-cod-gray placeholder-sandstone font-medium"
                  />
                  <button 
                    type="submit"
                    className="absolute right-4 top-3.5 w-5 h-5 text-sandstone hover:text-clay-creek transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
                <Link to="/" className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors">
                  Home
                </Link>
                <div className="py-3">
                  <span className="font-bold uppercase tracking-wide text-cod-gray">Categories</span>
                  <div className="ml-6 mt-3 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/categories/${category.slug}`}
                        className="block py-2 text-sm font-medium text-sandstone hover:text-clay-creek transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link to="/about" className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors">
                  About
                </Link>
                <Link to="/products" className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors">
                  All Products
                </Link>
                <Link to="/contact" className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors">
                  Contact
                </Link>
                <hr className="my-4 border-clay-creek/20" />
                {authLoading ? (
                  <div className="block py-3 text-cod-gray">
                    Loading...
                  </div>
                ) : user ? (
                  <>
                    <Link to="/account" className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors">
                      My Account
                    </Link>
                    <Link to="/wishlist" className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors">
                      Wishlist
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }} 
                      className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors text-left w-full"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block py-3 font-bold uppercase tracking-wide text-cod-gray hover:text-clay-creek transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-sandstone text-white mt-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 font-pacifico">
                MD Electronics
              </h3>
              <p className="text-westar/80 mb-6 leading-relaxed">
                Your trusted electronics retailer in Bangladesh. Quality products at competitive prices.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">+880-1234-567890</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">support@mdelectronics.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 uppercase tracking-wide">Categories</h4>
              <div className="space-y-3">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.slug}
                    to={`/categories/${category.slug}`}
                    className="block text-westar/80 hover:text-white transition-colors font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 uppercase tracking-wide">Customer Care</h4>
              <div className="space-y-3">
                <Link to="/contact" className="block text-westar/80 hover:text-white transition-colors font-medium">
                  Contact Us
                </Link>
                <Link to="/terms" className="block text-westar/80 hover:text-white transition-colors font-medium">
                  Terms & Conditions
                </Link>
                <Link to="/privacy" className="block text-westar/80 hover:text-white transition-colors font-medium">
                  Privacy Policy
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 uppercase tracking-wide">Payment Methods</h4>
              <div className="space-y-3 text-westar/80">
                <div className="font-medium">bKash</div>
                <div className="font-medium">Nagad</div>
                <div className="font-medium">Rocket</div>
                <div className="font-medium">Credit/Debit Cards</div>
                <div className="font-medium">Cash on Delivery</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-clay-creek/30 mt-12 pt-8 text-center text-westar/60">
            <p className="font-medium">&copy; 2025 MD Electronics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};