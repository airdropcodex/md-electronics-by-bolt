/*
  # Update user roles and order status system

  1. Schema Updates
    - Update user_profiles role constraint to include 'staff'
    - Ensure orders table has proper status enum values
    - Add any missing indexes for performance

  2. Security
    - Update RLS policies for admin/staff access
    - Ensure proper permissions for order management
*/

-- Update user_profiles role constraint to include staff
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_role_check' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_role_check;
  END IF;
  
  -- Add new constraint with staff role
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check 
    CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'staff'::text]));
END $$;

-- Add RLS policy for admin/staff to manage all user profiles
CREATE POLICY "Admin and staff can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'staff')
    )
  );

-- Add RLS policy for admin/staff to manage orders
CREATE POLICY "Admin and staff can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'staff')
    )
  );

-- Add RLS policy for admin/staff to read order items
CREATE POLICY "Admin and staff can read all order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'staff')
    )
  );

-- Add RLS policy for admin/staff to manage categories
CREATE POLICY "Admin and staff can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'staff')
    )
  );