import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk,
} from '@clerk/clerk-react';

interface AuthContextType {
  isClerkConfigured: boolean;
  isSignedIn: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  openSignIn: () => void;
  openSignUp: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isClerkConfigured: false,
  isSignedIn: false,
  userId: 'guest_user',
  userName: 'Guest Explorer',
  userEmail: '',
  userAvatar: '',
  openSignIn: () => {},
  openSignUp: () => {},
  signOut: () => {},
});

export const useAppAuth = () => useContext(AuthContext);

// Internal component when Clerk is active
const ClerkAuthBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  const authValue: AuthContextType = {
    isClerkConfigured: true,
    isSignedIn: Boolean(isLoaded && isSignedIn),
    userId: user?.id || 'guest_user',
    userName: user?.fullName || user?.firstName || user?.username || 'Member',
    userEmail: user?.primaryEmailAddress?.emailAddress || '',
    userAvatar: user?.imageUrl || '',
    openSignIn: () => openSignIn(),
    openSignUp: () => openSignUp(),
    signOut: () => signOut(),
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

// Fallback provider when VITE_CLERK_PUBLISHABLE_KEY is not yet supplied in env
const FallbackAuthProvider: React.FC<{
  children: React.ReactNode;
  onShowKeyModal: () => void;
}> = ({ children, onShowKeyModal }) => {
  const [guestId, setGuestId] = useState<string>('guest_user');

  useEffect(() => {
    try {
      let storedId = localStorage.getItem('noble_guest_user_id');
      if (!storedId) {
        storedId = 'guest_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('noble_guest_user_id', storedId);
      }
      setGuestId(storedId);
    } catch {
      // fallback
    }
  }, []);

  const authValue: AuthContextType = {
    isClerkConfigured: false,
    isSignedIn: false,
    userId: guestId,
    userName: 'Guest Explorer',
    userEmail: '',
    userAvatar: '',
    openSignIn: onShowKeyModal,
    openSignUp: onShowKeyModal,
    signOut: () => {},
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export interface AppAuthProviderProps {
  children: React.ReactNode;
  onShowConfigModal?: () => void;
}

export const AppAuthProvider: React.FC<AppAuthProviderProps> = ({
  children,
  onShowConfigModal = () => {},
}) => {
  const publishableKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY || '';
  const isKeyValid = Boolean(
    publishableKey &&
      (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))
  );

  if (!isKeyValid) {
    return (
      <FallbackAuthProvider onShowKeyModal={onShowConfigModal}>
        {children}
      </FallbackAuthProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkAuthBridge>{children}</ClerkAuthBridge>
    </ClerkProvider>
  );
};

export { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton };
