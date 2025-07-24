import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  // Map Clerk user to our app's user format
  const appUser = user ? {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    full_name: user.fullName || '',
    role: user.publicMetadata?.role as string || 'user',
    created_at: user.createdAt?.toISOString() || '',
  } : null;

  return {
    user: appUser,
    userProfile: appUser,
    loading: !isLoaded,
    signOut: () => signOut(),
  };
};