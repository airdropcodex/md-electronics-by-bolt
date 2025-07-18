import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';

export const CategoryProducts: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  const fetchCategoryProducts = async () => {
    try {
      // First get the category
      const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (category) {
        setCategoryName(category.name);
        
        // Then get products for this category
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', category.id);
        
        setProducts(products || []);
      } else {
        // Fallback for sample data
        const categoryMap: Record<string, { name: string; products: Product[] }> = {
          'air-conditioners': {
            name: 'Air Conditioners',
            products: [
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
              }
            ]
          },
          'televisions': {
            name: 'Televisions',
            products: [
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
              }
            ]
          }
        };

        const categoryData = categoryMap[slug || ''];
        if (categoryData) {
          setCategoryName(categoryData.name);
          setProducts(categoryData.products);
        }
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-westar min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-8">
          <Link
            to="/categories"
            className="inline-flex items-center text-clay-creek hover:text-cod-gray transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-cod-gray mb-4">
            {categoryName || 'Category Products'}
          </h1>
          <p className="text-lg text-sandstone">
            Explore our {categoryName?.toLowerCase()} collection
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-clay-creek"></div>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <h3 className="text-2xl font-bold text-cod-gray mb-4">No products found</h3>
                <p className="text-sandstone mb-6">
                  We're currently updating our {categoryName?.toLowerCase()} collection. 
                  Please check back soon!
                </p>
                <Link
                  to="/categories"
                  className="bg-cod-gray text-white px-6 py-3 rounded-lg hover:bg-clay-creek transition-colors"
                >
                  Browse Other Categories
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};