import { create } from "zustand";
import { PiggyBank, Transaction, CreatePiggyBankParams } from "@/types";
import { MOCK_PIGGY_BANKS, MOCK_TRANSACTIONS } from "@/lib/mockData";
import { addDays } from "@/lib/utils";

interface PiggyBankState {
  piggyBanks: PiggyBank[];
  transactions: Transaction[];
  isLoading: boolean;
  selectedBank: PiggyBank | null;
  isWithdrawModalOpen: boolean;

  fetchPiggyBanks: (address: string) => Promise<void>;
  createPiggyBank: (params: CreatePiggyBankParams) => Promise<void>;
  openWithdrawModal: (bank: PiggyBank) => void;
  closeWithdrawModal: () => void;
  withdraw: (bankId: string, isEarly: boolean) => Promise<void>;
}

export const usePiggyBankStore = create<PiggyBankState>()((set, get) => ({
  piggyBanks: [],
  transactions: [],
  isLoading: false,
  selectedBank: null,
  isWithdrawModalOpen: false,

  fetchPiggyBanks: async (_address: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    set({
      piggyBanks: MOCK_PIGGY_BANKS,
      transactions: MOCK_TRANSACTIONS,
      isLoading: false,
    });
  },

  createPiggyBank: async (params: CreatePiggyBankParams) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 2000));
    const newBank: PiggyBank = {
      id: `pb-${Date.now()}`,
      token: params.token,
      amountLocked: params.amount,
      lockDate: new Date(),
      unlockDate: addDays(new Date(), params.lockDurationDays),
      status: "locked",
      penaltyFeePercent: 5,
      owner: "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02",
    };
    set((state) => ({
      piggyBanks: [newBank, ...state.piggyBanks],
      isLoading: false,
    }));
  },

  openWithdrawModal: (bank: PiggyBank) => {
    set({ selectedBank: bank, isWithdrawModalOpen: true });
  },

  closeWithdrawModal: () => {
    set({ selectedBank: null, isWithdrawModalOpen: false });
  },

  withdraw: async (bankId: string, _isEarly: boolean) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1500));
    set((state) => ({
      piggyBanks: state.piggyBanks.map((b) =>
        b.id === bankId ? { ...b, status: "withdrawn" as const } : b
      ),
      isLoading: false,
      isWithdrawModalOpen: false,
      selectedBank: null,
    }));
  },
}));
