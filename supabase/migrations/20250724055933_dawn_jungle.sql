/*
  # Create wishlist_items table

  1. New Tables
    - `wishlist_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `wishlist_items` table
    - Add policy for users to manage their own wishlist items

  3. Relationships
    - Foreign key to products table
    - Foreign key to auth.users table
    - Unique constraint on user_id + product_id
*/

CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
  ON wishlist_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);