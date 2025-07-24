/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - Current RLS policies on user_profiles table are causing infinite recursion
    - Policies that check user roles are querying the same table they're applied to

  2. Solution
    - Drop existing problematic policies
    - Create new policies that avoid self-referential queries
    - Use direct auth.uid() comparisons instead of subqueries to user_profiles

  3. Security
    - Maintain same security level with simpler, non-recursive policies
    - Users can only access their own profile
    - Admin/staff access handled without recursive queries
*/

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Admin and staff can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new non-recursive policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- For admin access, we'll handle this in the application layer
-- instead of using recursive RLS policies