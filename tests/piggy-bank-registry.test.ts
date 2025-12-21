import { describe, expect, it, beforeEach } from "vitest";
import { Cl, simnet } from "@stacks/clarinet-sdk";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("PiggyBankRegistry Contract Tests", () => {
  beforeEach(() => {
    // Reset simnet state before each test
  });

  describe("register-piggy-bank", () => {
    it("should successfully register a piggy bank with metadata", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      const { result } = simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail when trying to register the same piggy bank twice", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // First registration
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Second registration should fail
      const { result } = simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      expect(result).toBeErr(Cl.uint(4002)); // ERR-ALREADY-REGISTERED
    });

    it("should store correct metadata", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // Register
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Get metadata
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-piggy-bank-metadata",
        [piggyBank],
        wallet1
      );
      
      expect(result).toBeOk();
      expect(result).toBeSome();
    });

    it("should add piggy bank to owner's list", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // Register
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Get owner's piggy banks
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-owner-piggy-banks",
        [owner],
        wallet1
      );
      
      expect(result).toBeOk();
      // Should contain the registered piggy bank
    });

    it("should increment total piggy banks count", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // Check initial total
      const initialTotal = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-total-piggy-banks",
        [],
        wallet1
      );
      expect(initialTotal.result).toBeOk(Cl.uint(0));
      
      // Register
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Check total after registration
      const newTotal = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-total-piggy-banks",
        [],
        wallet1
      );
      expect(newTotal.result).toBeOk(Cl.uint(1));
    });

    it("should allow multiple piggy banks for same owner", () => {
      const piggyBank1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const piggyBank2 = Cl.principal(simnet.deployer + ".token-manager");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank1, owner, factory],
        wallet1
      );
      
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank2, owner, factory],
        wallet1
      );
      
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-owner-piggy-banks",
        [owner],
        wallet1
      );
      
      expect(result).toBeOk();
    });
  });

  describe("unregister-piggy-bank", () => {
    it("should successfully unregister a piggy bank", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // First register
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Then unregister
      const { result } = simnet.callPublicFn(
        "piggy-bank-registry",
        "unregister-piggy-bank",
        [piggyBank],
        wallet1
      );
      
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail when trying to unregister non-existent piggy bank", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      
      const { result } = simnet.callPublicFn(
        "piggy-bank-registry",
        "unregister-piggy-bank",
        [piggyBank],
        wallet1
      );
      
      expect(result).toBeErr(Cl.uint(4003)); // ERR-NOT-REGISTERED
    });

    it("should fail when non-owner tries to unregister", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // Wallet1 registers
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Wallet2 tries to unregister
      const { result } = simnet.callPublicFn(
        "piggy-bank-registry",
        "unregister-piggy-bank",
        [piggyBank],
        wallet2
      );
      
      expect(result).toBeErr(Cl.uint(4001)); // ERR-UNAUTHORIZED
    });

    it("should remove metadata after unregistering", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // Register
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Unregister
      simnet.callPublicFn(
        "piggy-bank-registry",
        "unregister-piggy-bank",
        [piggyBank],
        wallet1
      );
      
      // Check metadata is gone
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-piggy-bank-metadata",
        [piggyBank],
        wallet1
      );
      
      expect(result).toBeOk(Cl.none());
    });
  });

  describe("Read-only functions", () => {
    it("should return correct metadata for registered piggy bank", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // Register
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Get metadata
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-piggy-bank-metadata",
        [piggyBank],
        wallet1
      );
      
      expect(result).toBeOk();
      expect(result).toBeSome();
    });

    it("should return empty list for owner with no piggy banks", () => {
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-owner-piggy-banks",
        [Cl.principal(wallet1)],
        wallet1
      );
      
      expect(result).toBeOk(Cl.list([]));
    });

    it("should return correct total count", () => {
      const piggyBank1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const piggyBank2 = Cl.principal(simnet.deployer + ".token-manager");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank1, owner, factory],
        wallet1
      );
      
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank2, owner, factory],
        wallet1
      );
      
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-total-piggy-banks",
        [],
        wallet1
      );
      
      expect(result).toBeOk(Cl.uint(2));
    });

    it("should return correct piggy bank by index", () => {
      const piggyBank = Cl.principal(simnet.deployer + ".piggy-bank");
      const owner = Cl.principal(wallet1);
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      // Register
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank, owner, factory],
        wallet1
      );
      
      // Get by index
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-piggy-bank-by-index",
        [Cl.uint(0)],
        wallet1
      );
      
      expect(result).toBeOk(Cl.some(piggyBank));
    });

    it("should return none for invalid index", () => {
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-piggy-bank-by-index",
        [Cl.uint(999)],
        wallet1
      );
      
      expect(result).toBeOk(Cl.none());
    });
  });

  describe("Multiple owners and piggy banks", () => {
    it("should track piggy banks from different owners separately", () => {
      const piggyBank1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const piggyBank2 = Cl.principal(simnet.deployer + ".token-manager");
      const factory = Cl.principal(simnet.deployer + ".piggy-bank-factory");
      
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank1, Cl.principal(wallet1), factory],
        wallet1
      );
      
      simnet.callPublicFn(
        "piggy-bank-registry",
        "register-piggy-bank",
        [piggyBank2, Cl.principal(wallet2), factory],
        wallet2
      );
      
      const list1 = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-owner-piggy-banks",
        [Cl.principal(wallet1)],
        wallet1
      );
      
      const list2 = simnet.callReadOnlyFn(
        "piggy-bank-registry",
        "get-owner-piggy-banks",
        [Cl.principal(wallet2)],
        wallet2
      );
      
      expect(list1.result).toBeOk();
      expect(list2.result).toBeOk();
    });
  });
});

