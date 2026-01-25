import { describe, expect, it, beforeEach, beforeAll } from "vitest";
import * as ClarinetSdk from "@stacks/clarinet-sdk";
console.log("DEBUG: ClarinetSdk keys:", Object.keys(ClarinetSdk));
try { console.log("DEBUG: Cl from import:", ClarinetSdk.Cl); } catch (e) { }
console.log("DEBUG: Global keys starting with C:", Object.keys(globalThis).filter(k => k.startsWith("C")));
console.log("DEBUG: Global keys starting with s:", Object.keys(globalThis).filter(k => k.startsWith("s")));
import { Cl } from "@stacks/clarinet-sdk";


describe("PiggyBankFactory Contract Tests", () => {
  let accounts: Map<string, string>;
  let deployer: string;
  let wallet1: string;
  let wallet2: string;

  beforeAll(() => {
    accounts = simnet.getAccounts();
    deployer = accounts.get("deployer")!;
    wallet1 = accounts.get("wallet_1")!;
    wallet2 = accounts.get("wallet_2")!;
  });

  beforeEach(() => {
    // Reset simnet state before each test
  });

  describe("register-piggy-bank", () => {
    it("should successfully register a piggy bank", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      const { result } = simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail when trying to register the same piggy bank twice", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // First registration
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Second registration should fail
      const { result } = simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(2002)); // ERR-ALREADY-REGISTERED
    });

    it("should allow different users to register different piggy banks", () => {
      const piggyBank1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const piggyBank2 = Cl.principal(simnet.deployer + ".token-manager"); // Using different contract as example

      const result1 = simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank1],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank2],
        wallet2
      );

      expect(result1.result).toBeOk(Cl.bool(true));
      expect(result2.result).toBeOk(Cl.bool(true));
    });

    it("should increment user piggy bank count", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // Check initial count
      const initialCount = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-count",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(initialCount.result).toBeOk(Cl.uint(0));

      // Register
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Check count after registration
      const newCount = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-count",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(newCount.result).toBeOk(Cl.uint(1));
    });

    it("should increment total piggy banks count", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // Check initial total
      const initialTotal = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-total-piggy-banks",
        [],
        wallet1
      );
      expect(initialTotal.result).toBeOk(Cl.uint(0));

      // Register
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Check total after registration
      const newTotal = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-total-piggy-banks",
        [],
        wallet1
      );
      expect(newTotal.result).toBeOk(Cl.uint(1));
    });
  });

  describe("unregister-piggy-bank", () => {
    it("should successfully unregister a piggy bank", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // First register
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Then unregister
      const { result } = simnet.callPublicFn(
        "piggy-bank-factory",
        "unregister-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail when trying to unregister non-existent piggy bank", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      const { result } = simnet.callPublicFn(
        "piggy-bank-factory",
        "unregister-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(2003)); // ERR-NOT-REGISTERED
    });

    it("should fail when non-owner tries to unregister", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // Wallet1 registers
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Wallet2 tries to unregister
      const { result } = simnet.callPublicFn(
        "piggy-bank-factory",
        "unregister-piggy-bank",
        [piggyBankContract],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(2001)); // ERR-UNAUTHORIZED
    });

    it("should decrement total count when unregistering", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // Register
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Unregister
      simnet.callPublicFn(
        "piggy-bank-factory",
        "unregister-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Check total is back to 0
      const total = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-total-piggy-banks",
        [],
        wallet1
      );
      expect(total.result).toBeOk(Cl.uint(0));
    });
  });

  describe("Read-only functions", () => {
    it("should return correct user piggy bank count", () => {
      const piggyBank1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const piggyBank2 = Cl.principal(simnet.deployer + ".token-manager");

      // Register two piggy banks
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank1],
        wallet1
      );

      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank2],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-count",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(2));
    });

    it("should return correct piggy bank by index", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // Register
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Get by index
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-by-index",
        [Cl.principal(wallet1), Cl.uint(0)],
        wallet1
      );

      expect(result).toBeOk(Cl.some(piggyBankContract));
    });

    it("should return none for invalid index", () => {
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-by-index",
        [Cl.principal(wallet1), Cl.uint(999)],
        wallet1
      );

      expect(result).toBeOk(Cl.none());
    });

    it("should return correct owner of piggy bank", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // Register
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Get owner
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-piggy-bank-owner",
        [piggyBankContract],
        wallet1
      );

      expect(result).toBeOk(Cl.some(Cl.principal(wallet1)));
    });

    it("should return false for non-registered contract", () => {
      const nonRegistered = Cl.principal(simnet.deployer + ".token-manager");

      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "is-piggy-bank",
        [nonRegistered],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(false));
    });

    it("should return true for registered contract", () => {
      const piggyBankContract = Cl.principal(simnet.deployer + ".piggy-bank");

      // Register
      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      // Check
      const { result } = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "is-piggy-bank",
        [piggyBankContract],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Multiple users and piggy banks", () => {
    it("should track multiple piggy banks per user", () => {
      const piggyBank1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const piggyBank2 = Cl.principal(simnet.deployer + ".token-manager");

      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank1],
        wallet1
      );

      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank2],
        wallet1
      );

      const count = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-count",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(count.result).toBeOk(Cl.uint(2));
    });

    it("should track piggy banks from different users separately", () => {
      const piggyBank1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const piggyBank2 = Cl.principal(simnet.deployer + ".token-manager");

      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank1],
        wallet1
      );

      simnet.callPublicFn(
        "piggy-bank-factory",
        "register-piggy-bank",
        [piggyBank2],
        wallet2
      );

      const count1 = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-count",
        [Cl.principal(wallet1)],
        wallet1
      );

      const count2 = simnet.callReadOnlyFn(
        "piggy-bank-factory",
        "get-user-piggy-bank-count",
        [Cl.principal(wallet2)],
        wallet2
      );

      expect(count1.result).toBeOk(Cl.uint(1));
      expect(count2.result).toBeOk(Cl.uint(1));
    });
  });
});

