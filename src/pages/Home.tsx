import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Headphones, CreditCard, Zap, Award } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { HeroSection } from '../components/HeroSection';
import { CategoryCard } from '../components/CategoryCard';
import { supabase } from '../lib/supabase';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(8);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*');

      setFeaturedProducts(products || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demonstration
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Samsung 1.5 Ton Split AC',
      description: 'Energy efficient air conditioner with inverter technology',
      price: 45000,
      category_id: '1',
      image_url: 'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=500',
      specifications: { capacity: '1.5 Ton', type: 'Split', energy_rating: '5 Star' },
      stock: 10,
      featured: true,
      created_at: '2025-01-27',
      updated_at: '2025-01-27'
    },
    {
      id: '2',
      name: 'LG 43" Smart TV',
      description: '4K Ultra HD Smart TV with WebOS',
      price: 35000,
      category_id: '2',
      image_url: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500',
      specifications: { size: '43 inch', resolution: '4K', smart: 'Yes' },
      stock: 15,
      featured: true,
      created_at: '2025-01-27',
      updated_at: '2025-01-27'
    },
    {
      id: '3',
      name: 'Walton 25L Microwave Oven',
      description: 'Digital microwave oven with grill function',
      price: 12000,
      category_id: '3',
      image_url: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=500',
      specifications: { capacity: '25L', type: 'Digital', grill: 'Yes' },
      stock: 8,
      featured: true,
      created_at: '2025-01-27',
      updated_at: '2025-01-27'
    },
    {
      id: '4',
      name: 'Haier 8kg Washing Machine',
      description: 'Front load washing machine with multiple wash programs',
      price: 28000,
      category_id: '4',
      image_url: 'https://images.pexels.com/photos/5824900/pexels-photo-5824900.jpeg?auto=compress&cs=tinysrgb&w=500',
      specifications: { capacity: '8kg', type: 'Front Load', rpm: '1200' },
      stock: 5,
      featured: true,
      created_at: '2025-01-27',
      updated_at: '2025-01-27'
    },
    {
      id: '5',
      name: 'Singer 350L Refrigerator',
      description: 'Double door refrigerator with frost-free technology',
      price: 32000,
      category_id: '5',
      image_url: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500',
      specifications: { capacity: '350L', type: 'Double Door', frost_free: 'Yes' },
      stock: 12,
      featured: true,
      created_at: '2025-01-27',
      updated_at: '2025-01-27'
    },
    {
      id: '6',
      name: 'Jamuna 200L Deep Freezer',
      description: 'Chest freezer with energy efficient compressor',
      price: 22000,
      category_id: '6',
      image_url: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500',
      specifications: { capacity: '200L', type: 'Chest', energy_rating: '4 Star' },
      stock: 6,
      featured: true,
      created_at: '2025-01-27',
      updated_at: '2025-01-27'
    }
  ];

  const sampleCategories = [
    { id: '1', name: 'Air Conditioners', slug: 'air-conditioners', description: 'Cool your home', image_url: 'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '2', name: 'Televisions', slug: 'televisions', description: 'Entertainment systems', image_url: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '3', name: 'Ovens', slug: 'ovens', description: 'Kitchen appliances', image_url: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '4', name: 'Washing Machines', slug: 'washing-machines', description: 'Laundry solutions', image_url: 'https://images.pexels.com/photos/5824900/pexels-photo-5824900.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '5', name: 'Refrigerators', slug: 'refrigerators', description: 'Keep food fresh', image_url: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '6', name: 'Deep Freezers', slug: 'deep-freezers', description: 'Frozen storage', image_url: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' }
  ];

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : sampleProducts;
  const displayCategories = categories.length > 0 ? categories : sampleCategories;

  const features = [
    {
      icon: <Truck className="w-12 h-12" />,
      title: 'Free Delivery',
      description: 'Free delivery across Dhaka city for orders over ৳1000'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Authentic Warranty',
      description: 'All products come with official manufacturer warranty'
    },
    {
      icon: <Headphones className="w-12 h-12" />,
      title: '24/7 Support',
      description: 'Round the clock customer support via phone and chat'
    },
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: 'Flexible Payment',
      description: 'bKash, Nagad, Rocket, cards, and cash on delivery'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Quick Installation',
      description: 'Professional installation service for all appliances'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Best Prices',
      description: 'Competitive pricing with regular offers and discounts'
    }
  ];

  return (
    <div>
      <HeroSection />

      {/* Categories Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-cod-gray mb-6"
            >
              Shop by Category
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-sandstone leading-relaxed max-w-2xl mx-auto"
            >
              Explore our wide range of electronics
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-gradient-to-br from-westar to-clay-creek/5">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-cod-gray mb-6"
            >
              Featured Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-sandstone leading-relaxed max-w-2xl mx-auto"
            >
              Discover our most popular electronics
            </motion.p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-clay-creek"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-cod-gray mb-6"
            >
              Why Choose MD Electronics?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-sandstone leading-relaxed max-w-2xl mx-auto"
            >
              We provide the best service to our customers
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex justify-center mb-6">
                  <div className="text-clay-creek group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-cod-gray mb-4 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sandstone leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};