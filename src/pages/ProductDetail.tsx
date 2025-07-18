import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { supabase } from '../lib/supabase';
import { Toast } from '../components/ui/Toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, quantity);
      setToastMessage('Added to cart successfully!');
      setShowToast(true);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-cod-gray">Product not found</h1>
        <Link to="/categories" className="text-clay-creek hover:underline mt-4 inline-block">
          Back to Categories
        </Link>
      </div>
    );
  }

  const images = [product.image_url, product.image_url, product.image_url, product.image_url];

  return (
    <div className="bg-westar min-h-screen">
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-sandstone mb-8">
          <Link to="/" className="hover:text-clay-creek transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-clay-creek transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-cod-gray font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-clay-creek/10"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-clay-creek shadow-md' 
                      : 'border-clay-creek/20 hover:border-clay-creek/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-clay-creek uppercase tracking-wide">
                  {product.specifications?.brand || 'MD Electronics'}
                </span>
                <span className="text-sandstone">•</span>
                <span className="text-sm text-sandstone">HR1525RQ0 - 8</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-cod-gray mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-clay-creek">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sandstone font-medium">42 reviews</span>
              </div>
            </div>

            <div className="text-4xl font-extrabold text-cod-gray">
              {formatPrice(product.price)}
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-clay-creek/30 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-westar transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-westar transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-lg border transition-colors ${
                  isInWishlist(product.id) 
                    ? 'text-red-500 border-red-200 bg-red-50' 
                    : 'text-sandstone border-clay-creek/30 hover:text-red-500 hover:border-red-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-cod-gray text-white py-4 px-6 rounded-lg font-medium uppercase tracking-wide hover:bg-clay-creek transition-all duration-300 disabled:bg-sandstone/50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              
              <div className="flex items-center text-sm text-sandstone">
                <Truck className="w-4 h-4 mr-2" />
                <span>Free delivery on orders over ৳30.0</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-clay-creek/20">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-clay-creek" />
                <div>
                  <div className="font-medium text-cod-gray">Free Delivery</div>
                  <div className="text-sm text-sandstone">On orders over ৳30</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-clay-creek" />
                <div>
                  <div className="font-medium text-cod-gray">Warranty</div>
                  <div className="text-sm text-sandstone">1 year coverage</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-clay-creek" />
                <div>
                  <div className="font-medium text-cod-gray">Easy Returns</div>
                  <div className="text-sm text-sandstone">30 day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10">
          <h2 className="text-2xl font-bold text-cod-gray mb-6">Product Description</h2>
          <div className="prose prose-lg text-sandstone leading-relaxed">
            <p>{product.description}</p>
            
            <h3 className="text-lg font-bold text-cod-gray mt-6 mb-3">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-clay-creek/10">
                  <span className="font-medium text-cod-gray capitalize">{key.replace('_', ' ')}</span>
                  <span className="text-sandstone">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};