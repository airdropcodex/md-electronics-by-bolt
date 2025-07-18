import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { supabase } from '../lib/supabase';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*');
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demonstration
  const sampleCategories: Category[] = [
    { id: '1', name: 'Air Conditioners', slug: 'air-conditioners', description: 'Stay cool with our energy-efficient air conditioners', image_url: 'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '2', name: 'Televisions', slug: 'televisions', description: 'Experience entertainment with our smart TVs', image_url: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '3', name: 'Ovens', slug: 'ovens', description: 'Modern kitchen appliances for your home', image_url: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '4', name: 'Washing Machines', slug: 'washing-machines', description: 'Efficient laundry solutions for your needs', image_url: 'https://images.pexels.com/photos/5824900/pexels-photo-5824900.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '5', name: 'Refrigerators', slug: 'refrigerators', description: 'Keep your food fresh with our refrigerators', image_url: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' },
    { id: '6', name: 'Deep Freezers', slug: 'deep-freezers', description: 'Large capacity freezers for bulk storage', image_url: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500', created_at: '2025-01-27' }
  ];

  const displayCategories = categories.length > 0 ? categories : sampleCategories;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-cod-gray mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-sandstone">
            Explore our wide range of electronics
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-clay-creek/10 hover:border-clay-creek/30"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-cod-gray group-hover:text-clay-creek transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sandstone">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};