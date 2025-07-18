import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy]);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*');
      
      if (data) {
        setProducts(data);
      } else {
        // Fallback to sample data
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
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="bg-westar min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cod-gray mb-4">All Products</h1>
          <p className="text-lg text-sandstone">Discover our complete range of electronics</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-clay-creek/10 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-sandstone" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-westar/50 text-cod-gray"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek bg-white text-cod-gray"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex border border-clay-creek/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-clay-creek text-white' : 'bg-white text-cod-gray hover:bg-westar'} transition-colors`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-clay-creek text-white' : 'bg-white text-cod-gray hover:bg-westar'} transition-colors`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-clay-creek"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sandstone">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-24">
                <h3 className="text-2xl font-bold text-cod-gray mb-4">No products found</h3>
                <p className="text-sandstone mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('name');
                  }}
                  className="bg-cod-gray text-white px-6 py-3 rounded-lg hover:bg-clay-creek transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};