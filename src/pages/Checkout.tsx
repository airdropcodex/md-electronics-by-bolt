import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Toast } from '../components/ui/Toast';

export const Checkout: React.FC = () => {
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setToastMessage('Please log in to place an order');
      setShowToast(true);
      return;
    }

    if (cartItems.length === 0) {
      setToastMessage('Your cart is empty');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalAmount(),
          shipping_address: formData.address,
          phone: formData.phone,
          payment_method: formData.paymentMethod,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear the cart
      await clearCart();

      setToastMessage('Order placed successfully! We will contact you soon.');
      setShowToast(true);
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      setToastMessage('Failed to place order. Please try again.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cod-gray mb-4">Please log in to checkout</h2>
          <Link
            to="/login"
            className="inline-block bg-cod-gray text-white px-6 py-2 rounded-lg hover:bg-clay-creek transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cod-gray mb-4">Your cart is empty</h2>
          <Link
            to="/categories"
            className="inline-block bg-cod-gray text-white px-6 py-2 rounded-lg hover:bg-clay-creek transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-westar min-h-screen py-8">
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-clay-creek hover:text-cod-gray transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-cod-gray">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10">
            <h2 className="text-2xl font-bold text-cod-gray mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-cod-gray mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-cod-gray mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-cod-gray mb-2">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray"
                />
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-cod-gray mb-2">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cod-gray text-white py-4 px-6 rounded-lg font-medium uppercase tracking-wide hover:bg-clay-creek transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{loading ? 'Placing Order...' : 'Place Order'}</span>
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10">
            <h2 className="text-2xl font-bold text-cod-gray mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product?.image_url}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-cod-gray">{item.product?.name}</h3>
                    <p className="text-sandstone text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cod-gray">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-clay-creek/20 pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sandstone">Subtotal</span>
                <span className="font-semibold">{formatPrice(getTotalAmount())}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sandstone">Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-cod-gray border-t border-clay-creek/20 pt-3">
                <span>Total</span>
                <span>{formatPrice(getTotalAmount())}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-sandstone">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Free delivery across Dhaka</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};