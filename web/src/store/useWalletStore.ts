import { create } from "zustand";
import { connectStacksWallet, disconnectStacksWallet } from "@/lib/stacks";

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  address: null,
  isConnecting: false,

  connect: async () => {
    set({ isConnecting: true });
    await connectStacksWallet({
      onSuccess: (address) => set({ address, isConnecting: false }),
      onCancel: () => set({ isConnecting: false }),
    });
  },

  disconnect: () => {
    disconnectStacksWallet();
    set({ address: null });
  },
}));
