# Testing Guide

This document provides an overview of the comprehensive test suite and chainhooks integration for the SyncsHC project.

## Test Suite Overview

Comprehensive test files have been created for all contracts:

### 1. `tests/piggy-bank.test.ts`
Tests for the main PiggyBank contract including:
- STX deposits and balance tracking
- Token deposits
- Lock duration management
- Withdrawals with penalty calculations
- Read-only functions (balance, lock info, expiration checks)
- Security tests (unauthorized access prevention)
- Edge cases (multiple deposits, different tokens)

### 2. `tests/piggy-bank-factory.test.ts`
Tests for the PiggyBank Factory contract including:
- PiggyBank registration
- Unregistration
- User piggy bank tracking
- Owner verification
- Index-based retrieval
- Multiple users and piggy banks

### 3. `tests/piggy-bank-registry.test.ts`
Tests for the PiggyBank Registry contract including:
- Metadata registration
- Owner tracking
- Global registry management
- Index-based enumeration
- Unregistration with authorization checks

### 4. `tests/token-manager.test.ts`
Tests for the Token Manager contract including:
- Adding supported tokens
- Removing tokens
- Ownership management
- Token support verification
- Authorization checks

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests with coverage and cost reports:
```bash
npm run test:report
```

### Watch mode (auto-rerun on file changes):
```bash
npm run test:watch
```

## Test Structure

Each test file follows this structure:
- **Setup**: Uses `beforeEach` for test isolation
- **Grouping**: Tests are organized by function/feature using `describe` blocks
- **Assertions**: Uses Clarity-specific matchers like `toBeUint()`, `toBeOk()`, `toBeErr()`
- **Coverage**: Tests cover:
  - Happy paths
  - Error cases
  - Edge cases
  - Security scenarios
  - Authorization checks

## Chainhooks Integration

The chainhooks integration is located in the `chainhooks/` directory and provides:

### Files Created:

1. **`chainhooks/index.ts`**: Main chainhooks client wrapper
   - `SyncsHCChainhooks` class for managing hooks
   - Methods for registering, listing, and deleting hooks

2. **`chainhooks/config.ts`**: Configuration management
   - Environment-based configuration
   - Contract address management

3. **`chainhooks/setup.ts`**: Setup script
   - Registers all chainhooks for monitoring
   - Can be run after contract deployment

4. **`chainhooks/webhook-handlers.ts`**: Webhook event handlers
   - Handlers for deposit, withdraw, registration, and token addition events
   - Example implementations for processing chainhook payloads

5. **`chainhooks/README.md`**: Comprehensive documentation
   - Setup instructions
   - Usage examples
   - API reference

### Setting Up Chainhooks

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file with:
   ```env
   CHAINHOOKS_BASE_URL=https://api.chainhooks.com
   CHAINHOOKS_API_KEY=your-api-key
   STX_NETWORK=testnet
   WEBHOOK_BASE_URL=https://your-webhook-server.com
   WEBHOOK_AUTH_HEADER=Bearer your-token
   ```

3. **Update contract addresses** in `chainhooks/config.ts`

4. **Register chainhooks**:
   ```bash
   npm run chainhooks:setup
   ```

### Chainhooks Scripts

- `npm run chainhooks:setup` - Register all chainhooks
- `npm run chainhooks:list` - List all registered chainhooks

## Test Coverage

The test suite aims for comprehensive coverage:

- ✅ All public functions tested
- ✅ All read-only functions tested
- ✅ Error conditions tested
- ✅ Authorization checks tested
- ✅ Edge cases covered
- ✅ Security scenarios tested

## Writing New Tests

When adding new functionality:

1. Add tests in the appropriate test file
2. Follow the existing structure and naming conventions
3. Test both success and failure cases
4. Include authorization checks
5. Test edge cases

Example:
```typescript
describe("new-feature", () => {
  it("should work correctly", () => {
    const { result } = simnet.callPublicFn(
      "contract-name",
      "function-name",
      [Cl.uint(100)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should fail with invalid input", () => {
    const { result } = simnet.callPublicFn(
      "contract-name",
      "function-name",
      [Cl.uint(0)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(ERROR_CODE));
  });
});
```

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage report
  run: npm run test:report
```

## Resources

- [Clarinet SDK Documentation](https://docs.hiro.so/stacks/clarinet-js-sdk)
- [Vitest Documentation](https://vitest.dev/)
- [Chainhooks Documentation](https://docs.hiro.so/chainhook)

