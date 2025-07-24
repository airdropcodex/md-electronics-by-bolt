import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useAuth } from '../hooks/useClerkAuth';

export const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount, loading } = useCart();
  const { user } = useAuth();

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
          <ShoppingBag className="mx-auto h-12 w-12 text-sandstone mb-4" />
          <h2 className="text-2xl font-bold text-cod-gray mb-2">Please log in to view your cart</h2>
          <p className="text-sandstone mb-6">You need to be logged in to add items to your cart</p>
          <SignInButton mode="modal">
            <button className="inline-block bg-cod-gray text-white px-6 py-2 rounded-lg hover:bg-clay-creek transition-colors">
              Login
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-sandstone mb-4" />
          <h2 className="text-2xl font-bold text-cod-gray mb-2">Your cart is empty</h2>
          <p className="text-sandstone mb-6">Add some products to your cart to get started</p>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-cod-gray mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-clay-creek/10">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center p-6 border-b last:border-b-0">
                <img
                  src={item.product?.image_url}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-cod-gray">
                    {item.product?.name}
                  </h3>
                  <p className="text-sandstone text-sm mt-1">
                    {item.product?.description}
                  </p>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-cod-gray">
                      {formatPrice(item.product?.price || 0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-westar transition-colors"
                  >
                    <Minus className="w-4 h-4 text-sandstone" />
                  </button>
                  
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-westar transition-colors"
                  >
                    <Plus className="w-4 h-4 text-sandstone" />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-clay-creek/10">
            <h2 className="text-xl font-semibold text-cod-gray mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sandstone">Subtotal</span>
                <span className="font-semibold">{formatPrice(getTotalAmount())}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sandstone">Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-cod-gray">Total</span>
                  <span className="text-lg font-semibold text-cod-gray">
                    {formatPrice(getTotalAmount())}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="w-full mt-6 bg-cod-gray text-white py-3 px-4 rounded-lg hover:bg-clay-creek transition-colors flex items-center justify-center"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              to="/categories"
              className="w-full mt-3 bg-westar text-cod-gray py-3 px-4 rounded-lg hover:bg-clay-creek/20 transition-colors flex items-center justify-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};