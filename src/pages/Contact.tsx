import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-cod-gray mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-sandstone">
            Get in touch with our team for any questions or support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-cod-gray mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cod-gray mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray placeholder-sandstone"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cod-gray mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray placeholder-sandstone"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-cod-gray mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray placeholder-sandstone"
                  placeholder="+880-1234-567890"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-cod-gray mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray placeholder-sandstone"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cod-gray text-white py-3 px-6 rounded-lg hover:bg-clay-creek transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-cod-gray mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-clay-creek mt-1" />
                <div>
                  <h3 className="font-semibold text-cod-gray">Phone</h3>
                  <p className="text-sandstone">+880-1234-567890</p>
                  <p className="text-sandstone">+880-1234-567891</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-clay-creek mt-1" />
                <div>
                  <h3 className="font-semibold text-cod-gray">Email</h3>
                  <p className="text-sandstone">support@mdelectronics.com</p>
                  <p className="text-sandstone">info@mdelectronics.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-clay-creek mt-1" />
                <div>
                  <h3 className="font-semibold text-cod-gray">Address</h3>
                  <p className="text-sandstone">
                    123 Electronics Street<br />
                    Dhanmondi, Dhaka - 1205<br />
                    Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-clay-creek mt-1" />
                <div>
                  <h3 className="font-semibold text-cod-gray">Business Hours</h3>
                  <p className="text-sandstone">
                    Saturday - Thursday: 9:00 AM - 9:00 PM<br />
                    Friday: 2:00 PM - 9:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-westar rounded-lg border border-clay-creek/20">
              <h3 className="font-semibold text-cod-gray mb-2">Need immediate assistance?</h3>
              <p className="text-sandstone mb-4">
                Our customer service team is available 24/7 to help you with any questions or concerns.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-sandstone">
                  <strong>WhatsApp:</strong> +880-1234-567890
                </p>
                <p className="text-sm text-sandstone">
                  <strong>Emergency:</strong> +880-1234-567891
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};