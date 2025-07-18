import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Toast } from '../components/ui/Toast';

export const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
    setToastMessage('Added to cart successfully!');
    setShowToast(true);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
    setToastMessage('Removed from wishlist');
    setShowToast(true);
  };

  if (!user) {
    return (
      <div className="bg-westar min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="mx-auto h-12 w-12 text-sandstone mb-4" />
          <h2 className="text-2xl font-bold text-cod-gray mb-2">Please log in to view your wishlist</h2>
          <p className="text-sandstone mb-6">Save your favorite products for later</p>
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

  if (loading) {
    return (
      <div className="bg-westar min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-westar min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="mx-auto h-12 w-12 text-sandstone mb-4" />
          <h2 className="text-2xl font-bold text-cod-gray mb-2">Your wishlist is empty</h2>
          <p className="text-sandstone mb-6">Start adding products you love to your wishlist</p>
          <Link
            to="/products"
            className="inline-block bg-cod-gray text-white px-6 py-2 rounded-lg hover:bg-clay-creek transition-colors"
          >
            Browse Products
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
          <h1 className="text-3xl font-bold text-cod-gray mb-2">My Wishlist</h1>
          <p className="text-sandstone">{wishlistItems.length} items saved</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-clay-creek/10 hover:shadow-lg transition-all">
              <Link to={`/product/${item.product?.id}`}>
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
                  <img
                    src={item.product?.image_url}
                    alt={item.product?.name}
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              
              <div className="p-6">
                <Link to={`/product/${item.product?.id}`}>
                  <h3 className="text-lg font-bold text-cod-gray hover:text-clay-creek transition-colors line-clamp-2 mb-2">
                    {item.product?.name}
                  </h3>
                </Link>
                
                <p className="text-sandstone text-sm line-clamp-2 mb-4 leading-relaxed">
                  {item.product?.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-extrabold text-cod-gray">
                    {formatPrice(item.product?.price || 0)}
                  </span>
                  <span className="text-xs text-sandstone">
                    {(item.product?.stock || 0) > 0 ? 'In stock' : 'Out of stock'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item.product?.id || '')}
                    disabled={(item.product?.stock || 0) === 0}
                    className="flex-1 bg-cod-gray text-white py-2 px-3 rounded-lg font-medium hover:bg-clay-creek transition-colors disabled:bg-sandstone/50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item.product?.id || '')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};