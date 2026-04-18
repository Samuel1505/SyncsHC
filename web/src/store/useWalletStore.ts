import { create } from "zustand";
import {
  connectStacksWallet,
  disconnectStacksWallet,
  fetchBnsName,
} from "@/lib/stacks";

interface WalletState {
  address: string | null;
  bnsName: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  address: null,
  bnsName: null,
  isConnecting: false,

  connect: async () => {
    set({ isConnecting: true });
    await connectStacksWallet({
      onSuccess: async (address) => {
        set({ address, isConnecting: false });
        // Fetch BNS name immediately after successful connection
        const bnsName = await fetchBnsName(address);
        if (bnsName) {
          set({ bnsName });
        }
      },
      onCancel: () => set({ isConnecting: false }),
    });
  },

  disconnect: () => {
    disconnectStacksWallet();
    set({ address: null, bnsName: null });
  },
}));
