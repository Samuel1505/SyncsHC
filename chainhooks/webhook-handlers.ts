/**
 * Webhook Handlers
 * 
 * Example webhook handlers for processing chainhook events.
 * These can be used in your webhook server to handle incoming chainhook notifications.
 */

export interface ChainhookEvent {
  uuid: string;
  name: string;
  network: {
    stacks?: {
      network: string;
      block_height: number;
      block_hash: string;
      parent_block_hash: string;
      timestamp: number;
    };
  };
  payload: {
    apply: Array<{
      block_identifier: {
        index: number;
        hash: string;
      };
      parent_block_identifier: {
        index: number;
        hash: string;
      };
      timestamp: number;
      transactions: Array<{
        transaction_identifier: {
          hash: string;
        };
        operations: Array<{
          operation_identifier: {
            index: number;
          };
          type: string;
          status: string;
          account: {
            address: string;
          };
          amount?: {
            value: string;
            currency: {
              symbol: string;
              decimals: number;
            };
          };
        }>;
        metadata?: {
          contract_call?: {
            contract_identifier: string;
            function_name: string;
            function_args: Array<{
              hex: string;
              repr: string;
            }>;
          };
        };
      }>;
    }>;
    rollback?: Array<any>;
  };
}

/**
 * Handle PiggyBank deposit event
 */
export function handlePiggyBankDeposit(event: ChainhookEvent) {
  console.log("📥 PiggyBank Deposit Event:", event.uuid);
  
  if (event.payload.apply && event.payload.apply.length > 0) {
    event.payload.apply.forEach((block) => {
      block.transactions.forEach((tx) => {
        if (tx.metadata?.contract_call?.function_name === "deposit-stx") {
          const amount = tx.metadata.contract_call.function_args[0]?.repr;
          const sender = tx.operations[0]?.account?.address;
          
          console.log(`  - Deposit: ${amount} STX from ${sender}`);
          console.log(`  - Block: ${block.block_identifier.index}`);
          console.log(`  - TX: ${tx.transaction_identifier.hash}`);
          
          // Add your custom logic here
          // e.g., update database, send notification, etc.
        }
      });
    });
  }
}

/**
 * Handle PiggyBank withdrawal event
 */
export function handlePiggyBankWithdraw(event: ChainhookEvent) {
  console.log("📤 PiggyBank Withdraw Event:", event.uuid);
  
  if (event.payload.apply && event.payload.apply.length > 0) {
    event.payload.apply.forEach((block) => {
      block.transactions.forEach((tx) => {
        if (tx.metadata?.contract_call?.function_name === "withdraw") {
          const amount = tx.metadata.contract_call.function_args[0]?.repr;
          const sender = tx.operations[0]?.account?.address;
          
          console.log(`  - Withdraw: ${amount} from ${sender}`);
          console.log(`  - Block: ${block.block_identifier.index}`);
          console.log(`  - TX: ${tx.transaction_identifier.hash}`);
          
          // Add your custom logic here
        }
      });
    });
  }
}

/**
 * Handle Factory registration event
 */
export function handleFactoryRegistration(event: ChainhookEvent) {
  console.log("🏭 Factory Registration Event:", event.uuid);
  
  if (event.payload.apply && event.payload.apply.length > 0) {
    event.payload.apply.forEach((block) => {
      block.transactions.forEach((tx) => {
        if (tx.metadata?.contract_call?.function_name === "register-piggy-bank") {
          const piggyBank = tx.metadata.contract_call.function_args[0]?.repr;
          const owner = tx.operations[0]?.account?.address;
          
          console.log(`  - Registered: ${piggyBank} by ${owner}`);
          console.log(`  - Block: ${block.block_identifier.index}`);
          console.log(`  - TX: ${tx.transaction_identifier.hash}`);
          
          // Add your custom logic here
        }
      });
    });
  }
}

/**
 * Handle Token addition event
 */
export function handleTokenAddition(event: ChainhookEvent) {
  console.log("🪙 Token Addition Event:", event.uuid);
  
  if (event.payload.apply && event.payload.apply.length > 0) {
    event.payload.apply.forEach((block) => {
      block.transactions.forEach((tx) => {
        if (tx.metadata?.contract_call?.function_name === "add-supported-token") {
          const token = tx.metadata.contract_call.function_args[0]?.repr;
          const addedBy = tx.operations[0]?.account?.address;
          
          console.log(`  - Token added: ${token} by ${addedBy}`);
          console.log(`  - Block: ${block.block_identifier.index}`);
          console.log(`  - TX: ${tx.transaction_identifier.hash}`);
          
          // Add your custom logic here
        }
      });
    });
  }
}

/**
 * Generic webhook handler router
 */
export function handleWebhook(event: ChainhookEvent, hookType: string) {
  switch (hookType) {
    case "deposit":
      handlePiggyBankDeposit(event);
      break;
    case "withdraw":
      handlePiggyBankWithdraw(event);
      break;
    case "register":
      handleFactoryRegistration(event);
      break;
    case "add-token":
      handleTokenAddition(event);
      break;
    default:
      console.log("Unknown hook type:", hookType);
  }
}

