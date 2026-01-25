import { describe, expect, it, beforeEach, beforeAll } from "vitest";
import { Cl } from "@stacks/clarinet-sdk";

describe("TokenManager Contract Tests", () => {
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

  describe("add-supported-token", () => {
    it("should successfully add a supported token by owner", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      const { result } = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail when non-owner tries to add token", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      const { result } = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR-UNAUTHORIZED
    });

    it("should fail when trying to add the same token twice", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // First addition
      simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      // Second addition should fail
      const { result } = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      expect(result).toBeErr(Cl.uint(3002)); // ERR-TOKEN-EXISTS
    });

    it("should mark token as supported after addition", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // Add token
      simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      // Check if supported
      const { result } = simnet.callReadOnlyFn(
        "token-manager",
        "is-token-supported",
        [token],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should allow adding multiple different tokens", () => {
      const token1 = Cl.principal(simnet.deployer + ".piggy-bank");
      const token2 = Cl.principal(simnet.deployer + ".piggy-bank-factory");

      const result1 = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token1],
        deployer
      );

      const result2 = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token2],
        deployer
      );

      expect(result1.result).toBeOk(Cl.bool(true));
      expect(result2.result).toBeOk(Cl.bool(true));
    });
  });

  describe("remove-supported-token", () => {
    it("should successfully remove a supported token by owner", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // First add
      simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      // Then remove
      const { result } = simnet.callPublicFn(
        "token-manager",
        "remove-supported-token",
        [token],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail when non-owner tries to remove token", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // Owner adds
      simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      // Non-owner tries to remove
      const { result } = simnet.callPublicFn(
        "token-manager",
        "remove-supported-token",
        [token],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR-UNAUTHORIZED
    });

    it("should fail when trying to remove non-existent token", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      const { result } = simnet.callPublicFn(
        "token-manager",
        "remove-supported-token",
        [token],
        deployer
      );

      expect(result).toBeErr(Cl.uint(3003)); // ERR-TOKEN-NOT-FOUND
    });

    it("should mark token as not supported after removal", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // Add
      simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      // Remove
      simnet.callPublicFn(
        "token-manager",
        "remove-supported-token",
        [token],
        deployer
      );

      // Check if not supported
      const { result } = simnet.callReadOnlyFn(
        "token-manager",
        "is-token-supported",
        [token],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(false));
    });
  });

  describe("transfer-ownership", () => {
    it("should successfully transfer ownership", () => {
      const newOwner = Cl.principal(wallet1);

      const { result } = simnet.callPublicFn(
        "token-manager",
        "transfer-ownership",
        [newOwner],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail when non-owner tries to transfer ownership", () => {
      const newOwner = Cl.principal(wallet2);

      const { result } = simnet.callPublicFn(
        "token-manager",
        "transfer-ownership",
        [newOwner],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR-UNAUTHORIZED
    });

    it("should update owner after transfer", () => {
      const newOwner = Cl.principal(wallet1);

      // Transfer
      simnet.callPublicFn(
        "token-manager",
        "transfer-ownership",
        [newOwner],
        deployer
      );

      // Check new owner
      const { result } = simnet.callReadOnlyFn(
        "token-manager",
        "get-owner",
        [],
        wallet1
      );

      expect(result).toBeOk(newOwner);
    });

    it("should allow new owner to manage tokens", () => {
      const newOwner = Cl.principal(wallet1);
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // Transfer ownership
      simnet.callPublicFn(
        "token-manager",
        "transfer-ownership",
        [newOwner],
        deployer
      );

      // New owner should be able to add token
      const { result } = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should prevent old owner from managing tokens after transfer", () => {
      const newOwner = Cl.principal(wallet1);
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // Transfer ownership
      simnet.callPublicFn(
        "token-manager",
        "transfer-ownership",
        [newOwner],
        deployer
      );

      // Old owner should not be able to add token
      const { result } = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR-UNAUTHORIZED
    });
  });

  describe("Read-only functions", () => {
    it("should return false for unsupported token", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      const { result } = simnet.callReadOnlyFn(
        "token-manager",
        "is-token-supported",
        [token],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(false));
    });

    it("should return true for supported token", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // Add token
      simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      // Check
      const { result } = simnet.callReadOnlyFn(
        "token-manager",
        "is-token-supported",
        [token],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should return correct owner", () => {
      const { result } = simnet.callReadOnlyFn(
        "token-manager",
        "get-owner",
        [],
        wallet1
      );

      expect(result).toBeOk(Cl.principal(deployer));
    });
  });

  describe("Edge cases", () => {
    it("should handle multiple add/remove cycles", () => {
      const token = Cl.principal(simnet.deployer + ".piggy-bank");

      // Add
      simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      // Remove
      simnet.callPublicFn(
        "token-manager",
        "remove-supported-token",
        [token],
        deployer
      );

      // Add again
      const { result } = simnet.callPublicFn(
        "token-manager",
        "add-supported-token",
        [token],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should handle ownership transfer chain", () => {
      const newOwner1 = Cl.principal(wallet1);
      const newOwner2 = Cl.principal(wallet2);

      // Transfer to wallet1
      simnet.callPublicFn(
        "token-manager",
        "transfer-ownership",
        [newOwner1],
        deployer
      );

      // Transfer from wallet1 to wallet2
      const { result } = simnet.callPublicFn(
        "token-manager",
        "transfer-ownership",
        [newOwner2],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));

      // Verify wallet2 is now owner
      const ownerCheck = simnet.callReadOnlyFn(
        "token-manager",
        "get-owner",
        [],
        wallet2
      );

      expect(ownerCheck.result).toBeOk(newOwner2);
    });
  });
});

