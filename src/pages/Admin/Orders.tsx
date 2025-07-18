import React, { useState, useEffect } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order, OrderItem } from '../../types';
import { Toast } from '../../components/ui/Toast';

interface OrderWithItems extends Order {
  order_items: (OrderItem & { product: { name: string; image_url: string } })[];
  user_profiles: { full_name: string; email: string };
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles!orders_user_id_fkey(full_name, email),
          order_items(
            *,
            product:products(name, image_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      setToastMessage(`Order status updated to ${newStatus}`);
      setShowToast(true);
      fetchOrders();
      
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setToastMessage('Error updating order status');
      setShowToast(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4 text-orange-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
      </div>
    );
  }

  return (
    <div>
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cod-gray">Orders</h1>
        <p className="text-sandstone mt-2">Manage customer orders and track deliveries</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-sandstone" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek bg-white w-full"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-clay-creek/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-westar">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-creek/10">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-westar/50">
                  <td className="px-6 py-4 text-sm font-medium text-cod-gray">
                    #{order.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-cod-gray">
                        {order.user_profiles?.full_name || 'Unknown'}
                      </div>
                      <div className="text-sm text-sandstone">
                        {order.user_profiles?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-cod-gray">
                    {formatPrice(Number(order.total_amount))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-cod-gray">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-clay-creek hover:text-cod-gray"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-cod-gray/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-cod-gray">
                  Order #{selectedOrder.id.substring(0, 8)}
                </h2>
                <p className="text-sandstone">
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-sandstone hover:text-cod-gray"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Customer Info */}
              <div className="bg-westar/50 rounded-lg p-4">
                <h3 className="font-bold text-cod-gray mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.user_profiles?.full_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user_profiles?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.shipping_address}</p>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-westar/50 rounded-lg p-4">
                <h3 className="font-bold text-cod-gray mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Total:</strong> {formatPrice(Number(selectedOrder.total_amount))}</p>
                  <p><strong>Payment:</strong> {selectedOrder.payment_method.toUpperCase()}</p>
                  <div className="flex items-center space-x-2">
                    <strong>Status:</strong>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="px-2 py-1 border border-clay-creek/30 rounded text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-cod-gray mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.order_items.map((item) => (
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

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-cod-gray text-white rounded-lg hover:bg-clay-creek transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};