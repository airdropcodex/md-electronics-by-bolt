import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'Fast Delivery' },
    { icon: <Shield className="w-5 h-5" />, text: 'Warranty' },
    { icon: <Truck className="w-5 h-5" />, text: 'Free Shipping' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-westar via-westar to-clay-creek/10 py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-cod-gray mb-6 leading-tight">
              Premium Electronics
              <br />
              <span className="text-clay-creek">Made Simple</span>
            </h1>
            
            <p className="text-lg md:text-xl text-sandstone mb-8 leading-relaxed max-w-2xl mx-auto">
              Discover Bangladesh's most trusted electronics retailer. Quality products, 
              competitive prices, and exceptional service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/categories"
                className="group bg-cod-gray text-white px-8 py-4 rounded-lg font-medium uppercase tracking-wide hover:bg-clay-creek transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="text-cod-gray font-medium uppercase tracking-wide hover:text-clay-creek transition-colors px-8 py-4"
              >
                Learn More
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sandstone">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="text-clay-creek">{feature.icon}</div>
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-clay-creek/5 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sandstone/5 rounded-full translate-y-32 -translate-x-32"></div>
    </section>
  );
};