import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Badge } from './ui/Badge';
import { Toast } from './ui/Toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(product.id);
    setToastMessage('Added to cart successfully!');
    setShowToast(true);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
      setToastMessage('Removed from wishlist');
    } else {
      await addToWishlist(product.id);
      setToastMessage('Added to wishlist');
    }
    setShowToast(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-clay-creek/10 hover:border-clay-creek/30 relative"
    >
      {product.featured && <Badge variant="featured">Featured</Badge>}
      {product.stock < 5 && product.stock > 0 && <Badge variant="limited">Limited Stock</Badge>}
      
      <Link to={`/product/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cod-gray/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      
      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-cod-gray group-hover:text-clay-creek transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center text-clay-creek">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-xs text-sandstone ml-2 font-medium">(4.5)</span>
        </div>
        
        <p className="text-sandstone text-sm line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-cod-gray">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-sandstone font-medium">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full transition-colors ${
              isInWishlist(product.id) ? 'text-red-500 bg-red-50' : 'text-sandstone hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-cod-gray text-white py-3 px-4 rounded-lg font-medium uppercase tracking-wide hover:bg-clay-creek transition-all duration-300 disabled:bg-sandstone/50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-105"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
    </>
  );
};