import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const getSupabaseUser = async () => {
      if (user) {
        try {
          // Simplified approach: Use Clerk user ID directly for now
          // This will work with existing database records
          const mappedUser = { id: user.id };
          setSupabaseUser(mappedUser);
          
          // Try to fetch user profile with Clerk ID
          await fetchUserProfile(user.id);
        } catch (error) {
          console.error('Error getting Supabase user:', error);
          // Fallback: still set the user to allow app functionality
          setSupabaseUser({ id: user.id });
        }
      } else {
        setSupabaseUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    };
    
    if (isLoaded) {
      getSupabaseUser();
    }
  }, [user, isLoaded]);

  // Map Clerk user to our app's user format
  const appUser = user ? {
    id: supabaseUser?.id || user.id, // Use Supabase UUID when available
    email: user.emailAddresses[0]?.emailAddress || '',
    full_name: userProfile?.full_name || user.fullName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    role: userProfile?.role || 'user',
    created_at: user.createdAt?.toISOString() || '',
  } : null;

  return {
    user: appUser,
    userProfile: userProfile,
    updateUserProfile: fetchUserProfile,
    loading: !isLoaded || loading,
    signOut: () => signOut(),
  };
};