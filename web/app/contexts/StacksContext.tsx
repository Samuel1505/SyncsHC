'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect, UserData } from '@stacks/connect';
import { STACKS_MAINNET, STACKS_TESTNET, StacksNetwork } from '@stacks/network';

// App configuration
const appConfig = new AppConfig(['store_write', 'publish_data'], process.env.NEXT_PUBLIC_STACKS_DOMAIN || 'localhost');
const userSession = new UserSession({ appConfig });

// Helper function to get network
const getNetwork = (): StacksNetwork => {
  if (typeof window === 'undefined') {
    // Server-side: default to testnet
    return STACKS_TESTNET;
  }
  return process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
    ? STACKS_MAINNET 
    : STACKS_TESTNET;
};

interface StacksContextType {
  userSession: UserSession;
  userData: UserData | null;
  network: StacksNetwork;
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshUserData: () => Promise<void>;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network] = useState<StacksNetwork>(getNetwork());

  useEffect(() => {
    // Check if user is already authenticated
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    showConnect({
      appDetails: {
        name: 'SyncsHC',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserData(userData);
        setIsConnected(true);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
    setIsConnected(false);
  };

  const refreshUserData = async () => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      setUserData(data);
      setIsConnected(true);
    } else {
      setUserData(null);
      setIsConnected(false);
    }
  };

  const address = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || null;

  return (
    <StacksContext.Provider
      value={{
        userSession,
        userData,
        network,
        isConnected,
        address,
        connectWallet,
        disconnectWallet,
        refreshUserData,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider');
  }
  return context;
}
