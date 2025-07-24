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
          // Check if we already have a Supabase session
          const { data: { user: sbUser }, error } = await supabase.auth.getUser();
          
          if (error || !sbUser) {
            try {
              // Get JWT token from Clerk
              const token = await user.getToken({ template: 'supabase' });
              if (token) {
                // Sign in to Supabase using the JWT token
                const { data: { user: newSbUser }, error: signInError } = await supabase.auth.signInWithIdToken({
                  provider: 'custom',
                  token: token,
                });
                
                if (!signInError && newSbUser) {
                  setSupabaseUser(newSbUser);
                  // Fetch user profile data
                  await fetchUserProfile(newSbUser.id);
                } else {
                  console.error('Supabase sign-in error:', signInError);
                }
              }
            } catch (tokenError) {
              console.error('Error getting Clerk token:', tokenError);
              // Fallback: try using Clerk user ID directly
              setSupabaseUser({ id: user.id });
              await fetchUserProfile(user.id);
            }
          } else {
            setSupabaseUser(sbUser);
            await fetchUserProfile(sbUser.id);
          }
        } catch (error) {
          console.error('Error getting Supabase user:', error);
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