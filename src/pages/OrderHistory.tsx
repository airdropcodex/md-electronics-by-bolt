import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useClerkAuth';
import { supabase } from '../lib/supabase';
import { Order, OrderItem, Product } from '../types';

interface OrderWithItems extends Order {
  order_items: (OrderItem & { product: Product })[];
}

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Don't fail silently - set empty orders on error
      setOrders([]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="bg-westar min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-cod-gray mb-4">Please log in to view your orders</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-westar min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-8">
          <Link
            to="/account"
            className="inline-flex items-center text-clay-creek hover:text-cod-gray transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-cod-gray mb-2">Order History</h1>
          <p className="text-sandstone">View all your past orders and their status</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="mx-auto h-12 w-12 text-sandstone mb-4" />
            <h2 className="text-2xl font-bold text-cod-gray mb-2">No orders yet</h2>
            <p className="text-sandstone mb-6">You haven't placed any orders yet</p>
            <Link
              to="/categories"
              className="inline-block bg-cod-gray text-white px-6 py-2 rounded-lg hover:bg-clay-creek transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-clay-creek/10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div>
                      <h3 className="text-lg font-bold text-cod-gray">
                        Order #{order.id.substring(0, 8)}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-sandstone mt-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {order.payment_method.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cod-gray">
                        {formatPrice(Number(order.total_amount))}
                      </div>
                      <div className="text-sm text-sandstone">
                        {order.order_items.length} item(s)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-clay-creek/10 pt-4">
                  <div className="flex items-start space-x-4 mb-4">
                    <MapPin className="w-4 h-4 text-clay-creek mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-cod-gray">Delivery Address</div>
                      <div className="text-sm text-sandstone">{order.shipping_address}</div>
                      <div className="text-sm text-sandstone">Phone: {order.phone}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-cod-gray">Order Items</h4>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-westar/30 rounded-lg">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-cod-gray">{item.product.name}</div>
                          <div className="text-sm text-sandstone">
                            Quantity: {item.quantity} × {formatPrice(Number(item.price))}
                          </div>
                        </div>
                        <div className="font-bold text-cod-gray">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};