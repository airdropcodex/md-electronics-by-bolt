import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSupabaseUser = async () => {
      if (user) {
        try {
          // Get or create Supabase user
          const { data: { user: sbUser }, error } = await supabase.auth.getUser();
          
          if (error || !sbUser) {
            // Sign in to Supabase using Clerk's JWT
            const token = await user.getToken({ template: 'supabase' });
            if (token) {
              const { data: { user: newSbUser }, error: signInError } = await supabase.auth.setSession({
                access_token: token,
                refresh_token: 'dummy-refresh-token'
              });
              
              if (!signInError && newSbUser) {
                setSupabaseUser(newSbUser);
              }
            }
          } else {
            setSupabaseUser(sbUser);
          }
        } catch (error) {
          console.error('Error getting Supabase user:', error);
        }
      } else {
        setSupabaseUser(null);
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
    full_name: user.fullName || '',
    role: user.publicMetadata?.role as string || 'user',
    created_at: user.createdAt?.toISOString() || '',
  } : null;

  return {
    user: appUser,
    userProfile: appUser,
    loading: !isLoaded || loading,
    signOut: () => signOut(),
  };
};