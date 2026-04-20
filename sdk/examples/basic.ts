import { SyncsClient } from '../src';

async function main() {
  const client = new SyncsClient({
    network: 'mainnet',
    contractAddress: 'SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF',
  });

  console.log('SDK Initialized');
  
  try {
    // Example: Get total piggy banks
    const total = await client.registry.getTotalPiggyBanks();
    console.log('Total Piggy Banks:', total);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
