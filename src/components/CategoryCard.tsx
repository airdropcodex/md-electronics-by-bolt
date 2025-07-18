import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Snowflake, Tv, ChefHat, Shirt, Refrigerator, Package } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('air') || name.includes('conditioner')) return <Snowflake className="w-12 h-12" />;
    if (name.includes('tv') || name.includes('television')) return <Tv className="w-12 h-12" />;
    if (name.includes('oven') || name.includes('microwave')) return <ChefHat className="w-12 h-12" />;
    if (name.includes('washing') || name.includes('machine')) return <Shirt className="w-12 h-12" />;
    if (name.includes('refrigerator') || name.includes('fridge')) return <Refrigerator className="w-12 h-12" />;
    if (name.includes('freezer')) return <Package className="w-12 h-12" />;
    return <Package className="w-12 h-12" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link
        to={`/categories/${category.slug}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-clay-creek/10 hover:border-clay-creek/30"
      >
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6 text-clay-creek group-hover:text-cod-gray transition-colors duration-300">
            {getCategoryIcon(category.name)}
          </div>
          <h3 className="text-xl font-bold text-cod-gray group-hover:text-clay-creek transition-colors mb-4">
            {category.name}
          </h3>
          <ArrowRight className="w-5 h-5 text-clay-creek opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mx-auto" />
        </div>
      </Link>
    </motion.div>
  );
};