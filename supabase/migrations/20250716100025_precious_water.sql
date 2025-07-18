/*
# Initial Database Schema for MD Electronics E-commerce

1. New Tables
   - `categories` - Product categories (AC, TV, Oven, etc.)
   - `products` - Product catalog with prices and specifications
   - `cart_items` - User shopping cart items
   - `orders` - Customer orders
   - `order_items` - Individual items in orders
   - `user_profiles` - Extended user information

2. Security
   - Enable RLS on all tables
   - Add policies for authenticated users
   - Admin-only access for product management

3. Sample Data
   - Pre-populate categories and sample products
   - Ready for immediate use
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id),
  image_url text,
  specifications jsonb DEFAULT '{}',
  stock integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address text NOT NULL,
  phone text NOT NULL,
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('bkash', 'nagad', 'rocket', 'card', 'cash')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Admin policies for products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for user profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for cart items
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order items
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Air Conditioners', 'air-conditioners', 'Stay cool with our energy-efficient air conditioners', 'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=500'),
('Televisions', 'televisions', 'Experience entertainment with our smart TVs', 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500'),
('Ovens', 'ovens', 'Modern kitchen appliances for your home', 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=500'),
('Washing Machines', 'washing-machines', 'Efficient laundry solutions for your needs', 'https://images.pexels.com/photos/5824900/pexels-photo-5824900.jpeg?auto=compress&cs=tinysrgb&w=500'),
('Refrigerators', 'refrigerators', 'Keep your food fresh with our refrigerators', 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500'),
('Deep Freezers', 'deep-freezers', 'Large capacity freezers for bulk storage', 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, specifications, stock, featured) VALUES
('Samsung 1.5 Ton Split AC', 'Energy efficient air conditioner with inverter technology', 45000, (SELECT id FROM categories WHERE slug = 'air-conditioners'), 'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=500', '{"capacity": "1.5 Ton", "type": "Split", "energy_rating": "5 Star"}', 10, true),
('LG 43" Smart TV', '4K Ultra HD Smart TV with WebOS', 35000, (SELECT id FROM categories WHERE slug = 'televisions'), 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=500', '{"size": "43 inch", "resolution": "4K", "smart": "Yes"}', 15, true),
('Walton 25L Microwave Oven', 'Digital microwave oven with grill function', 12000, (SELECT id FROM categories WHERE slug = 'ovens'), 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=500', '{"capacity": "25L", "type": "Digital", "grill": "Yes"}', 8, true),
('Haier 8kg Washing Machine', 'Front load washing machine with multiple wash programs', 28000, (SELECT id FROM categories WHERE slug = 'washing-machines'), 'https://images.pexels.com/photos/5824900/pexels-photo-5824900.jpeg?auto=compress&cs=tinysrgb&w=500', '{"capacity": "8kg", "type": "Front Load", "rpm": "1200"}', 5, true),
('Singer 350L Refrigerator', 'Double door refrigerator with frost-free technology', 32000, (SELECT id FROM categories WHERE slug = 'refrigerators'), 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500', '{"capacity": "350L", "type": "Double Door", "frost_free": "Yes"}', 12, true),
('Jamuna 200L Deep Freezer', 'Chest freezer with energy efficient compressor', 22000, (SELECT id FROM categories WHERE slug = 'deep-freezers'), 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=500', '{"capacity": "200L", "type": "Chest", "energy_rating": "4 Star"}', 6, true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();