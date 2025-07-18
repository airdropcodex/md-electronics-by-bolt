import React from 'react';
import { Shield, Truck, Headphones, Award, Users, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Authentic Products',
      description: 'All our products come with official manufacturer warranty and are 100% genuine.'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Free delivery across Dhaka city with same-day delivery for orders placed before 2 PM.'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Our customer service team is available round the clock to assist you.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Best Prices',
      description: 'Competitive pricing with regular offers and discounts on all products.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '5,000+', label: 'Products Sold' },
    { number: '50+', label: 'Brand Partners' },
    { number: '3', label: 'Years of Service' }
  ];

  return (
    <div className="bg-westar">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-cod-gray mb-6">
            About MD Electronics
          </h1>
          <p className="text-lg md:text-xl text-sandstone leading-relaxed max-w-3xl mx-auto">
            Your trusted electronics retailer in Bangladesh, committed to providing quality products 
            at competitive prices with exceptional customer service.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-cod-gray mb-6">Our Story</h2>
              <div className="space-y-4 text-sandstone leading-relaxed">
                <p>
                  Founded in 2021, MD Electronics started as a small electronics store in Dhaka with a 
                  simple mission: to make quality electronics accessible to everyone in Bangladesh.
                </p>
                <p>
                  Over the years, we've grown from a single store to a trusted online platform, serving 
                  thousands of customers across the country. Our commitment to authenticity, competitive 
                  pricing, and excellent customer service has made us a preferred choice for electronics 
                  shopping.
                </p>
                <p>
                  Today, we partner with leading brands to bring you the latest in air conditioners, 
                  televisions, kitchen appliances, and more, all backed by official warranties and 
                  our promise of quality service.
                </p>
              </div>
            </div>
            <div className="bg-clay-creek/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-cod-gray mb-2">{stat.number}</div>
                    <div className="text-sandstone font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cod-gray mb-4">Why Choose Us?</h2>
            <p className="text-lg text-sandstone">We're committed to providing the best shopping experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-clay-creek/10 text-center">
                <div className="flex justify-center mb-4 text-clay-creek">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-cod-gray mb-3">{feature.title}</h3>
                <p className="text-sandstone leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-westar rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-clay-creek mr-3" />
                <h3 className="text-2xl font-bold text-cod-gray">Our Mission</h3>
              </div>
              <p className="text-sandstone leading-relaxed">
                To democratize access to quality electronics in Bangladesh by providing authentic products 
                at competitive prices, backed by excellent customer service and reliable after-sales support.
              </p>
            </div>
            
            <div className="bg-westar rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-clay-creek mr-3" />
                <h3 className="text-2xl font-bold text-cod-gray">Our Vision</h3>
              </div>
              <p className="text-sandstone leading-relaxed">
                To become Bangladesh's most trusted electronics retailer, known for our commitment to 
                quality, innovation, and customer satisfaction, while contributing to the digital 
                transformation of our communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <h2 className="text-3xl font-bold text-cod-gray mb-8">Visit Our Store</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-clay-creek/10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-clay-creek mr-2" />
              <h3 className="text-xl font-bold text-cod-gray">MD Electronics</h3>
            </div>
            <div className="space-y-2 text-sandstone">
              <p>123 Electronics Street</p>
              <p>Dhanmondi, Dhaka - 1205</p>
              <p>Bangladesh</p>
            </div>
            <div className="mt-6 pt-6 border-t border-clay-creek/20">
              <p className="text-sandstone">
                <strong>Business Hours:</strong><br />
                Saturday - Thursday: 9:00 AM - 9:00 PM<br />
                Friday: 2:00 PM - 9:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};